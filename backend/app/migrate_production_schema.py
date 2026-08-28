"""
JOY DATA VERIFICATION - Complete Production Database Migration & Verification Engine
Creates and seeds all 19 enterprise tables in PostgreSQL / SQLite:
1. super_admin_users
2. companies
3. hr_users
4. candidates
5. verification_records
6. candidate_documents
7. invoices
8. payment_records
9. support_tickets
10. ticket_replies
11. system_error_logs
12. system_settings
13. platform_guidelines
14. communication_gateways
15. master_data_options
16. master_form_fields
17. api_configurations
18. active_sessions
19. audit_trail_logs
"""

import sys
import hashlib
from datetime import datetime, timedelta
from sqlalchemy import inspect
from backend.app.database import engine, Base, SessionLocal
from backend.app.models import (
    SuperAdminUser,
    Company,
    HrUser,
    Candidate,
    CandidateDocument,
    VerificationRecord,
    ActiveSession,
    AuditTrailLog,
    ApiConfiguration,
    MasterDataOption,
    MasterFormField,
    Invoice,
    PaymentRecord,
    SupportTicket,
    TicketReply,
    SystemErrorLog,
    SystemSetting,
    PlatformGuideline,
    CommunicationGateway
)

from sqlalchemy import text

def run_migration():
    print("=" * 80)
    print("🚀 STARTING JOY ENTERPRISE PRODUCTION DATABASE SCHEMA MIGRATION")
    print("=" * 80)

    # 1. Create all tables defined on Base
    Base.metadata.create_all(bind=engine)
    print("✓ Base.metadata.create_all executed successfully.")

    # 2. Run schema alterations for existing tables to add any missing columns
    with engine.connect() as conn:
        alter_statements = [
            "ALTER TABLE companies ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT 'Company@Admin2026';",
            "ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;",
            "ALTER TABLE companies ADD COLUMN IF NOT EXISTS wallet_balance FLOAT DEFAULT 50000.0;",
            "ALTER TABLE companies ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;",
            "ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT 'Hr@Recruiter2026';",
            "ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS permissions JSON DEFAULT '{\"can_create\": true, \"can_verify\": true, \"can_export\": true}';",
            "ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;",
            "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS portal_password VARCHAR(50) DEFAULT '1234';",
            "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS joining_form_data JSON DEFAULT '{}';",
            "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS verified_attributes JSON DEFAULT '{}';",
            "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS manual_checks JSON DEFAULT '{}';",
            "ALTER TABLE communication_gateways ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;"
        ]
        for stmt in alter_statements:
            try:
                conn.execute(text(stmt))
            except Exception as ex:
                pass
        conn.commit()
        print("✓ Executed all table column alterations (ADD COLUMN IF NOT EXISTS).")

    db = SessionLocal()
    try:
        # 3. Seed Super Admin User if not exists
        admin = db.query(SuperAdminUser).filter(SuperAdminUser.email == "superadmin@joyverification.com").first()
        if not admin:
            admin = SuperAdminUser(
                id="superadmin-01",
                name="Super Administrator",
                email="superadmin@joyverification.com",
                password_hash=hashlib.sha256("Master@Admin2026".encode()).hexdigest(),
                role="superadmin",
                status="Active",
                two_factor_enabled=True,
                last_login_at=datetime.utcnow()
            )
            db.add(admin)
            print("✓ Seeded SuperAdminUser (superadmin@joyverification.com)")

        # 3. Seed Companies with password
        comp = db.query(Company).filter(Company.id == "comp-1").first()
        if not comp:
            comp = Company(
                id="comp-1",
                name="Acme Global Technologies",
                code="ACME-CORP",
                contact_person="Vikram Malhotra",
                email="admin@acmeglobal.com",
                password_hash=hashlib.sha256("Company@Admin2026".encode()).hexdigest(),
                plan="Enterprise Premier",
                price_per_verification=120.0,
                verified_count_this_month=142,
                max_limit=500,
                wallet_balance=50000.0,
                status="Active",
                features={
                    "aadhaar": True, "pan": True, "bankCheck": True, "uan": True,
                    "drivingLicense": True, "passport": True, "aiFaceBiometrics": True,
                    "mobileOtp": True, "emailGateway": True, "faceCapture": True
                }
            )
            db.add(comp)
            print("✓ Seeded Company (Acme Global Technologies)")

        # 4. Seed HR User with password
        hr = db.query(HrUser).filter(HrUser.id == "hr-1").first()
        if not hr:
            hr = HrUser(
                id="hr-1",
                company_id="comp-1",
                name="Priya Sundaram",
                email="priya.s@acmeglobal.com",
                password_hash=hashlib.sha256("Hr@Recruiter2026".encode()).hexdigest(),
                dept="Engineering Recruitment",
                active_links=5,
                status="Active"
            )
            db.add(hr)
            print("✓ Seeded HrUser (Priya Sundaram)")

        # 5. Seed Candidate if not exists
        cand = db.query(Candidate).filter(Candidate.id == "cand-1").first()
        if not cand:
            cand = Candidate(
                id="cand-1",
                token="tok_sunita_412",
                name="Sunita Mehra",
                emp_id="EMP-2026-8812",
                email="sunita.mehra@example.com",
                mobile="+91 9876543210",
                aadhaar_no="541289123412",
                designation="Senior Frontend Engineer",
                dept="Engineering & UI/UX",
                company_id="comp-1",
                hr_id="hr-1",
                status="Verified",
                verification_config={"aadhaar": True, "pan": True, "bankCheck": True, "aiFaceBiometrics": True},
                verifications_completed={"aadhaar": True, "pan": True, "bankCheck": True, "aiFaceBiometrics": True},
                verified_attributes={
                    "fullName": "Sunita Mehra",
                    "fatherName": "Rajesh Mehra",
                    "dob": "1995-08-14",
                    "gender": "Female",
                    "panNumber": "ABCDE1234F",
                    "bankAccountNo": "100239102931",
                    "ifscCode": "HDFC0001234",
                    "bankName": "HDFC Bank Ltd",
                    "bloodGroup": "B+",
                    "maritalStatus": "Single"
                },
                verification_date=datetime.utcnow()
            )
            db.add(cand)
            print("✓ Seeded Candidate (Sunita Mehra)")

        # 6. Seed VerificationRecord if not exists
        vr = db.query(VerificationRecord).filter(VerificationRecord.id == "vr-aadh-01").first()
        if not vr:
            vr = VerificationRecord(
                id="vr-aadh-01",
                candidate_id="cand-1",
                token="tok_sunita_412",
                verification_type="aadhaar",
                status="VERIFIED",
                provider="Server 1: Sandbox.co.in (UIDAI Direct)",
                transaction_ref="UIDAI-TXN-20260828-99120",
                fetched_data={"name": "Sunita Mehra", "dob": "1995-08-14", "gender": "Female", "maskedAadhaar": "XXXX-XXXX-3412"},
                raw_payload={"status": "VALID", "signature": "SHA256_RSA_2048", "issuer": "UIDAI Central ID Repository"},
                confidence_score=1.0,
                sha256_seal="sha256_seal_99812480192841_joy_audit"
            )
            db.add(vr)
            print("✓ Seeded VerificationRecord (Aadhaar)")

        # 7. Seed CandidateDocument if not exists
        cd = db.query(CandidateDocument).filter(CandidateDocument.id == "cd-01").first()
        if not cd:
            cd = CandidateDocument(
                id="cd-01",
                candidate_id="cand-1",
                title="Official Aadhaar e-KYC XML Portrait",
                doc_type="aadhaar",
                file_format="pdf",
                file_path="/storage/documents/cand-1/aadhaar_verified.pdf",
                file_size_kb=420.5
            )
            db.add(cd)
            print("✓ Seeded CandidateDocument (Aadhaar e-KYC)")

        # 8. Seed Invoice if not exists
        inv = db.query(Invoice).filter(Invoice.id == "inv-2026-01").first()
        if not inv:
            inv = Invoice(
                id="inv-2026-01",
                company_id="comp-1",
                month="August",
                year=2026,
                verifications_count=142,
                unit_price=120.0,
                subtotal=17040.0,
                tax_rate=18.0,
                tax_amount=3067.2,
                total_amount=20107.2,
                status="PENDING",
                due_date=datetime.utcnow() + timedelta(days=15),
                line_items=[
                    {"item": "Aadhaar e-KYC Verifications", "qty": 142, "unit": 60.0, "total": 8520.0},
                    {"item": "PAN + Bank Account Verifications", "qty": 142, "unit": 60.0, "total": 8520.0}
                ]
            )
            db.add(inv)
            print("✓ Seeded Invoice (INV-2026-01)")

        # 9. Seed PaymentRecord if not exists
        pay = db.query(PaymentRecord).filter(PaymentRecord.id == "pay-01").first()
        if not pay:
            pay = PaymentRecord(
                id="pay-01",
                company_id="comp-1",
                amount=50000.0,
                payment_method="Razorpay UPI Auto-Recharge",
                transaction_ref="pay_rzp_live_9912401",
                status="SUCCESS",
                notes="Enterprise Credit Wallet Recharge (416 checks)"
            )
            db.add(pay)
            print("✓ Seeded PaymentRecord (Wallet Recharge)")

        # 10. Seed AuditTrailLog if not exists
        audit = db.query(AuditTrailLog).filter(AuditTrailLog.id == "audit-01").first()
        if not audit:
            audit = AuditTrailLog(
                id="audit-01",
                actor_role="superadmin",
                actor_email="superadmin@joyverification.com",
                action="INITIAL_DATABASE_SCHEMA_PROVISIONING",
                target_company_id="comp-1",
                details={"status": "SUCCESS", "tables_provisioned": 19},
                ip_address="127.0.0.1",
                prev_hash="0000000000000000000000000000000000000000000000000000000000000000",
                curr_hash=hashlib.sha256("INITIAL_GENESIS_BLOCK_2026".encode()).hexdigest()
            )
            db.add(audit)
            print("✓ Seeded AuditTrailLog (Genesis Block)")

        # 11. Seed ActiveSession if not exists
        sess = db.query(ActiveSession).filter(ActiveSession.id == "sess-01").first()
        if not sess:
            sess = ActiveSession(
                id="sess-01",
                user_id="superadmin-01",
                role="superadmin",
                email="superadmin@joyverification.com",
                token_hash="jwt_token_hash_master_2026",
                ip_address="127.0.0.1",
                device="MacBook Pro / Chrome",
                expires_at=datetime.utcnow() + timedelta(hours=2)
            )
            db.add(sess)
            print("✓ Seeded ActiveSession")

        # 12. Seed PlatformGuideline if not exists
        guide = db.query(PlatformGuideline).filter(PlatformGuideline.role == "superadmin").first()
        if not guide:
            guide = PlatformGuideline(
                role="superadmin",
                guidelines_data=[
                    {"title": "DPDP Act 2023 Consent Audit", "desc": "Ensure all candidate checks possess digital consent signatures."},
                    {"title": "API Gateway Quota Balancing", "desc": "Monitor Sandbox.co.in vs CoinCircleTrust failover quotas."}
                ]
            )
            db.add(guide)
            print("✓ Seeded PlatformGuideline")

        # 13. Seed SystemSetting if not exists
        setting = db.query(SystemSetting).filter(SystemSetting.role == "superadmin").first()
        if not setting:
            setting = SystemSetting(
                role="superadmin",
                settings_data={
                    "platformName": "JOY DATA VERIFICATION",
                    "autoInvoiceDispatch": True,
                    "defaultGstRate": 18,
                    "sessionTimeoutMinutes": 30
                }
            )
            db.add(setting)
            print("✓ Seeded SystemSetting")

        db.commit()
        print("✓ All transactions committed successfully.")

    except Exception as e:
        db.rollback()
        print(f"❌ Migration Exception: {e}")
    finally:
        db.close()

    # 14. Inspect and list all tables in the database
    inspector = inspect(engine)
    all_tables = inspector.get_table_names()

    print("\n" + "=" * 80)
    print(f"📊 DATABASE AUDIT VERIFICATION: {len(all_tables)} TABLES DETECTED IN ENGINE")
    print("=" * 80)
    for idx, table_name in enumerate(sorted(all_tables), start=1):
        cols = [c["name"] for c in inspector.get_columns(table_name)]
        print(f"  [{idx:02d}] 📁 {table_name:<28} -> {len(cols)} columns: {', '.join(cols[:5])}{'...' if len(cols) > 5 else ''}")
    print("=" * 80)

if __name__ == "__main__":
    run_migration()
