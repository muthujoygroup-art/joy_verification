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
@router.get("/dropdown-options")
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

DEFAULT_MASTER_FIELDS = [
    {"id": "name", "label": "Candidate Full Name", "field_type": "text", "category": "Personal Info", "default_mandatory": True},
    {"id": "empId", "label": "Employee ID Code", "field_type": "text", "category": "Personal Info", "default_mandatory": True},
    {"id": "designation", "label": "Job Designation / Title", "field_type": "select", "category": "Employment", "default_mandatory": True},
    {"id": "mobile", "label": "Registered Mobile Number (SMS Link)", "field_type": "tel", "category": "Contact", "default_mandatory": True},
    {"id": "email", "label": "Official Email Address", "field_type": "email", "category": "Contact", "default_mandatory": True},
    {"id": "aadhaarNo", "label": "Aadhaar Identity Number (12 Digits)", "field_type": "text", "category": "Government ID", "default_mandatory": True},
    {"id": "panNo", "label": "Tax PAN Card Number", "field_type": "text", "category": "Tax ID", "default_mandatory": False},
    {"id": "bankAccount", "label": "Bank Account Number & IFSC", "field_type": "text", "category": "Financial", "default_mandatory": False},
    {"id": "uan", "label": "Universal Account Number (EPFO UAN)", "field_type": "text", "category": "Employment", "default_mandatory": False},
    {"id": "nominee", "label": "Nominee Details & Relationship", "field_type": "text", "category": "Personal Info", "default_mandatory": True},
    {"id": "faceCapture", "label": "AI Biometric Facial Liveness Match", "field_type": "camera", "category": "Biometrics", "default_mandatory": True},
    {"id": "signature", "label": "Candidate Specimen Digital Signature", "field_type": "signature", "category": "Compliance", "default_mandatory": True}
]

@router.get("/form-fields", response_model=List[MasterFormFieldResponse])
def get_master_form_fields(db: Session = Depends(get_db)):
    """Fetch all default & custom master form fields; seeds standard fields if table is empty"""
    existing = db.query(MasterFormField).all()
    if not existing:
        for f in DEFAULT_MASTER_FIELDS:
            nf = MasterFormField(
                id=f["id"],
                label=f["label"],
                field_type=f["field_type"],
                category=f["category"],
                default_mandatory=f["default_mandatory"]
            )
            db.add(nf)
        try:
            db.commit()
            existing = db.query(MasterFormField).all()
        except Exception:
            db.rollback()
            existing = []
    return existing

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

@router.delete("/form-fields/{field_id}")
def delete_master_form_field(field_id: str, db: Session = Depends(get_db)):
    """Delete a custom master form field from database"""
    field = db.query(MasterFormField).filter(MasterFormField.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Master form field not found")
    db.delete(field)
    db.commit()
    return {"success": True, "message": f"Master field '{field.label}' removed from database"}
