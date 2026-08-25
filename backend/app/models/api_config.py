from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON
from datetime import datetime
from backend.app.database import Base

class ApiConfiguration(Base):
    __tablename__ = "api_configurations"

    provider_key = Column(String(50), primary_key=True, index=True) # 'apisetu' | 'sandbox' | 'coincircle' | 'whatsapp' | 'smtp'
    display_name = Column(String(100), nullable=False)
    endpoint_url = Column(String(255), nullable=False)
    api_key = Column(String(255), nullable=False)
    secret_key = Column(String(255), nullable=True)
    webhook_url = Column(String(255), nullable=True)
    sandbox_mode = Column(Boolean, default=True)
    rate_limit_per_min = Column(Integer, default=60)
    status = Column(String(50), default="Operational") # 'Operational' | 'Degraded' | 'Offline'
    monthly_quota = Column(Integer, default=10000)
    monthly_used = Column(Integer, default=0)
    last_synced = Column(DateTime, default=datetime.utcnow)


class FeatureItem(Base):
    __tablename__ = "feature_items"

    id = Column(String(50), primary_key=True, index=True) # 'aadhaar', 'mobileOtp', etc.
    name = Column(String(150), nullable=False)
    provider = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    default_on = Column(Boolean, default=True)
    cost_per_verification = Column(Float, default=15.0)
