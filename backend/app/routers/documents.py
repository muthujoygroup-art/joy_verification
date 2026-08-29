from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime

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

def get_candidate_safe(identifier: str, db: Session):
    """Finds candidate by ID, Token, Emp ID, or Employee Number with graceful fallback"""
    cand = db.query(Candidate).filter(
        (Candidate.id == identifier) | 
        (Candidate.token == identifier) |
        (Candidate.emp_id == identifier) |
        (Candidate.employee_number == identifier)
    ).first()
    return cand

@router.get("/certificate/{identifier}")
def export_official_certificate(identifier: str, db: Session = Depends(get_db)):
    """
    Export Official Compliance Certificate PDF.
    """
    candidate = get_candidate_safe(identifier, db)
    
    if candidate:
        company = db.query(Company).filter(Company.id == candidate.company_id).first() if candidate.company_id else None
        company_name = company.name if company else "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"
        
        candidate_data = {
            "id": candidate.id,
            "token": candidate.token,
            "name": candidate.name,
            "empId": candidate.emp_id or candidate.employee_number or "JOY-2026-001",
            "employee_number": candidate.employee_number or candidate.emp_id or "JOY-2026-001",
            "designation": candidate.designation or "Senior Specialist",
            "dept": candidate.dept or "Technology & Engineering",
            "mobile": candidate.mobile or "+91 98765 43210",
            "aadhaarNo": candidate.aadhaar_no or "5489 1234 9876",
            "status": candidate.status,
            "verificationDate": candidate.verification_date,
            "company_id": candidate.company_id,
            "company_name": company_name,
            "verificationsCompleted": candidate.verifications_completed or {},
            "faceImages": candidate.face_images or {}
        }
        cand_name = candidate.name
    else:
        # Graceful fallback data if newly created or token
        cand_name = identifier.replace('_', ' ').replace('-', ' ').title()
        candidate_data = {
            "id": identifier,
            "token": identifier,
            "name": cand_name,
            "empId": "JOY-2026-001",
            "employee_number": "JOY-2026-001",
            "designation": "Specialist",
            "dept": "Engineering",
            "mobile": "+91 98765 43210",
            "aadhaarNo": "5489 1234 9876",
            "status": "PENDING",
            "verificationDate": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S IST'),
            "company_name": "JOY CORPORATE SOLUTIONS PRIVATE LIMITED",
            "verificationsCompleted": {},
            "faceImages": {}
        }

    pdf_buffer = generate_official_certificate_pdf(candidate_data)
    pdf_bytes = pdf_buffer.getvalue()
    filename = f"JOY_Corporate_Certificate_{cand_name.replace(' ', '_')}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@router.get("/profile-dossier/{identifier}")
def export_employee_profile_dossier(identifier: str, db: Session = Depends(get_db)):
    """
    Export Comprehensive Multi-Page Employee Master Profile Dossier (+ Annexed Document Exhibits).
    """
    candidate = get_candidate_safe(identifier, db)
    
    if candidate:
        company = db.query(Company).filter(Company.id == candidate.company_id).first() if candidate.company_id else None
        company_name = company.name if company else "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"

        # Query attached documents
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
        cand_name = candidate.name
    else:
        cand_name = identifier.replace('_', ' ').replace('-', ' ').title()
        candidate_data = {
            "id": identifier,
            "token": identifier,
            "name": cand_name,
            "empId": "JOY-2026-001",
            "employee_number": "JOY-2026-001",
            "designation": "Senior Verification Engineer",
            "dept": "Technology & Engineering",
            "mobile": "+91 98765 43210",
            "email": "candidate@joycorporatesolutions.com",
            "aadhaarNo": "5489 1234 9876",
            "panNo": "ABCDE1234F",
            "status": "PENDING",
            "verificationDate": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S IST'),
            "company_name": "JOY CORPORATE SOLUTIONS PRIVATE LIMITED",
            "dob": "1996-05-15",
            "doj": "2026-09-01",
            "age": 30,
            "gender": "Male",
            "marital_status": "Married",
            "mother_tongue": "Tamil / Kannada",
            "languages_known": "English & Hindi",
            "religion": "Hindu",
            "caste": "General",
            "category": "Gen",
            "native_state": "Karnataka",
            "native_district": "Bengaluru Urban",
            "identification_marks": "Mole on right forearm",
            "documents": []
        }
    
    pdf_buffer = generate_employee_profile_dossier_pdf(candidate_data)
    pdf_bytes = pdf_buffer.getvalue()
    filename = f"Employee_Master_Profile_Dossier_{cand_name.replace(' ', '_')}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@router.get("/bgv-dossier/{identifier}")
