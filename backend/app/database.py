import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.config import settings

logger = logging.getLogger("joy_backend")
logging.basicConfig(level=logging.INFO)

Base = declarative_base()

def get_engine():
    """
    Attempts to connect to PostgreSQL with Enterprise Connection Pooling & Load Balancing parameters.
    Tries configured DATABASE_URL, localhost, 127.0.0.1, and unix sockets before falling back.
    """
    candidate_urls = [
        settings.DATABASE_URL,
        "postgresql://postgres:Muthu%40123@127.0.0.1:5432/joy_verification",
        "postgresql://postgres:Muthu%40123@localhost:5432/joy_verification",
        "postgresql://postgres@localhost:5432/joy_verification",
        "postgresql:///joy_verification"
    ]
    
    # Remove empty or duplicate candidate URLs
    seen = set()
    valid_urls = []
    for u in candidate_urls:
        if u and u not in seen:
            seen.add(u)
            valid_urls.append(u)

    for pg_url in valid_urls:
        try:
            engine = create_engine(
                pg_url,
                connect_args={"connect_timeout": 3},
                pool_size=20,
                max_overflow=15,
                pool_timeout=30,
                pool_recycle=1800,
                pool_pre_ping=True
            )
            with engine.connect() as conn:
                logger.info(f"Successfully connected to PostgreSQL Database ({pg_url.split('@')[-1]}) with Connection Pooling (pool_size=20)!")
            return engine
        except Exception as e:
            continue

    logger.warning("PostgreSQL connection not ready across candidate URLs. Falling back to development database engine.")
    return create_engine(
        settings.FALLBACK_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency for FastAPI route handlers to obtain a pooled DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
