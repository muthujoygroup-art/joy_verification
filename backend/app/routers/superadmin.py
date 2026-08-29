import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models import Company, ApiConfiguration, FeatureItem, SystemErrorLog, Candidate
from backend.app.schemas import (
    CompanyCreate, CompanyResponse, CompanyUpdateFeatures,
    ApiConfigCreate, ApiConfigResponse, ApiConfigUpdate, ApiConfigToggle,
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
    return db.query(ApiConfiguration).order_by(ApiConfiguration.is_primary.desc(), ApiConfiguration.provider_key.asc()).all()

@router.post("/api-configs", response_model=ApiConfigResponse)
def create_api_configuration(payload: ApiConfigCreate, db: Session = Depends(get_db)):
    """Super Admin onboarding of a new third-party verification API provider"""
    existing = db.query(ApiConfiguration).filter(ApiConfiguration.provider_key == payload.provider_key).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"API Provider with key '{payload.provider_key}' already exists.")
    
    if payload.is_primary:
        # Reset other providers' primary status
        db.query(ApiConfiguration).update({"is_primary": False})

    new_cfg = ApiConfiguration(
        provider_key=payload.provider_key,
        display_name=payload.display_name,
        endpoint_url=payload.endpoint_url,
        api_key=payload.api_key,
        secret_key=payload.secret_key,
        webhook_url=payload.webhook_url,
        sandbox_mode=payload.sandbox_mode or False,
        rate_limit_per_min=payload.rate_limit_per_min or 120,
        status=payload.status or "CONNECTED",
        is_active=payload.is_active if payload.is_active is not None else True,
        is_primary=payload.is_primary or False,
        supported_services=payload.supported_services or ["aadhaar", "pan", "bank", "dl", "passport", "uan", "face"],
        provider_type=payload.provider_type or "Institutional Gateway",
        description=payload.description,
        monthly_quota=payload.monthly_quota or 10000,
        monthly_used=0,
        ping_latency_ms=62,
        last_synced=datetime.utcnow()
    )
    db.add(new_cfg)
    db.commit()
    db.refresh(new_cfg)
    return new_cfg

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

@router.put("/api-configs/{provider_key}/toggle")
def toggle_api_config(provider_key: str, payload: ApiConfigToggle, db: Session = Depends(get_db)):
    """Instantly Enable or Disable an API Provider (e.g. during maintenance or latency failover)"""
    cfg = db.query(ApiConfiguration).filter(ApiConfiguration.provider_key == provider_key).first()
    if not cfg:
        raise HTTPException(status_code=404, detail="API Gateway configuration not found")
    
    cfg.is_active = payload.is_active
    cfg.status = "CONNECTED" if payload.is_active else "DISABLED"
    cfg.last_synced = datetime.utcnow()
    db.commit()
    db.refresh(cfg)
    status_str = "ENABLED (Active)" if cfg.is_active else "DISABLED (Offline)"
    return {"success": True, "message": f"{cfg.display_name} is now {status_str}", "config": cfg}

@router.put("/api-configs/{provider_key}/primary")
def set_primary_api_config(provider_key: str, db: Session = Depends(get_db)):
    """Set specified API provider as the Primary Active Verification Engine for all checks"""
    cfg = db.query(ApiConfiguration).filter(ApiConfiguration.provider_key == provider_key).first()
    if not cfg:
        raise HTTPException(status_code=404, detail="API Gateway configuration not found")
    
    # Demote all others
    db.query(ApiConfiguration).update({"is_primary": False})
    cfg.is_primary = True
    cfg.is_active = True
    cfg.status = "CONNECTED"
    cfg.last_synced = datetime.utcnow()
    db.commit()
    db.refresh(cfg)
    return {"success": True, "message": f"{cfg.display_name} is now the PRIMARY active verification engine.", "config": cfg}

@router.delete("/api-configs/{provider_key}")
def delete_api_config(provider_key: str, db: Session = Depends(get_db)):
    """Delete a custom added API Provider"""
    if provider_key in ("server1_sandbox", "server2_coincircle"):
        raise HTTPException(status_code=400, detail="System default providers (Sandbox / CoinCircle) cannot be deleted. You can disable them instead.")
    
    cfg = db.query(ApiConfiguration).filter(ApiConfiguration.provider_key == provider_key).first()
    if not cfg:
        raise HTTPException(status_code=404, detail="API Gateway configuration not found")
    
    db.delete(cfg)
    db.commit()
    return {"success": True, "message": f"API Provider '{cfg.display_name}' deleted successfully."}

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
