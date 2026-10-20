import base64
import json
import logging
import re
import requests
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.models.system import CommunicationGateway, DltSmsTemplate

logger = logging.getLogger("airtel_iq_sms")

# Default DLT Approved Templates as registered with Airtel DLT (Header: JYCORP)
DEFAULT_DLT_TEMPLATES = [
    {
        "id": "tpl-jtp-2fa-otp",
        "template_name": "JTP_MANDATORY_2FA_LOGIN_OTP",
        "dlt_template_id": "",
        "header": "JYCORP",
        "message_type": "SERVICE_IMPLICIT",
        "category": "OTP",
        "template_content": "Dear {#alphanumeric#}, your One-Time Password for secure login is {#numeric#}. Valid for 10 minutes. Do not share this with anyone. - JOY TRUE PROFILE",
        "variables": ["name", "otp"],
        "cta_url": None,
        "cta_id": None,
        "is_active": True
    },
    {
        "id": "tpl-jtp-verify-mobile",
        "template_name": "JTP_VERIFY_MOBILE_OTP",
        "dlt_template_id": "",
        "header": "JYCORP",
        "message_type": "SERVICE_IMPLICIT",
        "category": "OTP",
        "template_content": "Dear {#alphanumeric#}, your mobile verification code is {#numeric#}. Valid for 10 minutes. Enter this code to verify your phone number. - JOY TRUE PROFILE",
        "variables": ["name", "otp"],
        "cta_url": None,
        "cta_id": None,
        "is_active": True
    },
    {
        "id": "tpl-jtp-pass-reset",
        "template_name": "JTP_PASSWORD_RESET_PASSCODE",
        "dlt_template_id": "",
        "header": "JYCORP",
        "message_type": "SERVICE_IMPLICIT",
        "category": "Security",
        "template_content": "Dear {#alphanumeric#}, your password reset passcode is {#numeric#}. Valid for 10 minutes. If you did not request this, please contact support immediately. - JOY TRUE PROFILE",
        "variables": ["name", "passcode"],
        "cta_url": None,
        "cta_id": None,
        "is_active": True
    },
    {
        "id": "tpl-jtp-esign-otp",
        "template_name": "JTP_CANDIDATE_ESIGN_OTP",
        "dlt_template_id": "",
        "header": "JYCORP",
        "message_type": "SERVICE_IMPLICIT",
        "category": "e-Sign",
        "template_content": "Dear {#alphanumeric#}, your OTP for e-signing your digital verification consent is {#numeric#}. Valid for 10 minutes. - JOY TRUE PROFILE",
        "variables": ["name", "otp"],
        "cta_url": None,
        "cta_id": None,
        "is_active": True
    },
    {
        "id": "tpl-jtp-unique-id",
        "template_name": "JTP_PORTAL_USER_UNIQUE_ID",
        "dlt_template_id": "",
        "header": "JYCORP",
        "message_type": "SERVICE_IMPLICIT",
        "category": "Unique ID",
        "template_content": "Dear {#alphanumeric#}, your JOY TrueProfile Unique ID is {#alphanumeric#}. Use this to track your verification status at all times. - JOY TRUE PROFILE",
        "variables": ["name", "unique_id"],
        "cta_url": None,
        "cta_id": None,
        "is_active": True
    },
    {
        "id": "tpl-jtp-candidate-onboard",
        "template_name": "JTP_CANDIDATE_ONBOARDING_KYC",
        "dlt_template_id": "",
        "header": "JYCORP",
        "message_type": "TRANSACTIONAL",
        "category": "Onboarding Link",
        "template_content": "Dear {#alphanumeric#}, {#alphanumeric#} has initiated your employee verification on JOY TrueProfile. Please complete your KYC details at {#url#}. - JOY TRUE PROFILE",
        "variables": ["candidate_name", "company_name", "verify_url"],
        "cta_url": "https://trueprofile.joycorporatesolutions.com/verify?",
        "cta_id": "CTA_VERIFY_KYC",
        "is_active": True
    },
    {
        "id": "tpl-jtp-company-portal",
        "template_name": "JTP_COMPANY_ADMIN_PORTAL",
        "dlt_template_id": "",
        "header": "JYCORP",
        "message_type": "TRANSACTIONAL",
        "category": "Onboarding Link",
        "template_content": "Dear {#alphanumeric#}, your company portal workspace on JOY TrueProfile has been activated. Access your dashboard at {#url#}. - JOY TRUE PROFILE",
        "variables": ["name", "portal_url"],
        "cta_url": "https://trueprofile.joycorporatesolutions.com/company?",
        "cta_id": "CTA_COMPANY_PORTAL",
        "is_active": True
    },
    {
        "id": "tpl-jtp-hr-portal",
        "template_name": "JTP_HR_EXECUTIVE_PORTAL",
        "dlt_template_id": "",
        "header": "JYCORP",
        "message_type": "TRANSACTIONAL",
        "category": "Onboarding Link",
        "template_content": "Dear {#alphanumeric#}, your HR executive console on JOY TrueProfile is ready. Review candidates at {#url#}. - JOY TRUE PROFILE",
        "variables": ["name", "portal_url"],
        "cta_url": "https://trueprofile.joycorporatesolutions.com/hr?",
        "cta_id": "CTA_HR_PORTAL",
        "is_active": True
    },
    {
        "id": "tpl-jtp-vendor-portal",
        "template_name": "JTP_VENDOR_PORTAL_ACCESS",
        "dlt_template_id": "",
        "header": "JYCORP",
        "message_type": "TRANSACTIONAL",
        "category": "Onboarding Link",
        "template_content": "Dear {#alphanumeric#}, your vendor verification workspace on JOY TrueProfile is active. Access vendor portal at {#url#}. - JOY TRUE PROFILE",
        "variables": ["name", "portal_url"],
        "cta_url": "https://trueprofile.joycorporatesolutions.com/vendor?",
        "cta_id": "CTA_VENDOR_PORTAL",
        "is_active": True
    }
]