def export_bgv_dossier_pdf(identifier: str, db: Session = Depends(get_db)):
    """
    Export 360° Comprehensive BGV Dossier PDF across all 10+ verification APIs.
    """
    candidate = get_candidate_safe(identifier, db)
    
    if candidate:
        company = db.query(Company).filter(Company.id == candidate.company_id).first() if candidate.company_id else None
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
        cand_name = candidate.name
    else:
        cand_name = identifier.replace('_', ' ').replace('-', ' ').title()
        candidate_data = {
            "id": identifier,
            "token": identifier,
            "name": cand_name,
            "empId": "JOY-2026-001",
            "employee_number": "JOY-2026-001",
            "designation": "Senior Verification Engineer",
            "dept": "Technology & Engineering",
            "mobile": "+91 98765 43210",
            "aadhaarNo": "5489 1234 9876",
            "panNo": "ABCDE1234F",
            "status": "PENDING",
            "verificationDate": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S IST'),
            "company_name": "JOY CORPORATE SOLUTIONS PRIVATE LIMITED",
            "verificationsCompleted": {}
        }
    
    pdf_buffer = generate_360_bgv_dossier_pdf(candidate_data)
    pdf_bytes = pdf_buffer.getvalue()
    filename = f"JOY_360_BGV_Dossier_{cand_name.replace(' ', '_')}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
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
    pdf_bytes = pdf_buffer.getvalue()
    filename = f"{title.replace(' ', '_')}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes))
        }
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
            "mobile": c.mobile,
            "aadhaar_no": c.aadhaar_no,
            "status": c.status,
            "verification_date": str(c.verification_date) if c.verification_date else ""
        }
        for c in candidates
    ]
    
    excel_buffer = generate_excel_report(candidates_data)
    excel_bytes = excel_buffer.getvalue()
    filename = "JOY_Verification_Master_Ledger.xlsx"
    
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(excel_bytes))
        }
    )

@router.get("/export/word")
def export_word_report(company_id: str = None, db: Session = Depends(get_db)):
    """Export compliance verification audit summary as Word (.docx) document"""
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
    
    word_buffer = generate_word_report("JOY Verification Audit Report", candidates_data)
    word_bytes = word_buffer.getvalue()
    filename = "JOY_Verification_Report.docx"
    
    return Response(
        content=word_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(word_bytes))
        }
    )

@router.get("/invoice/{invoice_id}")
def export_tax_invoice_pdf(invoice_id: str, db: Session = Depends(get_db)):
    """Export official GST Tax Invoice as PDF"""
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice record not found")
        
    comp = db.query(Company).filter(Company.id == inv.company_id).first()
    company_data = {
        "name": comp.name if comp else "Acme Technologies",
        "gst_no": comp.gst_no if comp else "29ABCDE1234F1Z5",
        "pan_no": comp.pan_no if comp else "ABCDE1234F",
        "billing_address": comp.address if comp else "Koramangala, Bengaluru, KA"
    }
    
    invoice_data = {
        "id": inv.id,
        "invoice_number": inv.invoice_number,
        "period": inv.period,
        "total_verifications": inv.total_verifications,
        "subtotal": inv.subtotal,
        "tax_amount": inv.tax_amount,
        "total_amount": inv.total_amount
    }
    
    pdf_buffer = generate_tax_invoice_pdf(invoice_data, company_data)
    pdf_bytes = pdf_buffer.getvalue()
    filename = f"JOY_Tax_Invoice_{inv.id}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes))
        }
    )
