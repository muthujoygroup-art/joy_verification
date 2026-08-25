from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class SystemErrorLogResponse(BaseModel):
    id: str
    timestamp: str
    section: str
    error_code: str
    message: str
    severity: str
    solved: bool
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[str] = None

    class Config:
        from_attributes = True

class SystemErrorLogToggle(BaseModel):
    solved: bool
    resolved_by: Optional[str] = "Super Admin"

class ApiConfigUpdate(BaseModel):
    display_name: Optional[str] = None
    endpoint_url: Optional[str] = None
    api_key: Optional[str] = None
    secret_key: Optional[str] = None
    webhook_url: Optional[str] = None
    sandbox_mode: Optional[bool] = None
    rate_limit_per_min: Optional[int] = None
    status: Optional[str] = None

class ApiConfigResponse(BaseModel):
    provider_key: str
    display_name: str
    endpoint_url: str
    api_key: str
    secret_key: Optional[str] = None
    webhook_url: Optional[str] = None
    sandbox_mode: bool
    rate_limit_per_min: int
    status: str
    monthly_quota: int
    monthly_used: int
    last_synced: Optional[datetime] = None

    class Config:
        from_attributes = True

class RoleSettingsUpdate(BaseModel):
    role: str
    settings: Dict[str, Any]

class PlatformGuidelineUpdate(BaseModel):
    role: str
    guidelines: List[Dict[str, Any]]
