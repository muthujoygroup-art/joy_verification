from sqlalchemy import Column, String, Integer, DateTime, Text
from datetime import datetime
from backend.app.database import Base

class CompanyRequest(Base):
    """
    Inbound purchase / enterprise demo requests submitted via Landing Page.
    Super Admin can review, approve (auto-provisions company), or reject.
    """
    __tablename__ = "company_requests"

    id = Column(String(50), primary_key=True, index=True) # e.g. req_corp_88192
    company_name = Column(String(200), nullable=False)
    contact_person = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    requested_plan = Column(String(100), default="Business Enterprise") # 'Starter Growth' | 'Business Enterprise' | 'Unlimited Premier'
    estimated_monthly_verifications = Column(Integer, default=250)
    industry = Column(String(100), default="IT & Software")
    status = Column(String(50), default="Pending", index=True) # 'Pending' | 'Approved' | 'Rejected'
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(String(100), nullable=True)
