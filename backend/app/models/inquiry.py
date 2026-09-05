from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON
from datetime import datetime
from backend.app.database import Base

class LeadInquiry(Base):
    __tablename__ = "lead_inquiries"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'INQ-2026-001'
    full_name = Column(String(150), nullable=False)
    company_name = Column(String(200), nullable=False)
    email = Column(String(150), nullable=False, index=True)
    phone = Column(String(50), nullable=False)
    workforce_type = Column(String(100), default="labor") # 'labor' | 'corporate' | 'both'
    expected_volume = Column(String(100), default="200-1000") # '50-200' | '200-1000' | '1000-5000' | '5000+'
    inquiry_type = Column(String(50), default="Demo Request") # 'Demo Request' | 'Contact Sales' | 'Custom Plan'
    message = Column(Text, nullable=True)
    status = Column(String(50), default="New") # 'New' | 'Contacted' | 'Converted' | 'Closed'
    assigned_to = Column(String(100), nullable=True)
    internal_notes = Column(Text, nullable=True)
    source_url = Column(String(255), default="/")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
