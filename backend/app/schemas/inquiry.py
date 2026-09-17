from pydantic import BaseModel, model_validator
from typing import Optional

class LeadInquiryCreate(BaseModel):
    full_name: Optional[str] = None
    name: Optional[str] = None
    company_name: Optional[str] = None
    company: Optional[str] = None
    email: str
    phone: str
    workforce_type: Optional[str] = "labor"
    expected_volume: Optional[str] = "200-1000"
    inquiry_type: Optional[str] = "General Query" # "General Query" | "Purchasing Plan" | "Other"
    selected_plan: Optional[str] = None # "tier1" | "tier2" | "tier3" | "tier4" | "tier5"
    message: Optional[str] = None
    source_url: Optional[str] = "/"

    @model_validator(mode='after')
    def normalize_names(self):
        if not self.full_name and self.name:
            self.full_name = self.name
        elif not self.full_name:
            self.full_name = "Prospective Client"
        
        if not self.company_name and self.company:
            self.company_name = self.company
        elif not self.company_name:
            self.company_name = "Enterprise Client"
        return self

class LeadInquiryUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    internal_notes: Optional[str] = None

class LeadInquiryReply(BaseModel):
    subject: str
    message: str
