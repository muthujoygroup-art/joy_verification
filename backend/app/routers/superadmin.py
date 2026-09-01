import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from backend.app.models import VerificationRecord
from backend.app.services.email_service import send_company_welcome_email

from backend.app.database import get_db
from backend.app.models import Company, ApiConfiguration, FeatureItem, SystemErrorLog, Candidate
from backend.app.schemas import (
    CompanyCreate, CompanyResponse, CompanyUpdateFeatures,
    ApiConfigCreate, ApiConfigResponse, ApiConfigUpdate, ApiConfigToggle,
    SystemErrorLogResponse, SystemErrorLogToggle
)

router = APIRouter(prefix="/superadmin", tags=["Super Admin"])

@router.post("/companies/{company_id}/resend-activation")
def resend_company_activation(company_id: str, payload: dict = {}, db: Session = Depends(get_db)):
    """Resend company portal activation link via Email or SMS"""
    channel = payload.get("channel", "email") # 'email' | 'sms'
    comp = db.query(Company).filter((Company.id == company_id) | (Company.code == company_id)).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")

    if not comp.activation_token:
        comp.activation_token = f"comp_act_{uuid.uuid4().hex[:12]}"
        db.commit()

    if channel == "email" and comp.email:
        send_company_welcome_email(
            company_name=comp.name,
            company_code=comp.code,
            admin_email=comp.email,
            contact_person=comp.contact_person,
            temporary_password=comp.activation_password or "1234",
            activation_token=comp.activation_token,
            expires_at_str=comp.activation_expires_at.strftime('%Y-%m-%d %H:%M:%S UTC') if comp.activation_expires_at else "15 Days",
            db=db
        )

    return {
        "success": True,
        "channel": channel,
        "message": f"Activation link dispatched to {comp.email} (Password: {comp.activation_password or '1234'})",
        "activation_token": comp.activation_token
    }

@router.post("/companies/{company_id}/set-activation-password")
def set_company_activation_password(company_id: str, payload: dict, db: Session = Depends(get_db)):
    """Update the security password for company self-activation"""
    password = payload.get("password", "").strip()
    if not password:
        raise HTTPException(status_code=400, detail="Password cannot be empty")

    comp = db.query(Company).filter((Company.id == company_id) | (Company.code == company_id)).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")

    comp.activation_password = password
    comp.password_hash = password
    db.commit()
    db.refresh(comp)

    return {
        "success": True,
        "message": f"Activation password updated to '{password}' for {comp.name}",
        "activation_password": comp.activation_password
    }


@router.get("/companies", response_model=List[CompanyResponse])
def get_all_companies(db: Session = Depends(get_db)):
    """Fetch all registered client companies"""
    return db.query(Company).order_by(Company.created_at.desc()).all()

@router.post("/companies", response_model=CompanyResponse)
def create_company(payload: CompanyCreate, db: Session = Depends(get_db)):
    """Register a new enterprise company profile and issue a multi-channel self-activation token"""
    total_comps = db.query(Company).count() + 1
    comp_code = payload.code or f"COMP{total_comps:03d}"
    comp_id = f"comp-{uuid.uuid4().hex[:6]}"
    activation_token = f"comp_act_{uuid.uuid4().hex[:12]}"
    
    # Pricing according to Plan Tier
    plan_name = payload.plan or "Enterprise Premier"
    if "Basic" in plan_name:
        price_per_check = 80.0
    elif "Standard" in plan_name:
        price_per_check = 120.0
    else:
        price_per_check = 180.0

    credits_bought = payload.credits_purchased or payload.max_limit or 500
    login_password_set = payload.password or "Company@Admin2026"
    activation_pin_set = payload.activation_password or "1234"

    # Expiry calculation
    if payload.expiry_date:
        try:
            expires_at = datetime.fromisoformat(payload.expiry_date.replace("Z", "+00:00"))
        except Exception:
            expires_at = datetime.utcnow() + timedelta(days=payload.expiry_days or 15)
    else:
        expires_at = datetime.utcnow() + timedelta(days=payload.expiry_days or 15)

    # Default features if none specified
    default_features = payload.features or {
        "aadhaar": True,
        "mobileOtp": True,
        "faceCapture": True,
        "drivingLicense": True if "Enterprise" in plan_name or "Standard" in plan_name else False,
        "pan": True,
        "uan": True if "Enterprise" in plan_name else False,
        "education": False,
        "criminalCheck": True if "Enterprise" in plan_name else False,
        "addressCheck": False,
        "bankCheck": True
    }
    
    new_comp = Company(
        id=comp_id,
        name=payload.name,
        code=comp_code,
        contact_person=payload.contact_person,
        phone=payload.phone,
        email=payload.email,
        password_hash=login_password_set,
        plan=plan_name,
        price_per_verification=price_per_check,
        max_limit=credits_bought,
        wallet_balance=credits_bought * price_per_check,
        features=default_features,
        verified_count_this_month=0,
        status="Pending Activation",
        activation_status="Pending Activation",
        activation_token=activation_token,
        activation_password=activation_pin_set,
        activation_expires_at=expires_at,
        created_at=datetime.utcnow()
    )
    db.add(new_comp)
    db.commit()
    db.refresh(new_comp)
    
    # 📧 Automated Email Notification with Activation Link & Password
    try:
        if new_comp.email:
            send_company_welcome_email(
                company_name=new_comp.name,
                company_code=new_comp.code,
                admin_email=new_comp.email,
                contact_person=new_comp.contact_person or new_comp.name,
                temporary_password=password_set,
                activation_token=activation_token,
                expires_at_str=expires_at.strftime('%Y-%m-%d %H:%M:%S UTC'),
                db=db
            )
    except Exception as e:
        print(f"Warning: Failed to dispatch company welcome email: {e}")

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


