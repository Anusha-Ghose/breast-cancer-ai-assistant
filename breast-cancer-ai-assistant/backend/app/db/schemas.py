"""Pydantic request/response schemas (separate from SQLAlchemy models)."""
from pydantic import BaseModel


class BiomarkerOut(BaseModel):
    name: str
    status: str
    value: str
    confidence: int


class ReportOut(BaseModel):
    id: str
    document_type: str
    bi_rads_score: int | None = None
    tumor_size_cm: float | None = None
    histology: str | None = None
    grade: str | None = None
    lymph_node_status: str | None = None
    summary_text: str | None = None
    receptors: list[BiomarkerOut] = []
