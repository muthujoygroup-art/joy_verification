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

    @property
    def logo_url(self) -> Optional[str]:
        return (self.features or {}).get("logo_url") or (self.features or {}).get("logo") or (self.documents or {}).get("company_logo") or (self.documents or {}).get("logo")

    @logo_url.setter
    def logo_url(self, val: Optional[str]):
        f = dict(self.features or {})
        f["logo_url"] = val
        f["logo"] = val
        self.features = f
        docs = dict(self.documents or {})
        docs["company_logo"] = val
        self.documents = docs

    @property
    def company_logo(self) -> Optional[str]:
        return self.logo_url

    @company_logo.setter
    def company_logo(self, val: Optional[str]):
        self.logo_url = val

    @property
    def location(self) -> Optional[str]:
        return (self.features or {}).get("location") or self.registered_address

    @location.setter
    def location(self, val: Optional[str]):
        f = dict(self.features or {})
        f["location"] = val
        self.features = f
        self.registered_address = val

    @property
    def security_mode(self) -> str:
        return (self.features or {}).get("security_mode") or ("captcha" if (self.activation_password or "").upper() == "CAPTCHA" else "pin")

    @security_mode.setter
    def security_mode(self, val: str):
        f = dict(self.features or {})
        f["security_mode"] = val
        self.features = f

    @property
    def bank_name(self) -> Optional[str]:
        return (self.features or {}).get("bank_name") or ((self.features or {}).get("bank_details") or {}).get("bank_name")

    @bank_name.setter
    def bank_name(self, val: Optional[str]):
        f = dict(self.features or {})
        f["bank_name"] = val
        self.features = f

    @property
    def bank_account_number(self) -> Optional[str]:
        return (self.features or {}).get("bank_account_number") or ((self.features or {}).get("bank_details") or {}).get("account_number")

    @bank_account_number.setter
    def bank_account_number(self, val: Optional[str]):
        f = dict(self.features or {})
        f["bank_account_number"] = val
        self.features = f

    @property
    def bank_ifsc(self) -> Optional[str]:
        return (self.features or {}).get("bank_ifsc") or ((self.features or {}).get("bank_details") or {}).get("ifsc")

    @bank_ifsc.setter
    def bank_ifsc(self, val: Optional[str]):
        f = dict(self.features or {})
        f["bank_ifsc"] = (val or "").upper()
        self.features = f

    @property
    def bank_account_type(self) -> Optional[str]:
        return (self.features or {}).get("bank_account_type") or ((self.features or {}).get("bank_details") or {}).get("account_type") or "Current Account"

    @bank_account_type.setter
    def bank_account_type(self, val: Optional[str]):
        f = dict(self.features or {})
        f["bank_account_type"] = val
        self.features = f

    @property
    def bank_beneficiary_name(self) -> Optional[str]:
        return (self.features or {}).get("bank_beneficiary_name") or ((self.features or {}).get("bank_details") or {}).get("beneficiary_name") or self.name

    @bank_beneficiary_name.setter
    def bank_beneficiary_name(self, val: Optional[str]):
        f = dict(self.features or {})
        f["bank_beneficiary_name"] = val
        self.features = f

    @property
    def bank_details(self) -> Dict[str, Any]:
        return (self.features or {}).get("bank_details") or {
            "bank_name": self.bank_name,
            "account_number": self.bank_account_number,
            "ifsc": self.bank_ifsc,
            "account_type": self.bank_account_type,
            "beneficiary_name": self.bank_beneficiary_name
        }

    @bank_details.setter
    def bank_details(self, val: Dict[str, Any]):
        f = dict(self.features or {})
        f["bank_details"] = val or {}
        if val:
            if "bank_name" in val: f["bank_name"] = val["bank_name"]
            if "account_number" in val: f["bank_account_number"] = val["account_number"]
            if "ifsc" in val: f["bank_ifsc"] = (val["ifsc"] or "").upper()
            if "account_type" in val: f["bank_account_type"] = val["account_type"]
            if "beneficiary_name" in val: f["bank_beneficiary_name"] = val["beneficiary_name"]
        self.features = f

    @property
    def application_submitted_at(self) -> Optional[str]:
        return (self.features or {}).get("application_submitted_at")

    @application_submitted_at.setter
    def application_submitted_at(self, val: Any):
        f = dict(self.features or {})
        f["application_submitted_at"] = val.isoformat() if hasattr(val, "isoformat") else str(val) if val else None
        self.features = f

    @property
    def approved_at(self) -> Optional[str]:
        return (self.features or {}).get("approved_at")

    @approved_at.setter
    def approved_at(self, val: Any):
        f = dict(self.features or {})
        f["approved_at"] = val.isoformat() if hasattr(val, "isoformat") else str(val) if val else None
        self.features = f

    @property
    def approved_by(self) -> Optional[str]:
        return (self.features or {}).get("approved_by")

    @approved_by.setter
    def approved_by(self, val: Optional[str]):
        f = dict(self.features or {})
        f["approved_by"] = val
        self.features = f

    @property
    def storage_limit_gb(self) -> float:
        val = (self.features or {}).get("storage_limit_gb")
        if val is not None:
            try:
                return float(val)
            except (ValueError, TypeError):
                pass
        plan_str = (self.plan or "").lower()
        if "tier 5" in plan_str or "custom" in plan_str or "500+" in plan_str or "premier" in plan_str:
            return 500.0
        elif "tier 4" in plan_str:
            return 100.0
        elif "tier 3" in plan_str:
            return 50.0
        elif "tier 1" in plan_str or "< 50" in plan_str:
            return 10.0
        return 25.0

    @storage_limit_gb.setter
    def storage_limit_gb(self, val: Any):
        f = dict(self.features or {})
        try:
            f["storage_limit_gb"] = float(val) if val is not None else 25.0
        except (ValueError, TypeError):
            f["storage_limit_gb"] = 25.0
        self.features = f

    # Relationships
    hr_users = relationship("HrUser", back_populates="company", cascade="all, delete-orphan")
    candidates = relationship("Candidate", back_populates="company", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="company", cascade="all, delete-orphan")
    tickets = relationship("SupportTicket", back_populates="company", cascade="all, delete-orphan")
    payment_records = relationship("PaymentRecord", back_populates="company", cascade="all, delete-orphan")


