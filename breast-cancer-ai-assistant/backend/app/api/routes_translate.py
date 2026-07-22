from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.translation_service import translate, translate_batch

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    target_lang: str

class BatchTranslationRequest(BaseModel):
    texts: List[str]
    target_lang: str

@router.post("")
def translate_text(request: TranslationRequest):
    translated = translate(request.text, request.target_lang)
    return {"translated_text": translated}

@router.post("/batch")
def translate_batch_texts(request: BatchTranslationRequest):
    translated = translate_batch(request.texts, request.target_lang)
    return {"translated_texts": translated}
