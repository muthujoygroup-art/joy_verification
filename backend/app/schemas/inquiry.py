from pydantic import BaseModel
from typing import Optional

class LeadInquiryCreate(BaseModel):
    full_name: str
    company_name: str
    email: str
    phone: str
    workforce_type: Optional[str] = "labor"
    expected_volume: Optional[str] = "200-1000"
    inquiry_type: Optional[str] = "Demo Request"
    message: Optional[str] = None
    source_url: Optional[str] = "/"

class LeadInquiryUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    internal_notes: Optional[str] = None
