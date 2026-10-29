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

class RazorpayOrderCreateRequest(BaseModel):
    amount: float
    currency: str = "INR"
    receipt: Optional[str] = None
    notes: Optional[Dict[str, Any]] = None

class RazorpayOrderResponse(BaseModel):
    id: str
    amount: int
    amount_rupees: float
    currency: str
    key_id: str
    receipt: Optional[str] = None
    status: str
    is_live: bool = False

class RazorpayPaymentVerifyRequest(BaseModel):
    company_id: Optional[str] = None
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan_data: Dict[str, Any]

class RazorpayConfigUpdate(BaseModel):
    key_id: str
    key_secret: str
    webhook_secret: Optional[str] = None

