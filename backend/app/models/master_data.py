from sqlalchemy import Column, String, Integer, Boolean, DateTime
from datetime import datetime
from backend.app.database import Base

class MasterDataOption(Base):
    __tablename__ = "master_data_options"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category = Column(String(100), index=True, nullable=False) # 'departments', 'designations', 'workLocations', 'qualifications', 'employmentTypes'
    option_value = Column(String(200), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class MasterFormField(Base):
    __tablename__ = "master_form_fields"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'f_pan', 'f_curr_address'
    label = Column(String(150), nullable=False)
    field_type = Column(String(50), default="text") # 'text', 'select', 'date', 'file', 'number'
    category = Column(String(100), default="Personal Info")
    default_mandatory = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
