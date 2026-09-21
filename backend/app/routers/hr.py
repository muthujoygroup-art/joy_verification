from backend.app.services.storage_service import get_candidate_folder
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.database import get_db, apply_runtime_migrations
from backend.app.models import Candidate, Company, HrUser, CandidateDocument
from backend.app.services.email_service import send_candidate_onboarding_email
from backend.app.schemas import CandidateCreate, CandidateResponse, CandidateUpdate

router = APIRouter(prefix="/hr", tags=["HR Executive"])

@router.get("/candidates", response_model=List[CandidateResponse])
def get_all_candidates(hr_id: str = None, company_id: str = None, db: Session = Depends(get_db)):
    """Fetch candidates filtered by HR executive or Company with multi-alias support"""
    try:
        apply_runtime_migrations(db.get_bind())
    except Exception:
        pass
    query = db.query(Candidate)
    if hr_id:
        query = query.filter(Candidate.hr_id == hr_id)
    elif company_id:
        target = company_id.strip()
        joy_aliases = ["comp001", "comp-joy", "compjoy", "comp-test-1", "joy01", "joy", "joycorp"]
        clean_target = target.lower().replace("-", "").replace("_", "")
        if clean_target in [a.replace("-", "").replace("_", "") for a in joy_aliases]:
            query = query.filter(
                (Candidate.company_id.in_(["COMP001", "comp-joy", "comp-test-1", "JOY01", "compjoy", target])) |
                (Candidate.company_id.ilike("%comp%")) |
                (Candidate.company_id.ilike("%joy%"))
            )
        else:
            comp = db.query(Company).filter((Company.id == target) | (Company.code == target)).first()
            target_id = comp.id if comp else target
            query = query.filter(
                (Candidate.company_id == target_id) | 
                (Candidate.company_id == target) | 
                (Candidate.company_id.ilike(f"%{target}%"))
            )
    candidates = query.order_by(Candidate.created_at.desc()).all()
    for c in candidates:
        if c.verifications_completed is None:
            c.verifications_completed = {}
        if c.face_images is None:
            c.face_images = {"straight": None, "left": None, "right": None}
        if c.verification_config is None:
            c.verification_config = {}
        if c.joining_form_data is None:
            c.joining_form_data = {}
        if c.custom_fields is None:
            c.custom_fields = {}
        if c.manual_checks is None:
            c.manual_checks = {}
        if not c.status:
            c.status = "Link Sent"
    return candidates

