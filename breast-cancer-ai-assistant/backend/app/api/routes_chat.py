"""RAG-powered medical chat assistant."""
from fastapi import APIRouter
from pydantic import BaseModel

from app.services import rag_service

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    report_id: str | None = None


@router.post("")
def chat(payload: ChatRequest):
    """
    Retrieves relevant passages from the patient's own documents plus a verified
    medical knowledge base (LangChain + vector store), then generates a grounded
    answer via the LLM (Groq / LLaMA).
    """
    answer = rag_service.answer_question(payload.message, payload.report_id)
    return {"answer": answer, "grounded": True}
