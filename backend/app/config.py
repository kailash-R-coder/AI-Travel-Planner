from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Travel Planner"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # Database Configuration (Supports SQLite local demo or PostgreSQL+pgvector)
    DATABASE_URL: str = "sqlite:///./travel_planner.db"
    
    # JWT Authentication
    SECRET_KEY: str = "ai-travel-planner-super-secret-key-btech-ai-ds-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Optional LLM API Keys
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    OPENWEATHER_API_KEY: Optional[str] = None
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