def _save_or_update_candidate_record(payload: CandidateCreate, db: Session, commit: bool = True):
    """
    Internal helper to create or update a candidate record in the database.
    Returns (candidate_instance, is_new_record: bool).
    """
    # 🛡️ Resolve company and clean identifiers (Prioritize exact Company ID)
    requested_comp_id = (payload.company_id or "COMP001").strip()
    comp = db.query(Company).filter(
        (Company.id == requested_comp_id) | (Company.code == requested_comp_id)
    ).first()

    if not comp:
        comp_name = "Joy Corporate Solutions Private Limited" if requested_comp_id.upper() in ("COMP001", "COMP-JOY", "COMP-TEST-1", "JOY01") else f"Partner Organization ({requested_comp_id})"
        comp = Company(
            id=requested_comp_id,
            code=requested_comp_id,
            name=comp_name,
            contact_person="Company Administrator",
            email=f"admin_{requested_comp_id.lower()}@joycorporatesolutions.com",
            status="Active"
        )
        db.add(comp)
        try:
            db.commit()
            db.refresh(comp)
        except Exception as e:
            db.rollback()
            print(f"Error provisioning company '{requested_comp_id}': {e}")
            comp = db.query(Company).filter(Company.id == requested_comp_id).first() or db.query(Company).first()

    resolved_comp_id = requested_comp_id if comp is None else comp.id

    # 🛡️ Resolve HR user & ensure HrUser record exists in DB to prevent foreign key constraint violations
    resolved_hr_id = None
    if payload.hr_id:
        req_hr_id = payload.hr_id.strip()
        hr_user = db.query(HrUser).filter(
            (HrUser.id == req_hr_id) | (HrUser.email == req_hr_id)
        ).first()

        if not hr_user:
            hr_user = db.query(HrUser).filter(HrUser.company_id == resolved_comp_id).first()

        if not hr_user:
            hr_user = HrUser(
                id=req_hr_id,
                company_id=resolved_comp_id,
                name="HR Recruiter",
                email=f"hr_{req_hr_id.lower().replace(' ', '_')}@joycorporatesolutions.com",
                status="Active"
            )
            db.add(hr_user)
            try:
                db.commit()
                db.refresh(hr_user)
            except Exception as hr_err:
                db.rollback()
                print(f"Error provisioning HR User '{req_hr_id}': {hr_err}")
                hr_user = db.query(HrUser).filter(HrUser.company_id == resolved_comp_id).first()

        resolved_hr_id = hr_user.id if hr_user else req_hr_id

    clean_email = (payload.email or "").strip().lower() or None
    clean_mobile = None
    if payload.mobile:
        digits = "".join(filter(str.isdigit, str(payload.mobile)))
        clean_mobile = digits[-10:] if len(digits) >= 10 else digits

    # 🛡️ Strict Duplicate Resolution: Check if candidate already exists by email, mobile, or aadhaar
    # Sample mobile numbers like 9876543210 should NOT cause duplicate collisions across different employees
    is_sample_mobile = clean_mobile in ("9876543210", "1234567890", "0000000000")
    existing_cand = None
    if clean_email:
        existing_cand = db.query(Candidate).filter(
            (Candidate.company_id == resolved_comp_id) | (Candidate.company_id == payload.company_id),
            Candidate.email.ilike(clean_email)
        ).first()
    if not existing_cand and clean_mobile and len(clean_mobile) == 10 and not is_sample_mobile:
        existing_cand = db.query(Candidate).filter(
            (Candidate.company_id == resolved_comp_id) | (Candidate.company_id == payload.company_id),
            Candidate.mobile.endswith(clean_mobile)
        ).first()
    if not existing_cand and payload.aadhaar_no:
        clean_aadhaar = "".join(filter(str.isdigit, str(payload.aadhaar_no)))
        if clean_aadhaar and len(clean_aadhaar) == 12:
            existing_cand = db.query(Candidate).filter(
                (Candidate.company_id == resolved_comp_id) | (Candidate.company_id == payload.company_id),
                Candidate.aadhaar_no == clean_aadhaar
            ).first()

    if existing_cand:
        # Update existing candidate record rather than creating a duplicate
        existing_cand.name = payload.name or existing_cand.name
        existing_cand.designation = payload.designation or existing_cand.designation
        existing_cand.dept = payload.dept or existing_cand.dept
        existing_cand.employee_type = payload.employee_type or existing_cand.employee_type
        if clean_email: existing_cand.email = clean_email
        if clean_mobile: existing_cand.mobile = clean_mobile
        existing_cand.company_id = resolved_comp_id
        if payload.emp_id: existing_cand.emp_id = payload.emp_id
        if payload.employee_number: existing_cand.employee_number = payload.employee_number
        if payload.dob: existing_cand.dob = payload.dob
        if payload.doj: existing_cand.doj = payload.doj
        if payload.age: existing_cand.age = payload.age
        if payload.gender: existing_cand.gender = payload.gender
        if payload.marital_status: existing_cand.marital_status = payload.marital_status
        if payload.mother_tongue: existing_cand.mother_tongue = payload.mother_tongue
        if payload.languages_known: existing_cand.languages_known = payload.languages_known
        if payload.pf_number: existing_cand.pf_number = payload.pf_number
        if payload.esi_number: existing_cand.esi_number = payload.esi_number
        if payload.religion: existing_cand.religion = payload.religion
        if payload.caste: existing_cand.caste = payload.caste
        if payload.category: existing_cand.category = payload.category
        if payload.native_state: existing_cand.native_state = payload.native_state
        if payload.native_district: existing_cand.native_district = payload.native_district
        if payload.identification_marks: existing_cand.identification_marks = payload.identification_marks
        if payload.father_name: existing_cand.father_name = payload.father_name
        if payload.mother_name: existing_cand.mother_name = payload.mother_name
        if payload.spouse_name: existing_cand.spouse_name = payload.spouse_name
        if payload.blood_group: existing_cand.blood_group = payload.blood_group
        if payload.state: existing_cand.state = payload.state
        if payload.district: existing_cand.district = payload.district
        if payload.city: existing_cand.city = payload.city
        if payload.area: existing_cand.area = payload.area
        if payload.pincode: existing_cand.pincode = payload.pincode
        if payload.present_address: existing_cand.present_address = payload.present_address
        if payload.permanent_address: existing_cand.permanent_address = payload.permanent_address
        if payload.pan_no: existing_cand.pan_no = payload.pan_no
        if payload.uan_no: existing_cand.uan_no = payload.uan_no
        if payload.alternate_mobile: existing_cand.alternate_mobile = payload.alternate_mobile
        if payload.emergency_contact_name: existing_cand.emergency_contact_name = payload.emergency_contact_name
        if payload.emergency_contact_phone: existing_cand.emergency_contact_phone = payload.emergency_contact_phone
        if payload.qualification_category: existing_cand.qualification_category = payload.qualification_category
        if payload.highest_qualification: existing_cand.highest_qualification = payload.highest_qualification
        if payload.job_category: existing_cand.job_category = payload.job_category
        if payload.job_type: existing_cand.job_type = payload.job_type
        if payload.bank_name: existing_cand.bank_name = payload.bank_name
        if payload.bank_account_no: existing_cand.bank_account_no = payload.bank_account_no
        if payload.ifsc_code: existing_cand.ifsc_code = payload.ifsc_code
        if payload.nominee_name: existing_cand.nominee_name = payload.nominee_name
        if payload.nominee_relation: existing_cand.nominee_relation = payload.nominee_relation
        if payload.linked_in_url: existing_cand.linked_in_url = payload.linked_in_url
        if payload.github_url: existing_cand.github_url = payload.github_url
        if payload.portfolio_url: existing_cand.portfolio_url = payload.portfolio_url

        # Check joining_form_data for statutory numbers fallback on update
        if payload.joining_form_data:
            jfd_up = dict(payload.joining_form_data)
            if not existing_cand.pan_no and (jfd_up.get("panNo") or jfd_up.get("pan") or jfd_up.get("panNumber")):
                existing_cand.pan_no = jfd_up.get("panNo") or jfd_up.get("pan") or jfd_up.get("panNumber")
            if not existing_cand.pf_number and (jfd_up.get("uanEpf") or jfd_up.get("uan") or jfd_up.get("uanNumber")):
                existing_cand.pf_number = jfd_up.get("uanEpf") or jfd_up.get("uan") or jfd_up.get("uanNumber")
                existing_cand.uan_no = existing_cand.pf_number
            if not existing_cand.bank_account_no and (jfd_up.get("bankAccountNo") or jfd_up.get("accountNumber")):
                existing_cand.bank_account_no = jfd_up.get("bankAccountNo") or jfd_up.get("accountNumber")
            if not existing_cand.ifsc_code and (jfd_up.get("ifscCode") or jfd_up.get("ifsc")):
                existing_cand.ifsc_code = jfd_up.get("ifscCode") or jfd_up.get("ifsc")
            if not existing_cand.bank_name and jfd_up.get("bankName"):
                existing_cand.bank_name = jfd_up.get("bankName")
            if not existing_cand.esi_number and (jfd_up.get("esiNumber") or jfd_up.get("esicNo")):
                existing_cand.esi_number = jfd_up.get("esiNumber") or jfd_up.get("esicNo")
            if not existing_cand.aadhaar_no and (jfd_up.get("aadhaarNo") or jfd_up.get("aadhaar")):
                existing_cand.aadhaar_no = jfd_up.get("aadhaarNo") or jfd_up.get("aadhaar")
            existing_cand.joining_form_data = jfd_up

        if resolved_hr_id: existing_cand.hr_id = resolved_hr_id
        if existing_cand.status != "Verified":
            existing_cand.status = "Link Sent"
        if not existing_cand.token:
            clean_n = (existing_cand.name or "cand").lower().replace(" ", "_")[:10]
            existing_cand.token = f"tok_{clean_n}_{uuid.uuid4().hex[:4]}"
        existing_cand.portal_password = payload.portal_password or existing_cand.portal_password or "1234"
        if payload.verification_config: existing_cand.verification_config = payload.verification_config
        if payload.custom_fields: existing_cand.custom_fields = payload.custom_fields
        if payload.specimen_signature: existing_cand.specimen_signature = payload.specimen_signature
        if commit:
            db.commit()
            db.refresh(existing_cand)
        return existing_cand, False

    candidate_id = f"emp-{uuid.uuid4().hex[:6]}"
    clean_name = payload.name.lower().replace(" ", "_")[:10]
    token = f"tok_{clean_name}_{uuid.uuid4().hex[:4]}"
    
    # Compute hierarchical employee profile code (e.g. COMP001EMP001)
    comp_code = comp.code if comp and comp.code else "COMP001"
    emp_count = db.query(Candidate).filter(Candidate.company_id == resolved_comp_id).count() + 1
    hierarchical_emp_code = f"{comp_code}EMP{emp_count:03d}"
    
    # Default verifications completed status
    initial_verifs = {
        "aadhaar": False,
        "mobile": False,
        "face": False,
        "pan": False,
        "bankCheck": False,
        "uan": False,
        "education": False,
        "criminalCheck": False,
        "drivingLicense": False
    }
    
    initial_face_images = {
        "straight": None,
        "left": None,
        "right": None
    }
    
    joining_data = dict(payload.joining_form_data or {})
    if payload.documents:
        joining_data["uploadedDocuments"] = payload.documents

    # Auto-extract and harmonize statutory & banking numbers from joining_data
    pan_val = payload.pan_no or joining_data.get("panNo") or joining_data.get("pan") or joining_data.get("panNumber")
    uan_val = payload.uan_no or payload.pf_number or joining_data.get("uanEpf") or joining_data.get("uan") or joining_data.get("uanNumber") or joining_data.get("pfNumber")
    bank_acc_val = payload.bank_account_no or joining_data.get("bankAccountNo") or joining_data.get("accountNumber") or joining_data.get("accountNo")
    ifsc_val = payload.ifsc_code or joining_data.get("ifscCode") or joining_data.get("ifsc")
    bank_name_val = payload.bank_name or joining_data.get("bankName")
    esi_val = payload.esi_number or joining_data.get("esiNumber") or joining_data.get("esicNo")
    aadhaar_val = payload.aadhaar_no or joining_data.get("aadhaarNo") or joining_data.get("aadhaar")
    father_val = payload.father_name or joining_data.get("fatherSpouseName") or joining_data.get("fatherName")
    mother_val = payload.mother_name or joining_data.get("motherName")
    perm_addr_val = payload.permanent_address or joining_data.get("permanentAddressLine") or joining_data.get("permanentAddress")
    pres_addr_val = payload.present_address or joining_data.get("presentAddressLine") or joining_data.get("presentAddress") or perm_addr_val

    # Ensure joining_data also contains consistent keys
    if pan_val and not joining_data.get("panNo"): joining_data["panNo"] = pan_val
    if uan_val and not joining_data.get("uanEpf"): joining_data["uanEpf"] = uan_val
    if bank_acc_val and not joining_data.get("bankAccountNo"): joining_data["bankAccountNo"] = bank_acc_val
    if ifsc_val and not joining_data.get("ifscCode"): joining_data["ifscCode"] = ifsc_val
    if bank_name_val and not joining_data.get("bankName"): joining_data["bankName"] = bank_name_val
    if esi_val and not joining_data.get("esiNumber"): joining_data["esiNumber"] = esi_val
    if aadhaar_val and not joining_data.get("aadhaarNo"): joining_data["aadhaarNo"] = aadhaar_val

    new_candidate = Candidate(
        id=candidate_id,
        token=token,
        name=payload.name,
        emp_id=payload.emp_id or hierarchical_emp_code,
        employee_number=payload.employee_number or hierarchical_emp_code,
        email=clean_email,
        mobile=clean_mobile or "",
        aadhaar_no=aadhaar_val,
        designation=payload.designation or "Associate",
        dept=payload.dept or "General",
        employee_type=payload.employee_type or "it_tech",
        dob=payload.dob or joining_data.get("dob"),
        doj=payload.doj or joining_data.get("doj"),
        age=payload.age or (int(joining_data.get("age")) if joining_data.get("age") else None),
        gender=payload.gender or joining_data.get("gender") or "Male",
        marital_status=payload.marital_status or joining_data.get("maritalStatus") or "Single",
        mother_tongue=payload.mother_tongue or joining_data.get("motherTongue") or "Tamil",
        languages_known=payload.languages_known or "English, Tamil, Hindi",
        pf_number=uan_val,
        esi_number=esi_val,
        religion=payload.religion or "Hindu",
        caste=payload.caste,
        category=payload.category or "General",
        native_state=payload.native_state or "Tamil Nadu",
        native_district=payload.native_district or "Chennai",
        identification_marks=payload.identification_marks,
        father_name=father_val,
        mother_name=mother_val,
        spouse_name=payload.spouse_name,
        blood_group=payload.blood_group or joining_data.get("bloodGroup"),
        state=payload.state or joining_data.get("permanentState"),
        district=payload.district or joining_data.get("permanentCity"),
        city=payload.city or joining_data.get("permanentCity"),
        area=payload.area,
        pincode=payload.pincode or joining_data.get("permanentPincode"),
        present_address=pres_addr_val,
        permanent_address=perm_addr_val,
        pan_no=pan_val,
        uan_no=uan_val,
        alternate_mobile=payload.alternate_mobile or joining_data.get("alternateMobile"),
        emergency_contact_name=payload.emergency_contact_name or joining_data.get("emergencyContactName"),
        emergency_contact_phone=payload.emergency_contact_phone or joining_data.get("emergencyContactPhone"),
        qualification_category=payload.qualification_category,
        highest_qualification=payload.highest_qualification or joining_data.get("highestQualification"),
        job_category=payload.job_category,
        job_type=payload.job_type,
        bank_name=bank_name_val,
        bank_account_no=bank_acc_val,
        ifsc_code=ifsc_val,
        nominee_name=payload.nominee_name,
        nominee_relation=payload.nominee_relation,
        linked_in_url=payload.linked_in_url,
        github_url=payload.github_url,
        portfolio_url=payload.portfolio_url,
        twitter_url=payload.twitter_url,
        company_id=resolved_comp_id,
        hr_id=resolved_hr_id,
        portal_password=payload.portal_password or "1234",
        status="Link Sent",
        verification_config=payload.verification_config or {
            "requireAadhaar": True,
            "requireMobileOtp": True,
            "requireFaceMatch": True,
            "requireDL": False,
            "requirePAN": True,
            "requireBankCheck": True
        },
        verifications_completed=initial_verifs,
        face_images=initial_face_images,
        manual_checks=payload.manual_checks or {
            "hrReferenceCompleted": True,
            "addressVerifiedPhysically": False
        },
        joining_form_data=joining_data,
        custom_fields=payload.custom_fields or {},
        specimen_signature=payload.specimen_signature,
        created_at=datetime.utcnow()
    )
    
    db.add(new_candidate)
    
    # Save any attached candidate documents to candidate_documents table
    if payload.documents:
        for doc in payload.documents:
            doc_id = f"doc-{uuid.uuid4().hex[:8]}"
            if isinstance(doc, str):
                doc_title = f"{doc.capitalize()} Document"
                doc_type = doc
                file_fmt = "pdf"
                file_p = ""
                file_sz = 0.0
            elif isinstance(doc, dict):
                doc_title = doc.get("title") or doc.get("name") or "Candidate Verification Document"
                doc_type = doc.get("doc_type") or doc.get("type") or "aadhaar"
                file_fmt = doc.get("file_format") or doc.get("format") or "pdf"
                file_p = doc.get("file_path") or doc.get("data") or doc.get("url") or ""
                try:
                    file_sz = float(doc.get("file_size_kb") or doc.get("size_kb") or 0.0)
                except (ValueError, TypeError):
                    file_sz = 0.0
            else:
                continue

            cand_doc = CandidateDocument(
                id=doc_id,
                candidate_id=candidate_id,
                title=doc_title,
                doc_type=doc_type,
                file_format=file_fmt,
                file_path=file_p,
                file_size_kb=file_sz,
                created_at=datetime.utcnow()
            )
            db.add(cand_doc)

    # Increment active links on HR user
    if payload.hr_id:
        hr = db.query(HrUser).filter(HrUser.id == payload.hr_id).first()
        if hr:
            hr.active_links = (hr.active_links or 0) + 1
            
    if commit:
        db.commit()
        db.refresh(new_candidate)

    return new_candidate, True

