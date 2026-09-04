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

def apply_runtime_migrations(target_engine):
    """Executes safe IF NOT EXISTS column and table migrations on PostgreSQL/SQLite"""
    from sqlalchemy import text
    migrations = [
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS employee_number VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS designation VARCHAR(100);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS dept VARCHAR(100);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS aadhaar_no VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS pan_no VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS uan_no VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS dob VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS doj VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS age INTEGER;",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender VARCHAR(20);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS marital_status VARCHAR(30);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS mother_tongue VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS languages_known VARCHAR(200);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS pf_number VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS esi_number VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS religion VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS caste VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS category VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS native_state VARCHAR(100);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS native_district VARCHAR(100);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS identification_marks TEXT;",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS employee_type VARCHAR(50) DEFAULT 'it_tech';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS verification_config JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS verifications_completed JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS face_images JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS specimen_signature TEXT;",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS statutory_details JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT TRUE;",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS consent_ip VARCHAR(50);",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS custom_fields JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS aadhaar_data JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS pan_data JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS bank_data JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS dl_data JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS epfo_data JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS passport_data JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS face_match_data JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS court_record_data JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS verified_attributes JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS manual_checks JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS joining_form_data JSON DEFAULT '{}';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS risk_score FLOAT DEFAULT 0.0;",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS bgv_verdict VARCHAR(50) DEFAULT 'Pending';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS discrepancies_detected JSON DEFAULT '[]';",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP;",
        "CREATE TABLE IF NOT EXISTS candidate_documents (id VARCHAR(50) PRIMARY KEY, candidate_id VARCHAR(50) REFERENCES candidates(id) ON DELETE CASCADE, title VARCHAR(200) NOT NULL, doc_type VARCHAR(50), file_format VARCHAR(20), file_path TEXT, file_size_kb FLOAT DEFAULT 0.0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);",
        "ALTER TABLE candidate_documents ADD COLUMN IF NOT EXISTS file_path TEXT;",
        "ALTER TABLE candidate_documents ADD COLUMN IF NOT EXISTS file_size_kb FLOAT DEFAULT 0.0;",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone VARCHAR(50);",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT 'Company@Admin2026';",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS activation_status VARCHAR(50) DEFAULT 'Active';",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS activation_token VARCHAR(100);",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS activation_password VARCHAR(100) DEFAULT '1234';",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS activation_expires_at TIMESTAMP;",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS cin_number VARCHAR(100);",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS gstin_number VARCHAR(100);",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_pan VARCHAR(50);",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS registered_address TEXT;",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS industry_sector VARCHAR(100) DEFAULT 'Information Technology (IT/ITeS)';",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS website VARCHAR(200);",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS documents JSON DEFAULT '{}';",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS features JSON DEFAULT '{}';",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS terms_accepted VARCHAR(50) DEFAULT 'true';",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS terms_accepted_by VARCHAR(100);",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS terms_version VARCHAR(50) DEFAULT 'v2.4-2026';",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS custom_tariffs JSON DEFAULT '{}';",
        "ALTER TABLE companies ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;",
        "ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT 'Hr@Recruiter2026';",
        "ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS active_links INTEGER DEFAULT 0;",
        "ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS verified_this_month INTEGER DEFAULT 0;",
        "ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS permissions JSON DEFAULT '{\"aadhaar\": true, \"pan\": true, \"epfo\": true, \"bank\": true, \"dl\": true, \"face\": true}';",
        "ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;",
        "ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;",
        "ALTER TABLE communication_gateways ADD COLUMN IF NOT EXISTS company_id VARCHAR(50);",
        "ALTER TABLE communication_gateways ADD COLUMN IF NOT EXISTS settings_data JSON DEFAULT '{}';",
        "ALTER TABLE communication_gateways ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;"
    ]
    for stmt in migrations:
        try:
            with target_engine.begin() as conn:
                conn.execute(text(stmt))
        except Exception:
            pass

engine = get_engine()
try:
    apply_runtime_migrations(engine)
except Exception as _e:
    pass

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency for FastAPI route handlers to obtain a pooled DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
