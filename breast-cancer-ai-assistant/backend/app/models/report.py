"""Report SQLAlchemy model."""
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()


class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    document_type = Column(String)  # mammogram | biopsy | bloodwork | prescription
    bi_rads_score = Column(Integer, nullable=True)
    tumor_size_cm = Column(Float, nullable=True)
    histology = Column(String, nullable=True)
    grade = Column(String, nullable=True)
    lymph_node_status = Column(String, nullable=True)
    summary_text = Column(String, nullable=True)
    raw_extraction = Column(JSON)  # full structured extraction incl. confidence scores
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
