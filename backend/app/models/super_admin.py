from sqlalchemy import Column, String, Boolean, DateTime
from datetime import datetime
from backend.app.database import Base

class SuperAdminUser(Base):
    __tablename__ = "super_admin_users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), default="Super Administrator", nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="superadmin", nullable=False)
    status = Column(String(50), default="Active")
    two_factor_enabled = Column(Boolean, default=False)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
