import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.inquiry import LeadInquiry
from backend.app.schemas.inquiry import LeadInquiryCreate, LeadInquiryUpdate

router = APIRouter(prefix="/inquiries", tags=["Inquiries & Leads"])

@router.post("")
def submit_public_inquiry(payload: LeadInquiryCreate, db: Session = Depends(get_db)):
    """Public endpoint to submit demo requests, contact forms, or custom tariff inquiries"""
    try:
        inq_id = f"INQ-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        inquiry = LeadInquiry(
            id=inq_id,
            full_name=payload.full_name.strip(),
            company_name=payload.company_name.strip(),
            email=payload.email.strip().lower(),
            phone=payload.phone.strip(),
            workforce_type=payload.workforce_type or "labor",
            expected_volume=payload.expected_volume or "200-1000",
            inquiry_type=payload.inquiry_type or "Demo Request",
            message=payload.message or "",
            source_url=payload.source_url or "/",
            status="New",
            created_at=datetime.utcnow()
        )
        db.add(inquiry)
        db.commit()
        db.refresh(inquiry)

        return {
            "success": True,
            "message": "Demo inquiry received successfully! Our consultant will contact you within 2 business hours.",
            "inquiry_id": inquiry.id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit inquiry: {str(e)}")

@router.get("/all")
def get_all_inquiries(status: Optional[str] = None, db: Session = Depends(get_db)):
    """Super Admin endpoint to list all inquiries with optional status filtering"""
    query = db.query(LeadInquiry)
    if status and status.lower() != 'all':
        query = query.filter(LeadInquiry.status.ilike(status))
    
    inquiries = query.order_by(LeadInquiry.created_at.desc()).all()
    return [
        {
            "id": i.id,
            "full_name": i.full_name,
            "company_name": i.company_name,
            "email": i.email,
            "phone": i.phone,
            "workforce_type": i.workforce_type,
            "expected_volume": i.expected_volume,
            "inquiry_type": i.inquiry_type,
            "message": i.message,
            "status": i.status,
            "assigned_to": i.assigned_to,
            "internal_notes": i.internal_notes,
            "source_url": i.source_url,
            "created_at": i.created_at.isoformat() if i.created_at else None
        }
        for i in inquiries
    ]

@router.put("/{inquiry_id}")
def update_inquiry(inquiry_id: str, payload: LeadInquiryUpdate, db: Session = Depends(get_db)):
    """Super Admin endpoint to update lead status and notes"""
    inq = db.query(LeadInquiry).filter(LeadInquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    if payload.status is not None:
        inq.status = payload.status
    if payload.assigned_to is not None:
        inq.assigned_to = payload.assigned_to
    if payload.internal_notes is not None:
        inq.internal_notes = payload.internal_notes

    inq.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(inq)
    return {"success": True, "message": f"Inquiry {inquiry_id} updated", "status": inq.status}

@router.delete("/{inquiry_id}")
def delete_inquiry(inquiry_id: str, db: Session = Depends(get_db)):
    """Super Admin endpoint to delete an inquiry"""
    inq = db.query(LeadInquiry).filter(LeadInquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(inq)
    db.commit()
    return {"success": True, "message": f"Inquiry {inquiry_id} deleted successfully"}
