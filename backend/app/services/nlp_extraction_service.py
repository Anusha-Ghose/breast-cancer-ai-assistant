"""
Structured medical entity extraction from raw OCR text using LangChain and Groq.
Includes handwritten prescription reading and MTS Triage indicators.
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from app.config import settings
import json

class Medicine(BaseModel):
    name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    sig: Optional[str] = Field(default=None, description="Patient directions / instructions (e.g. Take 1 tablet by mouth twice daily after meals)")
    refills: Optional[str] = Field(default=None, description="Number of authorized refills")
    confidence_score: Optional[int] = Field(default=None, description="Confidence percentage (0-100) of this extraction")

class LabParameter(BaseModel):
    name: str
    value: Optional[str] = None
    units: Optional[str] = None
    reference_range: Optional[str] = None
    is_abnormal: Optional[bool] = None
    confidence_score: Optional[int] = Field(default=None, description="Confidence percentage (0-100) of this extraction")

class TermExplanation(BaseModel):
    term: str
    explanation: str
    confidence_score: Optional[int] = Field(default=None, description="Confidence percentage (0-100) of this explanation")

class ExtractedEntities(BaseModel):
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    report_date: Optional[str] = None
    hospital: Optional[str] = None
    doctor_name: Optional[str] = None
    prescribing_doctor: Optional[str] = None
    is_handwritten_prescription: Optional[bool] = Field(default=False, description="True if document is a handwritten physician prescription")
    handwritten_confidence_score: Optional[int] = Field(default=None, description="Confidence percentage (0-100) in reading handwritten text")
    diagnosis: Optional[List[str]] = []
    symptoms: Optional[List[str]] = []
    medicines: Optional[List[Medicine]] = []
    lab_parameters: Optional[List[LabParameter]] = []
    doctor_recommendations: Optional[List[str]] = []
    complex_terminologies: Optional[List[TermExplanation]] = []
    summary_confidence_score: Optional[int] = Field(default=None, description="Confidence percentage (0-100) of the diagnosis and symptoms summary extraction")

async def extract_entities(raw_text: str, document_type: str) -> dict:
    if not raw_text or len(raw_text.strip()) == 0:
        return ExtractedEntities().model_dump()
        
    llm = ChatGroq(
        temperature=0,
        model_name="llama-3.3-70b-versatile",
        api_key=settings.groq_api_key
    )
    
    structured_llm = llm.with_structured_output(ExtractedEntities)
    
    prompt = f"""
    You are an expert clinical data and handwritten prescription extractor. Your task is to accurately extract ALL patient, diagnostic, and prescription information from the provided medical document text.
    
    SPECIAL HANDWRITTEN PRESCRIPTION INSTRUCTION:
    - If the Document Type is 'handwritten_prescription' or the text contains physician prescription patterns (Rx, Sig, Disp, Refill, dosage frequencies like BID/TID/QID/PRN):
      - Set `is_handwritten_prescription` to True.
      - Carefully decode medicine names (e.g. Tamoxifen, Letrozole, Anastrozole, Ondansetron, Paclitaxel, Cyclophosphamide).
      - Extract the dosage (e.g., 20mg, 2.5mg, 4mg), frequency (e.g., once daily, twice daily after meals), duration (e.g., 30 days, 5 years), and full `sig` instructions.
      - Provide a `handwritten_confidence_score` (0-100) for how clearly the handwriting was parsed.
    
    CRITICAL: Carefully read through the medical document and identify any complex medical jargon or terminology (e.g. "ER-positive", "HER2/neu", "carcinoma"). 
    For each complex term you find, provide the term, a simple, plain-English explanation for a patient without medical training in the `complex_terminologies` field, and a `confidence_score` (0-100).

    Document Type: {document_type}
    
    TEXT:
    {raw_text}
    """
    
    try:
        result = structured_llm.invoke(prompt)
        return result.model_dump()
    except Exception as e:
        print(f"LLM Extraction error: {e}")
        return ExtractedEntities().model_dump()
