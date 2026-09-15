"""Biomarker time-series model, used for trend charts (CA 15-3, tumor size, etc.)."""
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()


class BiomarkerReading(Base):
    __tablename__ = "biomarker_readings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    report_id = Column(String, ForeignKey("reports.id"))
    marker_name = Column(String)  # e.g. "CA 15-3", "tumor_size_cm", "bi_rads"
    value = Column(Float)
    unit = Column(String)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)
