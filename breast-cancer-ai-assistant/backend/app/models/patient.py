"""Patient SQLAlchemy model."""
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    preferred_language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
