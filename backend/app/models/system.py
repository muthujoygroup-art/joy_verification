from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON
from datetime import datetime
from backend.app.database import Base

class SystemErrorLog(Base):
    __tablename__ = "system_error_logs"

    id = Column(String(50), primary_key=True, index=True) # 'LOG-901'
    timestamp = Column(String(50), nullable=False)
    section = Column(String(100), nullable=False)
    error_code = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), default="Warning") # 'Info' | 'Warning' | 'Critical'
    solved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(String(100), nullable=True)


class SystemSetting(Base):
    __tablename__ = "system_settings"

    role = Column(String(50), primary_key=True, index=True) # 'superadmin' | 'company' | 'hrexecutive' | 'employee'
    settings_data = Column(JSON, default=dict)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PlatformGuideline(Base):
    __tablename__ = "platform_guidelines"

    role = Column(String(50), primary_key=True, index=True)
    guidelines_data = Column(JSON, default=list)
    updated_at = Column(DateTime, default=datetime.utcnow)


class CommunicationGateway(Base):
    __tablename__ = "communication_gateways"

    id = Column(String(50), primary_key=True, index=True)
    gateway_type = Column(String(50), nullable=False) # 'whatsapp' | 'email_smtp' | 'sms'
    company_id = Column(String(50), nullable=True) # null for global
    settings_data = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow)
