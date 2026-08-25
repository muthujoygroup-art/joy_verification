from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models import Candidate, CandidateDocument, Company
from backend.app.services.report_generator import (
    generate_pdf_report,
    generate_excel_report,
    generate_word_report,
    generate_official_certificate_pdf,
    generate_employee_profile_dossier_pdf
)

router = APIRouter(prefix="/documents", tags=["Document Management & Exporter"])

@router.get("/certificate/{identifier}")
def export_official_certificate(identifier: str, db: Session = Depends(get_db)):
    """
    Export the Official Verification Certificate issued by JOY CORPORATE SOLUTIONS PRIVATE LIMITED.
    Supports either candidate ID ('emp-101') or token ('tok_sunita_412').
    Includes Dual Logos (JOY Corporate Solutions + Employer Company).
    """
    candidate = db.query(Candidate).filter(
        (Candidate.id == identifier) | (Candidate.token == identifier)
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate verification profile not found")
        
    company = db.query(Company).filter(Company.id == candidate.company_id).first()
    company_name = company.name if company else "Acme Global Technologies Pvt Ltd"

    candidate_data = {
        "id": candidate.id,
        "token": candidate.token,
        "name": candidate.name,
        "empId": candidate.emp_id,
        "designation": candidate.designation,
        "dept": candidate.dept,
        "mobile": candidate.mobile,
        "aadhaarNo": candidate.aadhaar_no,
        "status": candidate.status,
        "verificationDate": candidate.verification_date,
        "company_id": candidate.company_id,
        "company_name": company_name,
        "verificationsCompleted": candidate.verifications_completed or {},
        "faceImages": candidate.face_images or {}
    }
    
    pdf_buffer = generate_official_certificate_pdf(candidate_data)
    filename = f"JOY_Corporate_Certificate_{candidate.name.replace(' ', '_')}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/profile-dossier/{identifier}")
def export_employee_profile_dossier(identifier: str, db: Session = Depends(get_db)):
    """
    Export the Comprehensive 4-Page Employee Profile Dossier (CiteHR Standard).
    Includes Employer Company Logo and complete demographic, academic, employment, banking & nominee records.
    """
    candidate = db.query(Candidate).filter(
        (Candidate.id == identifier) | (Candidate.token == identifier)
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
        
    company = db.query(Company).filter(Company.id == candidate.company_id).first()
    company_name = company.name if company else "Acme Global Technologies Pvt Ltd"

    candidate_data = {
        "id": candidate.id,
        "token": candidate.token,
        "name": candidate.name,
        "empId": candidate.emp_id,
        "designation": candidate.designation,
        "dept": candidate.dept,
        "mobile": candidate.mobile,
        "email": candidate.email,
        "aadhaarNo": candidate.aadhaar_no,
        "status": candidate.status,
        "verificationDate": candidate.verification_date,
        "company_id": candidate.company_id,
        "company_name": company_name,
        "verificationsCompleted": candidate.verifications_completed or {},
        "joiningFormData": candidate.joining_form_data or {}
    }
    
    pdf_buffer = generate_employee_profile_dossier_pdf(candidate_data)
    filename = f"Employee_Profile_Dossier_{candidate.name.replace(' ', '_')}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/export/pdf")
def export_pdf_report(company_id: str = None, candidate_id: str = None, db: Session = Depends(get_db)):
    """Export compliance audit table report as standard PDF"""
    query = db.query(Candidate)
    title = "Platform Verification Audit Report"
    
    if candidate_id:
        c = query.filter(Candidate.id == candidate_id).first()
        candidates = [c] if c else []
        title = f"Compliance Dossier - {c.name if c else 'Candidate'}"
    elif company_id:
        candidates = query.filter(Candidate.company_id == company_id).all()
        comp = db.query(Company).filter(Company.id == company_id).first()
        title = f"Compliance Audit - {comp.name if comp else 'Company'}"
    else:
        candidates = query.all()
        
    candidates_data = [
        {
            "name": c.name,
            "emp_id": c.emp_id,
            "designation": c.designation,
            "dept": c.dept,
            "status": c.status,
            "verifications_completed": c.verifications_completed or {}
        }
        for c in candidates
    ]
    
    pdf_buffer = generate_pdf_report(title, candidates_data)
    filename = f"{title.replace(' ', '_')}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/export/excel")
def export_excel_report(company_id: str = None, db: Session = Depends(get_db)):
    """Export employee verification database as Excel (.xlsx) spreadsheet"""
    query = db.query(Candidate)
    if company_id:
        query = query.filter(Candidate.company_id == company_id)
    candidates = query.all()
    
    candidates_data = [
        {
            "name": c.name,
            "emp_id": c.emp_id,
            "designation": c.designation,
            "dept": c.dept,
            "status": c.status,
            "verifications_completed": c.verifications_completed or {}
        }
        for c in candidates
    ]
    
    excel_buffer = generate_excel_report("Verification Registry", candidates_data)
    return StreamingResponse(
        excel_buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="JOY_Verification_Registry.xlsx"'}
    )

@router.get("/export/word")
def export_word_report(company_id: str = None, db: Session = Depends(get_db)):
    """Export compliance records as Word Document (.docx)"""
    query = db.query(Candidate)
    if company_id:
        query = query.filter(Candidate.company_id == company_id)
    candidates = query.all()
    
    candidates_data = [
        {
            "name": c.name,
            "emp_id": c.emp_id,
            "designation": c.designation,
            "dept": c.dept,
            "status": c.status,
            "verifications_completed": c.verifications_completed or {}
        }
        for c in candidates
    ]
    
    word_buffer = generate_word_report("Compliance Summary", candidates_data)
    return StreamingResponse(
        word_buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": 'attachment; filename="JOY_Verification_Summary.docx"'}
    )
