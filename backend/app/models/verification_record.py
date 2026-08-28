from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class VerificationRecord(Base):
    """
    Permanent, tamper-evident audit record of every API verification executed
    across Government Registries (UIDAI, NSDL, NPCI, MoRTH, EPFO, MEA, CCTNS).
    Stores both the structured parsed attributes (for 360° Dossier & Certificate)
    and the full raw upstream payload (for statutory DPDP compliance & audits).
    """
    __tablename__ = "verification_records"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'vr_aadh_991823901'
    candidate_id = Column(String(50), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    token = Column(String(100), index=True, nullable=False)
    
    verification_type = Column(String(50), index=True, nullable=False) 
    # 'aadhaar' | 'pan' | 'bank' | 'driving_license' | 'passport' | 'epfo_uan' | 'face_match' | 'voter_id'
    
    status = Column(String(50), default="VERIFIED", index=True) 
    # 'VERIFIED' | 'FAILED' | 'PENDING' | 'MANUAL_REVIEW'
    
    provider = Column(String(100), default="Server 1: Sandbox.co.in") 
    # 'Server 1: Sandbox.co.in' | 'Server 2: CoinCircleTrust' | 'UIDAI Direct' | 'NSDL' | 'NPCI'
    
    transaction_ref = Column(String(100), nullable=True) # Upstream API Transaction Reference ID
    
    # 🌟 High-Fidelity Parsed Data (Used to auto-populate Candidate Master Dossier)
    fetched_data = Column(JSON, default=dict)
    
    # 📦 Full Unaltered Raw Payload from Government / Gateway Endpoint (Audit Compliance)
    raw_payload = Column(JSON, default=dict)
    
    confidence_score = Column(Float, default=1.0) # e.g. 0.99 for Face Liveness, 1.0 for Govt Match
    sha256_seal = Column(String(100), nullable=True) # Cryptographic Digital Checksum Seal
    
    verified_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    candidate = relationship("Candidate", back_populates="verification_records")
