import uuid
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.database import get_db
from backend.app.models import SupportTicket, TicketReply, Company, SuperAdminUser
from backend.app.schemas import (
    SupportTicketCreate, SupportTicketResponse,
    TicketReplyCreate, TicketReplyResponse
)
from backend.app.services.email_service import send_smtp_email, _build_email_shell
from backend.app.config import settings

logger = logging.getLogger("tickets_router")
router = APIRouter(prefix="/tickets", tags=["Support & Ticketing"])

@router.get("", response_model=List[SupportTicketResponse])
def get_all_tickets(company_id: str = None, db: Session = Depends(get_db)):
    """Fetch support tickets (optionally filtered by company)"""
    query = db.query(SupportTicket)
    if company_id:
        query = query.filter(SupportTicket.company_id == company_id)
    return query.order_by(SupportTicket.created_at.desc()).all()

@router.post("", response_model=SupportTicketResponse)
def create_support_ticket(payload: SupportTicketCreate, db: Session = Depends(get_db)):
    """Raise a new support ticket and send notification emails"""
    ticket_id = f"TCK-{uuid.uuid4().hex[:4].upper()}"
    new_ticket = SupportTicket(
        id=ticket_id,
        company_id=payload.company_id,
        company_name=payload.company_name,
        subject=payload.subject,
        category=payload.category,
        priority=payload.priority,
        status="Open",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_ticket)
    
    # Add initial message as first reply
    reply_id = f"rep-{uuid.uuid4().hex[:6]}"
    first_reply = TicketReply(
        id=reply_id,
        ticket_id=ticket_id,
        sender_role="company",
        sender_name=payload.company_name,
        message=payload.initial_message,
        timestamp=datetime.utcnow()
    )
    db.add(first_reply)
    
    db.commit()
    db.refresh(new_ticket)

    # 📧 1. Dispatch Ticket Creation Email to Company Admin
    try:
        comp = db.query(Company).filter(Company.id == payload.company_id).first()
        comp_email = comp.email if comp else None
        app_url = settings.APP_BASE_URL.rstrip('/')

        if comp_email:
            comp_content = f"""
            <h2 style="color: #0f172a; margin-top: 0;">🎫 Support Ticket Created: #{ticket_id}</h2>
            <p>Dear <strong>{payload.company_name}</strong>,</p>
            <p>Your support ticket has been registered on the <strong>JOY True Profile Verification Platform</strong>.</p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px;">
                <p style="margin: 4px 0;"><strong>Ticket ID:</strong> #{ticket_id}</p>
                <p style="margin: 4px 0;"><strong>Subject:</strong> {payload.subject}</p>
                <p style="margin: 4px 0;"><strong>Category:</strong> {payload.category}</p>
                <p style="margin: 4px 0;"><strong>Priority:</strong> <span style="color: {'#dc2626' if payload.priority == 'Critical' else '#d97706'}; font-weight: bold;">{payload.priority}</span></p>
                <p style="margin: 4px 0;"><strong>Initial Message:</strong> {payload.initial_message}</p>
            </div>
            <p>Our technical operations desk has been notified and will review your request promptly.</p>
            """
            comp_html = _build_email_shell(
                header_title=f"Support Ticket #{ticket_id}",
                badge_text="TECHNICAL SUPPORT DESK",
                content_html=comp_content,
                action_url=f"{app_url}/company",
                action_text="View Ticket in Company Portal",
                sender_brand="JOY Verification Helpdesk"
            )
            send_smtp_email(
                to_email=comp_email,
                subject=f"🎫 [Ticket #{ticket_id}] {payload.subject} — JOY True Profile Helpdesk",
                html_content=comp_html,
                company_id=payload.company_id,
                db=db,
                async_mode=True
            )

        # 📧 2. Alert SuperAdmin of new ticket
        sa = db.query(SuperAdminUser).filter(SuperAdminUser.role == "superadmin").first()
        sa_email = sa.email if sa else "admin@joycorporatesolutions.com"
        sa_content = f"""
        <h2 style="color: #0f172a; margin-top: 0;">🚨 New Support Ticket: #{ticket_id}</h2>
        <p>A new support request was raised by <strong>{payload.company_name}</strong> (#{payload.company_id}).</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Company:</strong> {payload.company_name}</p>
            <p style="margin: 4px 0;"><strong>Subject:</strong> {payload.subject}</p>
            <p style="margin: 4px 0;"><strong>Category:</strong> {payload.category}</p>
            <p style="margin: 4px 0;"><strong>Priority:</strong> {payload.priority}</p>
            <p style="margin: 4px 0;"><strong>Description:</strong> {payload.initial_message}</p>
        </div>
        """
        sa_html = _build_email_shell(
            header_title=f"Support Alert #{ticket_id}",
            badge_text="SUPERADMIN SUPPORT ALERT",
            content_html=sa_content,
            action_url=f"{app_url}/superadmin",
            action_text="Reply to Ticket in SuperAdmin Console",
            sender_brand="JOY Verification Platform"
        )
        send_smtp_email(
            to_email=sa_email,
            subject=f"🚨 [New Ticket #{ticket_id}] {payload.company_name}: {payload.subject}",
            html_content=sa_html,
            db=db,
            async_mode=True
        )
    except Exception as mail_err:
        logger.warning(f"Failed to dispatch support ticket emails: {mail_err}")

    return new_ticket

