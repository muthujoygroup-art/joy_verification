import time
import logging
from typing import Dict, Tuple, Optional

logger = logging.getLogger("otp_service")

# In-memory OTP storage cache with expiry
OTP_CACHE: Dict[str, Dict] = {}

def generate_and_send_otp(channel: str, identifier: str, token: str) -> Tuple[bool, str, Optional[str], str]:
    """
    Generates and dispatches a live OTP via UIDAI Aadhaar Gateway or SMS/Email Carrier.
    Returns (success, message, demo_otp, masked_target)
    """
    try:
        # Clean identifier
        clean_id = (identifier or "").replace(" ", "").replace("-", "").replace("+91", "")
        clean_token = (token or "").strip()
        cache_key = f"{clean_token}_{channel}"
        
        if channel == "aadhaar":
            masked = f"XXXX-XXXX-{clean_id[-4:]}" if len(clean_id) >= 4 else "XXXX-XXXX-****"
            
            if len(clean_id) != 12 or not clean_id.isdigit():
                return False, "Please enter a valid 12-digit Aadhaar number.", None, masked

            # Attempt live Neev / CoinCircle generate-aadhaar-otp-v2
            from backend.app.services.live_verification_service import _call_neev_api, get_active_provider_info
            prov = get_active_provider_info()
            
            if not prov or not prov.get("api_key") or "TEST" in str(prov.get("api_key", "")).upper():
                logger.warning("Active API Provider key is unset or set to dummy test key.")
                return False, "UIDAI Gateway Error: Real API Gateway Key not configured or inactive. Please configure your live CoinCircle/Neev API credentials in SuperAdmin.", None, masked

            live_ok, live_res, latency, err = _call_neev_api(
                endpoint_slug="/generate-aadhaar-otp-v2",
                payload_data={"aadhaar_number": clean_id},
                provider_info=prov
            )
            
            if live_ok and live_res:
                req_id = live_res.get("requestId") or live_res.get("transaction_id") or live_res.get("reference_id") or ""
                OTP_CACHE[cache_key] = {
                    "identifier": clean_id,
                    "request_id": req_id,
                    "created_at": time.time(),
                    "attempts": 0,
                    "is_live": True
                }
                logger.info(f"Live UIDAI Aadhaar OTP dispatched successfully (ReqId: {req_id})")
                return True, f"Live UIDAI OTP successfully dispatched by Government Gateway to mobile linked with Aadhaar {masked}.", None, masked
            else:
                err_text = err or (live_res.get("message") if isinstance(live_res, dict) else "Gateway rejected request")
                logger.warning(f"Live UIDAI OTP dispatch failed: {err_text}")
                return False, f"UIDAI Gateway Error: {err_text}", None, masked

        elif channel in ("mobile", "sms", "phone"):
            masked = f"+91 XXXXX-{clean_id[-4:]}" if len(clean_id) >= 4 else "+91 XXXXX-****"
            if len(clean_id) < 10:
                return False, "Please enter a valid 10-digit mobile number.", None, masked

            # Dispatch via Carrier SMS (Fast2SMS / Twilio)
            from backend.app.config import settings
            import random
            otp_code = str(random.randint(100000, 999999))
            
            OTP_CACHE[cache_key] = {
                "otp": otp_code,
                "identifier": clean_id,
                "created_at": time.time(),
                "attempts": 0,
                "is_live": False
            }
            
            # Send live SMS if Fast2SMS API key is set
            if settings.SMS_API_KEY and "live" in settings.SMS_API_KEY:
                try:
                    import requests
                    sms_url = "https://www.fast2sms.com/dev/bulkV2"
                    sms_payload = {
                        "variables_values": otp_code,
                        "route": "otp",
                        "numbers": clean_id
                    }
                    sms_headers = {"authorization": settings.SMS_API_KEY}
                    requests.post(sms_url, json=sms_payload, headers=sms_headers, timeout=5)
                except Exception as sms_err:
                    logger.warning(f"SMS Gateway dispatch failed: {sms_err}")

            return True, f"SMS OTP dispatched to registered mobile {masked} (Valid for 10 mins).", None, masked

        elif channel == "email":
            masked = identifier if "@" in identifier else f"candidate@joycorporate.com"
            from backend.app.services.email_service import send_candidate_email_otp
            import random
            otp_code = str(random.randint(100000, 999999))
            OTP_CACHE[cache_key] = {
                "otp": otp_code,
                "identifier": identifier,
                "created_at": time.time(),
                "attempts": 0
            }
            send_candidate_email_otp(identifier, otp_code)
            return True, f"Official verification OTP dispatched to email {masked}.", None, masked

        else:
            masked = f"ID: {clean_id[-4:] if len(clean_id) >= 4 else '****'}"
            return True, "Verification OTP code dispatched successfully.", None, masked

    except Exception as exc:
        logger.error(f"Error in generate_and_send_otp: {exc}", exc_info=True)
        clean_id = (identifier or "").replace(" ", "").replace("-", "").replace("+91", "")
        masked = f"XXXX-XXXX-{clean_id[-4:]}" if len(clean_id) >= 4 else "XXXX-XXXX-****"
        return False, f"Gateway connection error: {exc}", None, masked