class HrUser(Base):
    """
    HR Recruiter / Staff User Model.
    Aligned 100% with live PostgreSQL database schema (11 physical columns).
    Extended profile, education, documents, and activation tokens are persisted in 'permissions' JSON column.
    """
    __tablename__ = "hr_users"

    # Core Physical Database Columns (Existing in PostgreSQL)
    id = Column(String(50), primary_key=True, index=True)
    company_id = Column(String(50), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), default="Hr@Recruiter2026")
    dept = Column(String(100), default="Human Resources")
    active_links = Column(Integer, default=0)
    permissions = Column(JSON, default=lambda: {
        "can_create": True, 
        "can_verify": True, 
        "can_export": True,
        "phone": "",
        "activation_status": "Pending Activation",
        "activation_password": "1234"
    })
    status = Column(String(50), default="Active")
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Virtual Properties backed seamlessly by 'permissions' JSON
    @property
    def phone(self) -> Optional[str]:
        return (self.permissions or {}).get("phone")

    @phone.setter
    def phone(self, val: Optional[str]):
        p = dict(self.permissions or {})
        p["phone"] = val
        self.permissions = p

    @property
    def designation(self) -> str:
        return (self.permissions or {}).get("designation", "HR Recruiter / Talent Acquisition")

    @designation.setter
    def designation(self, val: str):
        p = dict(self.permissions or {})
        p["designation"] = val
        self.permissions = p

    @property
    def activation_status(self) -> str:
        return (self.permissions or {}).get("activation_status", self.status or "Pending Activation")

    @activation_status.setter
    def activation_status(self, val: str):
        p = dict(self.permissions or {})
        p["activation_status"] = val
        self.permissions = p

    @property
    def activation_token(self) -> Optional[str]:
        return (self.permissions or {}).get("activation_token")

    @activation_token.setter
    def activation_token(self, val: Optional[str]):
        p = dict(self.permissions or {})
        p["activation_token"] = val
        self.permissions = p

    @property
    def activation_password(self) -> str:
        return (self.permissions or {}).get("activation_password", "1234")

    @activation_password.setter
    def activation_password(self, val: str):
        p = dict(self.permissions or {})
        p["activation_password"] = val
        self.permissions = p

    @property
    def activation_expires_at(self) -> Optional[datetime]:
        iso_str = (self.permissions or {}).get("activation_expires_at")
        if iso_str:
            try:
                return datetime.fromisoformat(iso_str)
            except Exception:
                return None
        return None

    @activation_expires_at.setter
    def activation_expires_at(self, val: Any):
        p = dict(self.permissions or {})
        if isinstance(val, datetime):
            p["activation_expires_at"] = val.isoformat()
        else:
            p["activation_expires_at"] = str(val) if val else None
        self.permissions = p

    @property
    def personal_details(self) -> Dict[str, Any]:
        return (self.permissions or {}).get("personal_details", {})

    @personal_details.setter
    def personal_details(self, val: Dict[str, Any]):
        p = dict(self.permissions or {})
        p["personal_details"] = val or {}
        self.permissions = p

    @property
    def employment_details(self) -> Dict[str, Any]:
        return (self.permissions or {}).get("employment_details", {})

    @employment_details.setter
    def employment_details(self, val: Dict[str, Any]):
        p = dict(self.permissions or {})
        p["employment_details"] = val or {}
        self.permissions = p

    @property
    def education_details(self) -> Dict[str, Any]:
        return (self.permissions or {}).get("education_details", {})

    @education_details.setter
    def education_details(self, val: Dict[str, Any]):
        p = dict(self.permissions or {})
        p["education_details"] = val or {}
        self.permissions = p

    @property
    def documents(self) -> Dict[str, Any]:
        return (self.permissions or {}).get("documents", {})

    @documents.setter
    def documents(self, val: Dict[str, Any]):
        p = dict(self.permissions or {})
        p["documents"] = val or {}
        self.permissions = p

    @property
    def terms_accepted(self) -> str:
        return (self.permissions or {}).get("terms_accepted", "true")

    @terms_accepted.setter
    def terms_accepted(self, val: str):
        p = dict(self.permissions or {})
        p["terms_accepted"] = val
        self.permissions = p

    @property
    def terms_accepted_at(self) -> Optional[datetime]:
        iso_str = (self.permissions or {}).get("terms_accepted_at")
        if iso_str:
            try:
                return datetime.fromisoformat(iso_str)
            except Exception:
                return None
        return None

    @terms_accepted_at.setter
    def terms_accepted_at(self, val: Any):
        p = dict(self.permissions or {})
        if isinstance(val, datetime):
            p["terms_accepted_at"] = val.isoformat()
        else:
            p["terms_accepted_at"] = str(val) if val else None
        self.permissions = p

    @property
    def terms_accepted_by(self) -> Optional[str]:
        return (self.permissions or {}).get("terms_accepted_by")

    @terms_accepted_by.setter
    def terms_accepted_by(self, val: Optional[str]):
        p = dict(self.permissions or {})
        p["terms_accepted_by"] = val
        self.permissions = p

    @property
    def family_details(self) -> Dict[str, Any]:
        return (self.permissions or {}).get("family_details", {})

    @family_details.setter
    def family_details(self, val: Dict[str, Any]):
        p = dict(self.permissions or {})
        p["family_details"] = val or {}
        self.permissions = p

    @property
    def social_links(self) -> Dict[str, Any]:
        return (self.permissions or {}).get("social_links", {})

    @social_links.setter
    def social_links(self, val: Dict[str, Any]):
        p = dict(self.permissions or {})
        p["social_links"] = val or {}
        self.permissions = p

    @property
    def statutory_details(self) -> Dict[str, Any]:
        return (self.permissions or {}).get("statutory_details", {})

    @statutory_details.setter
    def statutory_details(self, val: Dict[str, Any]):
        p = dict(self.permissions or {})
        p["statutory_details"] = val or {}
        self.permissions = p

    @property
    def languages(self) -> Any:
        return (self.permissions or {}).get("languages", [])

    @languages.setter
    def languages(self, val: Any):
        p = dict(self.permissions or {})
        p["languages"] = val or []
        self.permissions = p

    # Relationships
    company = relationship("Company", back_populates="hr_users")
    candidates = relationship("Candidate", back_populates="hr_user")
