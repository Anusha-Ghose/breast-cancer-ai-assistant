"""
Structured medical entity extraction from raw OCR text using LangChain and Groq.
Includes handwritten prescription reading and MTS Triage indicators.
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from groq import Groq
from app.config import settings
from app.services.llm_service import client
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

EXTRACTION_SYSTEM_PROMPT = """You are an expert clinical data and medical document extractor.
Your task is to extract ALL patient demographics, diagnostic findings, medications, laboratory parameters, doctor recommendations, and complex terminology explanations from the medical document text into valid JSON.

JSON Schema format:
{
  "patient_name": string or null,
  "patient_age": integer or null,
  "patient_gender": string or null,
  "report_date": string or null,
  "hospital": string or null,
  "doctor_name": string or null,
  "prescribing_doctor": string or null,
  "is_handwritten_prescription": boolean,
  "handwritten_confidence_score": integer (0-100) or null,
  "diagnosis": [string, ...],
  "symptoms": [string, ...],
  "medicines": [
    {
      "name": string,
      "dosage": string or null,
      "frequency": string or null,
      "duration": string or null,
      "sig": string or null,
      "refills": string or null,
      "confidence_score": integer (0-100)
    }
  ],
  "lab_parameters": [
    {
      "name": string,
      "value": string or null,
      "units": string or null,
      "reference_range": string or null,
      "is_abnormal": boolean,
      "confidence_score": integer (0-100)
    }
  ],
  "doctor_recommendations": [string, ...],
  "complex_terminologies": [
    {
      "term": string,
      "explanation": string (plain English, patient-friendly explanation),
      "confidence_score": integer (0-100)
    }
  ],
  "summary_confidence_score": integer (0-100)
}

RULES:
1. Always populate 'diagnosis', 'symptoms', 'doctor_recommendations', and 'complex_terminologies' with relevant items found in the document.
2. For any biopsy, mammogram, ultrasound, or pathology report: identify the findings/impression (e.g. "BI-RADS Category: 4B", "Invasive Ductal Carcinoma") in the diagnosis list.
3. For blood tests or lab panels: extract all biomarkers/lab tests into 'lab_parameters' with their measured values, reference ranges, and whether abnormal.
4. For prescriptions: extract all medications, doses, frequencies, durations, and sig directions into 'medicines'.
5. For complex medical terms (e.g. BI-RADS, ER-positive, HER2, carcinoma, spiculated mass, etc.): provide a clear, empathetic, plain-language patient explanation in 'complex_terminologies'.
6. Return only valid JSON adhering strictly to the above schema.
"""

async def extract_entities(raw_text: str, document_type: str) -> dict:
    if not raw_text or len(raw_text.strip()) == 0:
        return ExtractedEntities().model_dump()
        
    user_prompt = f"Document Type: {document_type}\n\nDocument Text:\n{raw_text}"
    
    # Models to try in order of preference
    models_to_try = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"]
    
    raw_response_text = None
    for model in models_to_try:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.0
            )
            raw_response_text = response.choices[0].message.content
            if raw_response_text:
                break
        except Exception as e:
            print(f"Model {model} extraction failed: {e}")
            continue
            
    if not raw_response_text:
        return ExtractedEntities().model_dump()
        
    try:
        data = json.loads(raw_response_text)
        # Validate and normalize with Pydantic
        validated = ExtractedEntities(**data)
        return validated.model_dump()
    except Exception as e:
        print(f"Pydantic validation error on extracted JSON: {e}")
        # Try raw json dict with default structure
        if isinstance(data, dict):
            return data
        return ExtractedEntities().model_dump()