def seed_default_dlt_templates(db: Session) -> int:
    """Pre-seeds standard TRAI-compliant Airtel DLT SMS templates into database if not present"""
    added_count = 0
    try:
        for tpl_data in DEFAULT_DLT_TEMPLATES:
            existing = db.query(DltSmsTemplate).filter(
                (DltSmsTemplate.template_name == tpl_data["template_name"]) |
                (DltSmsTemplate.id == tpl_data["id"])
            ).first()
            if not existing:
                new_tpl = DltSmsTemplate(
                    id=tpl_data["id"],
                    template_name=tpl_data["template_name"],
                    dlt_template_id=tpl_data["dlt_template_id"],
                    header=tpl_data["header"],
                    message_type=tpl_data["message_type"],
                    category=tpl_data["category"],
                    template_content=tpl_data["template_content"],
                    variables=tpl_data["variables"],
                    cta_url=tpl_data.get("cta_url"),
                    cta_id=tpl_data.get("cta_id"),
                    is_active=tpl_data["is_active"]
                )
                db.add(new_tpl)
                added_count += 1
        if added_count > 0:
            db.commit()
            logger.info(f"Pre-seeded {added_count} official Airtel DLT SMS templates.")
    except Exception as e:
        db.rollback()
        logger.warning(f"Failed to seed DLT templates: {e}")
    return added_count


def get_sms_gateway_config(db: Optional[Session] = None) -> Dict[str, Any]:
    """
    Fetches the active Airtel IQ SMS Gateway configuration.
    Prefers CommunicationGateway DB entry, falling back to environment settings.
    """
    db_config: Dict[str, Any] = {}
    close_db = False
    if db is None:
        try:
            from backend.app.database import SessionLocal
            db = SessionLocal()
            close_db = True
        except Exception:
            db = None

    if db:
        try:
            gw = db.query(CommunicationGateway).filter(
                CommunicationGateway.gateway_type.in_(["sms", "airtel_iq"]),
                CommunicationGateway.company_id == None
            ).first()
            if gw and gw.settings_data:
                db_config = gw.settings_data
        except Exception as e:
            logger.warning(f"Error querying CommunicationGateway config: {e}")
        finally:
            if close_db:
                try:
                    db.close()
                except Exception:
                    pass

    customer_id = db_config.get("customer_id") or settings.AIRTEL_IQ_CUSTOMER_ID
    username = db_config.get("username") or settings.AIRTEL_IQ_USERNAME
    password = db_config.get("password") or settings.AIRTEL_IQ_PASSWORD
    entity_id = db_config.get("entity_id") or settings.AIRTEL_IQ_ENTITY_ID
    source_address = db_config.get("source_address") or settings.AIRTEL_IQ_SOURCE_ADDRESS or "JYCORP"
    base_url = db_config.get("base_url") or settings.AIRTEL_IQ_BASE_URL or "https://iqsms.airtel.in/api/v1/send-prepaid-sms"
    auth_header = db_config.get("auth_header") or settings.AIRTEL_IQ_AUTH_HEADER
    is_active = db_config.get("is_active", True)

    is_configured = bool(customer_id and (auth_header or (username and password)))

    return {
        "customer_id": customer_id,
        "username": username,
        "password": password,
        "entity_id": entity_id,
        "source_address": source_address,
        "base_url": base_url,
        "auth_header": auth_header,
        "is_active": is_active,
        "is_configured": is_configured,
        "has_credentials": bool(customer_id and (username or auth_header))
    }


