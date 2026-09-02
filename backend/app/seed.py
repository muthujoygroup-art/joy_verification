import logging
from datetime import datetime
from sqlalchemy import text
from backend.app.database import engine, Base, SessionLocal
from backend.app.models import (
    Company, HrUser, Candidate, ApiConfiguration, FeatureItem,
    MasterDataOption, MasterFormField, Invoice, PaymentRecord,
    SupportTicket, TicketReply, SystemErrorLog, SystemSetting, PlatformGuideline, CommunicationGateway
)

logger = logging.getLogger("seed")
logging.basicConfig(level=logging.INFO)

def clean_database_duplicates():
    """Removes duplicate rows across all tables while keeping the most recent or primary record."""
    db = SessionLocal()
    try:
        logger.info("Executing comprehensive database deduplication...")
        
        # 1. Deduplicate Companies by code / email (keep newest)
        with engine.connect() as conn:
            conn.execute(text("""
                DELETE FROM companies c1
                USING companies c2
                WHERE c1.ctid < c2.ctid 
                  AND (c1.code = c2.code OR LOWER(c1.email) = LOWER(c2.email) OR LOWER(c1.name) = LOWER(c2.name));
            """))
            
            # 2. Deduplicate HR Users by email (keep newest)
            conn.execute(text("""
                DELETE FROM hr_users h1
                USING hr_users h2
                WHERE h1.ctid < h2.ctid 
                  AND LOWER(h1.email) = LOWER(h2.email);
            """))
            
            # 3. Deduplicate Candidates by token / email (keep newest)
            conn.execute(text("""
                DELETE FROM candidates c1
                USING candidates c2
                WHERE c1.ctid < c2.ctid 
                  AND (c1.token = c2.token OR (c1.email IS NOT NULL AND LOWER(c1.email) = LOWER(c2.email) AND c1.company_id = c2.company_id));
            """))
            
            # 4. Deduplicate Communication Gateways by gateway_type & company_id
            conn.execute(text("""
                DELETE FROM communication_gateways g1
                USING communication_gateways g2
                WHERE g1.ctid < g2.ctid 
                  AND g1.gateway_type = g2.gateway_type 
                  AND ((g1.company_id = g2.company_id) OR (g1.company_id IS NULL AND g2.company_id IS NULL));
            """))

            # 5. Deduplicate API Configurations by provider_key
            conn.execute(text("""
                DELETE FROM api_configurations a1
                USING api_configurations a2
                WHERE a1.ctid < a2.ctid 
                  AND a1.provider_key = a2.provider_key;
            """))

            # 6. Deduplicate Master Data Options by category & option_value
            conn.execute(text("""
                DELETE FROM master_data_options m1
                USING master_data_options m2
                WHERE m1.ctid < m2.ctid 
                  AND m1.category = m2.category 
                  AND LOWER(m1.option_value) = LOWER(m2.option_value);
            """))
            
            conn.commit()
        logger.info("Database deduplication completed successfully!")
    except Exception as e:
        logger.warning(f"Note on deduplication: {e}")
    finally:
        db.close()

def seed_database(force_refresh=False):
    Base.metadata.create_all(bind=engine)
    clean_database_duplicates()
    
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
            db.flush()

        # 2. Check master company (muthukumar@joyglobalcorp.com)
        joy_comp = db.query(Company).filter(Company.id == "comp-joy").first()
        if not joy_comp:
            logger.info("Seeding master company: JOY CORPORATE SOLUTIONS PRIVATE LIMITED...")
            joy_company = Company(
                id="comp-joy",
                name="JOY CORPORATE SOLUTIONS PRIVATE LIMITED",
                code="JOY",
                contact_person="MUTHUKUMAR P",
                email="muthukumar@joyglobalcorp.com",
                plan="Enterprise Premier",
                price_per_verification=120.0,
                verified_count_this_month=1,
                max_limit=5000,
                status="Active",
                activation_status="Active",
                features={
                    "aadhaar": True, "mobileOtp": True, "faceCapture": True, "drivingLicense": True,
                    "pan": True, "uan": True, "education": True, "criminalCheck": True,
                    "addressCheck": True, "bankCheck": True, "passport": True, "directorship": True, "voterId": True
                }
            )
            db.add(joy_company)
            db.flush()

        # 3. Check master HR (muthujoygroup@gmail.com)
        joy_hr = db.query(HrUser).filter(HrUser.id == "hr-joy-1").first()
        if not joy_hr:
            hr_muthu = HrUser(
                id="hr-joy-1",
                company_id="comp-joy",
                name="MUTHUKUMAR P (HR Lead)",
                email="muthujoygroup@gmail.com",
                dept="Human Resources & Talent Acquisition",
                active_links=1
            )
            db.add(hr_muthu)
            db.flush()

        # Check master Candidate
        joy_cand = db.query(Candidate).filter(Candidate.id == "emp-101").first()
        if not joy_cand:
            cand_muthu = Candidate(
                id="emp-101",
                token="tok_sunita_412",
                name="MUTHUKUMAR P",
                emp_id="JOY-2026-001",
                email="muthukumar.p@joycorporatesolutions.com",
                mobile="+91 98765 43210",
                aadhaar_no="5489 1234 9876",
                designation="Senior Verification Engineer",
                dept="Technology & Engineering",
                company_id="comp-joy",
                hr_id="hr-joy-1",
                status="Pending",
                verification_config={
                    "requireAadhaar": True, "requireMobileOtp": True, "requireFaceMatch": True,
                    "requireDL": False, "requirePAN": True, "requireBankCheck": True
                },
                verifications_completed={
                    "aadhaar": False, "mobile": False, "face": False, "pan": False, "bankCheck": False
                }
            )
            db.add(cand_muthu)
            db.flush()

        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Seed error: {e}")
    finally:
        db.close()
