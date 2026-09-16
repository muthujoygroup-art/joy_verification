import logging
from datetime import datetime
from sqlalchemy import text
from backend.app.database import engine, Base, SessionLocal
from backend.app.models import (
    Company, HrUser, Candidate, ApiConfiguration, FeatureItem,
    MasterDataOption, MasterFormField, Invoice, PaymentRecord,
    SupportTicket, TicketReply, SystemErrorLog, SystemSetting, PlatformGuideline, CommunicationGateway
)
from backend.app.models.super_admin import SuperAdminUser

logger = logging.getLogger("seed")
logging.basicConfig(level=logging.INFO)

def clean_database_duplicates():
    """Removes duplicate rows across all tables while keeping the most recent or primary record."""
    try:
        with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
            conn.execute(text("""
                DELETE FROM companies c1
                USING companies c2
                WHERE c1.ctid < c2.ctid 
                  AND (c1.code = c2.code OR LOWER(c1.email) = LOWER(c2.email) OR LOWER(c1.name) = LOWER(c2.name));
            """))
            conn.execute(text("""
                DELETE FROM hr_users h1
                USING hr_users h2
                WHERE h1.ctid < h2.ctid 
                  AND LOWER(h1.email) = LOWER(h2.email);
            """))
            conn.execute(text("""
                DELETE FROM candidates c1
                USING candidates c2
                WHERE c1.ctid < c2.ctid 
                  AND (c1.token = c2.token OR (c1.email IS NOT NULL AND LOWER(c1.email) = LOWER(c2.email) AND c1.company_id = c2.company_id));
            """))
            conn.execute(text("""
                DELETE FROM communication_gateways g1
                USING communication_gateways g2
                WHERE g1.ctid < g2.ctid 
                  AND g1.gateway_type = g2.gateway_type 
                  AND ((g1.company_id = g2.company_id) OR (g1.company_id IS NULL AND g2.company_id IS NULL));
            """))
            conn.execute(text("""
                DELETE FROM api_configurations a1
                USING api_configurations a2
                WHERE a1.ctid < a2.ctid 
                  AND a1.provider_key = a2.provider_key;
            """))
            conn.execute(text("""
                DELETE FROM master_data_options m1
                USING master_data_options m2
                WHERE m1.ctid < m2.ctid 
                  AND m1.category = m2.category 
                  AND LOWER(m1.option_value) = LOWER(m2.option_value);
            """))
    except Exception as e:
        logger.warning(f"Note on deduplication: {e}")

def seed_database(force_refresh=False):
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Check Super Admin
        sa_admin = db.query(SuperAdminUser).filter(SuperAdminUser.email == "admin@joycorporatesolutions.com").first()
        if not sa_admin:
            logger.info("Seeding Super Admin: admin@joycorporatesolutions.com...")
            new_sa = SuperAdminUser(
                id="superadmin-01",
                name="Super Administrator",
                email="admin@joycorporatesolutions.com",
                password_hash="SuperAdmin@2026",
                role="superadmin",
                status="Active"
            )
            db.add(new_sa)
            db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Seed error: {e}")
    finally:
        db.close()
