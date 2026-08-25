import os
import urllib.parse
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "JOY DATA VERIFICATION API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database Settings
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "Muthu@123")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "127.0.0.1")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "joy_verification")
    
    @property
    def DATABASE_URL(self) -> str:
        # Encode password to handle special characters (@, #, $, etc.)
        encoded_password = urllib.parse.quote_plus(self.POSTGRES_PASSWORD)
        return f"postgresql://{self.POSTGRES_USER}:{encoded_password}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Fallback to local SQLite if PostgreSQL is unavailable
    FALLBACK_DATABASE_URL: str = "sqlite:///./joy_verification.db"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "joy_verification_super_secret_jwt_key_2026")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
