from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String(50), primary_key=True, index=True)
    token = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    emp_id = Column(String(50), index=True)
    email = Column(String(150), index=True)
    mobile = Column(String(50), index=True, nullable=False)
    aadhaar_no = Column(String(50))
    designation = Column(String(100))
    dept = Column(String(100))
    company_id = Column(String(50), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    hr_id = Column(String(50), ForeignKey("hr_users.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="Link Sent")  # 'Link Sent' | 'In Verification' | 'Verified' | 'Rejected'
    portal_password = Column(String(50), default="1234")  # HR-configured unlock passcode for verification portal
    
    # Granular verification flags & completion results
    verification_config = Column(JSON, default=dict)
    verifications_completed = Column(JSON, default=dict)
    verified_attributes = Column(JSON, default=dict) # Consolidated live-fetched verified data across all APIs
    face_images = Column(JSON, default=dict)  # { straight: url/base64, left: url/base64, right: url/base64 }
    manual_checks = Column(JSON, default=dict) # { hrReferenceCompleted: true, addressVerifiedPhysically: false }
    joining_form_data = Column(JSON, default=dict) # Full CiteHR 6-tab joining form data
    
    verification_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    company = relationship("Company", back_populates="candidates")
    hr_user = relationship("HrUser", back_populates="candidates")
    documents = relationship("CandidateDocument", back_populates="candidate", cascade="all, delete-orphan")
    verification_records = relationship("VerificationRecord", back_populates="candidate", cascade="all, delete-orphan")


class CandidateDocument(Base):
    __tablename__ = "candidate_documents"

    id = Column(String(50), primary_key=True, index=True)
    candidate_id = Column(String(50), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    doc_type = Column(String(50)) # 'aadhaar' | 'pan' | 'dl' | 'resume' | 'certificate' | 'joining_slip'
    file_format = Column(String(20)) # 'pdf' | 'xlsx' | 'docx' | 'image'
    file_path = Column(Text, nullable=True)
    file_size_kb = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="documents")
