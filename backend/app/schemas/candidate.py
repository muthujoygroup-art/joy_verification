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
    mobile: Optional[str] = ""
    aadhaar_no: Optional[str] = None
    designation: Optional[str] = None
    dept: Optional[str] = None
    company_id: Optional[str] = "comp-joy"
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
    father_name: Optional[str] = None
    father_mobile: Optional[str] = None
    father_occupation: Optional[str] = None
    mother_name: Optional[str] = None
    mother_mobile: Optional[str] = None
    mother_occupation: Optional[str] = None
    spouse_name: Optional[str] = None
    spouse_mobile: Optional[str] = None
    spouse_occupation: Optional[str] = None
    siblings: Optional[List[Any]] = []
    children: Optional[List[Any]] = []
    languages: Optional[List[Any]] = []
    blood_group: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    pincode: Optional[str] = None
    present_address: Optional[str] = None
    permanent_address: Optional[str] = None
    pan_no: Optional[str] = None
    uan_no: Optional[str] = None
    passport_no: Optional[str] = None
    driving_license_no: Optional[str] = None
    voter_id: Optional[str] = None
    ration_card_no: Optional[str] = None
    alternate_mobile: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    qualification_category: Optional[str] = None
    highest_qualification: Optional[str] = None
    job_category: Optional[str] = None
    job_type: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_no: Optional[str] = None
    ifsc_code: Optional[str] = None
    nominee_name: Optional[str] = None
    nominee_relation: Optional[str] = None
    linked_in_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    youtube_url: Optional[str] = None
    verification_config: Optional[Dict[str, Any]] = None
    manual_checks: Optional[Dict[str, Any]] = None
    joining_form_data: Optional[Dict[str, Any]] = None
    custom_fields: Optional[Any] = None
    industry_specialization: Optional[Dict[str, Any]] = None
    signing_papers: Optional[Dict[str, Any]] = None
    category_documents: Optional[Dict[str, Any]] = None
    specimen_signature: Optional[str] = None
    documents: Optional[List[Any]] = []

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
    father_name: Optional[str] = None
    father_mobile: Optional[str] = None
    father_occupation: Optional[str] = None
    mother_name: Optional[str] = None
    mother_mobile: Optional[str] = None
    mother_occupation: Optional[str] = None
    spouse_name: Optional[str] = None
    spouse_mobile: Optional[str] = None
    spouse_occupation: Optional[str] = None
    siblings: Optional[List[Any]] = None
    children: Optional[List[Any]] = None
    languages: Optional[List[Any]] = None
    blood_group: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    pincode: Optional[str] = None
    present_address: Optional[str] = None
    permanent_address: Optional[str] = None
    pan_no: Optional[str] = None
    uan_no: Optional[str] = None
    passport_no: Optional[str] = None
    driving_license_no: Optional[str] = None
    voter_id: Optional[str] = None
    ration_card_no: Optional[str] = None
    alternate_mobile: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    qualification_category: Optional[str] = None
    highest_qualification: Optional[str] = None
    job_category: Optional[str] = None
    job_type: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_no: Optional[str] = None
    ifsc_code: Optional[str] = None
    nominee_name: Optional[str] = None
    nominee_relation: Optional[str] = None
    linked_in_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    youtube_url: Optional[str] = None
    status: Optional[str] = None
    portal_password: Optional[str] = None
    verification_config: Optional[Dict[str, Any]] = None
    verifications_completed: Optional[Dict[str, Any]] = None
    face_images: Optional[Dict[str, Any]] = None
    manual_checks: Optional[Dict[str, Any]] = None
    joining_form_data: Optional[Dict[str, Any]] = None
    custom_fields: Optional[Dict[str, Any]] = None
    industry_specialization: Optional[Dict[str, Any]] = None
    signing_papers: Optional[Dict[str, Any]] = None
    category_documents: Optional[Dict[str, Any]] = None
    specimen_signature: Optional[str] = None

class CandidateResponse(CandidateBase):
    id: str
    token: str
    status: str
    portal_password: Optional[str] = "1234"
    verifications_completed: Dict[str, Any]
    face_images: Dict[str, Any]
    verified_attributes: Optional[Dict[str, Any]] = {}
    industry_specialization: Optional[Dict[str, Any]] = {}
    signing_papers: Optional[Dict[str, Any]] = {}
    category_documents: Optional[Dict[str, Any]] = {}
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
