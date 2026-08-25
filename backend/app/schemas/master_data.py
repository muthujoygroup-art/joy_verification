from pydantic import BaseModel
from typing import Optional, List, Dict

class MasterOptionCreate(BaseModel):
    category: str
    option_value: str

class MasterOptionResponse(BaseModel):
    id: int
    category: str
    option_value: str
    is_active: bool

    class Config:
        from_attributes = True

class MasterFormFieldCreate(BaseModel):
    label: str
    type: str = "text"
    category: str = "Personal Info"
    default_mandatory: bool = True

class MasterFormFieldResponse(BaseModel):
    id: str
    label: str
    field_type: str
    category: str
    default_mandatory: bool

    class Config:
        from_attributes = True
