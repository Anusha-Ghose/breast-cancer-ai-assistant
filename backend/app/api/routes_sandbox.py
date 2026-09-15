"""
Treatment Journey Sandbox API routes.
Provides grounded treatment pathways, sequence options, and literature-based guidance.
"""
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class TreatmentStep(BaseModel):
    id: str
    phase: str
    title: str
    description: str
    duration: str
    options: List[str]
    side_effects: List[str]
    evidence_grounding: str

class TreatmentPathwayResponse(BaseModel):
    subtype: str
    stage: str
    recommended_sequence: List[str]
    steps: List[TreatmentStep]
    clinical_notes: str

@router.get("/treatment-pathway", response_model=TreatmentPathwayResponse)
async def get_treatment_pathway(
    subtype: str = Query("HR+/HER2-", description="Subtype: HR+/HER2-, HER2+, Triple Negative"),
    stage: str = Query("Stage II", description="Clinical stage: Stage I, Stage II, Stage III, Stage IV")
):
    pathways = {
        "HR+/HER2-": {
            "subtype": "HR+ / HER2- (Hormone Receptor Positive, HER2 Negative)",
            "stage": stage,
            "recommended_sequence": [
                "1. Primary Surgery (Breast Conservation or Mastectomy)",
                "2. Adjuvant Radiation (if lumpectomy or node-positive)",
                "3. Adjuvant Endocrine / Hormone Therapy (5-10 years)",
                "4. Targeted Therapy (CDK4/6 inhibitors if high risk)"
            ],
            "steps": [
                {
                    "id": "step-1",
                    "phase": "Primary Surgical Intervention",
                    "title": "Lumpectomy or Mastectomy + Sentinel Node Biopsy",
                    "description": "Surgical removal of the tumor while evaluating axillary lymph nodes to dictate adjuvant treatment intensity.",
                    "duration": "1 - 3 weeks recovery",
                    "options": ["Breast-Conserving Surgery (BCS / Lumpectomy)", "Total Mastectomy", "Oncoplastic Reconstruction"],
                    "side_effects": ["Post-surgical soreness", "Lymphedema risk (5-10%)", "Seroma formation"],
                    "evidence_grounding": "NCCN Guidelines Version 4.2025 - Invasive Breast Cancer (BINV-4)"
                },
                {
                    "id": "step-2",
                    "phase": "Adjuvant Radiation Therapy",
                    "title": "Whole Breast / Regional Nodal Irradiation",
                    "description": "Targeted high-energy rays to eradicate microscopic residual cell populations and prevent local recurrence.",
                    "duration": "3 - 5 weeks (daily sessions)",
                    "options": ["Hypofractionated Whole Breast Irradiation (15-16 fractions)", "Accelerated Partial Breast Irradiation (APBI)"],
                    "side_effects": ["Skin redness/hyperpigmentation", "Fatigue", "Breast tissue tightness"],
                    "evidence_grounding": "ASTRO Clinical Practice Guideline on Radiation Therapy for Breast Cancer"
                },
                {
                    "id": "step-3",
                    "phase": "Adjuvant Endocrine (Hormone) Therapy",
                    "title": "Aromatase Inhibitors or Tamoxifen",
                    "description": "Blocks estrogen signals or suppresses systemic estrogen synthesis to prevent late distant recurrence.",
                    "duration": "5 to 10 years continuous",
                    "options": ["Aromatase Inhibitor (Letrozole / Anastrozole / Exemestane)", "Tamoxifen (Selective Estrogen Receptor Modulator)", "Ovarian Function Suppression (GnRH agonist)"],
                    "side_effects": ["Joint arthralgias", "Hot flashes", "Bone mineral density loss"],
                    "evidence_grounding": "ASCO Endocrine Therapy Guideline (Update 2024)"
                },
                {
                    "id": "step-4",
                    "phase": "Targeted & Risk-Reduction Therapy",
                    "title": "CDK4/6 Inhibitor Combination",
                    "description": "For high-risk node-positive patients, CDK4/6 inhibition significantly decreases invasive disease-free survival risk.",
                    "duration": "2 years (Abemaciclib)",
                    "options": ["Abemaciclib + Endocrine Therapy", "Ribociclib + AI"],
                    "side_effects": ["Mild diarrhea", "Neutropenia", "Fatigue"],
                    "evidence_grounding": "monarchE Clinical Trial (Journal of Clinical Oncology 2023)"
                }
            ],
            "clinical_notes": "Grounding Note: Sequence is individualized based on Oncotype DX / MammaPrint genomic recurrence scores."
        },
        "HER2+": {
            "subtype": "HER2+ (Human Epidermal Growth Factor Receptor 2 Positive)",
            "stage": stage,
            "recommended_sequence": [
                "1. Neoadjuvant Chemotherapy + Dual HER2 Blockade",
                "2. Definitive Surgery",
                "3. Adjuvant Anti-HER2 Targeted Therapy (T-DM1 or Trastuzumab/Pertuzumab)",
                "4. Radiation & Hormone Therapy (if ER+)"
            ],
            "steps": [
                {
                    "id": "step-1",
                    "phase": "Neoadjuvant Targeted & Systemic Therapy",
                    "title": "Chemotherapy + Trastuzumab (Herceptin) + Pertuzumab (Perjeta)",
                    "description": "Pre-operative systemic therapy to shrink primary tumor and evaluate Pathologic Complete Response (pCR).",
                    "duration": "18 - 24 weeks (6 cycles)",
                    "options": ["TCHP (Docetaxel, Carboplatin, Trastuzumab, Pertuzumab)", "AC-THP"],
                    "side_effects": ["Hair loss", "Diarrhea", "Reversible LVEF cardiac drop"],
                    "evidence_grounding": "NEOSPHERE & TRYPHAENA Clinical Trials"
                },
                {
                    "id": "step-2",
                    "phase": "Definitive Surgery",
                    "title": "Breast Surgery & Lymph Node Assessment",
                    "description": "Surgical removal tailored to tumor response following neoadjuvant treatment.",
                    "duration": "2 - 4 weeks recovery",
                    "options": ["Lumpectomy with Targeted Axillary Dissection", "Mastectomy"],
                    "side_effects": ["Post-op wound healing", "Mild numbness"],
                    "evidence_grounding": "NCCN Breast Cancer Guidelines (BINV-6)"
                },
                {
                    "id": "step-3",
                    "phase": "Adjuvant Targeted Therapy",
                    "title": "Trastuzumab Emtansine (T-DM1) or HP Completion",
                    "description": "If residual invasive disease remains at surgery, T-DM1 antibody-drug conjugate reduces recurrence risk by 50%.",
                    "duration": "Total 1 year of HER2 therapy",
                    "options": ["T-DM1 (Kadcyla) for residual disease", "Trastuzumab + Pertuzumab for pCR"],
                    "side_effects": ["Thrombocytopenia", "Mild neuropathy", "Elevated transaminases"],
                    "evidence_grounding": "KATHERINE Phase III Trial (NEJM 2019)"
                }
            ],
            "clinical_notes": "Grounding Note: Echocardiogram/MUGA scans are scheduled every 3 months to monitor cardiac ejection fraction."
        }
    }
    
    return pathways.get(subtype, pathways["HR+/HER2-"])
