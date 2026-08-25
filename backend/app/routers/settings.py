from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from backend.app.database import get_db
from backend.app.models import SystemSetting, PlatformGuideline, CommunicationGateway
from backend.app.schemas import RoleSettingsUpdate, PlatformGuidelineUpdate

router = APIRouter(prefix="/settings", tags=["System Settings & Guidelines"])

@router.get("/role/{role}")
def get_role_settings(role: str, db: Session = Depends(get_db)):
    """Fetch customized settings for the specified role"""
    setting = db.query(SystemSetting).filter(SystemSetting.role == role).first()
    if not setting:
        return {"role": role, "settings": {}}
    return {"role": role, "settings": setting.settings_data}

@router.put("/role")
def update_role_settings(payload: RoleSettingsUpdate, db: Session = Depends(get_db)):
    """Save updated role settings in database"""
    setting = db.query(SystemSetting).filter(SystemSetting.role == payload.role).first()
    if not setting:
        setting = SystemSetting(role=payload.role, settings_data=payload.settings)
        db.add(setting)
    else:
        setting.settings_data = payload.settings
        
    db.commit()
    return {"success": True, "role": payload.role, "settings": setting.settings_data}

@router.get("/guidelines/{role}")
def get_guidelines_for_role(role: str, db: Session = Depends(get_db)):
    """Fetch role-specific operating manual and documentation"""
    guide = db.query(PlatformGuideline).filter(PlatformGuideline.role == role).first()
    if not guide:
        return {"role": role, "guidelines": []}
    return {"role": role, "guidelines": guide.guidelines_data}

@router.get("/gateways")
def get_communication_gateways(company_id: str = None, db: Session = Depends(get_db)):
    """Fetch configured WhatsApp, SMTP, and SMS gateways"""
    gateways = db.query(CommunicationGateway).all()
    return gateways

@router.post("/gateways")
def save_communication_gateway(payload: dict, db: Session = Depends(get_db)):
    """Save or update WhatsApp / SMTP email credentials"""
    gw_type = payload.get("gateway_type") # 'whatsapp' | 'email_smtp'
    gw_id = f"gw_{gw_type}"
    
    gw = db.query(CommunicationGateway).filter(CommunicationGateway.id == gw_id).first()
    if not gw:
        gw = CommunicationGateway(
            id=gw_id,
            gateway_type=gw_type,
            settings_data=payload.get("settings", {}),
            is_active=True
        )
        db.add(gw)
    else:
        gw.settings_data = payload.get("settings", {})
        gw.is_active = payload.get("is_active", True)
        
    db.commit()
    db.refresh(gw)
    return {"success": True, "gateway": gw}
