import os
import smtplib
import logging
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from typing import Optional, Dict, Any

from backend.app.config import settings

logger = logging.getLogger("joy_email_service")
logging.basicConfig(level=logging.INFO)

# =============================================================================
# 🏢 TENANT-AWARE SMTP CONFIGURATION RESOLVER
# =============================================================================
def get_smtp_config(db=None, company_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Retrieves SMTP settings:
    1. If company_id is provided, looks for custom company SMTP gateway.
    2. Falls back to Master Super Admin cPanel SMTP (admin@joycorporatesolutions.com).
    3. Falls back to environment settings.
    """
    # 👑 Master Super Admin cPanel Defaults
    config = {
        "host": settings.SMTP_HOST or "mail.joycorporatesolutions.com",
        "port": int(settings.SMTP_PORT or 465),
        "user": settings.SMTP_USER or "admin@joycorporatesolutions.com",
        "password": settings.SMTP_PASSWORD or "",
        "use_ssl": True if int(settings.SMTP_PORT or 465) == 465 else False,
        "use_tls": True if int(settings.SMTP_PORT or 465) == 587 else False,
        "from_email": settings.EMAILS_FROM_EMAIL or "admin@joycorporatesolutions.com",
        "from_name": settings.EMAILS_FROM_NAME or "JOY Corporate Solutions BGV",
        "mode": "master_cpanel" # 'master_cpanel' | 'custom_company'
    }

    if db:
        try:
            from backend.app.models.system import CommunicationGateway
            
            # Step 1: Check if company has a dedicated custom SMTP gateway configured
            if company_id:
                comp_gw = db.query(CommunicationGateway).filter(
                    CommunicationGateway.gateway_type == "email_smtp",
                    CommunicationGateway.company_id == company_id,
                    CommunicationGateway.is_active == True
                ).first()
                if comp_gw and comp_gw.settings_data and comp_gw.settings_data.get("use_custom_smtp"):
                    sd = comp_gw.settings_data
                    return {
                        "host": sd.get("host") or config["host"],
                        "port": int(sd.get("port") or config["port"]),
                        "user": sd.get("user") or config["user"],
                        "password": sd.get("password") or config["password"],
                        "from_email": sd.get("from_email") or config["from_email"],
                        "from_name": sd.get("from_name") or config["from_name"],
                        "use_ssl": bool(sd.get("use_ssl", int(sd.get("port", 465)) == 465)),
                        "use_tls": bool(sd.get("use_tls", int(sd.get("port", 465)) == 587)),
                        "mode": "custom_company",
                        "company_id": company_id
                    }

            # Step 2: Check Master Super Admin cPanel SMTP Gateway
            master_gw = db.query(CommunicationGateway).filter(
                (CommunicationGateway.gateway_type == "email_smtp") | (CommunicationGateway.id == "gw_email_smtp"),
                CommunicationGateway.is_active == True
            ).first()
            if master_gw and master_gw.settings_data:
                sd = master_gw.settings_data
                config["host"] = sd.get("host") or config["host"]
                config["port"] = int(sd.get("port") or config["port"])
                config["user"] = sd.get("user") or config["user"]
                config["password"] = sd.get("password") or config["password"]
                config["from_email"] = sd.get("from_email") or config["from_email"]
                config["from_name"] = sd.get("from_name") or config["from_name"]
                config["use_ssl"] = bool(sd.get("use_ssl", config["port"] == 465))
                config["use_tls"] = bool(sd.get("use_tls", config["port"] == 587))
        except Exception as e:
            logger.warning(f"Could not resolve custom SMTP gateway from database: {e}")

    return config

def send_smtp_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
    company_id: Optional[str] = None,
    custom_config: Optional[Dict[str, Any]] = None,
    db=None
) -> Dict[str, Any]:
    """
    Core function to send an email via resolved SMTP gateway (Master cPanel or Company Custom).
    """
    if not to_email or "@" not in to_email:
        logger.warning(f"Skipping email dispatch: invalid recipient address '{to_email}'")
        return {"success": False, "error": "Invalid recipient email"}

    if custom_config and isinstance(custom_config, dict) and custom_config.get("user"):
        cfg = {
            "host": custom_config.get("host") or "mail.joycorporatesolutions.com",
            "port": int(custom_config.get("port") or 465),
            "user": custom_config.get("user") or "admin@joycorporatesolutions.com",
            "password": custom_config.get("password") or "",
            "use_ssl": bool(custom_config.get("use_ssl", int(custom_config.get("port") or 465) == 465)),
            "use_tls": bool(custom_config.get("use_tls", int(custom_config.get("port") or 465) == 587)),
            "from_email": custom_config.get("from_email") or custom_config.get("user") or "admin@joycorporatesolutions.com",
            "from_name": custom_config.get("from_name") or "JOY Corporate Solutions BGV",
            "mode": "runtime_override"
        }
    else:
        cfg = get_smtp_config(db, company_id=company_id)
    
    # If no SMTP password configured, log simulation mode
    if not cfg["password"]:
        logger.info(f"📧 [SMTP SIMULATION - Mode: {cfg['mode']}] To: {to_email} | Subject: {subject}")
        return {
            "success": True,
            "simulated": True,
            "mode": cfg["mode"],
            "message": "Email logged in simulation mode (Configure SMTP password in Settings to dispatch live)",
            "to": to_email,
            "subject": subject
        }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{cfg['from_name']} <{cfg['from_email']}>"
        msg["To"] = to_email
        msg["Date"] = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")

        # Plaintext fallback
        if text_content:
            msg.attach(MIMEText(text_content, "plain", "utf-8"))
        else:
            msg.attach(MIMEText("Please enable HTML view to read this official notification.", "plain", "utf-8"))

        # HTML body
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        # Connection handling based on Port / SSL / TLS
        if cfg["use_ssl"] or cfg["port"] == 465:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(cfg["host"], cfg["port"], context=context, timeout=15) as server:
                server.login(cfg["user"], cfg["password"])
                server.sendmail(cfg["from_email"], [to_email], msg.as_string())
        else:
            with smtplib.SMTP(cfg["host"], cfg["port"], timeout=15) as server:
                if cfg["use_tls"] or cfg["port"] == 587:
                    context = ssl.create_default_context()
                    server.starttls(context=context)
                server.login(cfg["user"], cfg["password"])
                server.sendmail(cfg["from_email"], [to_email], msg.as_string())

        logger.info(f"✅ [SMTP SENT - Mode: {cfg['mode']}] Dispatched to {to_email} ({subject})")
        return {"success": True, "to": to_email, "subject": subject, "mode": cfg["mode"]}

    except smtplib.SMTPAuthenticationError as auth_err:
        err_str = f"Authentication Rejected (535): Incorrect password for {cfg['user']}. Please check your cPanel webmail password and save settings."
        logger.error(f"❌ [SMTP AUTH ERROR - Mode: {cfg['mode']}] {err_str}")
        return {"success": False, "error": err_str, "to": to_email, "mode": cfg["mode"]}
    except Exception as e:
        logger.error(f"❌ [SMTP ERROR - Mode: {cfg['mode']}] Failed to send email to {to_email}: {e}")
        return {"success": False, "error": str(e), "to": to_email, "mode": cfg["mode"]}


# =============================================================================
# 🎨 BASE HTML TEMPLATE GENERATOR
# =============================================================================
def _build_email_shell(
    header_title: str, 
    badge_text: str, 
    content_html: str, 
    action_url: str = None, 
    action_text: str = None,
    sender_brand: str = "JOY CORPORATE SOLUTIONS"
) -> str:
    action_button_html = ""
    if action_url and action_text:
        action_button_html = f"""
        <div style="text-align: center; margin: 30px 0 20px 0;">
            <a href="{action_url}" style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(67, 56, 202, 0.25);">
                {action_text} &rarr;
            </a>
        </div>
        """

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{header_title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
            <tr>
                <td align="center">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                        
                        <!-- Top Header Strip -->
                        <tr>
                            <td style="background-color: #0f172a; padding: 24px 30px; border-bottom: 3px solid #4338ca;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td>
                                            <div style="color: #a5b4fc; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
                                                {badge_text}
                                            </div>
                                            <h1 style="color: #ffffff; font-size: 18px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">
                                                {sender_brand.upper()}
                                            </h1>
                                            <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">
                                                Enterprise Background Verification & Statutory Compliance
                                            </div>
                                        </td>
                                        <td align="right">
                                            <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 6px 12px; color: #34d399; font-size: 11px; font-weight: 800; font-family: monospace;">
                                                ISO 27001 ✓
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Email Main Body -->
                        <tr>
                            <td style="padding: 30px 30px 20px 30px; font-size: 13px; line-height: 1.6; color: #334155;">
                                {content_html}
                                {action_button_html}
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; line-height: 1.5;">
                                <p style="margin: 0 0 4px 0; font-weight: 600; color: #475569;">
                                    JOY CORPORATE SOLUTIONS PRIVATE LIMITED &bull; Master Email: admin@joycorporatesolutions.com
                                </p>
                                <p style="margin: 0 0 8px 0; font-size: 10px;">
                                    CIN: U74999KA2026PTC192841 &bull; Direct Government Gateway Authorized Partner
                                </p>
                                <p style="margin: 0; font-size: 9.5px; color: #94a3b8;">
                                    This is an automated statutory notification sent under DPDP Act 2023. Please do not reply directly to this email.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


# =============================================================================
# 1. 🏢 COMPANY CREATION WELCOME EMAIL (Super Admin -> Company Admin)
# =============================================================================
def send_company_welcome_email(
    company_name: str,
    company_code: str,
    admin_email: str,
    contact_person: str,
    temporary_password: str = "Admin@123",
    activation_token: Optional[str] = None,
    expires_at_str: Optional[str] = None,
    db=None
) -> Dict[str, Any]:
    app_url = settings.APP_BASE_URL.rstrip('/')
    activation_url = f"{app_url}/company-activation?token={activation_token}" if activation_token else f"{app_url}/login"

    content = f"""
    <h2 style="color: #0f172a; font-size: 16px; font-weight: 800; margin-top: 0;">
        Welcome to JOY Corporate Solutions, {contact_person}!
    </h2>
    <p>
        Your enterprise organization <strong>{company_name}</strong> has been provisioned on the JOY Background Verification & Statutory Labor Compliance Gateway.
    </p>
    <p>
        Please complete your remaining corporate onboarding (CIN, GSTIN, Company PAN, and COI document uploads) using your secure activation link below.
    </p>

    <!-- Credentials Box -->
    <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #4338ca; margin-bottom: 10px;">
            🔐 Organization Activation Access:
        </div>
        <table width="100%" border="0" cellspacing="4" cellpadding="0" style="font-size: 12px;">
            <tr>
                <td width="40%" style="color: #64748b; font-weight: 600;">Company Code / ID:</td>
                <td style="color: #0f172a; font-weight: 800; font-family: monospace; font-size: 13px;">{company_code}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Admin Login Email:</td>
                <td style="color: #0f172a; font-weight: 800; font-family: monospace;">{admin_email}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Admin Login Password:</td>
                <td style="color: #0f172a; font-weight: 800; font-family: monospace;">{temporary_password}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Activation Unlock PIN:</td>
                <td style="color: #4338ca; font-weight: 900; font-family: monospace; font-size: 16px; letter-spacing: 1px;">{temporary_password}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Activation Link Valid Until:</td>
                <td style="color: #b45309; font-weight: 700;">{expires_at_str or '15 Days from Issue'}</td>
            </tr>
        </table>
    </div>

    <p style="font-size: 12px; color: #475569;">
        Once activated, you can immediately create HR recruiter logins, configure customized statutory verification checks (Aadhaar, PAN, EPFO UAN, ESIC), and inspect live 360&deg; candidate dossiers.
    </p>
    """

    html = _build_email_shell(
        header_title=f"Activate {company_name} - JOY Corporate Solutions",
        badge_text="ORGANIZATION ONBOARDING INVITATION",
        content_html=content,
        action_url=activation_url,
        action_text="Complete Company Portal Activation"
    )

    subject = f"🏢 Organization Portal Activation - {company_name} ({company_code})"
    return send_smtp_email(admin_email, subject, html, db=db)


# =============================================================================
# 2. 👔 HR EXECUTIVE APPOINTMENT EMAIL (Company Admin -> HR Recruiter)
# =============================================================================
def send_hr_welcome_email(
    hr_name: str,
    hr_code: str,
    hr_email: str,
    company_name: str,
    company_id: Optional[str] = None,
    temporary_password: str = "Hr@123",
    db=None
) -> Dict[str, Any]:
    app_url = settings.APP_BASE_URL.rstrip('/')
    login_url = f"{app_url}/login"

    content = f"""
    <h2 style="color: #0f172a; font-size: 16px; font-weight: 800; margin-top: 0;">
        Hello {hr_name}, your HR Workstation is Ready!
    </h2>
    <p>
        You have been appointed as an authorized HR Recruitment Executive for <strong>{company_name}</strong> on the JOY Background Verification Platform.
    </p>

    <!-- Credentials Box -->
    <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #15803d; margin-bottom: 10px;">
            👔 HR Executive Workstation Login:
        </div>
        <table width="100%" border="0" cellspacing="4" cellpadding="0" style="font-size: 12px;">
            <tr>
                <td width="35%" style="color: #64748b; font-weight: 600;">HR Profile ID:</td>
                <td style="color: #0f172a; font-weight: 800; font-family: monospace; font-size: 13px;">{hr_code}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Employer Company:</td>
                <td style="color: #0f172a; font-weight: 800;">{company_name}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Official Login Email:</td>
                <td style="color: #0f172a; font-weight: 800; font-family: monospace;">{hr_email}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Workstation Password:</td>
                <td style="color: #15803d; font-weight: 800; font-family: monospace; font-size: 13px;">{temporary_password}</td>
            </tr>
        </table>
    </div>

    <p style="font-size: 12px; color: #475569;">
        You can now generate candidate onboarding links, audit live Aadhaar/PAN/EPFO records, review specimen signatures, and export 360&deg; BGV Dossiers.
    </p>
    """

    html = _build_email_shell(
        header_title=f"HR Workstation Login - {company_name}",
        badge_text="HR RECRUITER APPOINTMENT",
        content_html=content,
        action_url=login_url,
        action_text="Open HR Workstation",
        sender_brand=company_name
    )

    subject = f"👔 HR Recruiter Credentials - {company_name} ({hr_code})"
    return send_smtp_email(hr_email, subject, html, company_id=company_id, db=db)


# =============================================================================
# 3. 📱 CANDIDATE ONBOARDING INVITATION (HR Recruiter -> Candidate)
# =============================================================================
def send_candidate_onboarding_email(
    candidate_name: str,
    candidate_code: str,
    candidate_email: str,
    token: str,
    security_pin: str,
    company_name: str,
    company_id: Optional[str] = None,
    designation: str = "Associate",
    db=None
) -> Dict[str, Any]:
    app_url = settings.APP_BASE_URL.rstrip('/')
    verify_url = f"{app_url}/verify?token={token}"

    content = f"""
    <h2 style="color: #0f172a; font-size: 16px; font-weight: 800; margin-top: 0;">
        Dear {candidate_name},
    </h2>
    <p>
        Congratulations on your selection for the role of <strong>{designation}</strong> at <strong>{company_name}</strong>!
    </p>
    <p>
        As part of the statutory onboarding protocol, please complete your digital identity verification and statutory form disclosures (EPFO / ESIC) through the secure link below.
    </p>

    <!-- Onboarding Credentials Box -->
    <div style="background-color: #f5f3ff; border: 2px dashed #c4b5fd; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #5b21b6; margin-bottom: 10px;">
            🔐 Secure Verification Access Code:
        </div>
        <table width="100%" border="0" cellspacing="4" cellpadding="0" style="font-size: 12px;">
            <tr>
                <td width="40%" style="color: #64748b; font-weight: 600;">Employee ID / Code:</td>
                <td style="color: #0f172a; font-weight: 800; font-family: monospace; font-size: 13px;">{candidate_code}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">4-Digit Security PIN:</td>
                <td style="color: #5b21b6; font-weight: 900; font-family: monospace; font-size: 18px; letter-spacing: 2px;">{security_pin}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Session Window:</td>
                <td style="color: #b45309; font-weight: 800;">15 Minutes (DPDP Act Protected)</td>
            </tr>
        </table>
    </div>

    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 12px; font-size: 11px; color: #92400e; margin-bottom: 15px;">
        💡 <strong>Please keep ready:</strong> Aadhaar Registered Mobile (for OTP), PAN Card, Bank Account Details, and Previous PF/UAN Number.
    </div>
    """

    html = _build_email_shell(
        header_title=f"Onboarding Verification - {company_name}",
        badge_text="EMPLOYEE ONBOARDING INVITATION",
        content_html=content,
        action_url=verify_url,
        action_text="Start Verification & Complete Forms",
        sender_brand=company_name
    )

    subject = f"📱 Onboarding Verification Link - {company_name} ({candidate_name})"
    return send_smtp_email(candidate_email, subject, html, company_id=company_id, db=db)


# =============================================================================
# 4. ✅ BGV VERIFICATION CERTIFIED NOTICE (To Candidate, HR & Company)
# =============================================================================
def send_candidate_verification_completed_email(
    candidate_name: str,
    candidate_code: str,
    candidate_email: str,
    hr_email: str,
    company_name: str,
    company_id: Optional[str] = None,
    score: str = "99.6",
    db=None
) -> Dict[str, Any]:
    app_url = settings.APP_BASE_URL.rstrip('/')

    content = f"""
    <h2 style="color: #0f172a; font-size: 16px; font-weight: 800; margin-top: 0;">
        Verification Certified: 100% Passed ✓
    </h2>
    <p>
        The comprehensive 360&deg; background verification for <strong>{candidate_name}</strong> ({candidate_code}) under <strong>{company_name}</strong> has been successfully completed and certified.
    </p>

    <!-- Score Box -->
    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 2px solid #6ee7b7; border-radius: 14px; padding: 18px; text-align: center; margin: 20px 0;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #065f46; letter-spacing: 1px;">
            COMPLIANCE VERIFICATION SCORE
        </div>
        <div style="font-size: 28px; font-weight: 900; color: #047857; margin: 4px 0;">
            {score} / 100
        </div>
        <div style="font-size: 11px; font-weight: 700; color: #065f46;">
            10+ Gateways Audited &bull; EPFO Anti-Moonlighting Cleared &bull; DPDP Act Stamped
        </div>
    </div>

    <p style="font-size: 12px; color: #475569;">
        The Master 360&deg; BGV Dossier, EPFO Form 11, Form 2, ESIC Form 1, and attached KYC exhibits are permanently bound into the digital vault.
    </p>
    """

    html = _build_email_shell(
        header_title=f"BGV Certified - {candidate_name}",
        badge_text="AUDIT CERTIFICATION NOTICE",
        content_html=content,
        action_url=f"{app_url}/hr",
        action_text="View Certified Profile Dossier",
        sender_brand=company_name
    )

    subject = f"✅ BGV Certified (Score: {score}/100) - {candidate_name} ({candidate_code})"
    res1 = send_smtp_email(candidate_email, subject, html, company_id=company_id, db=db)
    
    if hr_email and hr_email != candidate_email:
        send_smtp_email(hr_email, f"✅ [HR Alert] {candidate_name} Onboarding Verification Complete", html, company_id=company_id, db=db)

    return res1


# =============================================================================
# 5. 🔄 HR CORRECTION REQUEST (HR -> Candidate)
# =============================================================================
def send_candidate_correction_email(
    candidate_name: str,
    candidate_email: str,
    token: str,
    correction_notes: str,
    company_name: str,
    company_id: Optional[str] = None,
    db=None
) -> Dict[str, Any]:
    app_url = settings.APP_BASE_URL.rstrip('/')
    verify_url = f"{app_url}/verify?token={token}"

    content = f"""
    <h2 style="color: #0f172a; font-size: 16px; font-weight: 800; margin-top: 0;">
        Action Required: Information Correction for {company_name}
    </h2>
    <p>
        Dear {candidate_name}, the HR recruitment team has reviewed your onboarding submission and requested a quick update or re-upload.
    </p>

    <!-- Correction Box -->
    <div style="background-color: #fff1f2; border: 2px dashed #fca5a5; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #9f1239; margin-bottom: 8px;">
            📝 HR Review Notes:
        </div>
        <div style="font-size: 13px; font-weight: 600; color: #881337; line-height: 1.5; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #fecdd3;">
            "{correction_notes}"
        </div>
    </div>

    <p style="font-size: 12px; color: #475569;">
        Please click the link below to open your verification portal, make the requested adjustments, and resubmit.
    </p>
    """

    html = _build_email_shell(
        header_title=f"Correction Requested - {company_name}",
        badge_text="HR CORRECTION REQUEST",
        content_html=content,
        action_url=verify_url,
        action_text="Update & Resubmit Verification",
        sender_brand=company_name
    )

    subject = f"🔄 Action Required: Information Correction Request - {company_name}"
    return send_smtp_email(candidate_email, subject, html, company_id=company_id, db=db)


# =============================================================================
# 6. 🚨 COMPANY RED-FLAG / DISCREPANCY ALERT (System -> Company Admin / HR)
# =============================================================================
def send_company_discrepancy_alert(
    company_name: str,
    admin_email: str,
    candidate_name: str,
    candidate_code: str,
    discrepancy_type: str,
    details: str,
    company_id: Optional[str] = None,
    db=None
) -> Dict[str, Any]:
    app_url = settings.APP_BASE_URL.rstrip('/')

    content = f"""
    <h2 style="color: #991b1b; font-size: 16px; font-weight: 800; margin-top: 0;">
        ⚠️ Urgent: Background Discrepancy Flagged
    </h2>
    <p>
        The automated compliance scanner has detected a potential discrepancy for <strong>{candidate_name}</strong> ({candidate_code}) under <strong>{company_name}</strong>.
    </p>

    <!-- Discrepancy Box -->
    <div style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #b91c1c; margin-bottom: 8px;">
            🚨 Discrepancy Classification: {discrepancy_type}
        </div>
        <div style="font-size: 12px; color: #7f1d1d; line-height: 1.5;">
            {details}
        </div>
    </div>

    <p style="font-size: 12px; color: #475569;">
        Please review the candidate's 360&deg; Multi-API Dossier in your Company Admin portal for manual adjudication.
    </p>
    """

    html = _build_email_shell(
        header_title=f"Discrepancy Alert - {candidate_name}",
        badge_text="COMPLIANCE SECURITY ALERT",
        content_html=content,
        action_url=f"{app_url}/company",
        action_text="Review Candidate Profile",
        sender_brand=company_name
    )

    subject = f"🚨 [Compliance Alert] Discrepancy Flagged for {candidate_name} ({candidate_code})"
    return send_smtp_email(admin_email, subject, html, company_id=company_id, db=db)
