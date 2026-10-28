from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List, Union

class SendOtpRequest(BaseModel):
    channel: Optional[str] = "mobile" # 'aadhaar' | 'mobile' | 'email'
    identifier: Optional[str] = None # aadhaar number or mobile number
    mobile: Optional[str] = None
    aadhaar_number: Optional[str] = None
    email: Optional[str] = None
    token: Optional[str] = None # candidate token

class SendOtpResponse(BaseModel):
    success: bool
    message: str
    masked_target: str

class VerifyOtpRequest(BaseModel):
    channel: Optional[str] = "mobile" # 'aadhaar' | 'mobile' | 'email'
    identifier: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None
    otp: str
    token: Optional[str] = None

class VerifyOtpResponse(BaseModel):
    success: bool
    message: str
    verified: bool

class FaceCapturePayload(BaseModel):
    token: str
    straight_image: Optional[str] = None # Base64 or URL
    image_data: Optional[str] = None
    left_image: Optional[str] = None
    right_image: Optional[str] = None
    liveness_score: Optional[float] = 98.5

class FaceCaptureResponse(BaseModel):
    success: bool
    message: str
    liveness_score: float
    verified: bool

class CompleteVerificationPayload(BaseModel):
    token: str
    joining_form_data: Optional[Dict[str, Any]] = None
    personal_details: Optional[Dict[str, Any]] = None
    bank_details: Optional[Dict[str, Any]] = None
    status: Optional[str] = "Submitted - Pending HR Review"
    specimen_signature: Optional[str] = None
    documents: Optional[Any] = None # Accepts List or Dict of documents
