from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey, Text, Boolean, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Dict, Any, Optional
from backend.app.database import Base

class Company(Base):
    """
    Client Employer / Enterprise Organization Model.
    Aligned 100% with live PostgreSQL database schema (21 physical columns).
    Extended fields are seamlessly persisted in the 'features' JSONB column.
    """
    __tablename__ = "companies"

    # 1. Core Physical Database Columns (Existing in PostgreSQL)
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    contact_person = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), default="Company@Admin2026")
    plan = Column(String(100), default="Enterprise Premier")
    price_per_verification = Column(Float, default=120.0)
    verified_count_this_month = Column(Integer, default=0)
    max_limit = Column(Integer, default=500)
    wallet_balance = Column(Float, default=50000.0)
    status = Column(String(50), default="Active")
    is_active = Column(Boolean, default=True)
    features = Column(JSON, default=dict)
    terms_accepted = Column(String(50), default="true")
    terms_accepted_at = Column(DateTime, default=datetime.utcnow)
    terms_accepted_by = Column(String(100), nullable=True)
    terms_version = Column(String(50), default="v2.4-2026")
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 2. Virtual Properties backed seamlessly by 'features' JSONB
    @property
    def phone(self) -> Optional[str]:
        return (self.features or {}).get("phone")

    @phone.setter
    def phone(self, val: Optional[str]):
        f = dict(self.features or {})
        f["phone"] = val
        self.features = f

    @property
    def activation_status(self) -> str:
        return (self.features or {}).get("activation_status", self.status or "Pending Activation")

    @activation_status.setter
    def activation_status(self, val: str):
        f = dict(self.features or {})
        f["activation_status"] = val
        self.features = f

    @property
    def activation_token(self) -> Optional[str]:
        return (self.features or {}).get("activation_token")

    @activation_token.setter
    def activation_token(self, val: Optional[str]):
        f = dict(self.features or {})
        f["activation_token"] = val
        self.features = f

    @property
    def activation_password(self) -> str:
        return (self.features or {}).get("activation_password", "1234")

    @activation_password.setter
    def activation_password(self, val: str):
        f = dict(self.features or {})
        f["activation_password"] = val
        self.features = f

    @property
    def activation_expires_at(self) -> Optional[datetime]:
        iso_str = (self.features or {}).get("activation_expires_at")
        if iso_str:
            try:
                return datetime.fromisoformat(iso_str)
            except Exception:
                return None
        return None

    @activation_expires_at.setter
    def activation_expires_at(self, val: Any):
        f = dict(self.features or {})
        if isinstance(val, datetime):
            f["activation_expires_at"] = val.isoformat()
        else:
            f["activation_expires_at"] = str(val) if val else None
        self.features = f

    @property
    def cin_number(self) -> Optional[str]:
        return (self.features or {}).get("cin_number")

    @cin_number.setter
    def cin_number(self, val: Optional[str]):
        f = dict(self.features or {})
        f["cin_number"] = val
        self.features = f

    @property
    def gstin_number(self) -> Optional[str]:
        return (self.features or {}).get("gstin_number")

    @gstin_number.setter
    def gstin_number(self, val: Optional[str]):
        f = dict(self.features or {})
        f["gstin_number"] = val
        self.features = f

    @property
    def company_pan(self) -> Optional[str]:
        return (self.features or {}).get("company_pan")

    @company_pan.setter
    def company_pan(self, val: Optional[str]):
        f = dict(self.features or {})
        f["company_pan"] = val
        self.features = f

    @property
    def registered_address(self) -> Optional[str]:
        return (self.features or {}).get("registered_address")

    @registered_address.setter
    def registered_address(self, val: Optional[str]):
        f = dict(self.features or {})
        f["registered_address"] = val
        self.features = f

    @property
    def industry_sector(self) -> str:
        return (self.features or {}).get("industry_sector", "Information Technology (IT/ITeS)")

    @industry_sector.setter
    def industry_sector(self, val: str):
        f = dict(self.features or {})
        f["industry_sector"] = val
        self.features = f

    @property
    def website(self) -> Optional[str]:
        return (self.features or {}).get("website")

    @website.setter
    def website(self, val: Optional[str]):
        f = dict(self.features or {})
        f["website"] = val
        self.features = f

    @property
    def documents(self) -> Dict[str, Any]:
        return (self.features or {}).get("documents", {})

    @documents.setter
    def documents(self, val: Dict[str, Any]):
        f = dict(self.features or {})
        f["documents"] = val or {}
        self.features = f

    @property
    def custom_tariffs(self) -> Dict[str, Any]:
        return (self.features or {}).get("custom_tariffs", {})

    @custom_tariffs.setter
    def custom_tariffs(self, val: Dict[str, Any]):
        f = dict(self.features or {})
        f["custom_tariffs"] = val or {}
        self.features = f

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