def save_sms_gateway_config(config: Dict[str, Any], db: Session) -> CommunicationGateway:
    """Saves or updates Airtel IQ SMS Gateway credentials in CommunicationGateway table"""
    gw = db.query(CommunicationGateway).filter(
        CommunicationGateway.gateway_type.in_(["sms", "airtel_iq"]),
        CommunicationGateway.company_id == None
    ).first()

    current_data = gw.settings_data if gw and gw.settings_data else {}
    
    # Merge credentials
    merged_data = {**current_data, **config}
    # Preserve existing password if new one is masked or empty
    if not config.get("password") or config.get("password") == "********":
        merged_data["password"] = current_data.get("password", "")

    if not gw:
        gw = CommunicationGateway(
            id="gw-airtel-iq-sms",
            gateway_type="sms",
            company_id=None,
            settings_data=merged_data,
            is_active=merged_data.get("is_active", True)
        )
        db.add(gw)
    else:
        gw.settings_data = merged_data
        gw.is_active = merged_data.get("is_active", True)
        gw.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(gw)
    return gw


def normalize_india_phone(phone_str: str) -> str:
    """Normalizes phone string into 91XXXXXXXXXX format as required by Airtel IQ"""
    if not phone_str:
        return ""
    digits = re.sub(r"\D", "", str(phone_str))
    if len(digits) == 10:
        return f"91{digits}"
    elif len(digits) == 12 and digits.startswith("91"):
        return digits
    elif len(digits) > 10 and digits.startswith("0"):
        return f"91{digits[1:]}"
    return digits


def format_dlt_message(template_content: str, variables: Any) -> str:
    """
    Substitutes any DLT variable pattern (e.g. {#var#}, {#var1#}, {#alphanumeric#}, {#numeric#}, {#url#},
    {#cbn#}, or {named_key}) with real candidate or OTP data.
    Accepts scalar string/int, list, tuple, or dict of variable values.
    """
    if not template_content:
        return ""

    msg = template_content

    # Normalize scalar variables to list
    if isinstance(variables, (str, int, float)):
        variables = [str(variables)]

    # Matches ANY DLT token in the format {#something#} (e.g. {#var#}, {#numeric#}, {#url#}, {#var1#})
    pattern = re.compile(r"\{#[^#]+#\}", re.IGNORECASE)

    if isinstance(variables, dict):
        # 1. Named direct replacement {key} and {#{key}#}
        for k, v in variables.items():
            msg = msg.replace(f"{{{k}}}", str(v))
            msg = msg.replace(f"{{#{k}#}}", str(v))
        # 2. Sequential replacement for remaining DLT tokens
        if pattern.search(msg):
            values = list(variables.values())
            for val in values:
                msg = pattern.sub(str(val), msg, count=1)
    elif isinstance(variables, (list, tuple)):
        for val in variables:
            msg = pattern.sub(str(val), msg, count=1)

    return msg


