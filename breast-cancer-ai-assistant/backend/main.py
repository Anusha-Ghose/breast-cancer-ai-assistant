"""
Entry point for the Breast Health Copilot API.
Run locally with: uvicorn main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api import routes_auth, routes_upload, routes_reports, routes_trends, routes_chat, routes_translate

app = FastAPI(
    title="Breast Health Copilot API",
    description="OCR + NLP + LLM pipeline for breast cancer report analysis",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(routes_upload.router, prefix="/api/reports", tags=["upload"])
app.include_router(routes_reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(routes_trends.router, prefix="/api/trends", tags=["trends"])
app.include_router(routes_chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(routes_translate.router, prefix="/api/translate", tags=["translate"])


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
