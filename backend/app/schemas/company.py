from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime

class HrUserBase(BaseModel):
    name: str
    email: str
    dept: Optional[str] = "Human Resources"
    active_links: Optional[int] = 0
    status: Optional[str] = "Active"

class HrUserCreate(HrUserBase):
    company_id: str

class HrUserResponse(HrUserBase):
    id: str
    company_id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CompanyBase(BaseModel):
    name: str
    code: Optional[str] = None
    contact_person: str
    phone: Optional[str] = None
    email: str
    plan: Optional[str] = "Enterprise Premier"
    price_per_verification: Optional[float] = 120.0
    max_limit: Optional[int] = 500
    features: Optional[Dict[str, bool]] = None
    wallet_balance: Optional[float] = 50000.0
    activation_status: Optional[str] = "Pending Activation"
    activation_token: Optional[str] = None
    activation_password: Optional[str] = "1234"
    activation_expires_at: Optional[datetime] = None
    cin_number: Optional[str] = None
    gstin_number: Optional[str] = None
    company_pan: Optional[str] = None
    registered_address: Optional[str] = None
    industry_sector: Optional[str] = None
    website: Optional[str] = None
    documents: Optional[Dict[str, Any]] = None

class CompanyCreate(CompanyBase):
    password: Optional[str] = "Company@Admin2026"
    credits_purchased: Optional[int] = 500
    expiry_days: Optional[int] = 15
    expiry_date: Optional[str] = None

class CompanyUpdateFeatures(BaseModel):
    features: Dict[str, bool]

class CompanyActivationUnlockRequest(BaseModel):
    token: str
    password: str

class CompanyActivationCompleteRequest(BaseModel):
    token: str
    cin_number: Optional[str] = None
    gstin_number: Optional[str] = None
    company_pan: Optional[str] = None
    registered_address: Optional[str] = None
    industry_sector: Optional[str] = None
    website: Optional[str] = None
    documents: Optional[Dict[str, Any]] = None
    terms_accepted: Optional[bool] = True

class CompanyResponse(CompanyBase):
    id: str
    verified_count_this_month: int
    status: str
    features: Dict[str, Any]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
