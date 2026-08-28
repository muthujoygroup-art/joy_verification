from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(50), primary_key=True, index=True) # 'INV-2026-01'
    company_id = Column(String(50), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    month = Column(String(50), default="August")
    year = Column(Integer, default=2026)
    verifications_count = Column(Integer, default=0)
    unit_price = Column(Float, default=120.0)
    subtotal = Column(Float, default=0.0)
    tax_rate = Column(Float, default=18.0) # 18% IGST
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    status = Column(String(50), default="PENDING") # 'PAID' | 'PENDING' | 'OVERDUE'
    due_date = Column(DateTime, nullable=True)
    line_items = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="invoices")


class PaymentRecord(Base):
    __tablename__ = "payment_records"

    id = Column(String(50), primary_key=True, index=True) # 'pay_rzp_9912401'
    company_id = Column(String(50), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), default="Razorpay UPI / Cards")
    transaction_ref = Column(String(100), nullable=True)
    status = Column(String(50), default="SUCCESS")
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="payment_records")