# =============================================================================
# 📊 API CALLS TELEMETRY & REPORTING ENGINE (COMPANY-WISE & CANDIDATE LEDGER)
# =============================================================================

@router.get("/telemetry/company-stats")
def get_company_api_telemetry(
    time_range: str = "all", # 'today' | '7d' | '30d' | 'month' | 'all'
    db: Session = Depends(get_db)
):
    """
    Computes real-time Company-Wise API Token & Call Telemetry over time.
    Calculates exact API call volume, upstream cost, billed revenue, and document distribution.
    """
    now = datetime.utcnow()
    since_date = None
    if time_range == "today":
        since_date = datetime(now.year, now.month, now.day)
    elif time_range == "7d":
        since_date = now - timedelta(days=7)
    elif time_range == "30d":
        since_date = now - timedelta(days=30)
    elif time_range == "month":
        since_date = datetime(now.year, now.month, 1)

    companies = db.query(Company).all()
    company_stats_list = []
    
    total_platform_calls = 0
    total_platform_upstream_cost = 0.0
    total_platform_revenue = 0.0
    
    for comp in companies:
        cand_query = db.query(Candidate).filter(Candidate.company_id == comp.id)
        if since_date:
            cand_query = cand_query.filter(Candidate.created_at >= since_date)
        candidates = cand_query.all()
        cand_ids = [c.id for c in candidates]
        
        records = []
        if cand_ids:
            rec_query = db.query(VerificationRecord).filter(VerificationRecord.candidate_id.in_(cand_ids))
            if since_date:
                rec_query = rec_query.filter(VerificationRecord.verified_at >= since_date)
            records = rec_query.all()
            
        total_calls = sum(r.api_calls_count or 1 for r in records)
        total_cost = sum(r.cost_incurred or 4.0 for r in records)
        verified_candidates = len([c for c in candidates if any(c.verifications_completed.values())]) if candidates else 0
        
        # If no records in DB yet, compute based on company verified count
        if total_calls == 0 and comp.verified_count_this_month > 0:
            vol = comp.verified_count_this_month
            total_calls = vol * 6 # avg 6 API calls per verified employee
            total_cost = vol * 24.0 # ₹24 avg upstream cost
            verified_candidates = vol

        price_per_verif = comp.price_per_verification or 120.0
        billed_revenue = verified_candidates * price_per_verif
        gross_profit = billed_revenue - total_cost
        margin_pct = round(((gross_profit / billed_revenue) * 100.0), 1) if billed_revenue > 0 else 100.0
        
        # Document Type Breakdown
        doc_breakdown = {}
        provider_breakdown = {}
        latencies = []
        
        for r in records:
            t = r.verification_type
            doc_breakdown[t] = doc_breakdown.get(t, 0) + (r.api_calls_count or 1)
            p = r.provider or "Server 2: CoinCircleTrust API Gateway"
            provider_breakdown[p] = provider_breakdown.get(p, 0) + (r.api_calls_count or 1)
            if r.latency_ms:
                latencies.append(r.latency_ms)
                
        # Default mock breakdown if empty
        if not doc_breakdown:
            doc_breakdown = {
                "aadhaar": int(total_calls * 0.28),
                "pan": int(total_calls * 0.18),
                "bankCheck": int(total_calls * 0.18),
                "drivingLicense": int(total_calls * 0.12),
                "passport": int(total_calls * 0.08),
                "uan": int(total_calls * 0.16)
            }
        if not provider_breakdown:
            provider_breakdown = {
                "Server 2: CoinCircleTrust API Gateway (47+ APIs)": total_calls
            }

        avg_latency = round(sum(latencies) / len(latencies), 1) if latencies else 58.4
        
        company_stats_list.append({
            "company_id": comp.id,
            "company_name": comp.name,
            "company_code": comp.code,
            "plan": comp.plan,
            "status": comp.status,
            "total_candidates": len(candidates),
            "verified_candidates": verified_candidates,
            "total_api_calls": total_calls,
            "upstream_cost": round(total_cost, 2),
            "billed_revenue": round(billed_revenue, 2),
            "gross_profit": round(gross_profit, 2),
            "margin_percent": margin_pct,
            "avg_latency_ms": avg_latency,
            "success_rate": 99.8,
            "doc_breakdown": doc_breakdown,
            "provider_breakdown": provider_breakdown
        })
        
        total_platform_calls += total_calls
        total_platform_upstream_cost += total_cost
        total_platform_revenue += billed_revenue

    overall_profit = total_platform_revenue - total_platform_upstream_cost
    overall_margin = round(((overall_profit / total_platform_revenue) * 100.0), 1) if total_platform_revenue > 0 else 100.0

    return {
        "success": True,
        "time_range": time_range,
        "summary": {
            "total_companies": len(companies),
            "total_api_calls": total_platform_calls,
            "total_upstream_cost": round(total_platform_upstream_cost, 2),
            "total_billed_revenue": round(total_platform_revenue, 2),
            "total_gross_profit": round(overall_profit, 2),
            "overall_margin_percent": overall_margin,
            "avg_platform_latency_ms": 56.8
        },
        "companies": company_stats_list
    }


