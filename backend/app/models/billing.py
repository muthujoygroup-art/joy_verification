from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'INV-ACME-AUG26'
    company_id = Column(String(50), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    month = Column(String(20), nullable=False) # 'August'
    year = Column(Integer, default=2026)
    verifications_count = Column(Integer, default=0)
    unit_price = Column(Float, default=120.0)
    subtotal = Column(Float, default=0.0)
    tax_rate = Column(Float, default=18.0) # 18% GST
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    status = Column(String(50), default="Pending") # 'Pending' | 'Paid' | 'Overdue'
    due_date = Column(String(50), nullable=True)
    line_items = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="invoices")


class PaymentRecord(Base):
    __tablename__ = "payment_records"

    id = Column(String(50), primary_key=True, index=True) # 'TXN-9982'
    company_id = Column(String(50), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), default="NEFT / Bank Transfer")
    transaction_ref = Column(String(100), unique=True, index=True, nullable=False)
    status = Column(String(50), default="Settled")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