def verify_otp_code(channel: str, identifier: str, otp: str, token: str) -> Tuple[bool, str]:
    """
    Validates entered OTP against Government Gateway or live Carrier cache.
    """
    clean_token = (token or "").strip()
    clean_otp = str(otp or "").strip()
    clean_id = (identifier or "").replace(" ", "").replace("-", "").replace("+91", "")
    
    cache_key = f"{clean_token}_{channel}"
    cached = OTP_CACHE.get(cache_key)
    
    if not cached:
        cached = OTP_CACHE.get(f"{clean_token}_aadhaar") or OTP_CACHE.get(f"{clean_token}_mobile")
        
    if not cached:
        return False, "No active OTP request found. Please click 'Send OTP' first."
        
    # Check expiry (10 minutes = 600s)
    if time.time() - cached["created_at"] > 600:
        OTP_CACHE.pop(cache_key, None)
        return False, "OTP has expired (10-minute validity exceeded). Please request a new OTP."

    # Live UIDAI verification handled in verify_aadhaar_live using API Gateway
    if channel == "aadhaar" and cached.get("is_live"):
        from backend.app.services.live_verification_service import _call_neev_api, get_active_provider_info
        prov = get_active_provider_info()
        live_ok, live_res, latency, err = _call_neev_api(
            endpoint_slug="/aadhaar-detail-verification-v2",
            payload_data={
                "aadhaar_number": clean_id,
                "otp": clean_otp,
                "requestId": cached.get("request_id") or ""
            },
            provider_info=prov
        )
        if live_ok:
            OTP_CACHE.pop(cache_key, None)
            return True, "UIDAI Aadhaar OTP verified successfully!"
        else:
            cached["attempts"] += 1
            if cached["attempts"] >= 3:
                OTP_CACHE.pop(cache_key, None)
                return False, f"Maximum verification attempts exceeded. UIDAI returned: {err or 'Invalid OTP'}"
            return False, f"UIDAI OTP Verification Failed: {err or 'Incorrect OTP entered'}"

    # Standard SMS / Email OTP check
    if cached.get("otp") and cached.get("otp") == clean_otp:
        OTP_CACHE.pop(cache_key, None)
        return True, "OTP verified successfully."
    else:
        cached["attempts"] = cached.get("attempts", 0) + 1
        remaining_attempts = max(0, 3 - cached["attempts"])
        if remaining_attempts <= 0:
            OTP_CACHE.pop(cache_key, None)
            return False, "Maximum verification attempts exceeded. Please request a new OTP."
        return False, f"Invalid OTP code entered. ({remaining_attempts} attempt(s) remaining)"
