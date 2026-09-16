"""
OCR and handwriting recognition.
Printed documents -> pdfplumber / Tesseract.
Scanned PDFs -> pdfplumber page image rendering + Tesseract OCR.
Handwritten prescriptions -> Tesseract with image preprocessing + OCR.space fallback.
"""
import os
import shutil
import requests
from PIL import Image
import pdfplumber
import pytesseract

# Explicitly configure tesseract binary path for macOS / Homebrew / Linux
_TESSERACT_CANDIDATES = [
    shutil.which("tesseract"),
    "/opt/homebrew/bin/tesseract",
    "/usr/local/bin/tesseract",
    "/usr/bin/tesseract"
]
for candidate in _TESSERACT_CANDIDATES:
    if candidate and os.path.exists(candidate):
        pytesseract.pytesseract.tesseract_cmd = candidate
        break

def extract_text_from_digital_pdf(file_path: str) -> str:
    """Extract digital selectable text from a PDF file using pdfplumber."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"pdfplumber digital extract error on {file_path}: {e}")
    return text.strip()

def extract_text_from_scanned_pdf(file_path: str) -> str:
    """
    Extract text from a scanned/image-based PDF by converting each page
    to a high-resolution PIL image and applying Tesseract OCR.
    """
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                try:
                    # Render page as high-res PIL Image (200 DPI for clinical OCR clarity)
                    page_img = page.to_image(resolution=200).original
                    if page_img.mode != "RGB":
                        page_img = page_img.convert("RGB")
                    page_text = pytesseract.image_to_string(page_img, config="--psm 3")
                    if page_text and page_text.strip():
                        text += f"\n--- Page {i+1} ---\n" + page_text.strip() + "\n"
                except Exception as page_err:
                    print(f"Error OCRing PDF page {i+1} of {file_path}: {page_err}")
    except Exception as e:
        print(f"Failed to open PDF for image OCR {file_path}: {e}")
    return text.strip()

def extract_text_from_image(file_path: str) -> str:
    """
    Extract text from an image file (.png, .jpg, .jpeg, .webp, .tiff).
    Tries local Tesseract first, then falls back to OCR.space API.
    """
    # 1. Local Tesseract
    try:
        with Image.open(file_path) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")
            text = pytesseract.image_to_string(img, config="--psm 3")
            if text and text.strip():
                return text.strip()
    except Exception as e:
        print(f"Local Tesseract failed on image {file_path}: {e}")
        
    # 2. Fallback to OCR.space public API
    print("Falling back to OCR.space API for image extraction...")
    try:
        with open(file_path, "rb") as f:
            response = requests.post(
                "https://api.ocr.space/parse/image",
                data={"apikey": "helloworld", "language": "eng"},
                files={"file": f},
                timeout=15
            )
            result = response.json()
            if result.get("ParsedResults"):
                parsed = result["ParsedResults"][0].get("ParsedText", "")
                if parsed.strip():
                    return parsed.strip()
    except Exception as e:
        print(f"OCR.space fallback failed: {e}")
        
    return ""

def extract_text_from_text_file(file_path: str) -> str:
    """Read plain text, markdown, CSV, or JSON directly."""
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()
    except Exception as e:
        print(f"Error reading text file {file_path}: {e}")
        return ""

async def extract_text(file_path: str, document_type: str) -> str:
    """
    Main extraction router based on file extension and content.
    Seamlessly handles digital PDFs, scanned PDFs, images, and text documents.
    """
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    
    # 1. Plain text formats
    if ext in [".txt", ".csv", ".json", ".md"]:
        return extract_text_from_text_file(file_path)
        
    # 2. PDF formats
    if ext == ".pdf":
        # First attempt digital text extraction
        text = extract_text_from_digital_pdf(file_path)
        
        # If digital extraction yielded nothing or negligible text, treat as scanned PDF
        if len(text.strip()) < 30:
            print(f"PDF {file_path} contains little/no digital text ({len(text)} chars). Running scanned PDF OCR...")
            scanned_text = extract_text_from_scanned_pdf(file_path)
            if scanned_text.strip():
                text = scanned_text
                
        # If still empty, attempt OCR.space API fallback on the PDF file
        if not text.strip():
            print("Running OCR.space API fallback for PDF...")
            try:
                with open(file_path, "rb") as f:
                    response = requests.post(
                        "https://api.ocr.space/parse/image",
                        data={"apikey": "helloworld", "language": "eng"},
                        files={"file": f},
                        timeout=20
                    )
                    result = response.json()
                    if result.get("ParsedResults"):
                        text = result["ParsedResults"][0].get("ParsedText", "").strip()
            except Exception as e:
                print(f"OCR.space PDF fallback failed: {e}")
                
        return text.strip()
        
    # 3. Image formats
    if ext in [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"]:
        text = extract_text_from_image(file_path)
        return text.strip()
        
    # 4. Fallback for other file types
    text = extract_text_from_digital_pdf(file_path)
    if not text.strip():
        text = extract_text_from_image(file_path)
        
    return text.strip()

