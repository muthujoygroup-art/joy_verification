import random
import time
from typing import Dict, Tuple

# In-memory OTP storage cache with expiry
OTP_CACHE: Dict[str, Dict] = {}

def generate_and_send_otp(channel: str, identifier: str, token: str) -> Tuple[bool, str, str, str]:
    """
    Simulates sending an OTP via Aadhaar UIDAI Gateway (API SETU) or SMS Gateway (Sandbox API).
    Returns (success, message, demo_otp, masked_target)
    """
    # Clean identifier
    clean_id = identifier.replace(" ", "").replace("-", "")
    otp_code = str(random.randint(100000, 999999))
    
    cache_key = f"{token}_{channel}"
    OTP_CACHE[cache_key] = {
        "otp": otp_code,
        "created_at": time.time(),
        "attempts": 0
    }
    
    if channel == "aadhaar":
        masked = f"XXXX-XXXX-{clean_id[-4:]}" if len(clean_id) >= 4 else "XXXX-XXXX-9876"
        msg = f"UIDAI OTP dispatched to linked mobile ending with *{clean_id[-2:] if len(clean_id) >= 2 else '10'}"
    else: # mobile
        masked = f"+91 XXXXX-{clean_id[-4:]}" if len(clean_id) >= 4 else "+91 XXXXX-4321"
        msg = f"SMS OTP dispatched to registered mobile {masked}"
        
    return True, msg, otp_code, masked

def verify_otp_code(channel: str, identifier: str, otp: str, token: str) -> Tuple[bool, str]:
    """
    Validates entered OTP. Accepts generated OTP or universal testing OTP '123456' / '849201'.
    """
    cache_key = f"{token}_{channel}"
    cached = OTP_CACHE.get(cache_key)
    
    # Universal sandbox testing OTPs
    if otp in ["123456", "849201", "000000"]:
        return True, "OTP verified successfully (Sandbox Override)."
        
    if not cached:
        return False, "No OTP request found. Please request a new OTP."
        
    # Check expiry (10 minutes)
    if time.time() - cached["created_at"] > 600:
        return False, "OTP has expired. Please request a new one."
        
    if cached["otp"] == otp.strip():
        # Remove used OTP
        OTP_CACHE.pop(cache_key, None)
        return True, "OTP verified successfully via Government Gateway."
    else:
        cached["attempts"] += 1
        return False, "Invalid OTP entered. Please check and try again."
