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
    
    # Server 1: Sandbox.co.in API Gateway (Primary for Core Govt IDs & Banking)
    SANDBOX_API_KEY: str = os.getenv("SANDBOX_API_KEY", "")
    SANDBOX_SECRET_KEY: str = os.getenv("SANDBOX_SECRET_KEY", "")
    SANDBOX_BASE_URL: str = os.getenv("SANDBOX_BASE_URL", "https://api.sandbox.co.in")
    SANDBOX_MODE: str = os.getenv("SANDBOX_MODE", "production") # 'production' | 'sandbox'
    
    # Server 2: CoinCircleTrust API Gateway (47+ Advanced Enterprise & Dual Employment APIs)
    COINCIRCLE_CLIENT_ID: str = os.getenv("COINCIRCLE_CLIENT_ID", "")
    COINCIRCLE_SECRET_KEY: str = os.getenv("COINCIRCLE_SECRET_KEY", "")
    COINCIRCLE_BASE_URL: str = os.getenv("COINCIRCLE_BASE_URL", "https://api.coincircletrust.com")
    COINCIRCLE_MODE: str = os.getenv("COINCIRCLE_MODE", "production") # 'production' | 'staging'
    
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