@router.post("/{ticket_id}/replies", response_model=TicketReplyResponse)
def add_ticket_reply(ticket_id: str, payload: TicketReplyCreate, db: Session = Depends(get_db)):
    """Append a timestamped reply from Super Admin or Company and notify the counter-party"""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    reply_id = f"rep-{uuid.uuid4().hex[:6]}"
    reply = TicketReply(
        id=reply_id,
        ticket_id=ticket_id,
        sender_role=payload.sender_role,
        sender_name=payload.sender_name,
        message=payload.message,
        timestamp=datetime.utcnow()
    )
    db.add(reply)
    
    ticket.updated_at = datetime.utcnow()
    if payload.sender_role == "superadmin" and ticket.status == "Open":
        ticket.status = "In Progress"
        
    db.commit()
    db.refresh(reply)

    # 📧 Email Notification for Ticket Reply
    try:
        app_url = settings.APP_BASE_URL.rstrip('/')
        if payload.sender_role == "superadmin":
            # SuperAdmin replied -> notify Company Admin
            comp = db.query(Company).filter(Company.id == ticket.company_id).first()
            if comp and comp.email:
                content = f"""
                <h2 style="color: #0f172a; margin-top: 0;">💬 Reply on Ticket #{ticket_id}</h2>
                <p>Hello <strong>{ticket.company_name}</strong>,</p>
                <p>Super Administrator (<strong>{payload.sender_name}</strong>) has responded to your support ticket:</p>
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px;">
                    <p style="margin: 4px 0;"><strong>Ticket Subject:</strong> {ticket.subject}</p>
                    <p style="margin: 4px 0;"><strong>Administrator Reply:</strong></p>
                    <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #dcfce7; margin-top: 8px; color: #166534; font-size: 13px; line-height: 1.6;">
                        {payload.message}
                    </div>
                </div>
                """
                html = _build_email_shell(
                    header_title=f"Reply on Ticket #{ticket_id}",
                    badge_text="HELP DESK UPDATE",
                    content_html=content,
                    action_url=f"{app_url}/company",
                    action_text="View & Reply in Company Portal",
                    sender_brand="JOY Verification Helpdesk"
                )
                send_smtp_email(
                    to_email=comp.email,
                    subject=f"💬 [Update #{ticket_id}] Admin Response: {ticket.subject}",
                    html_content=html,
                    company_id=ticket.company_id,
                    db=db,
                    async_mode=True
                )
        else:
            # Company replied -> notify SuperAdmin
            sa = db.query(SuperAdminUser).filter(SuperAdminUser.role == "superadmin").first()
            sa_email = sa.email if sa else "admin@joycorporatesolutions.com"
            content = f"""
            <h2 style="color: #0f172a; margin-top: 0;">💬 Client Reply on Ticket #{ticket_id}</h2>
            <p><strong>{payload.sender_name}</strong> from <strong>{ticket.company_name}</strong> has added a reply:</p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px;">
                <p style="margin: 4px 0;"><strong>Ticket Subject:</strong> {ticket.subject}</p>
                <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 8px; font-size: 13px; line-height: 1.6;">
                    {payload.message}
                </div>
            </div>
            """
            html = _build_email_shell(
                header_title=f"Client Reply #{ticket_id}",
                badge_text="SUPPORT UPDATE",
                content_html=content,
                action_url=f"{app_url}/superadmin",
                action_text="Open SuperAdmin Console",
                sender_brand="JOY Verification Platform"
            )
            send_smtp_email(
                to_email=sa_email,
                subject=f"💬 [Client Reply #{ticket_id}] {ticket.company_name}: {ticket.subject}",
                html_content=html,
                db=db,
                async_mode=True
            )
    except Exception as reply_mail_err:
        logger.warning(f"Failed to dispatch ticket reply email: {reply_mail_err}")

    return reply

@router.put("/{ticket_id}/status")
def update_ticket_status(ticket_id: str, status: str, db: Session = Depends(get_db)):
    """Close or update support ticket status and notify company"""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    old_status = ticket.status
    ticket.status = status
    ticket.updated_at = datetime.utcnow()
    db.commit()

    # If resolved or closed, notify Company Admin
    if status in ("Resolved", "Closed") and old_status != status:
        try:
            comp = db.query(Company).filter(Company.id == ticket.company_id).first()
            if comp and comp.email:
                app_url = settings.APP_BASE_URL.rstrip('/')
                content = f"""
                <h2 style="color: #0f172a; margin-top: 0;">✅ Support Ticket {status}: #{ticket_id}</h2>
                <p>Hello <strong>{ticket.company_name}</strong>,</p>
                <p>Your support ticket has been marked as <strong>{status.upper()}</strong> by the platform administration team.</p>
                <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 13px;">
                    <p style="margin: 4px 0;"><strong>Ticket ID:</strong> #{ticket_id}</p>
                    <p style="margin: 4px 0;"><strong>Subject:</strong> {ticket.subject}</p>
                    <p style="margin: 4px 0;"><strong>Final Status:</strong> <span style="color: #166534; font-weight: bold;">{status}</span></p>
                </div>
                <p>If you have any further questions or require additional assistance, feel free to reopen this ticket or submit a new inquiry.</p>
                """
                html = _build_email_shell(
                    header_title=f"Ticket {status} - #{ticket_id}",
                    badge_text="TICKET RESOLUTION",
                    content_html=content,
                    action_url=f"{app_url}/company",
                    action_text="View in Company Portal",
                    sender_brand="JOY Verification Helpdesk"
                )
                send_smtp_email(
                    to_email=comp.email,
                    subject=f"✅ [Ticket #{ticket_id}] Status Updated to {status}: {ticket.subject}",
                    html_content=html,
                    company_id=ticket.company_id,
                    db=db,
                    async_mode=True
                )
        except Exception as st_err:
            logger.warning(f"Failed to dispatch ticket status email: {st_err}")

    return {"success": True, "ticket_id": ticket_id, "new_status": status}

