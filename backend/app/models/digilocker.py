from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class DigilockerVerification(Base):
    __tablename__ = "digilocker_verifications"

    id = Column(String(50), primary_key=True, index=True)
    session_id = Column(String(50), index=True, nullable=True)
    candidate_id = Column(String(50), ForeignKey("candidates.id", ondelete="SET NULL"), nullable=True, index=True)
    user_type = Column(String(50), default="individual")
    auth_type = Column(String(50), default="mobile")
    identifier_value = Column(String(100), index=True, nullable=True)
    digilocker_id = Column(String(100), index=True, nullable=True)
    full_name = Column(String(255), nullable=True)
    dob = Column(String(50), nullable=True)
    gender = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    aadhaar_no = Column(String(50), nullable=True)
    uan_no = Column(String(50), nullable=True)
    pan_no = Column(String(50), nullable=True)
    dl_no = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    pincode = Column(String(20), nullable=True)
    status = Column(String(50), default="success")
    purpose = Column(String(255), default="Employee onboarding private sector")
    service_name = Column(String(255), default="JoyVerify")
    company_id = Column(String(50), default="COMP001", index=True)
    hr_id = Column(String(50), default="hr-1")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    documents = relationship("DigilockerDocument", back_populates="verification", cascade="all, delete-orphan")


class DigilockerDocument(Base):
    __tablename__ = "digilocker_documents"

    id = Column(String(50), primary_key=True, index=True)
    verification_id = Column(String(50), ForeignKey("digilocker_verifications.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_id = Column(String(50), ForeignKey("candidates.id", ondelete="SET NULL"), nullable=True)
    document_name = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=True)
    doc_no = Column(String(100), nullable=True)
    doc_uri = Column(String(255), nullable=True)
    doc_type = Column(String(100), nullable=True)
    doc_status = Column(String(50), default="Verified")
    created_at = Column(DateTime, default=datetime.utcnow)

    verification = relationship("DigilockerVerification", back_populates="documents")
