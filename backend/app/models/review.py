from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON
from datetime import datetime
from backend.app.database import Base

class ClientReview(Base):
    __tablename__ = "client_reviews"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'REV-2026-001'
    name = Column(String(150), nullable=False)
    role = Column(String(150), nullable=True)
    company = Column(String(200), nullable=False)
    industry = Column(String(100), default="labor") # 'labor' | 'logistics' | 'corporate'
    rating = Column(Integer, default=5)
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=True) # default true for initial demo, SuperAdmin can moderate
    is_featured = Column(Boolean, default=False)
    status = Column(String(50), default="Approved") # 'Approved' | 'Pending' | 'Rejected'
    moderated_by = Column(String(100), nullable=True)
    moderation_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