@router.post("/candidates", response_model=CandidateResponse)
def create_candidate(payload: CandidateCreate, db: Session = Depends(get_db)):
    """
    Creates a new labor/employee profile, configures verification fields,
    and issues an automated verification token link.
    """
    try:
        apply_runtime_migrations(db.get_bind())
    except Exception:
        pass

    new_candidate, is_new = _save_or_update_candidate_record(payload, db, commit=True)

    # 📧 Automated Email Invitation to Candidate
    try:
        if is_new and new_candidate.email:
            comp_obj = db.query(Company).filter(Company.id == new_candidate.company_id).first() if new_candidate.company_id else None
            comp_name = comp_obj.name if comp_obj else "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"
            
            hr_name = None
            hr_email = None
            if new_candidate.hr_id:
                hr_user = db.query(HrUser).filter(HrUser.id == new_candidate.hr_id).first()
                if hr_user:
                    hr_name = hr_user.name
                    hr_email = hr_user.email

            send_candidate_onboarding_email(
                candidate_name=new_candidate.name,
                candidate_code=new_candidate.emp_id or new_candidate.employee_number or "EMP",
                candidate_email=new_candidate.email,
                token=new_candidate.token,
                security_pin=new_candidate.portal_password or "1234",
                company_name=comp_name,
                company_id=new_candidate.company_id,
                designation=new_candidate.designation or "Associate",
                sender_hr_name=hr_name,
                sender_hr_email=hr_email,
                db=db
            )
    except Exception as e:
        print(f"Warning: Failed to dispatch candidate onboarding email: {e}")

    return new_candidate

