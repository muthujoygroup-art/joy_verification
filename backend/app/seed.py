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

def seed_database():
    logger.info("Creating database tables if not present...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Company).first():
            logger.info("Database already seeded with initial data. Skipping.")
            return

        logger.info("Seeding initial data into Database...")

        # 1. Companies
        comp1 = Company(
            id="comp-1",
            name="Acme Global Technologies",
            code="ACME",
            contact_person="Vikram Malhotra",
            email="admin@acmeglobal.com",
            plan="Enterprise Premier",
            price_per_verification=120.0,
            verified_count_this_month=142,
            max_limit=500,
            status="Active",
            features={
                "aadhaar": True, "mobileOtp": True, "faceCapture": True, "drivingLicense": True,
                "pan": True, "uan": True, "education": True, "criminalCheck": False,
                "addressCheck": False, "bankCheck": True
            }
        )
        comp2 = Company(
            id="comp-2",
            name="Apex Logistics & Freight",
            code="APEX",
            contact_person="Ananya Sharma",
            email="hr-head@apexlogistics.in",
            plan="Standard Tier",
            price_per_verification=100.0,
            verified_count_this_month=88,
            max_limit=250,
            status="Active",
            features={
                "aadhaar": True, "mobileOtp": True, "faceCapture": True, "drivingLicense": False,
                "pan": True, "uan": False, "education": False, "criminalCheck": False,
                "addressCheck": True, "bankCheck": False
            }
        )
        comp3 = Company(
            id="comp-3",
            name="Starlight Healthcare Solutions",
            code="SHS",
            contact_person="Dr. Ramesh Iyer",
            email="operations@starlighthealth.org",
            plan="Basic Tier",
            price_per_verification=80.0,
            verified_count_this_month=34,
            max_limit=100,
            status="Active",
            features={
                "aadhaar": True, "mobileOtp": True, "faceCapture": False, "drivingLicense": False,
                "pan": False, "uan": False, "education": False, "criminalCheck": False,
                "addressCheck": False, "bankCheck": False
            }
        )
        db.add_all([comp1, comp2, comp3])
        db.flush()

        # 2. HR Users
        hr1 = HrUser(id="hr-1", company_id="comp-1", name="Priya Sundaram", email="priya.s@acmeglobal.com", dept="Engineering Recruitment", active_links=12)
        hr2 = HrUser(id="hr-2", company_id="comp-1", name="Rahul Verma", email="rahul.v@acmeglobal.com", dept="Operations & Field Staff", active_links=8)
        hr3 = HrUser(id="hr-3", company_id="comp-2", name="Sneha Patel", email="sneha.p@apexlogistics.in", dept="Logistics Drivers & Fleet", active_links=15)
        db.add_all([hr1, hr2, hr3])
        db.flush()

        # 3. Candidates
        cand1 = Candidate(
            id="emp-101",
            token="tok_rajesh_891",
            name="Rajesh Kumar",
            emp_id="ACME-2026-88",
            email="rajesh.k@gmail.com",
            mobile="+91 98765 43210",
            aadhaar_no="5489 1234 9876",
            designation="Senior Software Engineer",
            dept="Engineering",
            company_id="comp-1",
            hr_id="hr-1",
            status="Verified",
            verification_config={"requireAadhaar": True, "requireMobileOtp": True, "requireFaceMatch": True, "requireDL": False, "requirePAN": True, "requireBankCheck": True},
            verifications_completed={"aadhaar": True, "mobile": True, "face": True, "pan": True, "bankCheck": True},
            face_images={
                "straight": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                "left": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                "right": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
            },
            verification_date=datetime(2026, 8, 19, 14, 32)
        )
        cand2 = Candidate(
            id="emp-102",
            token="tok_sunita_412",
            name="Sunita Mehra",
            emp_id="ACME-2026-89",
            email="sunita.mehra@outlook.com",
            mobile="+91 91234 56789",
            aadhaar_no="7812 3456 0192",
            designation="Fleet Operations Supervisor",
            dept="Operations",
            company_id="comp-1",
            hr_id="hr-2",
            status="In Verification",
            verification_config={"requireAadhaar": True, "requireMobileOtp": True, "requireFaceMatch": True, "requireDL": True, "requirePAN": False, "requireBankCheck": False},
            verifications_completed={"aadhaar": True, "mobile": False, "face": False},
            face_images={"straight": None, "left": None, "right": None}
        )
        cand3 = Candidate(
            id="emp-103",
            token="tok_karan_903",
            name="Karan Malhotra",
            emp_id="APEX-2026-14",
            email="karan.m@yahoo.com",
            mobile="+91 99887 76655",
            aadhaar_no="6543 9876 2109",
            designation="Logistics Coordinator",
            dept="Fleet Management",
            company_id="comp-2",
            hr_id="hr-3",
            status="Link Sent",
            verification_config={"requireAadhaar": True, "requireMobileOtp": True, "requireFaceMatch": True, "requireDL": False, "requirePAN": True},
            verifications_completed={"aadhaar": False, "mobile": False, "face": False},
            face_images={"straight": None, "left": None, "right": None}
        )
        db.add_all([cand1, cand2, cand3])
        db.flush()

        # 4. Master Dropdown Options
        dropdown_seeds = [
            ("departments", "Engineering & IT"),
            ("departments", "Logistics & Delivery Fleet"),
            ("departments", "Clinical & Medical Staff"),
            ("departments", "Human Resources"),
            ("departments", "Finance & Accounting"),
            ("departments", "Sales & Business Development"),
            ("departments", "Field Operations & Quality"),
            ("departments", "Customer Support & Helpdesk"),
            ("designations", "Senior Software Engineer"),
            ("designations", "Fleet Logistics Driver"),
            ("designations", "Clinical Nurse / Specialist"),
            ("designations", "HR Operations Associate"),
            ("designations", "Field Quality Inspector"),
            ("designations", "Project Manager & Team Lead"),
            ("workLocations", "Bengaluru Tech Park (HQ)"),
            ("workLocations", "Mumbai Financial District"),
            ("workLocations", "Delhi Logistics Hub"),
            ("workLocations", "Chennai Regional Office"),
            ("workLocations", "Hyderabad R&D Center"),
            ("workLocations", "Remote / Field Site"),
            ("qualifications", "B.Tech / B.E. in Computer Science"),
            ("qualifications", "Diploma in Commercial Driving"),
            ("qualifications", "B.Sc in Nursing / Healthcare"),
            ("qualifications", "MBA in HR & Operations"),
            ("qualifications", "Bachelor of Commerce (B.Com)"),
            ("qualifications", "Higher Secondary (10+2)"),
            ("employmentTypes", "Full Time Permanent"),
            ("employmentTypes", "Contract Staff"),
            ("employmentTypes", "Labor / Field Operative"),
            ("employmentTypes", "Internship / Trainee")
        ]
        for cat, val in dropdown_seeds:
            db.add(MasterDataOption(category=cat, option_value=val, is_active=True))

        # 5. Master Form Fields
        fields = [
            MasterFormField(id="f_aadhaar", label="Aadhaar UIDAI Number", field_type="number", category="Personal Info", default_mandatory=True),
            MasterFormField(id="f_dob", label="Date of Birth (DOB)", field_type="date", category="Personal Info", default_mandatory=True),
            MasterFormField(id="f_pan", label="Permanent Account Number (PAN)", field_type="text", category="Tax ID", default_mandatory=True),
            MasterFormField(id="f_uan", label="Universal Account Number (UAN)", field_type="number", category="Employment", default_mandatory=False),
            MasterFormField(id="f_bank_acc", label="Bank Account Number & IFSC", field_type="text", category="Financial", default_mandatory=True),
            MasterFormField(id="f_dl", label="Commercial Driving License No", field_type="text", category="Government ID", default_mandatory=False)
        ]
        db.add_all(fields)

        # 6. API Configurations
        api_configs = [
            ApiConfiguration(
                provider_key="apisetu",
                display_name="API SETU (National Informatics Centre)",
                endpoint_url="https://api.apisetu.gov.in/v2/uidai/verify",
                api_key="setu_prod_live_8918239081290",
                secret_key="setu_sec_9912",
                webhook_url="https://verify.joydata.com/webhooks/apisetu",
                sandbox_mode=False,
                rate_limit_per_min=120,
                status="Operational",
                monthly_quota=25000,
                monthly_used=3812
            ),
            ApiConfiguration(
                provider_key="sandbox",
                display_name="Sandbox API Engine (Mobile OTP & Bank Penny Drop)",
                endpoint_url="https://api.sandbox.co.in/kyc/v1",
                api_key="sbx_live_992183901",
                secret_key="sbx_sec_7721",
                webhook_url="https://verify.joydata.com/webhooks/sandbox",
                sandbox_mode=False,
                rate_limit_per_min=200,
                status="Operational",
                monthly_quota=50000,
                monthly_used=12400
            ),
            ApiConfiguration(
                provider_key="coincircle",
                display_name="Coincircletrust Biometrics Engine",
                endpoint_url="https://api.coincircletrust.io/v3/face-liveness",
                api_key="cct_bio_key_771892019",
                secret_key="cct_sec_3301",
                webhook_url="https://verify.joydata.com/webhooks/coincircle",
                sandbox_mode=True,
                rate_limit_per_min=50,
                status="Operational",
                monthly_quota=10000,
                monthly_used=2190
            )
        ]
        db.add_all(api_configs)

        # 7. System Error Logs
        logs = [
            SystemErrorLog(
                id="LOG-901",
                timestamp="2026-08-20 11:24:10",
                section="API Gateway - API SETU",
                error_code="UIDAI_TIMEOUT_504",
                message="UIDAI Aadhaar OTP gateway latency spiked to 4.2s. Automatic fallback retry succeeded.",
                severity="Warning",
                solved=True,
                resolved_at=datetime(2026, 8, 20, 12, 0),
                resolved_by="Super Admin (Automated Resilience)"
            ),
            SystemErrorLog(
                id="LOG-902",
                timestamp="2026-08-21 09:12:44",
                section="HR Profiler - Link Dispatch",
                error_code="SMTP_DELIVERY_FAIL",
                message="Candidate email server rejected delivery for user `john.doe@invalidmail.com` (550 Mailbox Unavailable).",
                severity="Info",
                solved=False
            ),
            SystemErrorLog(
                id="LOG-903",
                timestamp="2026-08-22 14:05:19",
                section="Biometrics - Coincircletrust",
                error_code="FACE_LIVENESS_LOW_LIGHT",
                message="WebCam frame capture rejected due to lux illumination < 15 lux. Candidate prompted to turn on ambient light.",
                severity="Warning",
                solved=False
            )
        ]
        db.add_all(logs)

        # 8. Support Tickets
        t1 = SupportTicket(
            id="TCK-8812",
            company_id="comp-1",
            company_name="Acme Global Technologies",
            subject="Rate limit expansion request for campus recruitment drive",
            category="API Integration",
            priority="High",
            status="In Progress",
            created_at=datetime(2026, 8, 21, 10, 15),
            updated_at=datetime(2026, 8, 21, 11, 45)
        )
        db.add(t1)
        db.flush()

        r1 = TicketReply(
            id="rep-1",
            ticket_id="TCK-8812",
            sender_role="company",
            sender_name="Vikram Malhotra (Acme Global)",
            message="Hi Super Admin Team, we have an upcoming bulk hiring drive this Friday. Could we expand our API SETU throughput limit from 60/min to 150/min?",
            timestamp=datetime(2026, 8, 21, 10, 15)
        )
        r2 = TicketReply(
            id="rep-2",
            ticket_id="TCK-8812",
            sender_role="superadmin",
            sender_name="Super Admin Support Desk",
            message="Hello Vikram, we have provisioned temporary surge bandwidth on your Enterprise Premier plan for Friday. Rate limit adjusted to 200/min.",
            timestamp=datetime(2026, 8, 21, 11, 45)
        )
        db.add_all([r1, r2])

        # 9. Invoices
        inv1 = Invoice(
            id="INV-ACME-AUG26",
            company_id="comp-1",
            month="August",
            year=2026,
            verifications_count=142,
            unit_price=120.0,
            subtotal=17040.0,
            tax_rate=18.0,
            tax_amount=3067.2,
            total_amount=20107.2,
            status="Pending",
            due_date="2026-09-05",
            line_items=[
                {"desc": "Metered Identity Verifications (August 2026)", "qty": 142, "rate": 120, "amount": 17040},
                {"desc": "Integrated UIDAI / Biometric Infrastructure Service", "qty": 1, "rate": 0, "amount": 0.0}
            ]
        )
        db.add(inv1)

        db.commit()
        logger.info("Successfully seeded all initial records into database!")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
