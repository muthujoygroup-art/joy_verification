from backend.app.services.logger_service import record_system_error_log
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
def get_master_smtp_config(db=None) -> Dict[str, Any]:
    """Retrieves the Master Super Admin cPanel SMTP configuration with stored credentials"""
    config = {
        "host": settings.SMTP_HOST or "mail.joycorporatesolutions.com",
        "port": int(settings.SMTP_PORT or 465),
        "user": settings.SMTP_USER or "admin@joycorporatesolutions.com",
        "password": settings.SMTP_PASSWORD or "Joyson@5610",
        "use_ssl": True if int(settings.SMTP_PORT or 465) == 465 else False,
        "use_tls": True if int(settings.SMTP_PORT or 465) == 587 else False,
        "from_email": settings.EMAILS_FROM_EMAIL or "admin@joycorporatesolutions.com",
        "from_name": settings.EMAILS_FROM_NAME or "JOY Corporate Solutions BGV",
        "mode": "master_cpanel"
    }
    if db:
        try:
            from backend.app.models.system import CommunicationGateway
            master_gw = db.query(CommunicationGateway).filter(
                (CommunicationGateway.gateway_type == "email_smtp") | (CommunicationGateway.id == "gw_email_smtp"),
                CommunicationGateway.is_active == True
            ).first()
            if master_gw and master_gw.settings_data:
                sd = master_gw.settings_data
                config["host"] = sd.get("host") or config["host"]
                config["port"] = int(sd.get("port") or config["port"])
                config["user"] = sd.get("user") or config["user"]
                if sd.get("password"):
                    config["password"] = sd.get("password")
                config["from_email"] = sd.get("from_email") or config["from_email"]
                config["from_name"] = sd.get("from_name") or config["from_name"]
                config["use_ssl"] = bool(sd.get("use_ssl", config["port"] == 465))
                config["use_tls"] = bool(sd.get("use_tls", config["port"] == 587))
        except Exception as e:
            logger.warning(f"Could not load master gateway from DB: {e}")
    return config

