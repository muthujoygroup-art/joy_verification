import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.database import get_db
from backend.app.models import SupportTicket, TicketReply, Company
from backend.app.schemas import (
    SupportTicketCreate, SupportTicketResponse,
    TicketReplyCreate, TicketReplyResponse
)

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
    """Raise a new support ticket"""
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
    return new_ticket

@router.post("/{ticket_id}/replies", response_model=TicketReplyResponse)
def add_ticket_reply(ticket_id: str, payload: TicketReplyCreate, db: Session = Depends(get_db)):
    """Append a timestamped reply from Super Admin or Company"""
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
    return reply

@router.put("/{ticket_id}/status")
def update_ticket_status(ticket_id: str, status: str, db: Session = Depends(get_db)):
    """Close or update support ticket status"""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    ticket.status = status
    ticket.updated_at = datetime.utcnow()
    db.commit()
    return {"success": True, "ticket_id": ticket_id, "new_status": status}
