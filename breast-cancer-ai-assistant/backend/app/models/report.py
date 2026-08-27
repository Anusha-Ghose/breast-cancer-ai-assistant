from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class ReportBase(BaseModel):
    patient_id: str
    document_type: str # 'digital_pdf', 'scanned_pdf', 'image', 'handwritten'
    original_filename: str

class ReportCreate(ReportBase):
    pass

class ReportInDB(ReportBase):
    file_path: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    status: str = "processing" # processing, completed, failed
    ocr_text: Optional[str] = None
    extracted_entities: Optional[Dict[str, Any]] = None

class ReportOut(ReportInDB):
    id: str
