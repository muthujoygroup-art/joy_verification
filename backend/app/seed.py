import logging
from datetime import datetime
from backend.app.database import engine, Base, SessionLocal
from backend.app.models import (
    Company, HrUser, Candidate, ApiConfiguration, FeatureItem,
    MasterDataOption, MasterFormField, Invoice, PaymentRecord,
    SupportTicket, TicketReply, SystemErrorLog, SystemSetting, PlatformGuideline, CommunicationGateway
)

logger = logging.getLogger("seed")
logging.basicConfig(level=logging.INFO)

def seed_database(force_refresh=True):
    logger.info("Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        if force_refresh:
            logger.info("Cleaning up old duplicate companies, HRs, and candidates...")
            db.query(Candidate).delete()
            db.query(HrUser).delete()
            db.query(Company).delete()
            db.commit()

        # Check if already seeded
        if db.query(Company).first():
            logger.info("Database already seeded with initial data. Skipping.")
            return

        logger.info("Seeding single master company: JOY CORPORATE SOLUTIONS PRIVATE LIMITED...")

        # 1. Single Master Company
        joy_company = Company(
            id="comp-joy",
            name="JOY CORPORATE SOLUTIONS PRIVATE LIMITED",
            code="JOY",
            contact_person="PRAVEEN B",
            email="director@joycorporatesolutions.com",
            plan="Enterprise Premier",
            price_per_verification=120.0,
            verified_count_this_month=1,
            max_limit=5000,
            status="Active",
            features={
                "aadhaar": True, "mobileOtp": True, "faceCapture": True, "drivingLicense": True,
                "pan": True, "uan": True, "education": True, "criminalCheck": True,
                "addressCheck": True, "bankCheck": True, "passport": True, "directorship": True, "voterId": True
            }
        )
        db.add(joy_company)
        db.flush()

        # 2. Single Master HR User (PRAVEEN B)
        hr_praveen = HrUser(
            id="hr-joy-1",
            company_id="comp-joy",
            name="PRAVEEN B",
            email="praveen.b@joycorporatesolutions.com",
            dept="Human Resources & Talent Acquisition",
            active_links=1
        )
        db.add(hr_praveen)
        db.flush()

        # 3. Single Master Candidate (MUTHUKUMAR P)
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
            },
            face_images={
                "straight": "/aadhaar_reference_photo.jpg",
                "livePhoto": "/aadhaar_reference_photo.jpg",
                "aadhaarRef": "/aadhaar_reference_photo.jpg",
                "left": "/aadhaar_reference_photo.jpg",
                "right": "/aadhaar_reference_photo.jpg"
            }
        )
        db.add(cand_muthu)
        db.flush()

        # 4. Master Dropdown Options
        if db.query(MasterDataOption).count() == 0:
            dropdown_seeds = [
                ("departments", "Engineering & IT"),
                ("departments", "Operations & Field Staff"),
                ("departments", "Healthcare & Nursing"),
                ("departments", "Logistics & Fleet"),
                ("departments", "Human Resources"),
                ("departments", "Finance & Accounts"),
                ("designations", "Senior Software Engineer"),
                ("designations", "Fleet Logistics Supervisor"),
                ("designations", "Clinical Nurse"),
                ("designations", "Operations Associate"),
                ("designations", "HR Specialist"),
                ("designations", "Delivery Driver"),
                ("workLocations", "Chennai Corporate HQ"),
                ("workLocations", "Bangalore Tech Hub"),
                ("workLocations", "Hyderabad Operations Center"),
                ("workLocations", "Mumbai Regional Office"),
                ("employmentTypes", "Full-Time Permanent (White Collar)"),
                ("employmentTypes", "Skilled Technical Operator"),
                ("employmentTypes", "Contractual Staff / Field Associate"),
                ("employmentTypes", "Manufacturing & Plant Labor")
            ]
            for cat, val in dropdown_seeds:
                db.add(MasterDataOption(category=cat, value=val))

        # 5. Upstream API Configurations
        if db.query(ApiConfiguration).count() == 0:
            api1 = ApiConfiguration(
                provider_key="server1_sandbox",
                name="Sandbox.co.in API Router",
                endpoint_url="https://api.sandbox.co.in",
                status="Online",
                rate_limit_per_min=2500,
                cost_per_call=2.50,
                is_active=True
            )
            api2 = ApiConfiguration(
                provider_key="server2_coincircle",
                name="CoinCircleTrust Institutional Gateway (47+ APIs)",
                endpoint_url="https://api.coincircletrust.com",
                status="Online",
                rate_limit_per_min=5000,
                cost_per_call=4.00,
                is_active=True
            )
            db.add_all([api1, api2])

        db.commit()
        logger.info("Database reset & seeded successfully with JOY CORPORATE SOLUTIONS PRIVATE LIMITED, PRAVEEN B, and MUTHUKUMAR P!")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database(force_refresh=True)
