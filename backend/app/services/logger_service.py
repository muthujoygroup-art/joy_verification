import uuid
import logging
from datetime import datetime
from typing import Optional
from backend.app.database import SessionLocal
from backend.app.models.system import SystemErrorLog

logger = logging.getLogger("joy_system_logger")

def record_system_error_log(
    section: str,
    error_code: str,
    message: str,
    severity: str = "Critical",
    db = None
) -> Optional[SystemErrorLog]:
    """
    Persists a system error log directly to the PostgreSQL database
    so Super Admins can monitor, diagnose, and track platform health in real-time.
    """
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        log_id = f"log_{uuid.uuid4().hex[:8]}"
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        entry = SystemErrorLog(
            id=log_id,
            timestamp=now_str,
            section=section,
            error_code=error_code,
            message=str(message)[:2000],
            severity=severity,
            solved=False
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        logger.info(f"📝 [SYSTEM LOG SAVED] [{severity.upper()}] [{section}] {error_code}: {message[:100]}")
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
