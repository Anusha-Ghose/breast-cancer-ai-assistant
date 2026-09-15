"""
Manchester Triage System (MTS) Assessment API route.
Evaluates clinical findings, symptoms, and report parameters into 5 MTS urgency levels.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class TriageRequest(BaseModel):
    report_id: Optional[str] = None
    symptoms: Optional[List[str]] = []
    findings: Optional[dict] = {}

class MTSTriageResponse(BaseModel):
    triage_color: str
    triage_level_name: str
    urgency_score: int  # 1 (Highest) to 5 (Lowest)
    target_time_minutes: int
    clinical_indicators: List[str]
    action_recommendation: str
    provider_guidance: str

@router.post("/assess", response_model=MTSTriageResponse)
async def assess_triage(payload: TriageRequest):
    symptoms = [s.lower() for s in (payload.symptoms or [])]
    findings = payload.findings or {}
    
    bi_rads = str(findings.get("bi_rads") or "")
    ca153 = findings.get("ca15_3")
    fever = any("fever" in s or "chills" in s for s in symptoms)
    chemo = any("chemo" in s for s in symptoms)
    acute_pain = any("severe pain" in s or "chest pain" in s or "shortness of breath" in s for s in symptoms)
    
    # Red / Immediate Triage (Score 1)
    if any("shortness of breath" in s or "chest pain" in s or "unconscious" in s for s in symptoms):
        return MTSTriageResponse(
            triage_color="Red",
            triage_level_name="Immediate (Red - Category 1)",
            urgency_score=1,
            target_time_minutes=0,
            clinical_indicators=["Acute Cardiorespiratory Distress", "Critical Emergency Indicator"],
            action_recommendation="Seek immediate emergency medical evaluation (Call Emergency Services / Visit nearest Emergency Department).",
            provider_guidance="Requires immediate resuscitation assessment by emergency physician."
        )
        
    # Orange / Very Urgent Triage (Score 2)
    if (fever and chemo) or acute_pain or "4c" in bi_rads.lower() or "5" in bi_rads:
        indicators = [c for c in [
            "Febrile Neutropenia Risk (Fever during Active Chemotherapy)" if (fever and chemo) else None,
            f"High-Risk Finding (BI-RADS {bi_rads})" if ("4" in bi_rads or "5" in bi_rads) else None,
            "Acute Inflammatory Symptom" if acute_pain else None
        ] if c]
        if not indicators:
            indicators = ["High Clinical Priority Parameter"]
            
        return MTSTriageResponse(
            triage_color="Orange",
            triage_level_name="Very Urgent (Orange - Category 2)",
            urgency_score=2,
            target_time_minutes=15,
            clinical_indicators=indicators,
            action_recommendation="Contact your oncology clinical care team or visit Urgent Oncology Care within 1-2 hours.",
            provider_guidance="Perform STAT CBC with differential to rule out neutropenic sepsis. Evaluate suspicious mass."
        )
        
    # Yellow / Urgent Triage (Score 3)
    if "4a" in bi_rads.lower() or "4b" in bi_rads.lower() or (ca153 and float(ca153) > 35) or any("lump" in s or "bleeding" in s for s in symptoms):
        indicators = [c for c in [
            f"Elevated CA 15-3 ({ca153} U/mL)" if (ca153 and float(ca153) > 35) else None,
            "Palpable Breast Nodule" if any("lump" in s for s in symptoms) else None,
            f"BI-RADS {bi_rads}" if bi_rads else None
        ] if c]
        if not indicators:
            indicators = ["Urgent Medical Finding"]
            
        return MTSTriageResponse(
            triage_color="Yellow",
            triage_level_name="Urgent (Yellow - Category 3)",
            urgency_score=3,
            target_time_minutes=60,
            clinical_indicators=indicators,
            action_recommendation="Schedule a consultation with your treating oncologist/breast specialist within 24-48 hours.",
            provider_guidance="Recommend targeted ultrasound / core needle biopsy verification and repeat biomarker panel."
        )
        
    # Green / Standard Triage (Score 4)
    return MTSTriageResponse(
        triage_color="Green",
        triage_level_name="Standard (Green - Category 4)",
        urgency_score=4,
        target_time_minutes=120,
        clinical_indicators=["Stable Longitudinal Parameters", "BI-RADS 1-3 Routine Follow-up"],
        action_recommendation="Continue routine scheduled follow-up visits and standard surveillance imaging.",
        provider_guidance="Reassess at next annual/semiannual routine follow-up appointment."
    )
