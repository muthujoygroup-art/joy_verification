from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from backend.app.database import get_db
from backend.app.models import SystemSetting, PlatformGuideline, CommunicationGateway
from backend.app.schemas import RoleSettingsUpdate, PlatformGuidelineUpdate
from backend.app.services.email_service import send_smtp_email, get_smtp_config

router = APIRouter(prefix="/settings", tags=["System Settings & Guidelines"])

@router.get("/role/{role}")
def get_role_settings(role: str, db: Session = Depends(get_db)):
    """Fetch customized settings for the specified role"""
    setting = db.query(SystemSetting).filter(SystemSetting.role == role).first()
    if not setting:
        return {"role": role, "settings": {}}
    return {"role": role, "settings": setting.settings_data}

@router.put("/role")
def update_role_settings(payload: RoleSettingsUpdate, db: Session = Depends(get_db)):
    """Save updated role settings in database"""
    setting = db.query(SystemSetting).filter(SystemSetting.role == payload.role).first()
    if not setting:
        setting = SystemSetting(role=payload.role, settings_data=payload.settings)
        db.add(setting)
    else:
        setting.settings_data = payload.settings
        
    db.commit()
    return {"success": True, "role": payload.role, "settings": setting.settings_data}

@router.get("/guidelines/{role}")
def get_guidelines_for_role(role: str, db: Session = Depends(get_db)):
    """Fetch role-specific operating manual and documentation"""
    guide = db.query(PlatformGuideline).filter(PlatformGuideline.role == role).first()
    if not guide:
        return {"role": role, "guidelines": []}
    return {"role": role, "guidelines": guide.guidelines_data}

@router.get("/gateways")
def get_communication_gateways(company_id: str = None, db: Session = Depends(get_db)):
    """Fetch configured WhatsApp, SMTP, and SMS gateways"""
    gateways = db.query(CommunicationGateway).all()
    return gateways

@router.post("/gateways")
def save_communication_gateway(payload: dict, db: Session = Depends(get_db)):
    """Save or update WhatsApp / SMTP email credentials"""
    gw_type = payload.get("gateway_type") # 'whatsapp' | 'email_smtp'
    gw_id = f"gw_{gw_type}"
    
    gw = db.query(CommunicationGateway).filter(CommunicationGateway.id == gw_id).first()
    if not gw:
        gw = CommunicationGateway(
            id=gw_id,
            gateway_type=gw_type,
            settings_data=payload.get("settings", {}),
            is_active=True
        )
        db.add(gw)
    else:
        gw.settings_data = payload.get("settings", {})
        gw.is_active = payload.get("is_active", True)
        
    db.commit()
    db.refresh(gw)
    return {"success": True, "gateway": gw}

from datetime import datetime


@router.get("/email-config")
def get_email_config(db: Session = Depends(get_db)):
    """Fetch current active SMTP configuration (with masked password)"""
    cfg = get_smtp_config(db)
    # Mask password for display
    masked_pw = "********" if cfg.get("password") else ""
    return {
        "host": cfg.get("host"),
        "port": cfg.get("port"),
        "user": cfg.get("user"),
        "has_password": bool(cfg.get("password")),
        "password_masked": masked_pw,
        "from_email": cfg.get("from_email"),
        "from_name": cfg.get("from_name"),
        "use_ssl": cfg.get("use_ssl"),
        "use_tls": cfg.get("use_tls")
    }

