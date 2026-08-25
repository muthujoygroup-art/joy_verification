import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models import Invoice, PaymentRecord, Company
from backend.app.schemas import (
    InvoiceResponse, InvoiceUpdate, PaymentCreate, PaymentResponse
)

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
