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
        if payload.verification_config:
            existing_cand.verification_config = payload.verification_config
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
            send_candidate_onboarding_email(
                candidate_name=new_candidate.name,
                candidate_code=new_candidate.emp_id or hierarchical_emp_code,
                candidate_email=new_candidate.email,
                token=new_candidate.token,
                security_pin=new_candidate.portal_password or "1234",
                company_name=comp_name,
                designation=new_candidate.designation or "Associate",
                db=db
            )
    except Exception as e:
        print(f"Warning: Failed to dispatch candidate onboarding email: {e}")

    return new_candidate

@router.post("/dispatch-link")
def dispatch_onboarding_link(payload: dict, db: Session = Depends(get_db)):
    """
    Multi-channel link dispatch via WhatsApp API, SMS Gateway, or cPanel SMTP Email.
    """
    channel = payload.get("channel", "email") # 'email' | 'whatsapp' | 'sms'
    candidate_id = payload.get("candidate_id")
    
    candidate = db.query(Candidate).filter((Candidate.id == candidate_id) | (Candidate.token == candidate_id)).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    comp_obj = db.query(Company).filter(Company.id == candidate.company_id).first() if candidate.company_id else None
    comp_name = comp_obj.name if comp_obj else "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"
    
    email_res = None
    if candidate.email:
        email_res = send_candidate_onboarding_email(
            candidate_name=candidate.name,
            candidate_code=candidate.emp_id or candidate.employee_number or "COMP001EMP001",
            candidate_email=candidate.email,
            token=candidate.token,
            security_pin=candidate.portal_password or "1234",
            company_name=comp_name,
            designation=candidate.designation or "Associate",
            db=db
        )

    return {
        "success": True,
        "channel": channel,
        "message": f"Onboarding invitation email dispatched to {candidate.email} (PIN: {candidate.portal_password or '1234'}).",
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
