from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Candidate, Company
from backend.app.schemas import (
    SendOtpRequest, SendOtpResponse, VerifyOtpRequest, VerifyOtpResponse,
    FaceCapturePayload, FaceCaptureResponse, CompleteVerificationPayload,
    CandidateResponse
)
from backend.app.services.otp_service import generate_and_send_otp, verify_otp_code
from backend.app.services.liveness_service import process_face_liveness

router = APIRouter(prefix="/verification", tags=["Employee Link Verification"])

@router.get("/candidate/{token}", response_model=CandidateResponse)
def get_candidate_by_token(token: str, db: Session = Depends(get_db)):
    """Resolves token link for employee verification view"""
    candidate = db.query(Candidate).filter(Candidate.token == token).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Invalid or expired verification token")
    return candidate

@router.post("/otp/send", response_model=SendOtpResponse)
def request_otp(payload: SendOtpRequest):
    """Dispatches Aadhaar UIDAI OTP or Mobile SMS OTP"""
    success, msg, demo_otp, masked = generate_and_send_otp(
        channel=payload.channel,
        identifier=payload.identifier,
        token=payload.token
    )
    return SendOtpResponse(
        success=success,
        message=msg,
        demo_otp=demo_otp,
        masked_target=masked
    )

@router.post("/otp/verify", response_model=VerifyOtpResponse)
def verify_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    """Validates entered OTP and updates candidate verification status"""
    candidate = db.query(Candidate).filter(Candidate.token == payload.token).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    verified, msg = verify_otp_code(
        channel=payload.channel,
        identifier=payload.identifier,
        otp=payload.otp,
        token=payload.token
    )
    
    if verified:
        verifs = dict(candidate.verifications_completed or {})
        if payload.channel == "aadhaar":
            verifs["aadhaar"] = True
        elif payload.channel == "mobile":
            verifs["mobile"] = True
            
        candidate.verifications_completed = verifs
        if candidate.status == "Link Sent":
            candidate.status = "In Verification"
            
        db.commit()
        db.refresh(candidate)
        
    return VerifyOtpResponse(success=verified, message=msg, verified=verified)

@router.post("/face-capture", response_model=FaceCaptureResponse)
def record_face_capture(payload: FaceCapturePayload, db: Session = Depends(get_db)):
    """Processes 3-Pose Face Liveness Biometric Capture (Straight, Left 45°, Right 45°)"""
    candidate = db.query(Candidate).filter(Candidate.token == payload.token).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    verified, score, msg = process_face_liveness(
        straight_image=payload.straight_image,
        left_image=payload.left_image,
        right_image=payload.right_image
    )
    
    if verified:
        verifs = dict(candidate.verifications_completed or {})
        verifs["face"] = True
        candidate.verifications_completed = verifs
        
        candidate.face_images = {
            "straight": payload.straight_image,
            "left": payload.left_image or payload.straight_image,
            "right": payload.right_image or payload.straight_image
        }
        
        if candidate.status == "Link Sent":
            candidate.status = "In Verification"
            
        db.commit()
        db.refresh(candidate)
        
    return FaceCaptureResponse(success=verified, message=msg, liveness_score=score, verified=verified)

@router.post("/complete")
def complete_verification(payload: CompleteVerificationPayload, db: Session = Depends(get_db)):
    """Submits candidate verification and marks record as Verified"""
    candidate = db.query(Candidate).filter(Candidate.token == payload.token).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    if payload.joining_form_data:
        candidate.joining_form_data = payload.joining_form_data
        
    candidate.status = "Verified"
    candidate.verification_date = datetime.utcnow()
    
    # Increment company verified count
    comp = db.query(Company).filter(Company.id == candidate.company_id).first()
    if comp:
        comp.verified_count_this_month = (comp.verified_count_this_month or 0) + 1
        
    db.commit()
    db.refresh(candidate)
    
    return {
        "success": True,
        "message": f"Verification completed successfully for {candidate.name}.",
        "candidate": candidate
    }