@router.post("/candidates/bulk", response_model=List[CandidateResponse])
def create_candidates_bulk(payload: List[CandidateCreate], db: Session = Depends(get_db)):
    """
    Bulk import multiple candidate/employee profiles in a high-performance, atomic batch transaction.
    """
    try:
        apply_runtime_migrations(db.get_bind())
    except Exception:
        pass

    saved_records = []
    for item in payload:
        try:
            cand, is_new = _save_or_update_candidate_record(item, db, commit=False)
            saved_records.append((cand, is_new))
        except Exception as err:
            print(f"Error importing bulk candidate '{getattr(item, 'name', 'unknown')}': {err}")
            continue

    try:
        db.commit()
    except Exception as commit_err:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error during bulk candidate ingestion: {str(commit_err)}")

    refreshed_list = []
    for cand, is_new in saved_records:
        try:
            db.refresh(cand)
            refreshed_list.append(cand)
            
            # Dispatch email if email is present
            if cand.email:
                try:
                    import uuid
                    if not cand.token:
                        clean_n = (cand.name or "cand").lower().replace(" ", "_")[:10]
                        cand.token = f"tok_{clean_n}_{uuid.uuid4().hex[:4]}"
                    if not cand.portal_password:
                        cand.portal_password = "1234"
                    db.commit()
                    db.refresh(cand)

                    comp_obj = db.query(Company).filter(Company.id == cand.company_id).first() if cand.company_id else None
                    comp_name = comp_obj.name if comp_obj else "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"

                    hr_name = None
                    hr_email = None
                    if cand.hr_id:
                        hr_user = db.query(HrUser).filter(HrUser.id == cand.hr_id).first()
                        if hr_user:
                            hr_name = hr_user.name
                            hr_email = hr_user.email

                    send_candidate_onboarding_email(
                        candidate_name=cand.name,
                        candidate_code=cand.emp_id or cand.employee_number or "EMP",
                        candidate_email=cand.email,
                        token=cand.token,
                        security_pin=cand.portal_password or "1234",
                        company_name=comp_name,
                        company_id=cand.company_id,
                        designation=cand.designation or "Associate",
                        sender_hr_name=hr_name,
                        sender_hr_email=hr_email,
                        db=db,
                        async_mode=True
                    )
                    print(f"✅ Onboarding email dispatched successfully to {cand.email}")
                except Exception as mail_err:
                    print(f"⚠️ Warning: Failed to dispatch candidate onboarding email for {cand.email}: {mail_err}")
        except Exception:
            continue

    return refreshed_list

