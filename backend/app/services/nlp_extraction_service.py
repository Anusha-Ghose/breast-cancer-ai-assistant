"""
Structured medical entity extraction from raw OCR text using LangChain and Groq.
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
    You are an expert medical data extractor. Your task is to accurately extract ALL relevant patient and clinical information from the provided medical document text.
    - Extract the patient's demographics, hospital, doctor name, diagnoses, symptoms, medications, lab parameters, and recommendations.
    - If a specific field is not found in the text, leave it empty or null. Do NOT invent information.
    - Note: The 'Document Type' provided below is what the user selected, but the actual text may contain different information (e.g. a blood test uploaded as a mammogram). Always trust the TEXT over the Document Type.
    
    CRITICAL: Carefully read through the medical document and identify any complex medical jargon or terminology (e.g. "ER-positive", "HER2/neu", "carcinoma"). 
    For each complex term you find, provide the term, a simple, plain-English explanation for a patient without medical training in the `complex_terminologies` field, and a `confidence_score` (0-100) indicating how sure you are of the explanation based on the context.
    Also provide a `confidence_score` (0-100) for all extracted medicines and lab parameters, and a `summary_confidence_score` (0-100) for the overall diagnosis and symptoms extraction.

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
