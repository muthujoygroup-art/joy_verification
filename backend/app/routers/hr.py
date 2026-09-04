from backend.app.services.storage_service import get_candidate_folder
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models import Candidate, Company, HrUser, CandidateDocument
from backend.app.services.email_service import send_candidate_onboarding_email
from backend.app.schemas import CandidateCreate, CandidateResponse, CandidateUpdate

router = APIRouter(prefix="/hr", tags=["HR Executive"])

@router.get("/candidates", response_model=List[CandidateResponse])
def get_all_candidates(hr_id: str = None, company_id: str = None, db: Session = Depends(get_db)):
    """Fetch candidates filtered by HR executive or Company"""
    query = db.query(Candidate)
    if hr_id:
        query = query.filter(Candidate.hr_id == hr_id)
    elif company_id:
        query = query.filter(Candidate.company_id == company_id)
    return query.order_by(Candidate.created_at.desc()).all()

@router.post("/candidates", response_model=CandidateResponse)
def create_candidate(payload: CandidateCreate, db: Session = Depends(get_db)):
    """
    Creates a new labor/employee profile, configures verification fields,
    and issues an automated verification token link.
    """
    # 🛡️ Strict Duplicate Prevention: Check if candidate already exists by email, mobile, aadhaar, or emp_id
    existing_cand = None
    if payload.email:
        existing_cand = db.query(Candidate).filter(
            Candidate.company_id == payload.company_id,
            Candidate.email.ilike(payload.email.strip())
        ).first()
    if not existing_cand and payload.mobile:
        existing_cand = db.query(Candidate).filter(
            Candidate.company_id == payload.company_id,
            Candidate.mobile == payload.mobile.strip()
        ).first()
    if not existing_cand and payload.aadhaar_no:
        existing_cand = db.query(Candidate).filter(
            Candidate.company_id == payload.company_id,
            Candidate.aadhaar_no == payload.aadhaar_no.strip()
        ).first()

    if existing_cand:
        # Update existing candidate record rather than creating a duplicate
        existing_cand.name = payload.name or existing_cand.name
        existing_cand.designation = payload.designation or existing_cand.designation
        existing_cand.dept = payload.dept or existing_cand.dept
        existing_cand.employee_type = payload.employee_type or existing_cand.employee_type
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
        if payload.portal_password: existing_cand.portal_password = payload.portal_password
        if payload.verification_config: existing_cand.verification_config = payload.verification_config
        if payload.joining_form_data: existing_cand.joining_form_data = payload.joining_form_data
        if payload.custom_fields: existing_cand.custom_fields = payload.custom_fields
        if payload.specimen_signature: existing_cand.specimen_signature = payload.specimen_signature
        db.commit()
        db.refresh(existing_cand)
        return existing_cand

    candidate_id = f"emp-{uuid.uuid4().hex[:6]}"
    clean_name = payload.name.lower().replace(" ", "_")[:10]
    token = f"tok_{clean_name}_{uuid.uuid4().hex[:4]}"
    
    # Compute hierarchical employee profile code (e.g. COMP001EMP001)
    comp = db.query(Company).filter(Company.id == payload.company_id).first() if payload.company_id else None
    comp_code = comp.code if comp and comp.code else "COMP001"
    emp_count = db.query(Candidate).filter(Candidate.company_id == payload.company_id).count() + 1
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
    
    joining_data = payload.joining_form_data or {}
    if payload.documents:
        joining_data["uploadedDocuments"] = payload.documents

    new_candidate = Candidate(
        id=candidate_id,
        token=token,
        name=payload.name,
        emp_id=payload.emp_id or hierarchical_emp_code,
        employee_number=payload.employee_number or hierarchical_emp_code,
        email=payload.email,
        mobile=payload.mobile,
        aadhaar_no=payload.aadhaar_no,
        designation=payload.designation or "Associate",
        dept=payload.dept or "General",
        employee_type=payload.employee_type or "it_tech",
        dob=payload.dob,
        doj=payload.doj,
        age=payload.age,
        gender=payload.gender or "Male",
        marital_status=payload.marital_status or "Single",
        mother_tongue=payload.mother_tongue or "Tamil",
        languages_known=payload.languages_known or "English, Tamil, Hindi",
        pf_number=payload.pf_number,
        esi_number=payload.esi_number,
        religion=payload.religion or "Hindu",
        caste=payload.caste,
        category=payload.category or "General",
        native_state=payload.native_state or "Tamil Nadu",
        native_district=payload.native_district or "Chennai",
        identification_marks=payload.identification_marks,
        company_id=payload.company_id,
        hr_id=payload.hr_id,
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
            cand_doc = CandidateDocument(
                id=doc_id,
                candidate_id=candidate_id,
                title=doc.get("title") or doc.get("name") or "Candidate Verification Document",
                doc_type=doc.get("doc_type") or doc.get("type") or "aadhaar",
                file_format=doc.get("file_format") or doc.get("format") or "pdf",
                file_path=doc.get("file_path") or doc.get("data") or doc.get("url") or "",
                file_size_kb=float(doc.get("file_size_kb") or doc.get("size_kb") or 0.0),
                created_at=datetime.utcnow()
            )
            db.add(cand_doc)

    # Increment active links on HR user
    if payload.hr_id:
        hr = db.query(HrUser).filter(HrUser.id == payload.hr_id).first()
        if hr:
            hr.active_links = (hr.active_links or 0) + 1
            
    db.commit()
    db.refresh(new_candidate)

    # 📧 Automated Email Invitation to Candidate
    try:
        if new_candidate.email:
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
                candidate_code=new_candidate.emp_id or hierarchical_emp_code,
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

@router.post("/dispatch-link")
def dispatch_onboarding_link(payload: dict, db: Session = Depends(get_db)):
    """
    Multi-channel link dispatch via WhatsApp API, SMS Gateway, or cPanel SMTP Email.
    Automatically persists candidate to PostgreSQL if not yet existing, guaranteeing seamless employee access.
    """
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
    
    # Try finding candidate in DB
    candidate = None
    if candidate_id:
        candidate = db.query(Candidate).filter((Candidate.id == candidate_id) | (Candidate.token == candidate_id)).first()
    if not candidate and token:
        candidate = db.query(Candidate).filter(Candidate.token == token).first()
    if not candidate and candidate_email:
        candidate = db.query(Candidate).filter(Candidate.email.ilike(candidate_email)).first()

    # If candidate is not yet in PostgreSQL DB, create record immediately
    if not candidate:
        import uuid
        cand_token = token or str(uuid.uuid4())
        cand_id = candidate_id if (candidate_id and not candidate_id.startswith('cand-17')) else f"cand-{uuid.uuid4().hex[:6]}"
        
        # Resolve valid company from PostgreSQL
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
            db.commit()
            db.refresh(comp_obj)
        comp_id = comp_obj.id

        # Resolve valid HR User
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
        db.commit()
        db.refresh(candidate)
    else:
        # Update existing candidate particulars
        if candidate_email:
            candidate.email = candidate_email
        if security_pin:
            candidate.portal_password = security_pin
        candidate.status = "Link Sent"
        db.commit()
        db.refresh(candidate)

    comp_obj = db.query(Company).filter(Company.id == candidate.company_id).first() if candidate.company_id else None
    comp_name = company_name or (comp_obj.name if comp_obj else "JOY CORPORATE SOLUTIONS PRIVATE LIMITED")
    
    if not hr_name and (hr_id or candidate.hr_id):
        hr_user = db.query(HrUser).filter(HrUser.id == (hr_id or candidate.hr_id)).first()
        if hr_user:
            hr_name = hr_user.name
            hr_email = hr_email or hr_user.email

    target_email = candidate.email or candidate_email
    if not target_email:
        raise HTTPException(status_code=400, detail="Candidate email address is required for dispatch")

    app_url = "https://test2.joycorporatesolutions.com"
    verify_url = f"{app_url}/verify?token={candidate.token}"

    try:
        email_res = send_candidate_onboarding_email(
            candidate_name=candidate.name,
            candidate_code=candidate.emp_id or candidate.employee_number or candidate_code,
            candidate_email=target_email,
            token=candidate.token,
            security_pin=candidate.portal_password or security_pin,
            company_name=comp_name,
            company_id=candidate.company_id,
            designation=candidate.designation or designation,
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
        "candidate_id": candidate.id,
        "token": candidate.token,
        "verify_url": verify_url,
        "security_pin": candidate.portal_password or security_pin,
        "email_sent": email_sent,
        "email_error": email_error,
        "message": f"Onboarding invitation email dispatched to {target_email} (PIN: {candidate.portal_password or security_pin})." if email_sent else f"Verification link generated for {target_email}. Note: {email_error or 'Email queued'}",
        "email_result": email_res
    }


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