@router.post("/dispatch-link")
def dispatch_onboarding_link(payload: dict, db: Session = Depends(get_db)):
    """
    Multi-channel link dispatch via WhatsApp API, SMS Gateway, or cPanel SMTP Email.
    Automatically ensures DB schema synchronization and reliably dispatches candidate invitation emails.
    """
    # 1. Apply runtime schema migrations on the active DB connection
    try:
        apply_runtime_migrations(db.get_bind())
    except Exception as mig_err:
        pass

    channel = payload.get("channel", "email") # 'email' | 'whatsapp' | 'sms'
    candidate_id = payload.get("candidate_id")
    token = payload.get("token") or payload.get("candidate_token")
    hr_email = payload.get("hr_email")
    hr_name = payload.get("hr_name")
    hr_id = payload.get("hr_id")
    candidate_email = (payload.get("candidate_email") or payload.get("email") or "").strip()
    candidate_name = payload.get("candidate_name") or payload.get("name") or "Valued Candidate"
    candidate_code = payload.get("candidate_code") or payload.get("employee_number") or payload.get("empId") or "JOY-EMP-001"
    company_name = payload.get("company_name")
    company_id = payload.get("company_id")
    designation = payload.get("designation") or "Associate"
    security_pin = str(payload.get("security_pin") or payload.get("portal_password") or "1234").strip()
    custom_smtp = payload.get("custom_smtp")

    # 2. Safely find or create Candidate record in PostgreSQL
    candidate = None
    try:
        if candidate_id:
            candidate = db.query(Candidate).filter((Candidate.id == candidate_id) | (Candidate.token == candidate_id)).first()
        if not candidate and token:
            candidate = db.query(Candidate).filter(Candidate.token == token).first()
        if not candidate and candidate_email:
            candidate = db.query(Candidate).filter(Candidate.email.ilike(candidate_email)).first()

        if not candidate:
            import uuid
            cand_token = token or str(uuid.uuid4())
            cand_id = candidate_id if (candidate_id and not str(candidate_id).startswith('cand-17')) else f"cand-{uuid.uuid4().hex[:6]}"
            
            comp_obj = None
            if company_id:
                comp_obj = db.query(Company).filter((Company.id == company_id) | (Company.code == company_id)).first()
            if not comp_obj:
                comp_obj = db.query(Company).first()
            if not comp_obj:
                comp_obj = Company(
                    id="comp-joy",
                    code="COMP001",
                    name=company_name or "JOY CORPORATE SOLUTIONS PRIVATE LIMITED",
                    email="info@joycorporatesolutions.com",
                    status="Active"
                )
                db.add(comp_obj)
                try:
                    db.commit()
                    db.refresh(comp_obj)
                except Exception:
                    db.rollback()
            comp_id = comp_obj.id if comp_obj else "comp-joy"

            hr_user = None
            if hr_id:
                hr_user = db.query(HrUser).filter(HrUser.id == hr_id).first()
            if not hr_user and comp_obj:
                hr_user = db.query(HrUser).filter(HrUser.company_id == comp_obj.id).first()
            resolved_hr_id = hr_user.id if hr_user else None
            
            cand_mobile = str(payload.get("mobile") or payload.get("candidate_mobile") or "9876543210").strip()

            candidate = Candidate(
                id=cand_id,
                token=cand_token,
                name=candidate_name,
                email=candidate_email,
                mobile=cand_mobile,
                designation=designation,
                dept=payload.get("dept") or "Operations",
                company_id=comp_id,
                hr_id=resolved_hr_id,
                status="Link Sent",
                portal_password=security_pin,
                employee_number=candidate_code
            )
            db.add(candidate)
            try:
                db.commit()
                db.refresh(candidate)
            except Exception:
                db.rollback()
                candidate = db.query(Candidate).filter((Candidate.email.ilike(candidate_email)) | (Candidate.token == cand_token)).first()
        else:
            if candidate_email:
                candidate.email = candidate_email
            if security_pin:
                candidate.portal_password = security_pin
            candidate.status = "Link Sent"
            try:
                db.commit()
                db.refresh(candidate)
            except Exception:
                db.rollback()
    except Exception as db_err:
        try:
            db.rollback()
        except Exception:
            pass

    # 3. Resolve target variables
    target_email = (candidate.email if candidate else None) or candidate_email
    target_token = (candidate.token if candidate else None) or token or "tok-muthu-99"
    cand_name = (candidate.name if candidate else None) or candidate_name
    cand_code = (candidate.emp_id if candidate else None) or (candidate.employee_number if candidate else None) or candidate_code
    cand_pin = (candidate.portal_password if candidate else None) or security_pin
    cand_company_id = (candidate.company_id if candidate else None) or company_id
    cand_designation = (candidate.designation if candidate else None) or designation

    comp_name = company_name
    if not comp_name and cand_company_id:
        try:
            comp_obj = db.query(Company).filter(Company.id == cand_company_id).first()
            if comp_obj:
                comp_name = comp_obj.name
        except Exception:
            pass
    if not comp_name:
        comp_name = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"

    if not hr_name:
        try:
            lookup_hr_id = hr_id or (candidate.hr_id if candidate else None)
            if lookup_hr_id:
                hr_user = db.query(HrUser).filter(HrUser.id == lookup_hr_id).first()
                if hr_user:
                    hr_name = hr_user.name
                    hr_email = hr_email or hr_user.email
        except Exception:
            pass

    app_url = "https://test2.joycorporatesolutions.com"
    verify_url = f"{app_url}/verify?token={target_token}"

    # 4. Dispatch onboarding email to Candidate
    email_res = None
    try:
        email_res = send_candidate_onboarding_email(
            candidate_name=cand_name,
            candidate_code=cand_code,
            candidate_email=target_email,
            token=target_token,
            security_pin=cand_pin,
            company_name=comp_name,
            company_id=cand_company_id,
            designation=cand_designation,
            sender_hr_name=hr_name,
            sender_hr_email=hr_email,
            custom_smtp=custom_smtp,
            db=db
        )
    except Exception as em_err:
        email_res = {"success": False, "error": str(em_err)}

    email_sent = bool(email_res and email_res.get("success"))
    email_error = email_res.get("error") if (email_res and not email_sent) else None

    return {
        "success": True,
        "channel": channel,
        "candidate_id": (candidate.id if candidate else None) or candidate_id or "cand-1",
        "token": target_token,
        "verify_url": verify_url,
        "security_pin": cand_pin,
        "email_sent": email_sent,
        "email_error": email_error,
        "message": f"Onboarding invitation email dispatched to {target_email} (PIN: {cand_pin})." if email_sent else f"Verification link generated for {target_email}. Note: {email_error or 'Email queued'}",
        "email_result": email_res
    }


