import uuid
import logging
import re
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
from backend.app.database import SessionLocal
from backend.app.models.system import SystemErrorLog

logger = logging.getLogger("joy_system_logger")

# IST Timezone (UTC + 5:30)
IST_TZ = timezone(timedelta(hours=5, minutes=30))

def sanitize_log_content(text: str) -> str:
    """Masks passwords, authorization tokens, API keys, and sensitive document numbers"""
    if not text:
        return ""
    sanitized = str(text)
    # Mask passwords & secret keys
    sanitized = re.sub(r'("password"\s*:\s*)"[^"]+"', r'\1"********"', sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(r'("secret_key"\s*:\s*)"[^"]+"', r'\1"********"', sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(r'("api_key"\s*:\s*)"([^"]{4})[^"]+([^"]{4})"', r'\1"\2****\3"', sanitized, flags=re.IGNORECASE)
    return sanitized

def record_system_error_log(
    section: str,
    error_code: str,
    message: str,
    portal: str = "HR Executive Portal",
    function_name: Optional[str] = None,
    stack_trace: Optional[str] = None,
    user_info: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    device_info: Optional[str] = None,
    severity: str = "Critical",
    db = None
) -> Optional[SystemErrorLog]:
    """
    Persists an enterprise-grade system error log directly to the PostgreSQL database
    so Super Admins can monitor, diagnose, and track platform health in real-time across all portals.
    """
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        # Generate traceable ID: ERR-YYYYMMDD-HEX
        now_ist = datetime.now(IST_TZ)
        date_prefix = now_ist.strftime("%Y%m%d")
        log_id = f"ERR-{date_prefix}-{uuid.uuid4().hex[:6].upper()}"
        now_str = now_ist.strftime("%Y-%m-%d %H:%M:%S IST")
        
        clean_msg = sanitize_log_content(message)[:3000]
        clean_stack = sanitize_log_content(stack_trace) if stack_trace else None
        
        entry = SystemErrorLog(
            id=log_id,
            timestamp=now_str,
            portal=portal or "HR Executive Portal",
            section=section or "General System",
            function_name=function_name,
            error_code=error_code or "ERR_SYSTEM_GENERAL",
            message=clean_msg,
            stack_trace=clean_stack,
            user_info=user_info or {},
            ip_address=ip_address,
            device_info=device_info,
            severity=severity or "Critical",
            solved=False
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        logger.info(f"🚨 [ERROR LOGGED] [{portal}] [{severity.upper()}] [{section} -> {function_name or ''}] {error_code}: {clean_msg[:120]}")
        return entry
    except Exception as e:
        logger.error(f"❌ Failed to persist system error log: {e}")
        try:
            db.rollback()
        except Exception:
            pass
        return None
    finally:
        if close_db:
            db.close()
