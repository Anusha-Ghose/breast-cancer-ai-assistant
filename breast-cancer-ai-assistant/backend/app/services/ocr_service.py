"""
OCR and handwriting recognition.
Printed documents -> Tesseract / EasyOCR.
Handwritten prescriptions -> handwriting-tuned OCR model or vision LLM fallback.
"""
from fastapi import UploadFile


async def extract_text(file: UploadFile, document_type: str) -> str:
    """
    1. Load file bytes (pdf2image for PDFs -> page images)
    2. Route to pytesseract for printed text, or a handwriting-specific
       model for prescriptions
    3. Return raw extracted text for downstream NLP parsing
    """
    raise NotImplementedError