def get_smtp_config(db=None, company_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Retrieves SMTP settings:
    1. If company_id is provided and has custom SMTP with valid password, uses custom company SMTP.
    2. Otherwise falls back to Master Super Admin cPanel SMTP (admin@joycorporatesolutions.com).
    """
    master_config = get_master_smtp_config(db)

    if db and company_id:
        try:
            from backend.app.models.system import CommunicationGateway
            from backend.app.models.company import Company

            # Step 1: Check if company has custom SMTP settings stored in Company.features
            comp_obj = db.query(Company).filter(Company.id == company_id).first()
            if comp_obj and comp_obj.features and comp_obj.features.get("smtp_settings"):
                sd = comp_obj.features["smtp_settings"]
                # Only use custom if explicitly enabled AND has password
                if sd.get("use_custom_smtp") and sd.get("password") and sd.get("host"):
                    return {
                        "host": sd.get("host") or master_config["host"],
                        "port": int(sd.get("port") or master_config["port"]),
                        "user": sd.get("user") or sd.get("username") or master_config["user"],
                        "password": sd.get("password"),
                        "from_email": sd.get("from_email") or master_config["from_email"],
                        "from_name": sd.get("from_name") or f"{comp_obj.name} - Verification Portal",
                        "use_ssl": bool(sd.get("use_ssl", int(sd.get("port", 465)) == 465)),
                        "use_tls": bool(sd.get("use_tls", int(sd.get("port", 465)) == 587)),
                        "mode": "custom_company",
                        "company_id": company_id
                    }

            comp_gw = db.query(CommunicationGateway).filter(
                CommunicationGateway.gateway_type == "email_smtp",
                CommunicationGateway.company_id == company_id,
                CommunicationGateway.is_active == True
            ).first()
            if comp_gw and comp_gw.settings_data and comp_gw.settings_data.get("use_custom_smtp") and comp_gw.settings_data.get("password"):
                sd = comp_gw.settings_data
                return {
                    "host": sd.get("host") or master_config["host"],
                    "port": int(sd.get("port") or master_config["port"]),
                    "user": sd.get("user") or master_config["user"],
                    "password": sd.get("password"),
                    "from_email": sd.get("from_email") or master_config["from_email"],
                    "from_name": sd.get("from_name") or master_config["from_name"],
                    "use_ssl": bool(sd.get("use_ssl", int(sd.get("port", 465)) == 465)),
                    "use_tls": bool(sd.get("use_tls", int(sd.get("port", 465)) == 587)),
                    "mode": "custom_company",
                    "company_id": company_id
                }
        except Exception as e:
            logger.warning(f"Could not resolve custom SMTP gateway from database: {e}")

    return master_config

def send_smtp_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
    company_id: Optional[str] = None,
    custom_config: Optional[Dict[str, Any]] = None,
    reply_to: Optional[str] = None,
    db=None
) -> Dict[str, Any]:
    """
    Core function to send an email via resolved SMTP gateway with automatic fallback to Master cPanel SMTP.
    """
    if not to_email or "@" not in to_email:
        logger.warning(f"Skipping email dispatch: invalid recipient address '{to_email}'")
        return {"success": False, "error": "Invalid recipient email"}

    if custom_config and isinstance(custom_config, dict) and custom_config.get("user") and custom_config.get("password"):
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
        if reply_to:
            msg["Reply-To"] = reply_to
        msg["Date"] = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")

        # Plaintext fallback
        if text_content:
            msg.attach(MIMEText(text_content, "plain", "utf-8"))
        else:
            msg.attach(MIMEText("Please enable HTML view to read this official notification.", "plain", "utf-8"))

        # HTML body
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        # Connection handling based on Port / SSL / TLS with cPanel SSL compatibility
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        if cfg["use_ssl"] or cfg["port"] == 465:
            with smtplib.SMTP_SSL(cfg["host"], cfg["port"], context=context, timeout=20) as server:
                server.login(cfg["user"], cfg["password"])
                server.sendmail(cfg["from_email"], [to_email], msg.as_string())
        else:
            with smtplib.SMTP(cfg["host"], cfg["port"], timeout=20) as server:
                if cfg["use_tls"] or cfg["port"] == 587:
                    server.starttls(context=context)
                server.login(cfg["user"], cfg["password"])
                server.sendmail(cfg["from_email"], [to_email], msg.as_string())

        logger.info(f"✅ [SMTP SENT - Mode: {cfg['mode']}] Dispatched to {to_email} ({subject})")
        return {"success": True, "to": to_email, "subject": subject, "mode": cfg["mode"]}

    except smtplib.SMTPAuthenticationError as auth_err:
        err_str = f"Authentication Rejected (535): Incorrect password for {cfg['user']}."
        logger.warning(f"⚠️ [SMTP AUTH ERROR - Mode: {cfg['mode']}] {err_str} Attempting Master cPanel fallback...")
        if cfg.get("mode") != "master_cpanel":
            master_cfg = get_master_smtp_config(db)
            if master_cfg.get("password") and master_cfg.get("user") != cfg.get("user"):
                return send_smtp_email(
                    to_email=to_email,
                    subject=subject,
                    html_content=html_content,
                    text_content=text_content,
                    company_id=None,
                    custom_config=master_cfg,
                    reply_to=reply_to or cfg.get("from_email"),
                    db=db
                )
        return {"success": False, "error": err_str, "to": to_email, "mode": cfg["mode"]}
    except Exception as e:
        logger.error(f"❌ [SMTP ERROR - Mode: {cfg['mode']}] Failed to send email to {to_email}: {e}")
        if cfg.get("mode") != "master_cpanel":
            master_cfg = get_master_smtp_config(db)
            if master_cfg.get("password") and master_cfg.get("user") != cfg.get("user"):
                logger.warning(f"⚠️ Retrying dispatch via Master cPanel SMTP...")
                return send_smtp_email(
                    to_email=to_email,
                    subject=subject,
                    html_content=html_content,
                    text_content=text_content,
                    company_id=None,
                    custom_config=master_cfg,
                    reply_to=reply_to or cfg.get("from_email"),
                    db=db
                )
        record_system_error_log(
            section="Email Gateway",
            error_code="ERR_SMTP_DISPATCH",
            message=f"Failed to send email to {to_email} via {cfg.get('host')}:{cfg.get('port')}: {str(e)}",
            severity="Warning",
            db=db
        )
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
    temporary_password: str = "Company@Admin2026",
    activation_pin: str = "1234",
    activation_token: Optional[str] = None,
    expires_at_str: Optional[str] = None,
    plan_name: Optional[str] = "Standard Tier",
    credits: Optional[int] = 500,
    db=None
) -> Dict[str, Any]:
    app_url = settings.APP_BASE_URL.rstrip('/')
    activation_url = f"{app_url}/company-activation?token={activation_token}" if activation_token else f"{app_url}/login"

    content = f"""
    <div style="margin-bottom: 24px;">
        <h2 style="color: #0f172a; font-size: 18px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: -0.3px;">
            Welcome to JOY Corporate Solutions, {contact_person}!
        </h2>
        <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.6;">
            We are pleased to inform you that your enterprise organization account for <strong>{company_name}</strong> has been officially provisioned on the <strong>JOY Background Verification Platform</strong>.
        </p>
    </div>

    <!-- Instructions Box -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 22px;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #4338ca; margin-bottom: 12px; letter-spacing: 0.5px;">
            📋 Easy 3-Step Organization Activation Instructions:
        </div>
        <ol style="margin: 0; padding-left: 20px; font-size: 12.5px; color: #334155; line-height: 1.8;">
            <li>Click the <strong>Complete Company Portal Activation</strong> button below.</li>
            <li>Enter your <strong>4-digit Security Unlock PIN</strong> (shown below) to unlock your portal.</li>
            <li>Review pre-filled details, upload statutory proofs (COI, GSTIN, PAN), and accept the <strong>DPDP Act 2023 Master Services Agreement</strong>.</li>
        </ol>
    </div>

    <!-- Credentials & PIN Box -->
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #a7f3d0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #047857; margin-bottom: 12px; letter-spacing: 0.5px;">
            🔐 Your Organization Access Dossier:
        </div>
        <table width="100%" border="0" cellspacing="6" cellpadding="0" style="font-size: 12.5px;">
            <tr>
                <td width="42%" style="color: #64748b; font-weight: 600;">Company Legal Name:</td>
                <td style="color: #0f172a; font-weight: 800;">{company_name}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Assigned Company Code:</td>
                <td style="color: #4338ca; font-weight: 800; font-family: monospace; font-size: 13px;">#{company_code}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Admin Login Username:</td>
                <td style="color: #0f172a; font-weight: 800; font-family: monospace;">{admin_email}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Commercial Plan:</td>
                <td style="color: #0f172a; font-weight: 800;">{plan_name} ({credits} Checks Allocated)</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Activation Link Security PIN:</td>
                <td>
                    <span style="background-color: #4338ca; color: #ffffff; padding: 4px 12px; border-radius: 8px; font-weight: 900; font-family: monospace; font-size: 15px; letter-spacing: 2px; display: inline-block;">
                        {activation_pin}
                    </span>
                </td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Activation Link Valid Until:</td>
                <td style="color: #b45309; font-weight: 700;">{expires_at_str or '15 Days from Issue'}</td>
            </tr>
        </table>
    </div>

    <!-- Fallback Direct Link -->
    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-top: 20px; font-size: 11px; color: #64748b;">
        <span style="font-weight: bold; color: #334155; display: block; margin-bottom: 4px;">Direct Activation URL:</span>
        <a href="{activation_url}" style="color: #4338ca; word-break: break-all; text-decoration: underline;">{activation_url}</a>
    </div>

    <p style="font-size: 11.5px; color: #64748b; margin-top: 18px; line-height: 1.5;">
        🛡️ <em>Security Advisory: This official onboarding email contains confidential enterprise credentials. Do not forward this link to unauthorized personnel.</em>
    </p>
    """

    html = _build_email_shell(
        header_title=f"Welcome to JOY - Activate {company_name}",
        badge_text="ORGANIZATION ONBOARDING & ACTIVATION",
        content_html=content,
        action_url=activation_url,
        action_text="Complete Company Portal Activation 🚀"
    )

    subject = f"🏢 Welcome to JOY - Activate Your Organization Account ({company_name} - #{company_code})"
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
# =============================================================================
# 2. 👔 HR RECRUITER SELF-ONBOARDING & ACTIVATION EMAILS
# =============================================================================
def send_hr_invitation_email(
    hr_name: str,
    hr_code: str,
    hr_email: str,
    activation_token: str,
    activation_pin: str,
    company_name: str,
    company_id: Optional[str] = None,
    department: str = "Human Resources",
    designation: str = "HR Recruiter",
    db = None
) -> Dict[str, Any]:
    """
    Dispatches self-activation invitation email to newly invited HR Recruiter with security PIN.
    """
    app_url = settings.APP_BASE_URL.rstrip('/')
    activation_url = f"{app_url}/hr-activation?token={activation_token}"

    content = f"""
    <h2 style="color: #0f172a; font-size: 17px; font-weight: 800; margin-top: 0; line-height: 1.4;">
        Welcome {hr_name}! Complete Your HR Profile for {company_name}
    </h2>
    <p style="font-size: 13px; color: #475569; line-height: 1.6;">
        You have been invited by <strong>{company_name}</strong> to join the Background Verification & Candidate Onboarding workstation as <strong>{designation}</strong> in <strong>{department}</strong>.
    </p>

    <!-- 4-Digit Security PIN Box -->
    <div style="background-color: #f8fafc; border: 2px dashed #6366f1; border-radius: 14px; padding: 18px; margin: 20px 0; text-align: center;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #4f46e5; letter-spacing: 0.5px; margin-bottom: 6px;">
            🔐 Your 4-Digit Security Unlock PIN:
        </div>
        <div style="font-size: 32px; font-family: 'Courier New', monospace; font-weight: 900; color: #1e1b4b; letter-spacing: 6px; margin: 6px 0;">
            {activation_pin}
        </div>
        <div style="font-size: 11.5px; color: #64748b;">
            Enter this 4-digit PIN when opening your personal onboarding link below.
        </div>
    </div>

    <!-- Onboarding Step Guide -->
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 12.5px; color: #166534;">
        <strong>📋 4 Quick Steps in Self-Activation:</strong>
        <ol style="margin: 6px 0 0 16px; padding: 0; line-height: 1.6;">
            <li>Enter your 4-digit security PIN to unlock the wizard.</li>
            <li>Fill your personal contact & permanent address details.</li>
            <li>Enter your educational background and upload ID proof.</li>
            <li>Review and digitally accept the HR Confidentiality & DPDP Consent.</li>
        </ol>
    </div>

    <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        This activation link is confidential and restricted for your authorized email (<code>{hr_email}</code>).
    </p>
    """

    html = _build_email_shell(
        header_title=f"HR Recruiter Onboarding - {company_name}",
        badge_text="HR RECRUITER INVITATION",
        content_html=content,
        action_url=activation_url,
        action_text="Complete HR Self-Activation →",
        sender_brand=company_name
    )

    subject = f"👔 Complete Your HR Profile - {company_name} (#{hr_code})"
    return send_smtp_email(hr_email, subject, html, company_id=company_id, db=db)


def send_hr_approval_email(
    hr_name: str,
    hr_code: str,
    hr_email: str,
    company_name: str,
    company_id: Optional[str] = None,
    login_password: str = "Hr@Recruiter2026",
    db = None
) -> Dict[str, Any]:
    """
    Dispatches confirmation email to HR Recruiter once approved by Company Admin,
    including login credentials and a comprehensive Quick Start Software Guide.
    """
    app_url = settings.APP_BASE_URL.rstrip('/')
    login_url = f"{app_url}/login"

    content = f"""
    <h2 style="color: #0f172a; font-size: 18px; font-weight: 900; margin: 0 0 10px 0; line-height: 1.4;">
        🎉 Congratulations {hr_name}! Your HR Recruiter Account is Approved!
    </h2>
    <p style="font-size: 13px; color: #475569; line-height: 1.6;">
        Your recruiter profile for <strong>{company_name}</strong> (Staff Code: <strong>#{hr_code}</strong>) has been officially reviewed, verified, and activated by your Company Administrator.
    </p>

    <!-- Credentials Box -->
    <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 11px; font-weight: 800; color: #15803d; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
            ✅ HR Workstation Login Credentials:
        </div>
        <table width="100%" border="0" cellspacing="5" cellpadding="0" style="font-size: 12.5px;">
            <tr>
                <td width="38%" style="color: #64748b; font-weight: 600;">Workstation Portal:</td>
                <td style="color: #4338ca; font-weight: 800;">HR Recruiter Workstation</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Official Login Email:</td>
                <td style="color: #0f172a; font-family: monospace; font-weight: 800;">{hr_email}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Recruiter Staff ID:</td>
                <td style="color: #0f172a; font-family: monospace; font-weight: 800;">#{hr_code}</td>
            </tr>
            <tr>
                <td style="color: #64748b; font-weight: 600;">Employer Organization:</td>
                <td style="color: #0f172a; font-weight: 800;">{company_name}</td>
            </tr>
        </table>
    </div>

    <!-- Quick Start Software Guide -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #4338ca; margin-bottom: 10px; letter-spacing: 0.5px;">
            📘 HR Recruiter Quick Start Guide & Features:
        </div>
        <ol style="margin: 0; padding-left: 18px; font-size: 12.5px; color: #334155; line-height: 1.8;">
            <li><strong>Initiate Candidate Verification:</strong> Click <em>"+ Send Verification Link"</em> to invite candidates with automated 4-digit PIN security.</li>
            <li><strong>Live Identity Checks:</strong> Audit real-time Aadhaar OTP e-KYC, PAN card verification, and EPFO employment service records.</li>
            <li><strong>Statutory Forms & Signatures:</strong> Review specimen digital signatures, EPFO Form 11, and ESIC Form 1 submissions.</li>
            <li><strong>Export 360° BGV Dossiers:</strong> Generate instant Background Verification Certificates and complete candidate audit reports.</li>
        </ol>
    </div>

    <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        🛡️ <em>All candidate records are protected under the Digital Personal Data Protection (DPDP) Act 2023. Keep your workstation login credentials confidential.</em>
    </p>
    """

    html = _build_email_shell(
        header_title=f"HR Recruiter Approved - {company_name}",
        badge_text="ACCOUNT ACTIVATED & VERIFIED",
        content_html=content,
        action_url=login_url,
        action_text="Open HR Recruiter Portal →",
        sender_brand=company_name
    )

    subject = f"🎉 HR Account Approved & Active - {company_name} (#{hr_code})"
    return send_smtp_email(hr_email, subject, html, company_id=company_id, db=db)


def send_candidate_onboarding_email(
    candidate_name: str,
    candidate_code: str,
    candidate_email: str,
    token: str,
    security_pin: str,
    company_name: str,
    company_id: Optional[str] = None,
    designation: str = "Associate",
    sender_hr_name: Optional[str] = None,
    sender_hr_email: Optional[str] = None,
    custom_smtp: Optional[Dict[str, Any]] = None,
    db=None
) -> Dict[str, Any]:
    app_url = settings.APP_BASE_URL.rstrip('/')
    verify_url = f"{app_url}/verify?token={token}"

    hr_badge_html = ""
    if sender_hr_name or sender_hr_email:
        hr_info = f"<strong>{sender_hr_name}</strong>" if sender_hr_name else "HR Executive"
        if sender_hr_email:
            hr_info += f" (<a href='mailto:{sender_hr_email}' style='color: #4f46e5; text-decoration: underline;'>{sender_hr_email}</a>)"
        hr_badge_html = f"""
        <div style="background-color: #f1f5f9; border-left: 4px solid #4f46e5; border-radius: 8px; padding: 10px 14px; font-size: 11px; color: #334155; margin-bottom: 16px;">
            👤 <strong>Issued & Dispatched by HR:</strong> {hr_info}<br>
            🏢 <strong>Organization:</strong> {company_name}
        </div>
        """

    content = f"""
    <h2 style="color: #0f172a; font-size: 16px; font-weight: 800; margin-top: 0;">
        Dear {candidate_name},
    </h2>
    <p>
        Congratulations on your selection for the role of <strong>{designation}</strong> at <strong>{company_name}</strong>!
    </p>
    {hr_badge_html}
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

    sender_brand = f"{sender_hr_name} via {company_name}" if sender_hr_name else company_name

    html = _build_email_shell(
        header_title=f"Onboarding Verification - {company_name}",
        badge_text="EMPLOYEE ONBOARDING INVITATION",
        content_html=content,
        action_url=verify_url,
        action_text="Start Verification & Complete Forms",
        sender_brand=sender_brand
    )

    subject = f"📱 Onboarding Verification Link - {company_name} ({candidate_name})"
    return send_smtp_email(
        to_email=candidate_email,
        subject=subject,
        html_content=html,
        company_id=company_id,
        custom_config=custom_smtp,
        reply_to=sender_hr_email,
        db=db
    )


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
