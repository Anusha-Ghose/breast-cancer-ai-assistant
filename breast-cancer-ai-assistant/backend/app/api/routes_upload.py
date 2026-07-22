"""Document upload and processing pipeline trigger."""
from fastapi import APIRouter, UploadFile, File, Form

from app.services import ocr_service, nlp_extraction_service

router = APIRouter()


@router.post("/upload")
async def upload_report(file: UploadFile = File(...), document_type: str = Form(...)):
    """
    1. Save file to storage
    2. Run OCR / handwriting recognition (ocr_service)
    3. Extract structured medical entities (nlp_extraction_service)
    4. Persist parsed report to DB
    5. Return report_id for the frontend to poll / fetch
    """
    raw_text = await ocr_service.extract_text(file, document_type)
    structured = nlp_extraction_service.extract_entities(raw_text, document_type)
    # TODO: persist `structured` to DB and return the new report_id
    return {"status": "processing", "document_type": document_type, "preview": structured}
