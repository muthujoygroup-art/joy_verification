import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models import Company, ApiConfiguration, FeatureItem, SystemErrorLog, Candidate
from backend.app.schemas import (
    CompanyCreate, CompanyResponse, CompanyUpdateFeatures,
    ApiConfigResponse, ApiConfigUpdate,
    SystemErrorLogResponse, SystemErrorLogToggle
)

router = APIRouter(prefix="/superadmin", tags=["Super Admin"])

@router.get("/companies", response_model=List[CompanyResponse])
def get_all_companies(db: Session = Depends(get_db)):
    """Fetch all registered client companies"""
    return db.query(Company).order_by(Company.created_at.desc()).all()

@router.post("/companies", response_model=CompanyResponse)
def create_company(payload: CompanyCreate, db: Session = Depends(get_db)):
    """Register a new enterprise company profile"""
    comp_code = payload.code or payload.name[:4].upper()
    comp_id = f"comp-{uuid.uuid4().hex[:6]}"
    
    # Default features if none specified
    default_features = payload.features or {
        "aadhaar": True,
        "mobileOtp": True,
        "faceCapture": True,
        "drivingLicense": False,
        "pan": True,
        "uan": False,
        "education": False,
        "criminalCheck": False,
        "addressCheck": False,
        "bankCheck": True
    }
    
    new_comp = Company(
        id=comp_id,
        name=payload.name,
        code=comp_code,
        contact_person=payload.contact_person,
        email=payload.email,
        plan=payload.plan or "Enterprise Premier",
        price_per_verification=payload.price_per_verification or 120.0,
        max_limit=payload.max_limit or 500,
        features=default_features,
        verified_count_this_month=0,
        status="Active"
    )
    db.add(new_comp)
    db.commit()
    db.refresh(new_comp)
    return new_comp

@router.put("/companies/{company_id}/features")
def update_company_features(company_id: str, payload: CompanyUpdateFeatures, db: Session = Depends(get_db)):
    """Toggle granular 10-feature verification capabilities per company"""
    comp = db.query(Company).filter(Company.id == company_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")
        
    comp.features = payload.features
    db.commit()
    db.refresh(comp)
    return {"success": True, "message": f"Updated features for {comp.name}", "features": comp.features}

@router.get("/api-configs", response_model=List[ApiConfigResponse])
def get_api_configurations(db: Session = Depends(get_db)):
    """Telemetry & credentials for API SETU, Sandbox API, Coincircletrust, etc."""
    return db.query(ApiConfiguration).all()

@router.put("/api-configs/{provider_key}")
def update_api_config(provider_key: str, payload: ApiConfigUpdate, db: Session = Depends(get_db)):
    """Update API Gateway credentials, endpoints, sandbox mode or rate limits"""
    cfg = db.query(ApiConfiguration).filter(ApiConfiguration.provider_key == provider_key).first()
    if not cfg:
        raise HTTPException(status_code=404, detail="API Gateway configuration not found")
        
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(cfg, k, v)
        
    cfg.last_synced = datetime.utcnow()
    db.commit()
    db.refresh(cfg)
    return {"success": True, "message": f"Updated {cfg.display_name} credentials", "config": cfg}

@router.get("/logs", response_model=List[SystemErrorLogResponse])
def get_system_logs(db: Session = Depends(get_db)):
    """Fetch all platform diagnostic and error logs"""
    return db.query(SystemErrorLog).order_by(SystemErrorLog.id.desc()).all()

@router.put("/logs/{log_id}/toggle")
def toggle_log_solved_status(log_id: str, payload: SystemErrorLogToggle, db: Session = Depends(get_db)):
    """Mark system error logs as Solved or Unresolved"""
    log_item = db.query(SystemErrorLog).filter(SystemErrorLog.id == log_id).first()
    if not log_item:
        raise HTTPException(status_code=404, detail="Log entry not found")
        
    log_item.solved = payload.solved
    log_item.resolved_at = datetime.utcnow() if payload.solved else None
    log_item.resolved_by = payload.resolved_by if payload.solved else None
    db.commit()
    db.refresh(log_item)
    return {"success": True, "log": log_item}

@router.get("/stats")
def get_superadmin_telemetry(db: Session = Depends(get_db)):
    """Overall platform telemetry, active company count, verification volume & revenue"""
    companies = db.query(Company).all()
    candidates = db.query(Candidate).all()
    total_verified = sum(c.verified_count_this_month for c in companies)
    total_revenue = sum(c.verified_count_this_month * c.price_per_verification for c in companies)
    
    return {
        "active_companies": len(companies),
        "total_candidates": len(candidates),
        "total_verified_this_month": total_verified,
        "total_estimated_revenue_inr": total_revenue,
        "unresolved_logs": db.query(SystemErrorLog).filter(SystemErrorLog.solved == False).count()
    }
