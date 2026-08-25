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
    email: str
    plan: Optional[str] = "Enterprise Premier"
    price_per_verification: Optional[float] = 120.0
    max_limit: Optional[int] = 500
    features: Optional[Dict[str, bool]] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdateFeatures(BaseModel):
    features: Dict[str, bool]

class CompanyResponse(CompanyBase):
    id: str
    verified_count_this_month: int
    status: str
    features: Dict[str, Any]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
