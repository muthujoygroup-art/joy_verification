import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from backend.app.database import get_db
from backend.app.config import settings
from backend.app.models import Invoice, PaymentRecord, Company
from backend.app.schemas import (
    InvoiceResponse, InvoiceUpdate, PaymentCreate, PaymentResponse,
    RazorpayOrderCreateRequest, RazorpayOrderResponse,
    RazorpayPaymentVerifyRequest, RazorpayConfigUpdate
)
from backend.app.services import razorpay_service

router = APIRouter(prefix="/billing", tags=["Billing & Invoicing"])

@router.get("/invoices", response_model=List[InvoiceResponse])
def get_all_invoices(company_id: str = None, db: Session = Depends(get_db)):
    """Fetch monthly metered invoices"""
    query = db.query(Invoice)
    if company_id:
        query = query.filter(Invoice.company_id == company_id)
    return query.order_by(Invoice.created_at.desc()).all()

@router.post("/invoices/generate/{company_id}")
def generate_monthly_invoice(company_id: str, month: str = "August", year: int = 2026, db: Session = Depends(get_db)):
    """Generates a monthly metered invoice based on verified candidate volume"""
    comp = db.query(Company).filter(Company.id == company_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")
        
    inv_id = f"INV-{comp.code}-{month[:3].upper()}{str(year)[-2:]}"
    count = comp.verified_count_this_month or 0
    unit_p = comp.price_per_verification or 120.0
    subtotal = count * unit_p
    tax = round(subtotal * 0.18, 2)
    total = round(subtotal + tax, 2)
    
    line_items = [
        {"desc": f"Metered Identity Verifications ({month} {year})", "qty": count, "rate": unit_p, "amount": subtotal},
        {"desc": "Integrated UIDAI / Biometric Infrastructure Service", "qty": 1, "rate": 0, "amount": 0.0}
    ]
    
    existing = db.query(Invoice).filter(Invoice.id == inv_id).first()
    if existing:
        existing.verifications_count = count
        existing.unit_price = unit_p
        existing.subtotal = subtotal
        existing.tax_amount = tax
        existing.total_amount = total
        existing.line_items = line_items
        db.commit()
        db.refresh(existing)
        return existing
        
    new_inv = Invoice(
        id=inv_id,
        company_id=comp.id,
        month=month,
        year=year,
        verifications_count=count,
        unit_price=unit_p,
        subtotal=subtotal,
        tax_rate=18.0,
        tax_amount=tax,
        total_amount=total,
        status="Pending",
        due_date=f"2026-09-05",
        line_items=line_items,
        created_at=datetime.utcnow()
    )
    db.add(new_inv)
    db.commit()
    db.refresh(new_inv)
    return new_inv

@router.put("/invoices/{invoice_id}")
def update_invoice(invoice_id: str, payload: InvoiceUpdate, db: Session = Depends(get_db)):
    """Edit invoice details (verifications count, pricing override, status)"""
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    if payload.unit_price is not None:
        inv.unit_price = payload.unit_price
    if payload.verifications_count is not None:
        inv.verifications_count = payload.verifications_count
    if payload.status is not None:
        inv.status = payload.status
    if payload.due_date is not None:
        inv.due_date = payload.due_date
        
    inv.subtotal = inv.verifications_count * inv.unit_price
    inv.tax_amount = round(inv.subtotal * (inv.tax_rate / 100.0), 2)
    inv.total_amount = round(inv.subtotal + inv.tax_amount, 2)
    
    db.commit()
    db.refresh(inv)
    return inv

@router.get("/payments", response_model=List[PaymentResponse])
def get_payment_ledger(company_id: str = None, db: Session = Depends(get_db)):
    """Fetch recorded payment transactions"""
    query = db.query(PaymentRecord)
    if company_id:
        query = query.filter(PaymentRecord.company_id == company_id)
    return query.order_by(PaymentRecord.created_at.desc()).all()

@router.post("/payments", response_model=PaymentResponse)
def record_payment(payload: PaymentCreate, db: Session = Depends(get_db)):
    """Record a settlement payment from Company Admin to Super Admin"""
    txn_id = f"TXN-{uuid.uuid4().hex[:6].upper()}"
    new_pay = PaymentRecord(
        id=txn_id,
        company_id=payload.company_id,
        amount=payload.amount,
        payment_method=payload.payment_method,
        transaction_ref=payload.transaction_ref,
        status="Settled",
        notes=payload.notes,
        created_at=datetime.utcnow()
    )
    db.add(new_pay)
    db.commit()
    db.refresh(new_pay)
    return new_pay


# =============================================================================
# 💳 RAZORPAY B2B WALLET & SINGLE PLAN PAYMENT GATEWAY
# =============================================================================

@router.get("/razorpay/config")
def get_razorpay_gateway_config(db: Session = Depends(get_db)):
    """Fetches public Razorpay configuration (Key ID & setup status)"""
    creds = razorpay_service.get_razorpay_credentials(db)
    return {
        "key_id": creds["key_id"],
        "is_configured": creds["is_configured"],
        "has_secret": bool(creds["key_secret"]),
        "has_webhook_secret": bool(creds["webhook_secret"]),
        "webhook_url": f"{settings.APP_BASE_URL}/api/billing/razorpay/webhook"
    }


@router.post("/razorpay/config")
def update_razorpay_gateway_config(payload: RazorpayConfigUpdate, db: Session = Depends(get_db)):
    """Allows SuperAdmin to configure live Razorpay Key ID, Secret, and Webhook Secret"""
    if not payload.key_id or not payload.key_secret:
        raise HTTPException(status_code=400, detail="Key ID and Key Secret are required")
    result = razorpay_service.save_razorpay_credentials(
        db=db,
        key_id=payload.key_id,
        key_secret=payload.key_secret,
        webhook_secret=payload.webhook_secret
    )
    return result


@router.post("/razorpay/create-order", response_model=RazorpayOrderResponse)
def create_order(payload: RazorpayOrderCreateRequest, db: Session = Depends(get_db)):
    """
    Creates an official Razorpay order in INR paise.
    Converts rupees to paise (amount * 100).
    """
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    order = razorpay_service.create_razorpay_order(
        amount_in_rupees=payload.amount,
        currency=payload.currency,
        receipt=payload.receipt,
        notes=payload.notes,
        db=db
    )
    return order


@router.post("/razorpay/verify-payment")
def verify_payment_and_settle(payload: RazorpayPaymentVerifyRequest, db: Session = Depends(get_db)):
    """
    Validates HMAC SHA-256 signature and settles single plan purchase:
    Increases company candidate quota (`max_limit`), activates plan checklist,
    issues official 18% GST invoice, and logs transaction ledger.
    """
    # 1. Verify cryptographic signature
    is_valid, msg = razorpay_service.verify_payment_signature(
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature,
        db=db
    )

    if not is_valid:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {msg}")

    # 2. Settle Single Plan Purchase
    try:
        settlement_result = razorpay_service.settle_single_plan_purchase(
            db=db,
            company_id=payload.company_id,
            payment_data={
                "razorpay_order_id": payload.razorpay_order_id,
                "razorpay_payment_id": payload.razorpay_payment_id
            },
            plan_data=payload.plan_data
        )
        return settlement_result
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to settle plan purchase: {str(e)}")


@router.post("/razorpay/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None, alias="X-Razorpay-Signature"),
    db: Session = Depends(get_db)
):
    """
    Receives and processes official Razorpay Webhook events
    (e.g., payment.captured, order.paid).
    Endpoint: https://trueprofile.joycorporatesolutions.com/api/billing/razorpay/webhook
    """
    body_bytes = await request.body()

    # Verify signature if header is provided
    if x_razorpay_signature:
        verified = razorpay_service.verify_webhook_signature(body_bytes, x_razorpay_signature, db)
        if not verified:
            raise HTTPException(status_code=400, detail="Invalid Razorpay webhook signature")

    try:
        event_data = json.loads(body_bytes.decode("utf-8"))
    except Exception:
        return {"status": "ignored", "reason": "non-json payload"}

    event_type = event_data.get("event")
    logger_msg = f"Razorpay Webhook received event: {event_type}"

    # Handle payment.captured or order.paid if needed for async settlements
    if event_type in ("payment.captured", "order.paid"):
        payload_entity = event_data.get("payload", {}).get("payment", {}).get("entity", {})
        notes = payload_entity.get("notes", {})
        company_id = notes.get("company_id")
        if company_id:
            # Idempotently confirm or mark payment
            logger_msg += f" for company {company_id}"

    return {"status": "ok", "event": event_type, "message": logger_msg}