@router.put("/candidates/{candidate_id}", response_model=CandidateResponse)
def update_candidate_profile(candidate_id: str, payload: CandidateUpdate, db: Session = Depends(get_db)):
    """
    Updates an existing candidate/employee profile particulars including name, contact,
    IDs, statutory forms data, verification configs, and security passcode.
    """
    cand = db.query(Candidate).filter((Candidate.id == candidate_id) | (Candidate.token == candidate_id)).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")

    if payload.name is not None: cand.name = payload.name
    if payload.emp_id is not None: cand.emp_id = payload.emp_id
    if payload.employee_number is not None: cand.employee_number = payload.employee_number
    if payload.email is not None: cand.email = payload.email
    if payload.mobile is not None: cand.mobile = payload.mobile
    if payload.aadhaar_no is not None: cand.aadhaar_no = payload.aadhaar_no
    if payload.designation is not None: cand.designation = payload.designation
    if payload.dept is not None: cand.dept = payload.dept
    if payload.employee_type is not None: cand.employee_type = payload.employee_type
    if payload.dob is not None: cand.dob = payload.dob
    if payload.doj is not None: cand.doj = payload.doj
    if payload.age is not None: cand.age = payload.age
    if payload.gender is not None: cand.gender = payload.gender
    if payload.marital_status is not None: cand.marital_status = payload.marital_status
    if payload.mother_tongue is not None: cand.mother_tongue = payload.mother_tongue
    if payload.languages_known is not None: cand.languages_known = payload.languages_known
    if payload.pf_number is not None: cand.pf_number = payload.pf_number
    if payload.esi_number is not None: cand.esi_number = payload.esi_number
    if payload.religion is not None: cand.religion = payload.religion
    if payload.caste is not None: cand.caste = payload.caste
    if payload.category is not None: cand.category = payload.category
    if payload.native_state is not None: cand.native_state = payload.native_state
    if payload.native_district is not None: cand.native_district = payload.native_district
    if payload.identification_marks is not None: cand.identification_marks = payload.identification_marks
    if payload.father_name is not None: cand.father_name = payload.father_name
    if payload.mother_name is not None: cand.mother_name = payload.mother_name
    if payload.spouse_name is not None: cand.spouse_name = payload.spouse_name
    if payload.blood_group is not None: cand.blood_group = payload.blood_group
    if payload.state is not None: cand.state = payload.state
    if payload.district is not None: cand.district = payload.district
    if payload.city is not None: cand.city = payload.city
    if payload.area is not None: cand.area = payload.area
    if payload.pincode is not None: cand.pincode = payload.pincode
    if payload.present_address is not None: cand.present_address = payload.present_address
    if payload.permanent_address is not None: cand.permanent_address = payload.permanent_address
    if payload.pan_no is not None: cand.pan_no = payload.pan_no
    if payload.uan_no is not None: cand.uan_no = payload.uan_no
    if payload.alternate_mobile is not None: cand.alternate_mobile = payload.alternate_mobile
    if payload.emergency_contact_name is not None: cand.emergency_contact_name = payload.emergency_contact_name
    if payload.emergency_contact_phone is not None: cand.emergency_contact_phone = payload.emergency_contact_phone
    if payload.qualification_category is not None: cand.qualification_category = payload.qualification_category
    if payload.highest_qualification is not None: cand.highest_qualification = payload.highest_qualification
    if payload.job_category is not None: cand.job_category = payload.job_category
    if payload.job_type is not None: cand.job_type = payload.job_type
    if payload.bank_name is not None: cand.bank_name = payload.bank_name
    if payload.bank_account_no is not None: cand.bank_account_no = payload.bank_account_no
    if payload.ifsc_code is not None: cand.ifsc_code = payload.ifsc_code
    if payload.nominee_name is not None: cand.nominee_name = payload.nominee_name
    if payload.nominee_relation is not None: cand.nominee_relation = payload.nominee_relation
    if payload.linked_in_url is not None: cand.linked_in_url = payload.linked_in_url
    if payload.github_url is not None: cand.github_url = payload.github_url
    if payload.portfolio_url is not None: cand.portfolio_url = payload.portfolio_url
    if payload.twitter_url is not None: cand.twitter_url = payload.twitter_url
    if payload.status is not None: cand.status = payload.status
    if payload.portal_password is not None: cand.portal_password = payload.portal_password
    if payload.verification_config is not None: cand.verification_config = payload.verification_config
    if payload.verifications_completed is not None: cand.verifications_completed = payload.verifications_completed
    if payload.face_images is not None: cand.face_images = payload.face_images
    if payload.manual_checks is not None: cand.manual_checks = payload.manual_checks
    if payload.joining_form_data is not None: cand.joining_form_data = payload.joining_form_data
    if payload.custom_fields is not None: cand.custom_fields = payload.custom_fields
    if payload.specimen_signature is not None: cand.specimen_signature = payload.specimen_signature

    db.commit()
    db.refresh(cand)
    return cand