def send_airtel_iq_sms(
    destination_address: Any,
    template_name_or_id: Optional[str] = None,
    message_text: Optional[str] = None,
    variables: Optional[Any] = None,
    dlt_template_id: Optional[str] = None,
    entity_id: Optional[str] = None,
    source_address: Optional[str] = None,
    message_type: Optional[str] = None,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Dispatches SMS via official Airtel IQ Prepaid SMS API:
    Endpoint: https://iqsms.airtel.in/api/v1/send-prepaid-sms
    
    Header format:
      Authorization: Basic <base64(username:password)>
      Accept: application/json
      Content-Type: application/json
      
    Payload:
      {
        "customerId": "...",
        "destinationAddress": ["919876543210"],
        "dltTemplateId": "...",
        "entityId": "...",
        "message": "...",
        "messageType": "SERVICE_IMPLICIT" | "TRANSACTIONAL",
        "sourceAddress": "JYCORP"
      }
    """
    cfg = get_sms_gateway_config(db)

    # 1. Normalize destination phone list
    phone_list: List[str] = []
    if isinstance(destination_address, str):
        # Could be comma-separated or single
        for p in destination_address.split(","):
            norm = normalize_india_phone(p.strip())
            if norm:
                phone_list.append(norm)
    elif isinstance(destination_address, (list, tuple)):
        for p in destination_address:
            norm = normalize_india_phone(str(p).strip())
            if norm:
                phone_list.append(norm)

    if not phone_list:
        return {
            "success": False,
            "error": "No valid destination mobile number provided. Must be a valid 10-digit Indian phone.",
            "status_code": 400
        }

    # 2. Look up template if template_name_or_id provided
    tpl_record: Optional[Any] = None
    if template_name_or_id:
        close_temp_db = False
        active_db = db
        if active_db is None:
            try:
                from backend.app.database import SessionLocal
                active_db = SessionLocal()
                close_temp_db = True
            except Exception:
                active_db = None

        if active_db:
            try:
                tpl_record = active_db.query(DltSmsTemplate).filter(
                    (DltSmsTemplate.template_name.ilike(template_name_or_id)) |
                    (DltSmsTemplate.id == template_name_or_id)
                ).first()

                # Resilient fallback: search by keywords if template was renamed or modified
                if not tpl_record:
                    clean_search = template_name_or_id.replace('-', '_')
                    keywords = [w for w in clean_search.split('_') if len(w) > 2 and w.upper() not in ('JTP', 'TPL', 'SMS')]
                    for kw in keywords:
                        tpl_record = active_db.query(DltSmsTemplate).filter(DltSmsTemplate.template_name.ilike(f"%{kw}%")).first()
                        if tpl_record:
                            break
            except Exception as q_err:
                logger.warning(f"Database error querying DltSmsTemplate: {q_err}")
            finally:
                if close_temp_db and active_db:
                    try:
                        active_db.close()
                    except Exception:
                        pass

        # Fallback to pre-approved memory templates if DB record not found
        if not tpl_record:
            for def_tpl in DEFAULT_DLT_TEMPLATES:
                if def_tpl["template_name"].lower() == template_name_or_id.lower() or def_tpl["id"] == template_name_or_id:
                    tpl_record = type("TempTpl", (), def_tpl)()
                    break
            if not tpl_record:
                clean_search = template_name_or_id.replace('-', '_')
                keywords = [w for w in clean_search.split('_') if len(w) > 2 and w.upper() not in ('JTP', 'TPL', 'SMS')]
                for def_tpl in DEFAULT_DLT_TEMPLATES:
                    for kw in keywords:
                        if kw.lower() in def_tpl["template_name"].lower():
                            tpl_record = type("TempTpl", (), def_tpl)()
                            break
                    if tpl_record:
                        break

    final_dlt_id = dlt_template_id or (getattr(tpl_record, "dlt_template_id", "") if tpl_record else "")
    final_header = source_address or (getattr(tpl_record, "header", "") if tpl_record else "") or cfg.get("source_address", "JYCORP")
    final_msg_type = message_type or (getattr(tpl_record, "message_type", "") if tpl_record else "") or "SERVICE_IMPLICIT"
    final_entity_id = entity_id or cfg.get("entity_id", "")
    final_customer_id = cfg.get("customer_id", "")

    # Build the final message text
    final_message = message_text or ""
    if tpl_record and not final_message:
        if variables is not None:
            final_message = format_dlt_message(tpl_record.template_content, variables)
        else:
            final_message = tpl_record.template_content
    elif variables is not None and final_message:
        final_message = format_dlt_message(final_message, variables)

    if not final_message:
        return {
            "success": False,
            "error": "Message content cannot be empty. Specify either a valid template or custom message.",
            "status_code": 400
        }

    # Prepare Airtel IQ Payload
    payload = {
        "customerId": final_customer_id,
        "destinationAddress": phone_list,
        "dltTemplateId": final_dlt_id or "1007892345671234567",
        "entityId": final_entity_id,
        "message": final_message,
        "messageType": final_msg_type,
        "sourceAddress": final_header
    }

    # Prepare Auth Header
    auth_header = cfg.get("auth_header")
    if not auth_header and cfg.get("username") and cfg.get("password"):
        user_pass = f"{cfg['username']}:{cfg['password']}".encode("utf-8")
        auth_header = f"Basic {base64.b64encode(user_pass).decode('utf-8')}"

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    if auth_header:
        headers["Authorization"] = auth_header

    # Check if live credentials exist
    if not cfg.get("has_credentials") or not cfg.get("is_active"):
        logger.info(
            f"[MOCK / OFFLINE AIRTEL IQ] Carrier SMS simulated to {phone_list}: "
            f"'{final_message[:80]}...' (DLT: {final_dlt_id or 'DEFAULT'}, Header: {final_header})"
        )
        return {
            "success": True,
            "mode": "simulated",
            "provider": "airtel_iq",
            "message": "SMS processed in verified sandbox simulation mode (credentials pending live activation).",
            "phone_numbers": phone_list,
            "dlt_template_id": final_dlt_id,
            "header": final_header,
            "message_content": final_message,
            "timestamp": datetime.utcnow().isoformat(),
            "simulated_batch_id": f"AIQ-{int(datetime.utcnow().timestamp())}"
        }

    # Dispatch Live HTTP Call to Airtel IQ
    base_url = cfg.get("base_url") or "https://iqsms.airtel.in/api/v1/send-prepaid-sms"
    try:
        response = requests.post(base_url, json=payload, headers=headers, timeout=12)
        response_json = {}
        try:
            response_json = response.json()
        except Exception:
            response_json = {"raw_text": response.text}

        if response.status_code in (200, 201, 202):
            logger.info(f"Airtel IQ SMS sent successfully to {phone_list}. Response: {response_json}")
            return {
                "success": True,
                "mode": "live",
                "provider": "airtel_iq",
                "status_code": response.status_code,
                "phone_numbers": phone_list,
                "header": final_header,
                "dlt_template_id": final_dlt_id,
                "response": response_json
            }
        else:
            logger.warning(f"Airtel IQ API returned HTTP {response.status_code}: {response_json}")
            return {
                "success": False,
                "mode": "live",
                "provider": "airtel_iq",
                "status_code": response.status_code,
                "error": response_json.get("message") or response_json.get("error") or f"HTTP {response.status_code}",
                "response": response_json,
                "dispatched_payload": payload
            }
    except requests.exceptions.RequestException as req_err:
        logger.error(f"Network error calling Airtel IQ SMS endpoint: {req_err}")
        return {
            "success": False,
            "mode": "live",
            "provider": "airtel_iq",
            "error": f"Network exception: {str(req_err)}",
            "fallback_used": False
        }


# =====================================================================
# Specialized Trigger Methods
# =====================================================================

def send_2fa_login_otp_sms(phone: str, name: str, otp: str, db: Optional[Session] = None) -> Dict[str, Any]:
    """Sends JTP_MANDATORY_2FA_LOGIN_OTP template to user mobile"""
    clean_name = name or "User"
    return send_airtel_iq_sms(
        destination_address=phone,
        template_name_or_id="JTP_MANDATORY_2FA_LOGIN_OTP",
        variables=[clean_name, otp],
        db=db
    )


def send_mobile_verification_otp_sms(phone: str, name: str, otp: str, db: Optional[Session] = None) -> Dict[str, Any]:
    """Sends JTP_VERIFY_MOBILE_OTP template to candidate or employee mobile"""
    clean_name = name or "Candidate"
    return send_airtel_iq_sms(
        destination_address=phone,
        template_name_or_id="JTP_VERIFY_MOBILE_OTP",
        variables=[clean_name, otp],
        db=db
    )


def send_password_reset_sms(phone: str, name: str, passcode: str, db: Optional[Session] = None) -> Dict[str, Any]:
    """Sends JTP_PASSWORD_RESET_PASSCODE template to user mobile"""
    clean_name = name or "User"
    return send_airtel_iq_sms(
        destination_address=phone,
        template_name_or_id="JTP_PASSWORD_RESET_PASSCODE",
        variables=[clean_name, passcode],
        db=db
    )


def send_esign_consent_otp_sms(phone: str, name: str, otp: str, db: Optional[Session] = None) -> Dict[str, Any]:
    """Sends JTP_CANDIDATE_ESIGN_OTP template for digital consent signature"""
    clean_name = name or "Candidate"
    return send_airtel_iq_sms(
        destination_address=phone,
        template_name_or_id="JTP_CANDIDATE_ESIGN_OTP",
        variables=[clean_name, otp],
        db=db
    )


def send_unique_id_sms(phone: str, name: str, unique_id: str, db: Optional[Session] = None) -> Dict[str, Any]:
    """Sends JTP_PORTAL_USER_UNIQUE_ID template with user's permanent BGV tracking ID"""
    clean_name = name or "User"
    return send_airtel_iq_sms(
        destination_address=phone,
        template_name_or_id="JTP_PORTAL_USER_UNIQUE_ID",
        variables=[clean_name, unique_id],
        db=db
    )


def send_candidate_onboarding_sms(
    phone: str,
    candidate_name: str,
    company_name: str,
    verify_url: str,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """Sends JTP_CANDIDATE_ONBOARDING_KYC transactional SMS with CTA URL"""
    c_name = candidate_name or "Candidate"
    comp_name = company_name or "JOY TrueProfile"
    return send_airtel_iq_sms(
        destination_address=phone,
        template_name_or_id="JTP_CANDIDATE_ONBOARDING_KYC",
        variables=[c_name, comp_name, verify_url],
        message_type="TRANSACTIONAL",
        db=db
    )
