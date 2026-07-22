"""Application settings loaded from environment variables."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    groq_api_key: str = ""
    database_url: str = "postgresql://user:password@localhost:5432/breast_health"
    mongo_uri: str = "mongodb://localhost:27017/breast_health"
    jwt_secret: str = "change_this_secret"
    vector_db_path: str = "./data/vectorstore"
    cors_origins: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"


settings = Settings()