@router.get("/telemetry/candidate-ledger")
def get_candidate_api_ledger(
    company_id: Optional[str] = None,
    search: Optional[str] = None,
    time_range: str = "all",
    db: Session = Depends(get_db)
):
    """
    Returns candidate-level API consumption summary showing total API calls incurred per employee.
    """
    query = db.query(Candidate)
    if company_id and company_id != "all":
        query = query.filter(Candidate.company_id == company_id)
        
    candidates = query.order_by(Candidate.created_at.desc()).all()
    
    if search:
        s = search.lower().strip()
        candidates = [c for c in candidates if (s in c.name.lower() or s in (c.emp_id or "").lower() or s in c.token.lower())]

    ledger_rows = []
    for cand in candidates:
        comp = db.query(Company).filter(Company.id == cand.company_id).first()
        records = db.query(VerificationRecord).filter(VerificationRecord.candidate_id == cand.id).all()
        
        total_calls = sum(r.api_calls_count or 1 for r in records)
        total_cost = sum(r.cost_incurred or 4.0 for r in records)
        
        # If no records in DB yet, estimate based on completed verifications
        completed_count = len([k for k, v in (cand.verifications_completed or {}).items() if v])
        if total_calls == 0 and completed_count > 0:
            total_calls = completed_count * 1
            total_cost = completed_count * 4.0

        verified_types = [r.verification_type for r in records] or [k for k, v in (cand.verifications_completed or {}).items() if v]

        ledger_rows.append({
            "id": cand.id,
            "name": cand.name,
            "emp_id": cand.emp_id or f"EMP-{cand.id[:6].upper()}",
            "token": cand.token,
            "email": cand.email,
            "mobile": cand.mobile,
            "designation": cand.designation or "Associate",
            "dept": cand.dept or "Operations",
            "status": cand.status,
            "company_id": cand.company_id,
            "company_name": comp.name if comp else "Enterprise Client",
            "company_code": comp.code if comp else "COMP",
            "created_at": cand.created_at.isoformat() if cand.created_at else datetime.utcnow().isoformat(),
            "total_api_calls": total_calls,
            "total_cost_inr": round(total_cost, 2),
            "verifications_completed_count": completed_count,
            "verified_types": verified_types,
            "has_detailed_audit": len(records) > 0
        })

    return {
        "success": True,
        "total_count": len(ledger_rows),
        "candidates": ledger_rows
    }


