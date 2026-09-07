from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON
from datetime import datetime
from backend.app.database import Base

class ApiCallLog(Base):
    __tablename__ = "api_call_logs"

    id = Column(String(50), primary_key=True, index=True)
    endpoint_slug = Column(String(150), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    initiator_role = Column(String(50), default="superadmin", index=True)
    initiator_id = Column(String(100), nullable=True, index=True)
    company_id = Column(String(50), nullable=True, index=True)
    provider_key = Column(String(50), default="server2_coincircle")
    
    status = Column(String(50), default="SUCCESS", index=True)
    http_status = Column(Integer, default=200)
    latency_ms = Column(Integer, default=50)
    cost_incurred = Column(Float, default=4.0)
    input_identifier = Column(String(100), nullable=True)
    request_payload = Column(JSON, default=dict)
    response_summary = Column(JSON, default=dict)
    error_message = Column(Text, nullable=True)
    
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
