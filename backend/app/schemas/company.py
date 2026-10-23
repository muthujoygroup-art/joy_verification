from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class HrUserBase(BaseModel):
    name: Optional[str] = ""
    email: Optional[str] = ""
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
    name: Optional[str] = ""
    code: Optional[str] = None
    contact_person: Optional[str] = ""
    phone: Optional[str] = None
    email: Optional[str] = ""
    plan: Optional[str] = "Standard Tier"
    price_per_verification: Optional[float] = 120.0
    max_limit: Optional[int] = 500
    features: Optional[Dict[str, Any]] = None
    wallet_balance: Optional[float] = 50000.0
    status: Optional[str] = "Pending Activation"
    activation_status: Optional[str] = "Pending Activation"
    activation_token: Optional[str] = None
    activation_password: Optional[str] = "1234"
    security_mode: Optional[str] = "pin"
    activation_expires_at: Optional[datetime] = None
    cin_number: Optional[str] = None
    gstin_number: Optional[str] = None
    company_pan: Optional[str] = None
    registered_address: Optional[str] = None
    industry_sector: Optional[str] = None
    website: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    bank_account_type: Optional[str] = None
    bank_beneficiary_name: Optional[str] = None
    bank_details: Optional[Dict[str, Any]] = None
    application_submitted_at: Optional[str] = None
    documents: Optional[Dict[str, Any]] = None
    terms_accepted: Optional[str] = None
    terms_accepted_at: Optional[datetime] = None
    terms_accepted_by: Optional[str] = None
    terms_version: Optional[str] = None
    custom_tariffs: Optional[Dict[str, Any]] = None
    logo: Optional[str] = None
    logo_url: Optional[str] = None
    company_logo: Optional[str] = None
    location: Optional[str] = None

class CompanyCreate(CompanyBase):
    password: Optional[str] = "Company@Admin2026"
    credits_purchased: Optional[int] = 500
    expiry_days: Optional[int] = 15
    expiry_date: Optional[str] = None

class CompanyUpdateFeatures(BaseModel):
    features: Dict[str, bool]

class CompanyActivationUnlockRequest(BaseModel):
    token: str
    password: Optional[str] = ""
    captcha_solved: Optional[bool] = False

class CompanyActivationCompleteRequest(BaseModel):
    token: str
    cin_number: Optional[str] = None
    gstin_number: Optional[str] = None
    company_pan: Optional[str] = None
    registered_address: Optional[str] = None
    industry_sector: Optional[str] = None
    website: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    bank_account_type: Optional[str] = None
    bank_beneficiary_name: Optional[str] = None
    bank_details: Optional[Dict[str, Any]] = None
    company_logo: Optional[str] = None
    documents: Optional[Dict[str, Any]] = None
    terms_accepted: Optional[bool] = True
    signatory_name: Optional[str] = None
    signatory_designation: Optional[str] = None

class CompanyResponse(CompanyBase):
    id: str
    verified_count_this_month: Optional[int] = 0
    status: Optional[str] = "Pending Activation"
    features: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
