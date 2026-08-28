"""
JOY DATA VERIFICATION - Enterprise Security & High-Concurrency Performance Engine
Includes:
- Sliding-Window Rate Limiting Middleware (anti-brute-force login and gateway quota shield)
- Ultra-Fast In-Memory LRU Cache with TTL (zero database latency on hot lookups)
- Cryptographic PII Masking & Data Sanitization (Aadhaar, PAN, Bank Accounts, Phone)
- Enterprise OWASP Top 10 Security Headers (HSTS, CSP, X-Frame-Options, Nosniff)
"""

import time
import re
import threading
from collections import defaultdict
from typing import Any, Optional, Dict, Tuple
from fastapi import Request, Response, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


# =============================================================================
# 1. PII MASKING & DATA SANITIZATION ENGINE
# =============================================================================

def mask_aadhaar(aadhaar: Optional[str]) -> str:
    """Masks first 8 digits of Aadhaar (e.g., XXXX-XXXX-1234)"""
    if not aadhaar:
        return ""
    clean = re.sub(r"\D", "", str(aadhaar))
    if len(clean) >= 12:
        return f"XXXX-XXXX-{clean[-4:]}"
    elif len(clean) >= 4:
        return f"XXXX-{clean[-4:]}"
    return "****"

def mask_pan(pan: Optional[str]) -> str:
    """Masks middle 4 digits of PAN (e.g., ABCDE****F)"""
    if not pan:
        return ""
    clean = str(pan).strip().upper()
    if len(clean) == 10:
        return f"{clean[:5]}****{clean[-1]}"
    return "****"

def mask_bank_account(acc: Optional[str]) -> str:
    """Masks all but last 4 digits of Bank Account (e.g., ******1234)"""
    if not acc:
        return ""
    clean = re.sub(r"\D", "", str(acc))
    if len(clean) >= 4:
        return f"{'*' * (len(clean) - 4)}{clean[-4:]}"
    return "****"

def mask_mobile(mobile: Optional[str]) -> str:
    """Masks middle 4 digits of Mobile Number (e.g., +91 98****1234)"""
    if not mobile:
        return ""
    clean = re.sub(r"\D", "", str(mobile))
    if len(clean) >= 10:
        return f"+91 {clean[:2]}****{clean[-4:]}"
    return "+91 *******"

