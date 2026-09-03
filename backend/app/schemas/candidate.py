from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

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
    documents: Optional[List[Dict[str, Any]]] = None

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

class CandidateResponse(CandidateBase):
    id: str
    token: str
    status: str
    portal_password: Optional[str] = "1234"
    verifications_completed: Dict[str, Any]
    face_images: Dict[str, Any]
    verification_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
