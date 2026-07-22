"""
Structured medical entity extraction from raw OCR text.
Pulls out: BI-RADS score, receptor status (ER/PR/HER2/Ki-67), tumor size,
histology, grade, lymph node status, medications and dosages.
Uses spaCy (with a medical NER model) plus LLM-assisted extraction (Groq)
for fields spaCy's base model won't catch, with a confidence score attached
to each extracted field.
"""


def extract_entities(raw_text: str, document_type: str) -> dict:
    # TODO: run spaCy NER pass, then a Groq LLM structured-extraction pass,
    # merge results, and attach a confidence score (0-100) to each field.
    raise NotImplementedError