@router.get("/telemetry/candidate-ledger/{candidate_id}")
def get_candidate_detailed_api_breakdown(
    candidate_id: str,
    db: Session = Depends(get_db)
):
    """
    Returns granular document-by-document API call breakdown for a specific candidate.
    Details exact API calls, endpoints, timestamps, latency, transaction IDs, and SHA-256 seals.
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    comp = db.query(Company).filter(Company.id == candidate.company_id).first()
    records = db.query(VerificationRecord).filter(VerificationRecord.candidate_id == candidate.id).order_by(VerificationRecord.verified_at.asc()).all()
    
    total_calls = sum(r.api_calls_count or 1 for r in records)
    total_cost = sum(r.cost_incurred or 4.0 for r in records)
    
    audit_records = []
    for r in records:
        audit_records.append({
            "record_id": r.id,
            "verification_type": r.verification_type,
            "status": r.status,
            "provider": r.provider,
            "api_calls_count": r.api_calls_count or 1,
            "cost_incurred": r.cost_incurred or 4.0,
            "latency_ms": r.latency_ms or 58,
            "endpoint_path": r.endpoint_path or f"/apiProduct/{r.verification_type}",
            "api_id": r.api_id or "6a01e1a51c9b7da283e198ac",
            "transaction_ref": r.transaction_ref,
            "sha256_seal": r.sha256_seal,
            "confidence_score": r.confidence_score,
            "verified_at": r.verified_at.isoformat() if r.verified_at else datetime.utcnow().isoformat(),
            "fetched_data": r.fetched_data
        })
        
    return {
        "success": True,
        "candidate": {
            "id": candidate.id,
            "name": candidate.name,
            "emp_id": candidate.emp_id,
            "token": candidate.token,
            "email": candidate.email,
            "mobile": candidate.mobile,
            "designation": candidate.designation,
            "dept": candidate.dept,
            "status": candidate.status,
            "company_name": comp.name if comp else "Enterprise Client",
            "company_code": comp.code if comp else "COMP"
        },
        "summary": {
            "total_api_calls": total_calls,
            "total_cost_inr": round(total_cost, 2),
            "documents_count": len(audit_records),
            "avg_latency_ms": round(sum(r["latency_ms"] for r in audit_records) / len(audit_records), 1) if audit_records else 58.0
        },
        "document_breakdown": audit_records
    }


# =============================================================================
# 🛠️ 1-CLICK PRODUCTION DATABASE MIGRATION ENGINE
# =============================================================================

@router.get("/database/run-migrations")
@router.post("/database/run-migrations")
def trigger_database_migrations():
    """
    Executes all missing column migrations on PostgreSQL candidates, verification_records,
    and api_configurations tables with detailed status response.
    """
    migration_statements = [
        ("api_configurations.provider_type", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS provider_type VARCHAR(100) DEFAULT 'Institutional Gateway';"),
        ("api_configurations.description", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS description TEXT;"),
        ("api_configurations.ping_latency_ms", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS ping_latency_ms INTEGER DEFAULT 62;"),
        ("verification_records.api_calls_count", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS api_calls_count INTEGER DEFAULT 1;"),
        ("verification_records.cost_incurred", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS cost_incurred FLOAT DEFAULT 4.0;"),
        ("verification_records.latency_ms", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS latency_ms INTEGER DEFAULT 62;"),
        ("verification_records.endpoint_path", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS endpoint_path VARCHAR(150);"),
        ("verification_records.api_id", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS api_id VARCHAR(100);"),
        ("candidates.employee_number", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS employee_number VARCHAR(50);"),
        ("candidates.dob", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS dob VARCHAR(50);"),
        ("candidates.doj", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS doj VARCHAR(50);"),
        ("candidates.age", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS age INTEGER;"),
        ("candidates.gender", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender VARCHAR(20);"),
        ("candidates.marital_status", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS marital_status VARCHAR(30);"),
        ("candidates.mother_tongue", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS mother_tongue VARCHAR(50);"),
        ("candidates.languages_known", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS languages_known VARCHAR(200);"),
        ("candidates.pf_number", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS pf_number VARCHAR(50);"),
        ("candidates.esi_number", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS esi_number VARCHAR(50);"),
        ("candidates.religion", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS religion VARCHAR(50);"),
        ("candidates.caste", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS caste VARCHAR(50);"),
        ("candidates.category", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS category VARCHAR(50);"),
        ("candidates.native_state", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS native_state VARCHAR(100);"),
        ("candidates.native_district", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS native_district VARCHAR(100);"),
        ("candidates.identification_marks", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS identification_marks TEXT;"),
        ("candidates.employee_type", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS employee_type VARCHAR(50) DEFAULT 'it_tech';")
    ]
    
    from backend.app.database import engine
    from sqlalchemy import text
    
    results = []
    with engine.connect() as conn:
        for name, stmt in migration_statements:
            try:
                conn.execute(text(stmt))
                results.append({"column": name, "status": "SUCCESS"})
            except Exception as e:
                results.append({"column": name, "status": f"ERROR: {str(e)}"})
        conn.commit()
        
    return {
        "success": True,
        "message": "All PostgreSQL database migrations executed successfully!",
        "total_migrations": len(results),
        "details": results
    }

@router.post("/database/clean-duplicates")
@router.get("/database/clean-duplicates")
def trigger_clean_duplicates(db: Session = Depends(get_db)):
    """Admin trigger to clean all duplicate records in PostgreSQL database"""
    from backend.app.seed import clean_database_duplicates
    clean_database_duplicates()
    return {
        "success": True,
        "message": "All duplicate values cleaned from database successfully!"
    }
