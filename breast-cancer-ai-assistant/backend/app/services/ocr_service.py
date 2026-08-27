"""
OCR and handwriting recognition.
Printed documents -> pdfplumber / Tesseract.
Handwritten prescriptions -> Tesseract fallback or Vision LLM.
"""
import os
import pytesseract
from PIL import Image
import pdfplumber
import requests

def extract_text_from_digital_pdf(file_path: str) -> str:
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"pdfplumber error: {e}")
    return text

def extract_text_from_image(file_path: str) -> str:
    # First try local tesseract
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        if text.strip():
            return text
    except Exception as e:
        print(f"Local tesseract not available or failed: {e}")
        
    # Fallback to OCR.space public API
    print("Falling back to OCR.space API for image extraction...")
    try:
        with open(file_path, 'rb') as f:
            response = requests.post(
                'https://api.ocr.space/parse/image',
                data={'apikey': 'helloworld', 'language': 'eng'},
                files={'file': f}
            )
            result = response.json()
            if result.get('ParsedResults'):
                return result['ParsedResults'][0]['ParsedText']
    except Exception as e:
        print(f"OCR.space fallback failed: {e}")
        
    return ""

async def extract_text(file_path: str, document_type: str) -> str:
    """
    Route based on document_type.
    """
    text = ""
    if file_path.lower().endswith(".pdf"):
        text = extract_text_from_digital_pdf(file_path)
        
    if not text.strip():
        # Fallback to OCR if it's an image OR a scanned PDF (where pdfplumber found no text)
        text = extract_text_from_image(file_path)
        
    return text
