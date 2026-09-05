from pydantic import BaseModel
from typing import Optional

class ClientReviewCreate(BaseModel):
    name: str
    role: Optional[str] = None
    company: str
    industry: Optional[str] = "labor"
    rating: int = 5
    title: Optional[str] = None
    content: str

class ClientReviewModeration(BaseModel):
    is_approved: Optional[bool] = None
    is_featured: Optional[bool] = None
    status: Optional[str] = None
    moderation_notes: Optional[str] = None
