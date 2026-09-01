from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    contact_person = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=True) # Mobile / contact number
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), default="Company@Admin2026")
    plan = Column(String(100), default="Enterprise Premier") # 'Basic Tier' | 'Standard Tier' | 'Enterprise Premier'
    price_per_verification = Column(Float, default=120.0)
    verified_count_this_month = Column(Integer, default=0)
    max_limit = Column(Integer, default=500)
    wallet_balance = Column(Float, default=50000.0)
    status = Column(String(50), default="Active") # 'Active' | 'Pending Activation' | 'Suspended'
    activation_status = Column(String(50), default="Pending Activation") # 'Pending Activation' | 'Active'
    activation_token = Column(String(100), unique=True, index=True, nullable=True) # comp_act_...
    activation_password = Column(String(100), default="1234") # Security password set by Super Admin
    activation_expires_at = Column(DateTime, nullable=True)
    
    # Detailed Corporate Profile Fields (Completed during Activation)
    cin_number = Column(String(100), nullable=True) # Corporate Identification Number
    gstin_number = Column(String(100), nullable=True) # GST Registration
    company_pan = Column(String(50), nullable=True) # Company PAN
    registered_address = Column(Text, nullable=True) # Registered Office Address
    industry_sector = Column(String(100), nullable=True) # Industry / Domain
    website = Column(String(200), nullable=True) # Official Website
    documents = Column(JSON, default=dict) # Uploaded COI, PAN, GST, Board Resolution files
    
    is_active = Column(Boolean, default=True)
    features = Column(JSON, default=dict)
    terms_accepted = Column(String(50), default="true")
    terms_accepted_at = Column(DateTime, default=datetime.utcnow)
    terms_accepted_by = Column(String(100), nullable=True)
    terms_version = Column(String(50), default="v2.4-2026")
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    hr_users = relationship("HrUser", back_populates="company", cascade="all, delete-orphan")
    candidates = relationship("Candidate", back_populates="company", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="company", cascade="all, delete-orphan")
    tickets = relationship("SupportTicket", back_populates="company", cascade="all, delete-orphan")
    payment_records = relationship("PaymentRecord", back_populates="company", cascade="all, delete-orphan")


class HrUser(Base):
    __tablename__ = "hr_users"

    id = Column(String(50), primary_key=True, index=True)
    company_id = Column(String(50), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), default="Hr@Recruiter2026")
    dept = Column(String(100), default="Human Resources")
    active_links = Column(Integer, default=0)
    permissions = Column(JSON, default=lambda: {"can_create": True, "can_verify": True, "can_export": True})
    status = Column(String(50), default="Active")
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="hr_users")
    candidates = relationship("Candidate", back_populates="hr_user")
