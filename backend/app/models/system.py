from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON
from datetime import datetime
from backend.app.database import Base

class SystemErrorLog(Base):
    __tablename__ = "system_error_logs"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'ERR-2026-0904-8921'
    timestamp = Column(String(50), nullable=False)
    portal = Column(String(100), default="HR Executive Portal") # 'HR Executive Portal' | 'Employee Portal' | 'Company Admin Portal' | 'SuperAdmin Portal' | 'API Gateway Service' | 'Email Gateway'
    section = Column(String(100), nullable=False) # e.g. 'Candidate Creation' | 'Aadhaar e-KYC' | 'PAN Verification'
    function_name = Column(String(100), nullable=True) # e.g. 'create_candidate', 'verify_pan_live', 'send_otp'
    error_code = Column(String(50), nullable=False) # e.g. 'ERR_VALIDATION_FAILED', 'ERR_GATEWAY_TIMEOUT'
    message = Column(Text, nullable=False)
    stack_trace = Column(Text, nullable=True)
    user_info = Column(JSON, default=dict) # {"user_email": "...", "candidate_token": "...", "company_name": "..."}
    ip_address = Column(String(50), nullable=True)
    device_info = Column(String(255), nullable=True)
    severity = Column(String(50), default="Critical") # 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'
    solved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(String(100), nullable=True)
    resolution_notes = Column(Text, nullable=True)


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
