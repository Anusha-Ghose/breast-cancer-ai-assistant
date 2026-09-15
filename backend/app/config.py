"""Application settings loaded from environment variables."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    groq_api_key: str = ""
    mongo_uri: str = "mongodb://localhost:27017/healthcare_assistant"
    jwt_secret: str = "change_this_secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 1 week
    vector_db_path: str = "./data/vectorstore"
    cors_origins: list[str] = ["http://localhost:5174", "http://localhost:5173", "http://localhost:3000", "http://localhost", "http://127.0.0.1:5174", "http://127.0.0.1:5173"]
    upload_dir: str = "./data/uploads"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
