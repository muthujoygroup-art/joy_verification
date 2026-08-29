from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models import Candidate, CandidateDocument, Company, Invoice
from backend.app.services.report_generator import (
    generate_pdf_report,
    generate_excel_report,
    generate_word_report,
    generate_official_certificate_pdf,
    generate_employee_profile_dossier_pdf,
    generate_tax_invoice_pdf,
    generate_360_bgv_dossier_pdf
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
        (Candidate.id == identifier) | 
        (Candidate.token == identifier) |
        (Candidate.emp_id == identifier) |
        (Candidate.employee_number == identifier)
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
        (Candidate.id == identifier) | 
        (Candidate.token == identifier) |
        (Candidate.emp_id == identifier) |
        (Candidate.employee_number == identifier)
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
        
    company = db.query(Company).filter(Company.id == candidate.company_id).first()
    company_name = company.name if company else "Acme Global Technologies Pvt Ltd"

    # Query all candidate documents attached in database
    docs_db = db.query(CandidateDocument).filter(CandidateDocument.candidate_id == candidate.id).all()
    docs_list = [
        {
            "id": d.id,
            "title": d.title,
            "name": d.name,
            "doc_type": d.doc_type,
            "file_format": d.file_format,
            "file_size_kb": d.file_size_kb,
            "file_path": d.file_path,
            "uploaded_at": str(d.uploaded_at)
        }
        for d in docs_db
    ]

    candidate_data = {
        "id": candidate.id,
        "token": candidate.token,
        "name": candidate.name,
        "empId": candidate.emp_id,
        "employee_number": candidate.employee_number or candidate.emp_id,
        "designation": candidate.designation,
        "dept": candidate.dept,
        "employee_type": candidate.employee_type,
        "mobile": candidate.mobile,
        "email": candidate.email,
        "aadhaarNo": candidate.aadhaar_no,
        "panNo": (candidate.joining_form_data or {}).get("panNo") or (candidate.verified_attributes or {}).get("pan", {}).get("pan_number") or "ABCDE1234F",
        "status": candidate.status,
        "verificationDate": candidate.verification_date,
        "company_id": candidate.company_id,
        "company_name": company_name,
        "dob": candidate.dob,
        "doj": candidate.doj,
        "age": candidate.age,
        "gender": candidate.gender,
        "marital_status": candidate.marital_status,
        "mother_tongue": candidate.mother_tongue,
        "languages_known": candidate.languages_known,
        "religion": candidate.religion,
        "caste": candidate.caste,
        "category": candidate.category,
        "native_state": candidate.native_state,
        "native_district": candidate.native_district,
        "identification_marks": candidate.identification_marks,
        "pf_number": candidate.pf_number,
        "esi_number": candidate.esi_number,
        "custom_fields": candidate.custom_fields or {},
        "documents": docs_list,
        "verificationsCompleted": candidate.verifications_completed or {},
        "faceImages": candidate.face_images or {},
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

@router.get("/invoice/{invoice_id}")
def export_tax_invoice_pdf(invoice_id: str, db: Session = Depends(get_db)):
    """Export official GST Tax Invoice as PDF"""
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    comp = db.query(Company).filter(Company.id == inv.company_id).first()
    company_data = {
        "name": comp.name if comp else "Acme Global Technologies Pvt Ltd",
        "code": comp.code if comp else "ACME"
    }
    
    invoice_data = {
        "id": inv.id,
        "month": inv.month,
        "year": inv.year,
        "verifications_count": inv.verifications_count,
        "unit_price": inv.unit_price,
        "subtotal": inv.subtotal,
        "tax_amount": inv.tax_amount,
        "total_amount": inv.total_amount
    }
    
    pdf_buffer = generate_tax_invoice_pdf(invoice_data, company_data)
    filename = f"JOY_Tax_Invoice_{inv.id}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/bgv-dossier/{identifier}")
def export_bgv_dossier_pdf(identifier: str, db: Session = Depends(get_db)):
    """
    Export the 360° Comprehensive BGV Dossier across all 10+ verification APIs.
    """
    candidate = db.query(Candidate).filter(
        (Candidate.id == identifier) | 
        (Candidate.token == identifier) |
        (Candidate.emp_id == identifier) |
        (Candidate.employee_number == identifier)
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate verification profile not found")
        
    company = db.query(Company).filter(Company.id == candidate.company_id).first()
    company_name = company.name if company else "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"

    candidate_data = {
        "id": candidate.id,
        "token": candidate.token,
        "name": candidate.name,
        "empId": candidate.emp_id,
        "employee_number": candidate.employee_number or candidate.emp_id,
        "designation": candidate.designation,
        "dept": candidate.dept,
        "mobile": candidate.mobile,
        "aadhaarNo": candidate.aadhaar_no,
        "panNo": (candidate.joining_form_data or {}).get("panNo") or (candidate.verified_attributes or {}).get("pan", {}).get("pan_number") or "ABCDE1234F",
        "status": candidate.status,
        "verificationDate": candidate.verification_date,
        "company_name": company_name,
        "verificationsCompleted": candidate.verifications_completed or {}
    }
    
    pdf_buffer = generate_360_bgv_dossier_pdf(candidate_data)
    filename = f"JOY_360_BGV_Dossier_{candidate.name.replace(' ', '_')}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
