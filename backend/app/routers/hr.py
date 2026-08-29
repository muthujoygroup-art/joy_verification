import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models import Candidate, Company, HrUser, CandidateDocument
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
    candidate_id = f"emp-{uuid.uuid4().hex[:6]}"
    clean_name = payload.name.lower().replace(" ", "_")[:10]
    token = f"tok_{clean_name}_{uuid.uuid4().hex[:4]}"
    
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
        emp_id=payload.emp_id or f"EMP-2026-{uuid.uuid4().hex[:4].upper()}",
        employee_number=payload.employee_number or payload.emp_id or f"EN-{uuid.uuid4().hex[:6].upper()}",
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
    return new_candidate

@router.post("/dispatch-link")
def dispatch_onboarding_link(payload: dict, db: Session = Depends(get_db)):
    """
    Simulates multi-channel link dispatch via WhatsApp API, SMS Gateway, or SMTP Email.
    """
    channel = payload.get("channel", "whatsapp") # 'whatsapp' | 'sms' | 'email'
    candidate_id = payload.get("candidate_id")
    
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    magic_link = f"http://localhost:5173/verify?token={candidate.token}"
    
    if channel == "whatsapp":
        msg = f"WhatsApp template dispatched to {candidate.mobile} with verification link."
    elif channel == "sms":
        msg = f"SMS OTP Link sent to {candidate.mobile} via DLT Bulk Gateway."
    else:
        msg = f"Onboarding invitation email sent to {candidate.email}."
        
    return {
        "success": True,
        "channel": channel,
        "message": msg,
        "link": magic_link
    }
