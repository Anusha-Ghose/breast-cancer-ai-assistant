"""Longitudinal trend comparisons across a patient's report history."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/{patient_id}")
def get_trends(patient_id: str, marker: str | None = None):
    """
    Returns time-series values for a given biomarker (e.g. CA 15-3, tumor size,
    BI-RADS score) across all of a patient's uploaded reports, so the frontend
    can render the trend chart.
    """
    # TODO: query DB for historical values of `marker` for this patient
    raise NotImplementedError
