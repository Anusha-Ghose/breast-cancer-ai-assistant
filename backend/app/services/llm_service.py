"""
Wrapper around the Groq API (LLaMA 3.3-70B) for:
- Structured extraction assistance
- Plain-language report summaries
- Confidence-aware explanations
"""
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.groq_api_key)


def summarize_report(structured_report: dict) -> str:
    """Generate a patient-friendly plain-language summary of a structured report."""
    # TODO: build prompt from structured_report, call client.chat.completions.create(...)
    raise NotImplementedError


def explain_term(term: str, patient_context: dict) -> str:
    """Explain a single medical term/finding in context of the patient's history."""
    raise NotImplementedError
