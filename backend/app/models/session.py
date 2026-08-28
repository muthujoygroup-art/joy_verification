from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from backend.app.database import Base

class ActiveSession(Base):
    __tablename__ = "active_sessions"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), index=True, nullable=False)
    role = Column(String(50), index=True, nullable=False)
    email = Column(String(150), index=True, nullable=False)
    token_hash = Column(String(255), unique=True, index=True, nullable=False)
    ip_address = Column(String(50), default="127.0.0.1")
    device = Column(String(100), default="Desktop Web")
    user_agent = Column(Text, nullable=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
