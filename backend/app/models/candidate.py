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
    employee_number = Column(String(50), index=True, nullable=True)
    email = Column(String(150), index=True)
    mobile = Column(String(50), index=True, nullable=False)
    aadhaar_no = Column(String(50))
    designation = Column(String(100))
    dept = Column(String(100))
    employee_type = Column(String(50), default="it_tech") # 'it_tech' | 'manufacturing' | 'bfsi' | 'logistics' | 'healthcare' | 'sales_retail'
    dob = Column(String(50), nullable=True)
    doj = Column(String(50), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    marital_status = Column(String(30), nullable=True)
    mother_tongue = Column(String(50), nullable=True)
    languages_known = Column(String(200), nullable=True)
    pf_number = Column(String(50), nullable=True)
    esi_number = Column(String(50), nullable=True)
    religion = Column(String(50), nullable=True)
    caste = Column(String(50), nullable=True)
    category = Column(String(50), nullable=True) # 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
    native_state = Column(String(100), nullable=True)
    native_district = Column(String(100), nullable=True)
    identification_marks = Column(Text, nullable=True)
    
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
    custom_fields = Column(JSON, default=dict) # Dynamic custom attributes configured on the fly by HR
    specimen_signature = Column(Text, nullable=True)
    # Specialized Structured API Cache Data Stores
    aadhaar_data = Column(JSON, default=dict)
    pan_data = Column(JSON, default=dict)
    bank_data = Column(JSON, default=dict)
    dl_data = Column(JSON, default=dict)
    epfo_data = Column(JSON, default=dict)
    passport_data = Column(JSON, default=dict)
    face_match_data = Column(JSON, default=dict)
    court_record_data = Column(JSON, default=dict)
    risk_score = Column(Float, default=0.0)
    bgv_verdict = Column(String(50), default="Pending") # 'Pending' | 'Clear / Verified' | 'Major Discrepancy' | 'Minor Flag'
    discrepancies_detected = Column(JSON, default=list)
    
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
