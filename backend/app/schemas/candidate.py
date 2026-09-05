from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime

class CandidateDocumentResponse(BaseModel):
    id: str
    candidate_id: Optional[str] = None
    title: str
    doc_type: Optional[str] = "general"
    file_format: Optional[str] = "pdf"
    file_path: Optional[str] = ""
    file_size_kb: Optional[float] = 0.0
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class CandidateBase(BaseModel):
    name: str
    emp_id: Optional[str] = None
    employee_number: Optional[str] = None
    email: Optional[str] = None
    mobile: str
    aadhaar_no: Optional[str] = None
    designation: Optional[str] = None
    dept: Optional[str] = None
    company_id: str
    hr_id: Optional[str] = None
    portal_password: Optional[str] = "1234"
    employee_type: Optional[str] = "it_tech"
    dob: Optional[str] = None
    doj: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    mother_tongue: Optional[str] = None
    languages_known: Optional[str] = None
    pf_number: Optional[str] = None
    esi_number: Optional[str] = None
    religion: Optional[str] = None
    caste: Optional[str] = None
    category: Optional[str] = None
    native_state: Optional[str] = None
    native_district: Optional[str] = None
    identification_marks: Optional[str] = None
    verification_config: Optional[Dict[str, Any]] = None
    manual_checks: Optional[Dict[str, Any]] = None
    joining_form_data: Optional[Dict[str, Any]] = None
    custom_fields: Optional[Any] = None
    specimen_signature: Optional[str] = None
    documents: Optional[List[CandidateDocumentResponse]] = []

    model_config = ConfigDict(from_attributes=True)

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    emp_id: Optional[str] = None
    employee_number: Optional[str] = None
    email: Optional[str] = None
    mobile: Optional[str] = None
    aadhaar_no: Optional[str] = None
    designation: Optional[str] = None
    dept: Optional[str] = None
    employee_type: Optional[str] = None
    dob: Optional[str] = None
    doj: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    mother_tongue: Optional[str] = None
    languages_known: Optional[str] = None
    pf_number: Optional[str] = None
    esi_number: Optional[str] = None
    religion: Optional[str] = None
    caste: Optional[str] = None
    category: Optional[str] = None
    native_state: Optional[str] = None
    native_district: Optional[str] = None
    identification_marks: Optional[str] = None
    status: Optional[str] = None
    portal_password: Optional[str] = None
    verification_config: Optional[Dict[str, Any]] = None
    verifications_completed: Optional[Dict[str, Any]] = None
    face_images: Optional[Dict[str, Any]] = None
    manual_checks: Optional[Dict[str, Any]] = None
    joining_form_data: Optional[Dict[str, Any]] = None
    custom_fields: Optional[Dict[str, Any]] = None
    specimen_signature: Optional[str] = None

class CandidateResponse(CandidateBase):
    id: str
    token: str
    status: str
    portal_password: Optional[str] = "1234"
    verifications_completed: Dict[str, Any]
    face_images: Dict[str, Any]
    verified_attributes: Optional[Dict[str, Any]] = {}
    aadhaar_data: Optional[Dict[str, Any]] = {}
    pan_data: Optional[Dict[str, Any]] = {}
    bank_data: Optional[Dict[str, Any]] = {}
    dl_data: Optional[Dict[str, Any]] = {}
    epfo_data: Optional[Dict[str, Any]] = {}
    passport_data: Optional[Dict[str, Any]] = {}
    face_match_data: Optional[Dict[str, Any]] = {}
    court_record_data: Optional[Dict[str, Any]] = {}
    risk_score: Optional[float] = 0.0
    bgv_verdict: Optional[str] = "Pending"
    discrepancies_detected: Optional[List[Any]] = []
    documents: Optional[List[CandidateDocumentResponse]] = []
    verification_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
