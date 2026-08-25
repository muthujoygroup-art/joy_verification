from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'TCK-8812'
    company_id = Column(String(50), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(200), nullable=False)
    subject = Column(String(255), nullable=False)
    category = Column(String(100), default="API Integration") # 'API Integration' | 'Billing Inquiry' | 'Biometric Liveness' | 'Feature Request'
    priority = Column(String(50), default="Medium") # 'Low' | 'Medium' | 'High' | 'Critical'
    status = Column(String(50), default="Open") # 'Open' | 'In Progress' | 'Resolved' | 'Closed'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company", back_populates="tickets")
    replies = relationship("TicketReply", back_populates="ticket", cascade="all, delete-orphan")


class TicketReply(Base):
    __tablename__ = "ticket_replies"

    id = Column(String(50), primary_key=True, index=True)
    ticket_id = Column(String(50), ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False)
    sender_role = Column(String(50), nullable=False) # 'superadmin' | 'company' | 'hrexecutive'
    sender_name = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("SupportTicket", back_populates="replies")
