"""Fetching and listing analyzed reports."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/{report_id}")
def get_report(report_id: str):
    # TODO: fetch structured report + AI-generated plain-language summary from DB
    raise NotImplementedError


@router.get("/")
def list_reports(patient_id: str):
    # TODO: return all reports for a patient, most recent first
    raise NotImplementedError
