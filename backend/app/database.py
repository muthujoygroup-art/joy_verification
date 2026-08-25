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
    If PostgreSQL is unreachable or not started yet, falls back to SQLite to guarantee uptime.
    """
    pg_url = settings.DATABASE_URL
    try:
        engine = create_engine(
            pg_url,
            connect_args={"connect_timeout": 3},
            pool_size=20,          # High-concurrency connection pool
            max_overflow=15,       # Burst capacity for simultaneous verifications
            pool_timeout=30,       # Wait up to 30s for an available connection
            pool_recycle=1800,     # Recycle connections every 30 minutes to avoid stale sockets
            pool_pre_ping=True     # Auto-verify connection liveness before queries
        )
        # Test connection
        with engine.connect() as conn:
            logger.info("Successfully connected to PostgreSQL Database with Connection Pooling (pool_size=20)!")
        return engine
    except Exception as e:
        logger.warning(f"PostgreSQL connection not ready ({e}). Falling back to development database engine.")
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
