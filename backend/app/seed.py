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
        # 1. Super Admin
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

        # 2. Companies
        comp1 = db.query(Company).filter((Company.code == "COMP001") | (Company.id == "COMP001")).first()
        if not comp1:
            comp1 = Company(
                id="COMP001",
                code="COMP001",
                name="Joy Corporate Solutions Private Limited",
                contact_person="Muthu Kumar P",
                email="admin@joycorporatesolutions.com",
                phone="+91 98765 43210",
                plan="tier2",
                status="Active",
                activation_status="Active",
                max_limit=100,
                verified_count_this_month=38,
                wallet_balance=200000.0,
                logo_url="/assets/logos/companies/joy_corporate_solutions_logo.png",
                features={
                    "cin": "U74999KA2026PTC098214",
                    "gstin": "33AABCJ1234K1Z5",
                    "pan": "AABCJ1234K",
                    "location": "Joy Tech Park, Electronic City, Bengaluru",
                    "tier_number": 2
                }
            )
            db.add(comp1)
            db.commit()

        comp2 = db.query(Company).filter((Company.code == "COMP002") | (Company.id == "COMP002")).first()
        if not comp2:
            comp2 = Company(
                id="COMP002",
                code="COMP002",
                name="Joy Man Power Service",
                contact_person="Agilan",
                email="agilan@joycorporatesolutions.com",
                phone="+91 98450 12345",
                plan="tier1",
                status="Active",
                activation_status="Active",
                max_limit=50,
                verified_count_this_month=12,
                wallet_balance=100000.0,
                logo_url="/assets/logos/companies/joy_manpower_service_logo.png",
                features={
                    "location": "Chennai Central Workstation, Tamil Nadu",
                    "tier_number": 1
                }
            )
            db.add(comp2)
            db.commit()

        # 3. HR Users
        hr1 = db.query(HrUser).filter(HrUser.email == "agilan@joycorporatesolutions.com").first()
        if not hr1:
            hr1 = HrUser(
                id="hr_001",
                company_id="COMP002",
                name="Agilan (Lead HR)",
                email="agilan@joycorporatesolutions.com",
                dept="Talent Acquisition",
                active_links=5,
                status="Active",
                permissions={
                    "can_create": True,
                    "can_verify": True,
                    "can_export": True,
                    "designation": "Lead HR Recruiter",
                    "phone": "9876543210",
                    "activation_status": "Active"
                }
            )
            db.add(hr1)
            db.commit()

        # 4. Candidates (Seed if fewer than 2 candidates exist)
        total_cands = db.query(Candidate).count()
        if total_cands < 2:
            c1 = Candidate(
                id="emp_001",
                token="emp-101",
                name="Aarav Sharma",
                emp_id="JOY-EMP-8921",
                employee_number="JOY-EMP-8921",
                email="aarav.sharma@example.com",
                mobile="9876543210",
                company_id="COMP001",
                hr_id="hr_001",
                designation="Senior Software Engineer",
                dept="Engineering & Product",
                status="Verified",
                bgv_verdict="Verified & Compliant",
                risk_score=0.0
            )
            c2 = Candidate(
                id="emp_002",
                token="emp-102",
                name="Priya Nair",
                emp_id="JOY-EMP-8922",
                employee_number="JOY-EMP-8922",
                email="priya.nair@example.com",
                mobile="9845012345",
                company_id="COMP001",
                hr_id="hr_001",
                designation="Financial Analyst",
                dept="Corporate Finance",
                status="Verified",
                bgv_verdict="Verified & Compliant",
                risk_score=0.0
            )
            c3 = Candidate(
                id="emp_003",
                token="emp-103",
                name="Karthik Raja",
                emp_id="JOY-EMP-8923",
                employee_number="JOY-EMP-8923",
                email="karthik.raja@example.com",
                mobile="9845098765",
                company_id="COMP002",
                hr_id="hr_001",
                designation="Operations Manager",
                dept="Operations",
                status="Verified",
                bgv_verdict="Verified & Compliant",
                risk_score=0.0
            )
            c4 = Candidate(
                id="emp_004",
                token="emp-104",
                name="Priya Sundaram",
                emp_id="JOY-EMP-8924",
                employee_number="JOY-EMP-8924",
                email="priya.sundaram@example.com",
                mobile="9789012345",
                company_id="COMP002",
                hr_id="hr_001",
                designation="Senior QA Engineer",
                dept="Quality Assurance",
                status="Link Sent",
                bgv_verdict="Pending Review",
                risk_score=0.0
            )
            c5 = Candidate(
                id="emp_005",
                token="emp-105",
                name="Ramesh Kumar",
                emp_id="JOY-EMP-8925",
                employee_number="JOY-EMP-8925",
                email="ramesh.test@example.com",
                mobile="9876501234",
                company_id="COMP002",
                hr_id="hr_001",
                designation="HR Executive",
                dept="Human Resources",
                status="Link Sent",
                bgv_verdict="Pending Review",
                risk_score=0.0
            )
            db.add_all([c1, c2, c3, c4, c5])
            db.commit()
            logger.info("Default candidate dataset successfully seeded.")
    except Exception as e:
        db.rollback()
        logger.error(f"Seed error: {e}")
    finally:
        db.close()