@router.post("/test-email")
def test_email_dispatch(payload: dict, db: Session = Depends(get_db)):
    """Dispatches a live diagnostic test email to verify cPanel SMTP connectivity"""
    to_email = payload.get("to_email")
    if not to_email:
        raise HTTPException(status_code=400, detail="Recipient 'to_email' is required")

    test_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
        <h2 style="color: #4338ca; margin-top: 0;">🎉 cPanel SMTP Email Gateway Connected!</h2>
        <p>This is a live test email dispatched from your <strong>JOY Background Verification Platform</strong>.</p>
        <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <strong style="color: #15803d;">Status: Successfully Authenticated with Mail Server</strong><br>
            <span style="font-size: 12px; color: #475569;">Timestamp: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</span>
        </div>
        <p style="font-size: 12px; color: #64748b;">
            All automated account creation and verification notice emails will be dispatched via this gateway.
        </p>
    </div>
    """

    res = send_smtp_email(
        to_email=to_email,
        subject="✅ JOY Corporate Solutions - cPanel SMTP Test Verification",
        html_content=test_html,
        db=db
    )

    if not res.get("success") and not res.get("simulated"):
        raise HTTPException(status_code=500, detail=res.get("error", "Failed to dispatch test email via SMTP"))

    return res


# =============================================================================
# 🏢 COMPANY-SPECIFIC EMAIL & NOTIFICATION GATEWAY ENDPOINTS
# =============================================================================
@router.get("/company/{company_id}/email-config")
def get_company_email_config(company_id: str, db: Session = Depends(get_db)):
    """Fetch company-specific SMTP configuration or master cPanel fallback status"""
    gw = db.query(CommunicationGateway).filter(
        CommunicationGateway.gateway_type == "email_smtp",
        CommunicationGateway.company_id == company_id
    ).first()

    master_cfg = get_smtp_config(db)

    if not gw or not gw.settings_data:
        return {
            "use_custom_smtp": False,
            "company_id": company_id,
            "master_from_email": master_cfg.get("from_email", "admin@joycorporatesolutions.com"),
            "host": "mail.joycorporatesolutions.com",
            "port": 465,
            "user": "admin@joycorporatesolutions.com",
            "from_email": master_cfg.get("from_email", "admin@joycorporatesolutions.com"),
            "from_name": "JOY Corporate Solutions BGV",
            "use_ssl": True,
            "has_password": False,
            "password_masked": "",
            "notification_rules": {
                "notify_hr_created": True,
                "notify_candidate_verified": True,
                "notify_discrepancies": True,
                "notify_low_balance": True
            }
        }

    sd = gw.settings_data
    return {
        "use_custom_smtp": sd.get("use_custom_smtp", False),
        "company_id": company_id,
        "master_from_email": master_cfg.get("from_email", "admin@joycorporatesolutions.com"),
        "host": sd.get("host", "mail.joycorporatesolutions.com"),
        "port": sd.get("port", 465),
        "user": sd.get("user", ""),
        "from_email": sd.get("from_email", ""),
        "from_name": sd.get("from_name", ""),
        "use_ssl": sd.get("use_ssl", True),
        "use_tls": sd.get("use_tls", False),
        "has_password": bool(sd.get("password")),
        "password_masked": "********" if sd.get("password") else "",
        "notification_rules": sd.get("notification_rules", {
            "notify_hr_created": True,
            "notify_candidate_verified": True,
            "notify_discrepancies": True,
            "notify_low_balance": True
        })
    }

@router.post("/company/{company_id}/email-config")
def save_company_email_config(company_id: str, payload: dict, db: Session = Depends(get_db)):
    """Save or update company-specific SMTP email and notification preferences"""
    gw = db.query(CommunicationGateway).filter(
        CommunicationGateway.gateway_type == "email_smtp",
        CommunicationGateway.company_id == company_id
    ).first()

    gw_id = f"gw_comp_{company_id}"
    if not gw:
        gw = CommunicationGateway(
            id=gw_id,
            gateway_type="email_smtp",
            company_id=company_id,
            settings_data=payload,
            is_active=True
        )
        db.add(gw)
    else:
        # Preserve existing password if not updated
        existing_sd = gw.settings_data or {}
        if not payload.get("password") and existing_sd.get("password"):
            payload["password"] = existing_sd["password"]
        gw.settings_data = payload
        gw.is_active = True

    db.commit()
    db.refresh(gw)
    return {"success": True, "gateway": gw}

@router.post("/company/{company_id}/test-email")
def test_company_email_dispatch(company_id: str, payload: dict, db: Session = Depends(get_db)):
    """Dispatches a test verification email using the company's resolved SMTP settings"""
    to_email = payload.get("to_email")
    if not to_email:
        raise HTTPException(status_code=400, detail="Recipient 'to_email' is required")

    test_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
        <h2 style="color: #4338ca; margin-top: 0;">🏢 Company Email Gateway Connected!</h2>
        <p>This is an automated test email dispatched for Company <strong>{company_id}</strong> on JOY Background Verification Gateway.</p>
        <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <strong style="color: #15803d;">Status: Verified & Operational</strong><br>
            <span style="font-size: 12px; color: #475569;">Dispatched at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</span>
        </div>
    </div>
    """

    res = send_smtp_email(
        to_email=to_email,
        subject=f"✅ JOY Corporate Solutions - Company {company_id} Email Test",
        html_content=test_html,
        company_id=company_id,
        db=db
    )
    return res


# =============================================================================
# 👔 HR EXECUTIVE NOTIFICATION PREFERENCES ENDPOINTS
# =============================================================================
@router.get("/hr/{hr_id}/preferences")
def get_hr_preferences(hr_id: str, db: Session = Depends(get_db)):
    """Fetch individual HR recruiter notification preferences and email signature"""
    setting = db.query(SystemSetting).filter(SystemSetting.role == f"hr_{hr_id}").first()
    if not setting:
        return {
            "hr_id": hr_id,
            "preferences": {
                "notification_email": "",
                "cc_email": "",
                "sender_display_name": "",
                "custom_signature": "Best regards,\nTalent Acquisition Team",
                "auto_email_candidate_link": True,
                "notify_on_candidate_verified": True,
                "notify_on_red_flags": True,
                "daily_digest": False
            }
        }
    return {"hr_id": hr_id, "preferences": setting.settings_data}

@router.post("/hr/{hr_id}/preferences")
def save_hr_preferences(hr_id: str, payload: dict, db: Session = Depends(get_db)):
    """Save individual HR recruiter notification preferences and signature"""
    role_key = f"hr_{hr_id}"
    setting = db.query(SystemSetting).filter(SystemSetting.role == role_key).first()
    if not setting:
        setting = SystemSetting(role=role_key, settings_data=payload)
        db.add(setting)
    else:
        setting.settings_data = payload

    db.commit()
    db.refresh(setting)
    return {"success": True, "hr_id": hr_id, "preferences": setting.settings_data}
