import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.database import get_db
from backend.app.models import MasterDataOption, MasterFormField
from backend.app.schemas import (
    MasterOptionCreate, MasterOptionResponse,
    MasterFormFieldCreate, MasterFormFieldResponse
)

router = APIRouter(prefix="/master-data", tags=["Master Data Management"])

@router.get("/dropdowns")
def get_all_dropdown_options(db: Session = Depends(get_db)):
    """Fetch grouped master dropdown options"""
    options = db.query(MasterDataOption).filter(MasterDataOption.is_active == True).all()
    grouped: Dict[str, List[str]] = {
        "departments": [],
        "designations": [],
        "workLocations": [],
        "qualifications": [],
        "employmentTypes": []
    }
    for opt in options:
        if opt.category in grouped:
            grouped[opt.category].append(opt.option_value)
        else:
            grouped[opt.category] = [opt.option_value]
    return grouped

@router.post("/dropdowns", response_model=MasterOptionResponse)
def add_dropdown_option(payload: MasterOptionCreate, db: Session = Depends(get_db)):
    """Add a new option to a master dropdown list"""
    new_opt = MasterDataOption(
        category=payload.category,
        option_value=payload.option_value,
        is_active=True
    )
    db.add(new_opt)
    db.commit()
    db.refresh(new_opt)
    return new_opt

@router.delete("/dropdowns")
def remove_dropdown_option(category: str, option_value: str, db: Session = Depends(get_db)):
    """Remove or deactivate an option from master dropdown"""
    opt = db.query(MasterDataOption).filter(
        MasterDataOption.category == category,
        MasterDataOption.option_value == option_value
    ).first()
    if not opt:
        raise HTTPException(status_code=404, detail="Option not found")
        
    db.delete(opt)
    db.commit()
    return {"success": True, "message": f"Removed '{option_value}' from {category}"}

@router.get("/form-fields", response_model=List[MasterFormFieldResponse])
def get_master_form_fields(db: Session = Depends(get_db)):
    """Fetch all default & custom master form fields"""
    return db.query(MasterFormField).all()

@router.post("/form-fields", response_model=MasterFormFieldResponse)
def add_master_form_field(payload: MasterFormFieldCreate, db: Session = Depends(get_db)):
    """Create a new default form field template"""
    field_id = f"f_{uuid.uuid4().hex[:6]}"
    new_field = MasterFormField(
        id=field_id,
        label=payload.label,
        field_type=payload.type,
        category=payload.category,
        default_mandatory=payload.default_mandatory
    )
    db.add(new_field)
    db.commit()
    db.refresh(new_field)
    return new_field
