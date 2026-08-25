from pydantic import BaseModel
from typing import Optional, Dict, Any

class SendOtpRequest(BaseModel):
    channel: str # 'aadhaar' | 'mobile'
    identifier: str # aadhaar number or mobile number
    token: str # candidate token

class SendOtpResponse(BaseModel):
    success: bool
    message: str
    demo_otp: Optional[str] = None # For demo/testing ease (e.g. '849201')
    masked_target: str

class VerifyOtpRequest(BaseModel):
    channel: str # 'aadhaar' | 'mobile'
    identifier: str
    otp: str
    token: str

class VerifyOtpResponse(BaseModel):
    success: bool
    message: str
    verified: bool

class FaceCapturePayload(BaseModel):
    token: str
    straight_image: str # Base64 or URL
    left_image: Optional[str] = None
    right_image: Optional[str] = None

class FaceCaptureResponse(BaseModel):
    success: bool
    message: str
    liveness_score: float
    verified: bool

class CompleteVerificationPayload(BaseModel):
    token: str
    joining_form_data: Optional[Dict[str, Any]] = None
