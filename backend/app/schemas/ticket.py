from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TicketReplyCreate(BaseModel):
    sender_role: str
    sender_name: str
    message: str

class TicketReplyResponse(BaseModel):
    id: str
    ticket_id: str
    sender_role: str
    sender_name: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True

class SupportTicketCreate(BaseModel):
    company_id: str
    company_name: str
    subject: str
    category: str = "API Integration"
    priority: str = "Medium"
    initial_message: str

class SupportTicketResponse(BaseModel):
    id: str
    company_id: str
    company_name: str
    subject: str
    category: str
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime
    replies: List[TicketReplyResponse] = []

    class Config:
        from_attributes = True
