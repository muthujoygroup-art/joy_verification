import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.inquiry import LeadInquiry
from backend.app.schemas.inquiry import LeadInquiryCreate, LeadInquiryUpdate, LeadInquiryReply
from backend.app.services.email_service import send_smtp_email, _build_email_shell

router = APIRouter(prefix="/inquiries", tags=["Inquiries & Leads"])

@router.post("")
def submit_public_inquiry(payload: LeadInquiryCreate, db: Session = Depends(get_db)):
    """Public endpoint to submit general queries, purchasing plan inquiries, or other requests"""
    try:
        inq_id = f"INQ-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        inquiry_type_label = payload.inquiry_type or "General Query"
        
        inquiry = LeadInquiry(
            id=inq_id,
            full_name=payload.full_name.strip(),
            company_name=payload.company_name.strip(),
            email=payload.email.strip().lower(),
            phone=payload.phone.strip(),
            workforce_type=payload.workforce_type or "labor",
            expected_volume=payload.expected_volume or "200-1000",
            inquiry_type=inquiry_type_label,
            message=payload.message or (f"Selected Plan: {payload.selected_plan}" if payload.selected_plan else ""),
            source_url=payload.source_url or "/",
            status="New",
            created_at=datetime.utcnow()
        )
        db.add(inquiry)
        db.commit()
        db.refresh(inquiry)

        # 1. Automated Acknowledgement Email to Candidate / Company
        try:
            ack_subject = f"✅ Inquiry Received: {inquiry_type_label} [Ref: {inquiry.id}] - JOY True Profile"
            ack_body = f"""
            <p>Dear <strong>{inquiry.full_name}</strong>,</p>
            <p>Thank you for reaching out to <strong>JOY Corporate Solutions</strong> regarding <strong>{inquiry_type_label}</strong>.</p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0 0 8px; font-weight: bold; color: #1e293b;">Inquiry Reference Details:</p>
                <p style="margin: 4px 0; color: #475569;">• <strong>Ticket ID:</strong> {inquiry.id}</p>
                <p style="margin: 4px 0; color: #475569;">• <strong>Category:</strong> {inquiry_type_label}</p>
                <p style="margin: 4px 0; color: #475569;">• <strong>Company:</strong> {inquiry.company_name}</p>
                <p style="margin: 4px 0; color: #475569;">• <strong>Contact:</strong> {inquiry.phone}</p>
            </div>
            <p>Our solutions consultant has received your request and will review it promptly. We will reply directly to this email thread.</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">JOY Corporate Solutions Private Limited • Coimbatore, Tamil Nadu, India</p>
            """
            ack_html = _build_email_shell(
                header_title=f"Inquiry Received - {inquiry_type_label}",
                badge_text=inquiry_type_label,
                content_html=ack_body
            )
            send_smtp_email(
                to_email=inquiry.email,
                subject=ack_subject,
                html_content=ack_html,
                db=db,
                async_mode=True
            )
        except Exception as mail_err:
            print(f"[Inquiry] Warning: Failed to send ack email: {mail_err}")

        # 2. Automated Alert to Admin
        try:
            admin_subject = f"🔔 [New Lead] {inquiry_type_label} from {inquiry.company_name} ({inquiry.full_name})"
            admin_body = f"""
            <p>A new inquiry was submitted via the public portal:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
                <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 30%;">Inquiry ID</td><td style="padding: 8px; border: 1px solid #e2e8f0;">{inquiry.id}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Inquiry Type</td><td style="padding: 8px; border: 1px solid #e2e8f0; color: #426CF5; font-weight: bold;">{inquiry_type_label}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Full Name</td><td style="padding: 8px; border: 1px solid #e2e8f0;">{inquiry.full_name}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Company</td><td style="padding: 8px; border: 1px solid #e2e8f0;">{inquiry.company_name}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #e2e8f0;"><a href="mailto:{inquiry.email}">{inquiry.email}</a></td></tr>
                <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Phone / WhatsApp</td><td style="padding: 8px; border: 1px solid #e2e8f0;"><a href="tel:{inquiry.phone}">{inquiry.phone}</a></td></tr>
                <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Message</td><td style="padding: 8px; border: 1px solid #e2e8f0;">{inquiry.message or 'N/A'}</td></tr>
            </table>
            <p>You can reply directly to this client from the Super Admin dashboard under <strong>Landing Page & Website CMS > Inquiries & Leads</strong>.</p>
            """
            admin_html = _build_email_shell(
                header_title=f"New Lead Alert - {inquiry_type_label}",
                badge_text="Super Admin Alert",
                content_html=admin_body
            )
            send_smtp_email(
                to_email="info@joycorporatesolutions.com",
                subject=admin_subject,
                html_content=admin_html,
                db=db,
                async_mode=True
            )
        except Exception as mail_err:
            print(f"[Inquiry] Warning: Failed to send admin alert email: {mail_err}")

        return {
            "success": True,
            "message": "Inquiry submitted successfully! A confirmation email has been dispatched.",
            "inquiry_id": inquiry.id,
            "inquiry_type": inquiry.inquiry_type
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit inquiry: {str(e)}")

@router.get("")
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

@router.post("/{inquiry_id}/reply")
def reply_to_inquiry(inquiry_id: str, payload: LeadInquiryReply, db: Session = Depends(get_db)):
    """Super Admin endpoint to send an official SMTP email reply to an inquiry and log communication"""
    inq = db.query(LeadInquiry).filter(LeadInquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    if not payload.subject or not payload.message:
        raise HTTPException(status_code=400, detail="Subject and message are required")

    reply_body = f"""
    <p>Dear <strong>{inq.full_name}</strong>,</p>
    <div style="margin: 16px 0; color: #1e293b; line-height: 1.6;">
        {payload.message.replace(chr(10), '<br/>')}
    </div>
    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
    <p style="font-size: 12px; color: #64748b;">
        <strong>Inquiry Reference:</strong> {inq.id} ({inq.inquiry_type})<br/>
        <strong>Company:</strong> {inq.company_name}<br/>
        JOY Corporate Solutions Private Limited • Coimbatore, Tamil Nadu, India
    </p>
    """
    reply_html = _build_email_shell(
        header_title=payload.subject,
        badge_text="Official Communication",
        content_html=reply_body
    )

    send_res = {"success": True, "message": "Queued"}
    try:
        send_res = send_smtp_email(
            to_email=inq.email,
            subject=payload.subject,
            html_content=reply_html,
            db=db,
            async_mode=True
        )
    except Exception as email_err:
        print(f"[Inquiry Reply] SMTP Error: {email_err}")
        send_res = {"success": False, "error": str(email_err)}

    # Log internal notes
    timestamp_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    new_note = f"[{timestamp_str}] Sent email reply (Subject: '{payload.subject}')"
    if inq.internal_notes:
        inq.internal_notes = f"{inq.internal_notes}\n{new_note}"
    else:
        inq.internal_notes = new_note
    
    inq.status = "Contacted"
    inq.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(inq)

    return {
        "success": True,
        "message": f"Reply successfully dispatched to {inq.email} via SMTP Server.",
        "email_delivery": send_res,
        "status": inq.status,
        "internal_notes": inq.internal_notes
    }

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
