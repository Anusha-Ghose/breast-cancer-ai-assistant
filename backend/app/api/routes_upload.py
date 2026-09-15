from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
import os
import shutil
from datetime import datetime
from bson import ObjectId

from app.services import ocr_service, nlp_extraction_service
from app.core.security import get_current_user_id
from app.db.database import db
from app.models.report import ReportInDB, ReportOut
from app.config import settings

router = APIRouter()

@router.post("/upload", response_model=ReportOut)
async def upload_report(
    file: UploadFile = File(...), 
    document_type: str = Form(...),
    user_id: str = Depends(get_current_user_id)
):
    os.makedirs(settings.upload_dir, exist_ok=True)
    
    # Save file
    file_extension = file.filename.split(".")[-1] if "." in file.filename else ""
    safe_filename = f"{ObjectId()}_{file.filename}"
    file_path = os.path.join(settings.upload_dir, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    report = ReportInDB(
        patient_id=user_id,
        document_type=document_type,
        original_filename=file.filename,
        file_path=file_path,
        status="processing"
    )
    
    result = await db.db.reports.insert_one(report.model_dump())
    report_id = str(result.inserted_id)
    
    # Process inline (OCR + NLP)
    raw_text = await ocr_service.extract_text(file_path, document_type)
    structured = await nlp_extraction_service.extract_entities(raw_text, document_type)
    
    # Update report with OCR text and extracted entities
    await db.db.reports.update_one(
        {"_id": ObjectId(report_id)}, 
        {"$set": {
            "ocr_text": raw_text, 
            "extracted_entities": structured,
            "status": "completed"
        }}
    )
    
    final_report = await db.db.reports.find_one({"_id": ObjectId(report_id)})
    final_report["id"] = str(final_report["_id"])
    return ReportOut(**final_report)
