from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class InvoiceResponse(BaseModel):
    id: str
    company_id: str
    month: str
    year: int
    verifications_count: int
    unit_price: float
    subtotal: float
    tax_rate: float
    tax_amount: float
    total_amount: float
    status: str
    due_date: Optional[str] = None
    line_items: List[Dict[str, Any]]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class InvoiceUpdate(BaseModel):
    unit_price: Optional[float] = None
    verifications_count: Optional[int] = None
    status: Optional[str] = None
    due_date: Optional[str] = None

class PaymentCreate(BaseModel):
    company_id: str
    amount: float
    payment_method: str = "NEFT / Bank Transfer"
    transaction_ref: str
    notes: Optional[str] = None

class PaymentResponse(BaseModel):
    id: str
    company_id: str
    amount: float
    payment_method: str
    transaction_ref: str
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
