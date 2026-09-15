from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services import rag_service
from app.core.security import get_current_user_id

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    report_id: str | None = None
    language: str | None = "en"

@router.post("")
async def chat(payload: ChatRequest, user_id: str = Depends(get_current_user_id)):
    """
    Retrieves relevant passages and generates a grounded answer via LLM.
    """
    answer = rag_service.answer_question(payload.message, patient_id=user_id, language=payload.language)
    return {"answer": answer, "grounded": True}
