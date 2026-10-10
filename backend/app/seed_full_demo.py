import logging
from datetime import datetime
from backend.app.database import engine, Base, SessionLocal
from backend.app.models import (
    Company, HrUser, Candidate, SuperAdminUser
)

logger = logging.getLogger("seed_demo")
logging.basicConfig(level=logging.INFO)

def seed_full():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Super Admin
        sa = db.query(SuperAdminUser).filter(SuperAdminUser.email == "admin@joycorporatesolutions.com").first()
        if not sa:
            sa = SuperAdminUser(
                id="superadmin-01",
                name="Super Administrator",
                email="admin@joycorporatesolutions.com",
                password_hash="SuperAdmin@2026",
                role="superadmin",
                status="Active"
            )
            db.add(sa)
            db.commit()

        # 2. Companies
        comp1 = db.query(Company).filter(Company.code == "COMP001").first()
        if not comp1:
            comp1 = Company(
                id="comp_076a8152e0",
                code="COMP001",
                name="Joy Corporate Solutions Pvt Ltd",
                contact_person="Muthu Kumar P",
                email="admin@joycorporatesolutions.com",
                plan="tier2",
                status="Active",
                max_limit=100,
                verified_count_this_month=38,
                wallet_balance=200000.0,
                features={
                    "cin": "U74999KA2026PTC098214",
                    "gstin": "33AABCJ1234K1Z5",
                    "pan": "AABCJ1234K",
                    "location": "Joy Tech Park, Electronic City, Bengaluru",
                    "tier_number": 2,
                    "unbilled_amount": 42500,
                    "postpaid_credit_limit": 200000
                }
            )
            db.add(comp1)
            db.commit()

        # 3. HR Users
        hr1 = db.query(HrUser).filter(HrUser.email == "agilan@joycorporatesolutions.com").first()
        if not hr1:
            hr1 = HrUser(
                id="hr_comp002_001",
                company_id=comp1.id,
                name="Agilan (Lead HR)",
                email="agilan@joycorporatesolutions.com",
                password_hash="Hr@Recruiter2026",
                dept="Engineering Talent Acquisition",
                active_links=6,
                status="Active",
                permissions={
                    "can_create": True,
                    "can_verify": True,
                    "can_export": True,
                    "designation": "Lead HR Recruiter",
                    "phone": "+91 78459 66580",
                    "activation_status": "Active"
                }
            )
            db.add(hr1)
            db.commit()

        hr2 = db.query(HrUser).filter(HrUser.email == "haripriya@joycorporatesolutions.com").first()
        if not hr2:
            hr2 = HrUser(
                id="hr_comp001_001",
                company_id=comp1.id,
                name="Hari priya",
                email="haripriya@joycorporatesolutions.com",
                password_hash="Hr@Recruiter2026",
                dept="Managing Recruitment",
                active_links=0,
                status="Active",
                permissions={
                    "can_create": True,
                    "can_verify": True,
                    "can_export": True,
                    "designation": "HR & ADMIN",
                    "phone": "+91 95007 88211",
                    "activation_status": "Active"
                }
            )
            db.add(hr2)
            db.commit()

        # 4. Candidates
        cand1 = db.query(Candidate).filter(Candidate.token == "emp-101").first()
        if not cand1:
            cand1 = Candidate(
                id="emp_001",
                token="emp-101",
                name="Aarav Sharma",
                emp_id="JOY-EMP-8921",
                employee_number="JOY-EMP-8921",
                email="aarav.sharma@example.com",
                mobile="9876543210",
                company_id=comp1.id,
                designation="Senior Software Engineer",
                dept="Engineering & Product",
                status="Verified",
                verification_date="02 Oct 2026, 14:32:10 IST",
                risk_score=0,
                bgv_verdict="Verified & Compliant",
                joining_form_data={
                    "fullName": "Aarav Sharma",
                    "empId": "JOY-EMP-8921",
                    "companyName": "JOY CORPORATE SOLUTIONS PRIVATE LIMITED",
                    "designation": "Senior Software Engineer",
                    "department": "Engineering & Product",
                    "fatherSpouseName": "Rajesh Sharma",
                    "dob": "1994-08-15",
                    "gender": "Male"
                }
            )
            db.add(cand1)
            db.commit()

        cand2 = db.query(Candidate).filter(Candidate.token == "emp-102").first()
        if not cand2:
            cand2 = Candidate(
                id="emp_002",
                token="emp-102",
                name="Priya Nair",
                emp_id="JOY-EMP-8922",
                employee_number="JOY-EMP-8922",
                email="priya.nair@example.com",
                mobile="9845012345",
                company_id=comp1.id,
                designation="Financial Analyst",
                dept="Corporate Finance",
                status="Verified",
                verification_date="02 Oct 2026, 11:15:00 IST",
                risk_score=0,
                bgv_verdict="Verified & Compliant"
            )
            db.add(cand2)
            db.commit()

        logger.info("Successfully seeded demo data in PostgreSQL!")
    except Exception as e:
        db.rollback()
        logger.error(f"Seed error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_full()