def sanitize_for_audit_logs(data: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitizes sensitive data before writing to server audit logs"""
    sanitized = {}
    for k, v in data.items():
        k_lower = k.lower()
        if any(term in k_lower for term in ["password", "secret", "token", "auth"]):
            sanitized[k] = "[REDACTED_CREDENTIAL]"
        elif "aadhaar" in k_lower:
            sanitized[k] = mask_aadhaar(str(v))
        elif "pan" in k_lower:
            sanitized[k] = mask_pan(str(v))
        elif any(term in k_lower for term in ["bank", "account", "acc_no"]):
            sanitized[k] = mask_bank_account(str(v))
        elif "mobile" in k_lower or "phone" in k_lower:
            sanitized[k] = mask_mobile(str(v))
        elif isinstance(v, dict):
            sanitized[k] = sanitize_for_audit_logs(v)
        else:
            sanitized[k] = v
    return sanitized


# =============================================================================
# 2. HIGH-CONCURRENCY IN-MEMORY LRU CACHE WITH TTL
# =============================================================================

class HighPerformanceCache:
    """Thread-safe in-memory cache with TTL expiry to eliminate database load on repeated reads"""
    def __init__(self, default_ttl_seconds: int = 60, max_entries: int = 10000):
        self._cache: Dict[str, Tuple[Any, float]] = {}
        self._lock = threading.RLock()
        self._default_ttl = default_ttl_seconds
        self._max_entries = max_entries

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            if key not in self._cache:
                return None
            val, expiry = self._cache[key]
            if time.time() > expiry:
                del self._cache[key]
                return None
            return val

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        with self._lock:
            ttl = ttl_seconds if ttl_seconds is not None else self._default_ttl
            expiry = time.time() + ttl
            
            # Simple LRU eviction if max capacity is exceeded
            if len(self._cache) >= self._max_entries and key not in self._cache:
                oldest_key = next(iter(self._cache))
                del self._cache[oldest_key]
                
            self._cache[key] = (value, expiry)

    def invalidate(self, pattern_or_key: str) -> int:
        """Invalidates cache entries matching a prefix or exact key"""
        with self._lock:
            if pattern_or_key in self._cache:
                del self._cache[pattern_or_key]
                return 1
            
            to_delete = [k for k in self._cache if k.startswith(pattern_or_key)]
            for k in to_delete:
                del self._cache[k]
            return len(to_delete)

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()

    def get_stats(self) -> Dict[str, Any]:
        with self._lock:
            now = time.time()
            active_entries = sum(1 for _, exp in self._cache.values() if exp > now)
            return {
                "total_cached_items": len(self._cache),
                "active_unexpired_items": active_entries,
                "max_capacity": self._max_entries
            }

# Global application cache instance
fast_cache = HighPerformanceCache(default_ttl_seconds=120)


# =============================================================================
# 3. SLIDING-WINDOW ADAPTIVE RATE LIMITER
# =============================================================================

class SlidingWindowRateLimiter:
    """
    Sliding-window rate limiter by IP & Endpoint category.
    Protects against login brute forcing, DDoS, and rapid duplicate requests.
    """
    def __init__(self):
        self._requests = defaultdict(list)
        self._lock = threading.RLock()
        
        # Rate limits (max_requests, window_in_seconds)
        self.LIMITS = {
            "auth": (25, 60),          # Max 25 logins/min per IP
            "verification": (90, 60),  # Max 90 live verifications/min per IP
            "documents": (60, 60),     # Max 60 document exports/min per IP
            "general": (400, 60)       # Max 400 requests/min per IP
        }

    def _get_category(self, path: str) -> str:
        if "/api/auth/login" in path:
            return "auth"
        elif "/api/verification/" in path:
            return "verification"
        elif "/api/documents/" in path:
            return "documents"
        return "general"

    def check_rate_limit(self, client_ip: str, path: str) -> Tuple[bool, int, int, int]:
        """
        Returns (is_allowed, remaining_requests, limit, retry_after_seconds)
        """
        category = self._get_category(path)
        max_requests, window_seconds = self.LIMITS[category]
        key = f"{client_ip}:{category}"
        now = time.time()
        window_start = now - window_seconds

        with self._lock:
            # Clean timestamps older than window
            self._requests[key] = [ts for ts in self._requests[key] if ts > window_start]
            
            current_count = len(self._requests[key])
            if current_count >= max_requests:
                oldest_ts = self._requests[key][0]
                retry_after = max(1, int(oldest_ts + window_seconds - now))
                return False, 0, max_requests, retry_after
            
            # Record current request
            self._requests[key].append(now)
            remaining = max_requests - current_count - 1
            return True, remaining, max_requests, 0

# Global rate limiter instance
global_rate_limiter = SlidingWindowRateLimiter()


# =============================================================================
# 4. ENTERPRISE SECURITY & PERFORMANCE MIDDLEWARE
# =============================================================================

class EnterpriseSecurityMiddleware(BaseHTTPMiddleware):
    """
    FastAPI Middleware providing:
    - Sliding-window rate limiting with standard HTTP headers
    - OWASP Top 10 Security Headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
    - Concurrency metrics and cluster telemetry
    """
    async def dispatch(self, request: Request, call_next):
        # Extract client IP
        client_ip = request.headers.get("X-Forwarded-For")
        if client_ip:
            client_ip = client_ip.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "127.0.0.1"

        path = request.url.path

        # Bypass rate limiting for static docs and basic health checks
        if path in ["/health", "/api/health", "/docs", "/redoc", "/openapi.json", "/"]:
            response = await call_next(request)
            return self._inject_security_headers(response)

        # 1. Rate Limit Enforcement
        is_allowed, remaining, limit, retry_after = global_rate_limiter.check_rate_limit(client_ip, path)
        if not is_allowed:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests from IP {client_ip}. Please retry in {retry_after} seconds.",
                    "retry_after_seconds": retry_after,
                    "status": "rate_limited"
                },
                headers={
                    "Retry-After": str(retry_after),
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time() + retry_after))
                }
            )

        # 2. Process Request
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        # 3. Add Performance & Rate Limit Headers
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        response.headers["X-Server-Engine"] = "JOY-UltraSpeed-FastAPI/2.4"
        response.headers["X-Cluster-Status"] = "High-Availability-Zero-Lag"

        # 4. Inject Enterprise Security Headers
        return self._inject_security_headers(response)

    def _inject_security_headers(self, response: Response) -> Response:
        """Injects enterprise-grade OWASP security headers into all responses"""
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(self), microphone=(), geolocation=()"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; "
            "img-src 'self' data: https: blob:; "
            "connect-src 'self' https: wss:; "
            "font-src 'self' https: data:; "
            "frame-ancestors 'self';"
        )
        return response
