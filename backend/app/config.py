import os
import urllib.parse
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "JOY DATA VERIFICATION API"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    
    # -------------------------------------------------------------
    # 🗄️ DATABASE SETTINGS (PostgreSQL Connection Pooling)
    # -------------------------------------------------------------
    DATABASE_URL_ENV: str = os.getenv("DATABASE_URL", "")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "Muthu@123")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "127.0.0.1")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "joy_verification")
    
    @property
    def DATABASE_URL(self) -> str:
        # If full connection string is explicitly specified in env, clean and normalize it
        if self.DATABASE_URL_ENV:
            import re
            u = self.DATABASE_URL_ENV.strip()
            # Clean accidental leading whitespace after postgresql://
            u = re.sub(r"postgresql://\s*", "postgresql://", u)
            # Replace localhost with 127.0.0.1 to avoid ::1 IPv6 pg_hba.conf rejection
            u = re.sub(r"@localhost(:|/)", r"@127.0.0.1\1", u)
            return u
            
        # Otherwise encode password to handle special characters (@, #, $, etc.) safely
        user = self.POSTGRES_USER.strip()
        host = self.POSTGRES_HOST.strip()
        if host.lower() == "localhost":
            host = "127.0.0.1"
        encoded_password = urllib.parse.quote_plus(self.POSTGRES_PASSWORD.strip())
        db = self.POSTGRES_DB.strip()
        port = self.POSTGRES_PORT.strip()
        return f"postgresql://{user}:{encoded_password}@{host}:{port}/{db}"
    
    # Fallback to local SQLite if PostgreSQL service is unavailable
    FALLBACK_DATABASE_URL: str = "sqlite:///./joy_verification.db"
    
    # -------------------------------------------------------------
    # 🌐 DOMAIN, APP & WEBHOOK CALLBACK URLS
    # -------------------------------------------------------------
    APP_BASE_URL: str = os.getenv("APP_BASE_URL", "https://verification.joycorporatesolutions.com")
    API_BASE_URL: str = os.getenv("API_BASE_URL", "https://verification.joycorporatesolutions.com")
    CALLBACK_URL: str = os.getenv("CALLBACK_URL", "https://verification.joycorporatesolutions.com/api/verification/webhook/callback")
    WEBHOOK_URL: str = os.getenv("WEBHOOK_URL", "https://verification.joycorporatesolutions.com/api/verification/webhook/callback")
    WEBHOOK_SECRET: str = os.getenv("WEBHOOK_SECRET", "joy_whsec_994281749102")
    
    # -------------------------------------------------------------
    # 🔐 AUTH & SECURITY
    # -------------------------------------------------------------
    SECRET_KEY: str = os.getenv("SECRET_KEY", "joy_verification_super_secret_jwt_key_2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "joy_aes_256_gcm_master_encryption_key_2026")
    
    # -------------------------------------------------------------
    # 🏛️ SERVER 1: Sandbox.co.in API Gateway (Govt IDs & Banking)
    # -------------------------------------------------------------
    SANDBOX_API_KEY: str = os.getenv("SANDBOX_API_KEY", "")
    SANDBOX_SECRET_KEY: str = os.getenv("SANDBOX_SECRET_KEY", "")
    SANDBOX_BASE_URL: str = os.getenv("SANDBOX_BASE_URL", "https://api.sandbox.co.in")
    SANDBOX_VERSION: str = os.getenv("SANDBOX_VERSION", "1.0")
    SANDBOX_MODE: str = os.getenv("SANDBOX_MODE", "production") # 'production' | 'sandbox'
    
    # -------------------------------------------------------------
    # 🛡️ SERVER 2: CoinCircleTrust API Gateway (47+ Dual Employment & Compliance APIs)
    # -------------------------------------------------------------
    COINCIRCLE_API_KEY: str = os.getenv("COINCIRCLE_API_KEY", os.getenv("COINCIRCLE_CLIENT_ID", ""))
    COINCIRCLE_CLIENT_ID: str = os.getenv("COINCIRCLE_CLIENT_ID", os.getenv("COINCIRCLE_API_KEY", ""))
    COINCIRCLE_SECRET_KEY: str = os.getenv("COINCIRCLE_SECRET_KEY", "")
    COINCIRCLE_BASE_URL: str = os.getenv("COINCIRCLE_BASE_URL", "https://api.coincircletrust.com")
    COINCIRCLE_MODE: str = os.getenv("COINCIRCLE_MODE", "production") # 'production' | 'staging'
    
    # -------------------------------------------------------------
    # 💬 WHATSAPP META CLOUD API GATEWAY
    # -------------------------------------------------------------
    WHATSAPP_API_TOKEN: str = os.getenv("WHATSAPP_API_TOKEN", "")
    WHATSAPP_PHONE_NUMBER_ID: str = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    WHATSAPP_BUSINESS_ACCOUNT_ID: str = os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID", "")
    WHATSAPP_WEBHOOK_VERIFY_TOKEN: str = os.getenv("WHATSAPP_WEBHOOK_VERIFY_TOKEN", "joy_wa_verify_2026")
    
    # -------------------------------------------------------------
    # 📧 cPanel SMTP EMAIL GATEWAY (Hosted Mails)
    # -------------------------------------------------------------
    SMTP_HOST: str = os.getenv("SMTP_HOST", "mail.joycorporatesolutions.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "465"))
    SMTP_USER: str = os.getenv("SMTP_USER", "noreply@joycorporatesolutions.com")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_USE_SSL: bool = os.getenv("SMTP_USE_SSL", "true").lower() in ("true", "1", "yes")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "noreply@joycorporatesolutions.com")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "JOY Corporate Solutions BGV")
    
    # -------------------------------------------------------------
    # 📱 CARRIER SMS GATEWAY (Fast2SMS / Twilio)
    # -------------------------------------------------------------
    SMS_GATEWAY_PROVIDER: str = os.getenv("SMS_GATEWAY_PROVIDER", "fast2sms") # 'fast2sms' | 'twilio'
    SMS_API_KEY: str = os.getenv("SMS_API_KEY", "")
    SMS_SENDER_ID: str = os.getenv("SMS_SENDER_ID", "JOYVER")
    
    # -------------------------------------------------------------
    # 💳 RAZORPAY B2B WALLET & RECHARGE GATEWAY
    # -------------------------------------------------------------
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_1DP5mmOlF5G5ag")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    
    # -------------------------------------------------------------
    # 🌐 CORS DOMAINS
    # -------------------------------------------------------------
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://verification.joycorporatesolutions.com",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
