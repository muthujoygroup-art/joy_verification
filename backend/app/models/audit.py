from sqlalchemy import Column, String, DateTime, Text, JSON
from datetime import datetime
from backend.app.database import Base

class AuditTrailLog(Base):
    __tablename__ = "audit_trail_logs"

    id = Column(String(50), primary_key=True, index=True)
    actor_role = Column(String(50), index=True, nullable=False)
    actor_email = Column(String(150), index=True, nullable=False)
    action = Column(String(100), index=True, nullable=False)
    target_candidate_id = Column(String(50), nullable=True, index=True)
    target_company_id = Column(String(50), nullable=True, index=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), default="127.0.0.1")
    prev_hash = Column(String(64), nullable=True)
    curr_hash = Column(String(64), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
