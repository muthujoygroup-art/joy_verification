import time
import uuid
import hmac
import hashlib
import json
import base64
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

from backend.app.config import settings

# Active in-memory session registry
# In production, this can be synced to Redis or PostgreSQL
ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}

SESSION_TTL_SECONDS = 30 * 60  # 30 Minutes standard session TTL

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def _base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)

def create_jwt_token(payload: Dict[str, Any], secret_key: str = settings.SECRET_KEY) -> str:
    """Generates a secure HS256 signed JWT token without external dependencies"""
    header = {"alg": "HS256", "typ": "JWT"}
    
    encoded_header = _base64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    encoded_payload = _base64url_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))
    
    signing_input = f"{encoded_header}.{encoded_payload}".encode('utf-8')
    signature = hmac.new(secret_key.encode('utf-8'), signing_input, hashlib.sha256).digest()
    encoded_signature = _base64url_encode(signature)
    
    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

def verify_jwt_token(token: str, secret_key: str = settings.SECRET_KEY) -> Optional[Dict[str, Any]]:
    """Verifies and decodes an HS256 signed JWT token"""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
            
        encoded_header, encoded_payload, encoded_signature = parts
        signing_input = f"{encoded_header}.{encoded_payload}".encode('utf-8')
        expected_sig = hmac.new(secret_key.encode('utf-8'), signing_input, hashlib.sha256).digest()
        actual_sig = _base64url_decode(encoded_signature)
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        payload = json.loads(_base64url_decode(encoded_payload).decode('utf-8'))
        
        # Check token expiration
        if 'exp' in payload and payload['exp'] < time.time():
            return None
            
        return payload
    except Exception:
        return None

def create_session(user_data: Dict[str, Any], role: str, ip_address: str = "127.0.0.1", user_agent: str = "Mozilla/5.0") -> Dict[str, Any]:
    """Creates a new active session and returns a JWT access token"""
    session_id = f"sess_{uuid.uuid4().hex[:16]}"
    now = time.time()
    expires_at = now + SESSION_TTL_SECONDS
    
    session_record = {
        "session_id": session_id,
        "role": role,
        "user_id": user_data.get("id") or user_data.get("email") or "admin",
        "user_name": user_data.get("name", "User"),
        "email": user_data.get("email", ""),
        "company_id": user_data.get("companyId"),
        "ip_address": ip_address,
        "user_agent": user_agent,
        "created_at": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC'),
        "last_active": now,
        "expires_at": expires_at
    }
    
    ACTIVE_SESSIONS[session_id] = session_record
    
    jwt_payload = {
        "sub": session_record["user_id"],
        "sid": session_id,
        "role": role,
        "name": session_record["user_name"],
        "email": session_record["email"],
        "iat": int(now),
        "exp": int(expires_at)
    }
    
    token = create_jwt_token(jwt_payload)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "session_id": session_id,
        "expires_in": SESSION_TTL_SECONDS,
        "expires_at": int(expires_at),
        "role": role,
        "user": user_data
    }

def get_session_by_token(token: str) -> Optional[Dict[str, Any]]:
    """Validates token and returns live session telemetry"""
    payload = verify_jwt_token(token)
    if not payload:
        return None
        
    session_id = payload.get("sid")
    if not session_id or session_id not in ACTIVE_SESSIONS:
        # If server restarted, we can still trust valid unexpired JWT payload
        now = time.time()
        remaining = max(0, int(payload.get("exp", now) - now))
        return {
            "session_id": session_id or "sess_jwt_restored",
            "role": payload.get("role", "user"),
            "user_name": payload.get("name", "User"),
            "email": payload.get("email", ""),
            "is_valid": remaining > 0,
            "ttl_remaining_seconds": remaining,
            "ip_address": "127.0.0.1",
            "load_balancer_node": "joy-cluster-node-01"
        }
        
    session = ACTIVE_SESSIONS[session_id]
    now = time.time()
    remaining = max(0, int(session["expires_at"] - now))
    
    if remaining <= 0:
        ACTIVE_SESSIONS.pop(session_id, None)
        return None
        
    session["last_active"] = now
    return {
        **session,
        "is_valid": True,
        "ttl_remaining_seconds": remaining,
        "load_balancer_node": "joy-cluster-node-01"
    }

def extend_session(token: str) -> Optional[Dict[str, Any]]:
    """Extends the active session duration by 30 minutes and issues a fresh JWT token"""
    payload = verify_jwt_token(token)
    if not payload:
        return None
        
    session_id = payload.get("sid")
    now = time.time()
    expires_at = now + SESSION_TTL_SECONDS
    
    if session_id in ACTIVE_SESSIONS:
        ACTIVE_SESSIONS[session_id]["expires_at"] = expires_at
        ACTIVE_SESSIONS[session_id]["last_active"] = now
        
    new_jwt_payload = {
        **payload,
        "iat": int(now),
        "exp": int(expires_at)
    }
    
    new_token = create_jwt_token(new_jwt_payload)
    return {
        "access_token": new_token,
        "token_type": "bearer",
        "session_id": session_id,
        "expires_in": SESSION_TTL_SECONDS,
        "expires_at": int(expires_at),
        "message": "Session successfully extended by 30 minutes"
    }

def terminate_session(token: str) -> bool:
    """Terminates and removes active session"""
    payload = verify_jwt_token(token)
    if payload and "sid" in payload:
        ACTIVE_SESSIONS.pop(payload["sid"], None)
        return True
    return False
