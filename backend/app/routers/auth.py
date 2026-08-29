from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Company, HrUser, Candidate
from backend.app.services.session_service import (
    create_session,
    get_session_by_token,
    extend_session,
    terminate_session
)

router = APIRouter(prefix="/auth", tags=["Authentication & Session Management"])

def _extract_token(authorization: str = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication token missing.")
    if authorization.startswith("Bearer "):
        return authorization.split(" ")[1]
    return authorization

@router.post("/login")
def login(payload: dict, request: Request, db: Session = Depends(get_db)):
    """
    Role-based authentication & JWT session creation.
    Supports Super Admin, Company Admin, HR Executive, and Candidate link.
    """
    role = payload.get("role")
    email = payload.get("email", "").strip().lower()
    token = payload.get("token", "").strip()
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "Web Browser")
    
    if role == "superadmin":
        user_data = {
            "id": "superadmin-01",
            "name": "Super Administrator",
            "email": email or "superadmin@joyverification.com",
            "portal": "Master Governance Portal"
        }
        return create_session(user_data, "superadmin", client_ip, user_agent)
        
    elif role in ("company", "companyadmin"):
        comp = None
        if email:
            comp = db.query(Company).filter(Company.email.ilike(email)).first()
        if not comp:
            comp = db.query(Company).first()
            
        if not comp:
            raise HTTPException(status_code=404, detail="Company account not found.")
            
        user_data = {
            "id": comp.id,
            "name": comp.contact_person,
            "companyName": comp.name,
            "companyCode": comp.code,
            "email": comp.email,
            "plan": comp.plan
        }
        return create_session(user_data, "company", client_ip, user_agent)
        
    elif role in ("hrexecutive", "hr"):
        hr = None
        if email:
            hr = db.query(HrUser).filter(HrUser.email.ilike(email)).first()
        if not hr:
            hr = db.query(HrUser).first()
            
        if not hr:
            raise HTTPException(status_code=404, detail="HR Executive account not found.")
            
        comp = db.query(Company).filter(Company.id == hr.company_id).first()
        user_data = {
            "id": hr.id,
            "name": hr.name,
            "email": hr.email,
            "dept": hr.dept,
            "companyId": hr.company_id,
            "companyName": comp.name if comp else "Acme Global"
        }
        return create_session(user_data, "hrexecutive", client_ip, user_agent)
        
    elif role == "employee_link":
        if not token:
            raise HTTPException(status_code=400, detail="Verification token is required.")
        candidate = db.query(Candidate).filter(Candidate.token == token).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Invalid or expired verification token.")
            
        comp = db.query(Company).filter(Company.id == candidate.company_id).first()
        user_data = {
            "id": candidate.id,
            "token": candidate.token,
            "name": candidate.name,
            "email": candidate.email,
            "mobile": candidate.mobile,
            "aadhaarNo": candidate.aadhaar_no,
            "designation": candidate.designation,
            "dept": candidate.dept,
            "companyId": candidate.company_id,
            "companyName": comp.name if comp else "Enterprise Employer",
            "status": candidate.status,
            "verificationConfig": candidate.verification_config,
            "verificationsCompleted": candidate.verifications_completed,
            "faceImages": candidate.face_images
        }
        return create_session(user_data, "employee_link", client_ip, user_agent)
        
    raise HTTPException(status_code=400, detail="Invalid role specified.")

@router.get("/session")
def check_session(token: str = Depends(_extract_token)):
    """Validates the active session and returns TTL remaining and cluster telemetry"""
    session = get_session_by_token(token)
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please log in again.")
    return session

@router.post("/refresh")
def refresh_session(token: str = Depends(_extract_token)):
    """Extends the active session by 30 minutes and returns a fresh JWT access token"""
    refreshed = extend_session(token)
    if not refreshed:
        raise HTTPException(status_code=401, detail="Cannot refresh expired or invalid session.")
    return refreshed

@router.post("/logout")
def logout(token: str = Depends(_extract_token)):
    """Invalidates the active session token"""
    success = terminate_session(token)
    return {"message": "Logged out successfully", "session_terminated": success}
