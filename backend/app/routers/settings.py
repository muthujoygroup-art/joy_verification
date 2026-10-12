from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from datetime import datetime

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

@router.get("/superadmin/profile")
def get_superadmin_profile(db: Session = Depends(get_db)):
    """Fetch Master Super Administrator account details"""
    from backend.app.models.super_admin import SuperAdminUser
    sa = db.query(SuperAdminUser).filter(SuperAdminUser.role == "superadmin").first()
    if not sa:
        sa = db.query(SuperAdminUser).first()
    if not sa:
        return {
            "id": "sa-master-01",
            "name": "Super Administrator",
            "email": "admin@joycorporatesolutions.com",
            "role": "superadmin",
            "status": "Active"
        }
    return {
        "id": sa.id,
        "name": sa.name,
        "email": sa.email,
        "role": sa.role,
        "status": sa.status,
        "created_at": sa.created_at.strftime("%Y-%m-%d %H:%M:%S") if sa.created_at else None,
        "last_login_at": sa.last_login_at.strftime("%Y-%m-%d %H:%M:%S") if sa.last_login_at else None
    }

@router.put("/superadmin/profile")
def update_superadmin_profile(payload: dict, db: Session = Depends(get_db)):
    """Update Super Administrator name, master email address, and optional password"""
    from backend.app.models.super_admin import SuperAdminUser
    new_name = (payload.get("name") or "").strip()
    new_email = (payload.get("email") or "").strip().lower()
    new_password = (payload.get("new_password") or payload.get("password") or "").strip()

    if not new_email or "@" not in new_email:
        raise HTTPException(status_code=400, detail="Valid Super Admin email is required.")

    sa = db.query(SuperAdminUser).filter(SuperAdminUser.role == "superadmin").first()
    if not sa:
        sa = db.query(SuperAdminUser).first()

    if not sa:
        sa = SuperAdminUser(
            id="sa-master-01",
            name=new_name or "Super Administrator",
            email=new_email,
            password_hash=new_password or "SuperAdmin@2026",
            role="superadmin",
            status="Active"
        )
        db.add(sa)
    else:
        if new_name:
            sa.name = new_name
        sa.email = new_email
        if new_password and len(new_password) >= 4:
            sa.password_hash = new_password

    db.commit()
    db.refresh(sa)

    return {
        "success": True,
        "message": "Super Administrator profile & official master email updated successfully!",
        "profile": {
            "id": sa.id,
            "name": sa.name,
            "email": sa.email,
            "role": sa.role,
            "status": sa.status
        }
    }