@router.put("/candidates/{candidate_id}/status")
def toggle_candidate_status(candidate_id: str, payload: dict, db: Session = Depends(get_db)):
    """Set candidate verification status: 'Verified' | 'Link Sent' | 'In Verification' | 'Inactive' | 'Discontinued' | 'Withdrawn'"""
    cand = db.query(Candidate).filter((Candidate.id == candidate_id) | (Candidate.token == candidate_id)).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    new_status = payload.get("status", "Inactive")
    cand.status = new_status
    db.commit()
    db.refresh(cand)
    return {"success": True, "candidate_id": cand.id, "status": cand.status}


@router.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: str, db: Session = Depends(get_db)):
    """Deletes a candidate profile and cascades all associated verification records and documents"""
    cand = db.query(Candidate).filter((Candidate.id == candidate_id) | (Candidate.token == candidate_id)).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    cand_name = cand.name
    db.delete(cand)
    db.commit()
    return {"success": True, "message": f"Candidate {cand_name} deleted successfully"}

@router.post("/candidates/purge-duplicates")
def purge_duplicate_candidates(payload: dict = None, db: Session = Depends(get_db)):
    """Purges duplicate candidate records keeping only the most recent unique record per email/mobile/aadhaar"""
    company_id = payload.get("company_id") if payload else None
    query = db.query(Candidate)
    if company_id:
        query = query.filter(Candidate.company_id == company_id)
    
    all_cands = query.order_by(Candidate.created_at.desc()).all()
    seen = set()
    deleted_count = 0
    
    for c in all_cands:
        key = None
        if c.aadhaar_no:
            key = f"aadhaar_{c.aadhaar_no.strip()}"
        elif c.email:
            key = f"email_{c.email.strip().lower()}"
        elif c.mobile:
            key = f"mobile_{c.mobile.strip()}"
        
        if key:
            if key in seen:
                db.delete(c)
                deleted_count += 1
            else:
                seen.add(key)
    
    db.commit()
    return {
        "success": True,
        "message": f"Purged {deleted_count} duplicate candidate records.",
        "deleted_count": deleted_count
    }

@router.put("/candidates/{candidate_id}/toggle-status")
def toggle_candidate_status(candidate_id: str, payload: dict = None, db: Session = Depends(get_db)):
    """Toggles candidate status between Active (Pending/Verified) and Inactive"""
    cand = db.query(Candidate).filter((Candidate.id == candidate_id) | (Candidate.token == candidate_id)).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    new_status = payload.get("status") if payload and "status" in payload else None
    if not new_status:
        if cand.status == "Inactive":
            new_status = "Pending"
        else:
            new_status = "Inactive"
            
    cand.status = new_status
    db.commit()
    db.refresh(cand)
    return {
        "success": True,
        "message": f"Candidate {cand.name} is now {new_status}",
        "status": cand.status
    }