@router.post("/email-config")
@router.post("/gateways")
@router.post("/smtp-settings")
def save_communication_gateway(payload: dict, db: Session = Depends(get_db)):
    """Save or update WhatsApp / SMTP email credentials"""
    try:
        gw_type = payload.get("gateway_type", "email_smtp")
        gw_id = f"gw_{gw_type}"
        settings_data = payload.get("settings") if payload.get("settings") is not None else payload
        
        # Match existing gateway by gateway_type or ID to guarantee clean updates without duplicate key collision
        gw = db.query(CommunicationGateway).filter(
            (CommunicationGateway.gateway_type == gw_type) | (CommunicationGateway.id == gw_id)
        ).first()

        existing_sd = dict(gw.settings_data or {}) if gw else {}
        incoming_pw = settings_data.get("password")

        # Retain existing password if masked or not provided
        if not incoming_pw or incoming_pw == "********" or incoming_pw == "":
            if existing_sd.get("password"):
                settings_data["password"] = existing_sd["password"]

        # Retain existing accessToken if empty or masked so it never vanishes
        incoming_token = settings_data.get("accessToken") or settings_data.get("access_token")
        if not incoming_token or incoming_token.startswith("••") or incoming_token.startswith("**") or incoming_token == "":
            if existing_sd.get("accessToken"):
                settings_data["accessToken"] = existing_sd["accessToken"]
            elif existing_sd.get("access_token"):
                settings_data["accessToken"] = existing_sd["access_token"]

        # Retain existing phoneNumberId and wabaId if empty
        if not settings_data.get("phoneNumberId") and existing_sd.get("phoneNumberId"):
            settings_data["phoneNumberId"] = existing_sd["phoneNumberId"]
        if not settings_data.get("wabaId") and (existing_sd.get("wabaId") or existing_sd.get("businessAccountId")):
            settings_data["wabaId"] = existing_sd.get("wabaId") or existing_sd.get("businessAccountId")

        if not gw:
            gw = CommunicationGateway(
                id=gw_id,
                gateway_type=gw_type,
                settings_data=settings_data,
                is_active=True,
                updated_at=datetime.utcnow()
            )
            db.add(gw)
        else:
            gw.settings_data = settings_data
            gw.is_active = payload.get("is_active", True)
            gw.updated_at = datetime.utcnow()
            
        db.commit()
        db.refresh(gw)
        return {
            "success": True,
            "message": "cPanel SMTP Email Configuration saved successfully!",
            "gateway_id": gw.id,
            "gateway_type": gw.gateway_type,
            "is_active": gw.is_active
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error saving SMTP settings: {str(e)}")


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
    smtp_cfg = payload.get("smtp_config")
    
    if not to_email:
        raise HTTPException(status_code=400, detail="Recipient 'to_email' is required")

    # If SMTP config with password was provided in test request, persist it to database
    if smtp_cfg and isinstance(smtp_cfg, dict) and smtp_cfg.get("password"):
        try:
            gw_id = "gw_email_smtp"
            gw = db.query(CommunicationGateway).filter(
                (CommunicationGateway.gateway_type == "email_smtp") | (CommunicationGateway.id == gw_id)
            ).first()
            if not gw:
                gw = CommunicationGateway(
                    id=gw_id,
                    gateway_type="email_smtp",
                    settings_data=smtp_cfg,
                    is_active=True,
                    updated_at=datetime.utcnow()
                )
                db.add(gw)
            else:
                gw.settings_data = smtp_cfg
                gw.is_active = True
                gw.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(gw)
        except Exception as e:
            db.rollback()
            print(f"Warning persisting SMTP config in test email: {e}")

    test_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 25px; color: #0f172a; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 18px; letter-spacing: 0.5px;">JOY CORPORATE SOLUTIONS</h2>
            <span style="color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase;">cPanel SMTP Direct Gateway Handshake</span>
        </div>
        
        <div style="background: #f0fdf4; border: 2px solid #86efac; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
            <strong style="color: #15803d; font-size: 15px;">🎉 SMTP Gateway Connection Verified!</strong><br>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #334155; line-height: 1.5;">
                This live diagnostic email confirms that your cPanel mail server (<strong>{smtp_cfg.get('host') if smtp_cfg else 'mail.joycorporatesolutions.com'}</strong>) is properly authenticated and ready to dispatch notifications.
            </p>
        </div>

        <table width="100%" border="0" cellspacing="4" cellpadding="0" style="font-size: 12px; margin-bottom: 20px;">
            <tr>
                <td width="35%" style="color: #64748b; font-weight: 600;">Sender Account:</td>
                <td style="color: #0f172a; font-weight: bold; font-family: monospace;">{smtp_cfg.get('user') if smtp_cfg else 'admin@joycorporatesolutions.com'}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Recipient:</td>
                <td style="color: #0f172a; font-weight: bold; font-family: monospace;">{to_email}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Handshake Protocol:</td>
                <td style="color: #4338ca; font-weight: bold;">SSL/TLS Port {smtp_cfg.get('port') if smtp_cfg else 465}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Timestamp (UTC):</td>
                <td style="color: #0f172a;">{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</td>
            </tr>
        </table>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
            JOY Data Verification & Compliance Gateway • ISO 27001 Certified • DPDP Act 2023 Ready
        </div>
    </div>
    """

    res = send_smtp_email(
        to_email=to_email,
        subject="✅ JOY Corporate Solutions - cPanel SMTP Gateway Verification",
        html_content=test_html,
        custom_config=smtp_cfg,
        db=db
    )

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

# =============================================================================
# 🏛️ LEGAL & DPDP GOVERNANCE MASTER ENDPOINTS
# =============================================================================
@router.get("/legal-governance")
def get_legal_governance_settings(db: Session = Depends(get_db)):
    """Fetch master DPDP Act policies, IT Act disclaimers, and DPO officer details"""
    setting = db.query(SystemSetting).filter(SystemSetting.role == "legal_governance").first()
    
    defaults = {
        "dpdp_consent_declaration": "I hereby voluntarily provide my explicit and unconditional consent under Section 6 of the Digital Personal Data Protection Act 2023 (DPDP Act 2023) to JOY Corporate Solutions Private Limited and my prospective employer to verify my identity credentials against authorized Government and statutory databases (UIDAI Aadhaar, Income Tax PAN, EPFO, MoRTH Driving License). I understand my data is processed solely for employment background verification and statutory payroll onboarding.",
        "it_act_safe_harbor": "JOY Corporate Solutions operates as a technology intermediary under Section 79 of the Information Technology Act 2000, retrieving point-in-time public records. Employer organizations remain the primary Data Fiduciaries responsible for lawful onboarding.",
        "uidai_aadhaar_mandate": "All Aadhaar data is processed under Regulation 16B & 19 of UIDAI Security Regulations. Raw 12-digit numbers are strictly masked as XXXX-XXXX-9876 across all reports, dossiers, and database storage.",
        "data_retention_days": 60,
        "dpo_name": "Adv. Rajeshwari Sundaram",
        "dpo_email": "dpo@joycorporatesolutions.com",
        "dpo_phone": "+91 44 2819 0900",
        "dpo_address": "JOY Corporate Solutions Tower, Mount Road, Chennai, Tamil Nadu - 600002",
        "dpo_reg_no": "BC/TN/2026/0912",
        "iso_cert_no": "ISO-27001-2022-IND-99412",
        "updated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }

    if not setting or not setting.settings_data:
        return defaults
    
    return {**defaults, **setting.settings_data}


@router.post("/legal-governance")
def save_legal_governance_settings(payload: dict, db: Session = Depends(get_db)):
    """Save or update master legal clauses, retention policy, and DPO officer information"""
    setting = db.query(SystemSetting).filter(SystemSetting.role == "legal_governance").first()
    
    if not setting:
        setting = SystemSetting(
            role="legal_governance",
            settings_data=payload,
            updated_at=datetime.utcnow()
        )
        db.add(setting)
    else:
        setting.settings_data = payload
        setting.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(setting)
    return {
        "success": True,
        "message": "Legal & DPDP Governance policies updated successfully!",
        "settings": setting.settings_data
    }


# -------------------------------------------------------------
# 💬 LIVE META WHATSAPP TEST DISPATCH
# -------------------------------------------------------------
@router.post("/test-whatsapp")
@router.post("/gateways/test-whatsapp")
async def test_send_whatsapp_message(payload: dict, db: Session = Depends(get_db)):
    """Dispatch real live WhatsApp test message via Meta Cloud API v19.0"""
    import httpx
    from fastapi.responses import JSONResponse
    phone = (payload.get("phone") or payload.get("to") or "").replace("+", "").replace(" ", "").replace("-", "")
    message_text = payload.get("message") or "Hello from JOY TrueProfile! Your Meta WhatsApp Cloud API is successfully connected & 100% active. 🚀"
    
    # 1. Resolve credentials: prioritize payload (instant test), then Database, then settings (.env)
    gw = db.query(CommunicationGateway).filter(CommunicationGateway.gateway_type == "whatsapp").first()
    gw_settings = gw.settings_data if gw and gw.settings_data else {}
    
    phone_number_id = (
        payload.get("phoneNumberId") or 
        payload.get("phone_number_id") or 
        gw_settings.get("phoneNumberId") or 
        gw_settings.get("phone_number_id") or 
        settings.WHATSAPP_PHONE_NUMBER_ID
    )
    access_token = (
        payload.get("accessToken") or 
        payload.get("access_token") or 
        gw_settings.get("accessToken") or 
        gw_settings.get("access_token") or 
        settings.WHATSAPP_API_TOKEN
    )
    waba_id = (
        payload.get("wabaId") or 
        payload.get("businessAccountId") or 
        gw_settings.get("wabaId") or 
        gw_settings.get("businessAccountId") or 
        settings.WHATSAPP_BUSINESS_ACCOUNT_ID
    )
    
    if not phone_number_id or not access_token:
        raise HTTPException(
            status_code=400, 
            detail="Missing WhatsApp credentials. Please configure Phone Number ID and Meta Access Token in SuperAdmin first."
        )
        
    # Standardize phone number for India (add 91 if 10 digits)
    if len(phone) == 10:
        phone = f"91{phone}"
        
    meta_url = f"https://graph.facebook.com/v19.0/{phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    req_body = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone,
        "type": "text",
        "text": {
            "preview_url": True,
            "body": message_text
        }
    }
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(meta_url, json=req_body, headers=headers)
            res_data = resp.json()
            if resp.status_code >= 400:
                err_msg = res_data.get("error", {}).get("message", "Meta API Error")
                err_code = res_data.get("error", {}).get("code")
                formatted_err = f"Meta Error ({err_code}): {err_msg}" if err_code else err_msg
                return JSONResponse(status_code=resp.status_code, content={"success": False, "error": formatted_err, "meta_response": res_data})
            
            message_id = None
            if isinstance(res_data.get("messages"), list) and len(res_data["messages"]) > 0:
                message_id = res_data["messages"][0].get("id")

            return {
                "success": True,
                "message": f"WhatsApp test message dispatched to +{phone} successfully!",
                "message_id": message_id,
                "phone": f"+{phone}",
                "meta_response": res_data
            }
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
