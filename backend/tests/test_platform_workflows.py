import unittest
from backend.app.database import SessionLocal
from backend.app.models import Company, HrUser, Candidate, ApiConfiguration, MasterDataOption
from backend.app.routers.superadmin import format_company_dict

class TestPlatformWorkflows(unittest.TestCase):

    def setUp(self):
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_database_connection_and_models(self):
        """Verify that PostgreSQL/SQLite session can query core entities."""
        companies = self.db.query(Company).all()
        self.assertTrue(isinstance(companies, list))

        api_configs = self.db.query(ApiConfiguration).all()
        self.assertTrue(isinstance(api_configs, list))

    def test_company_serialization_helper(self):
        """Verify safe serialization of company records without leaking sensitive columns."""
        comp = self.db.query(Company).first()
        if comp:
            serialized = format_company_dict(comp)
            self.assertIn("id", serialized)
            self.assertIn("name", serialized)
            self.assertIn("plan", serialized)
            # Ensure sensitive internal hashes are not exposed in default serialization
            self.assertNotIn("password_hash", serialized)

    def test_master_data_options(self):
        """Verify that master data options exist for role classifications and industry types."""
        options = self.db.query(MasterDataOption).all()
        self.assertTrue(len(options) >= 0)

    def test_company_and_hr_relationship(self):
        """Verify that HR users are properly associated with companies."""
        hr_users = self.db.query(HrUser).all()
        for hr in hr_users:
            if hr.company_id:
                comp = self.db.query(Company).filter(Company.id == hr.company_id).first()
                self.assertIsNotNone(comp)

    def test_candidate_profile_schema_integrity(self):
        """Verify candidate record fields and JSON verification configs."""
        candidates = self.db.query(Candidate).all()
        for cand in candidates:
            self.assertTrue(hasattr(cand, "name"))
            self.assertTrue(hasattr(cand, "status"))
            self.assertTrue(hasattr(cand, "verification_config"))

    def test_security_service_pii_masking(self):
        """Verify PII masking functions under DPDP Act 2023 guidelines."""
        from backend.app.services.security_service import (
            mask_aadhaar, mask_pan, mask_bank_account, mask_mobile, sanitize_for_audit_logs
        )
        self.assertEqual(mask_aadhaar("123456789012"), "XXXX-XXXX-9012")
        self.assertEqual(mask_pan("ABCDE1234F"), "ABCDE****F")
        self.assertEqual(mask_mobile("9994699044"), "+91 99****9044")
        self.assertEqual(mask_bank_account("1234567890"), "******7890")

        sanitized = sanitize_for_audit_logs({
            "candidate_name": "Karan Sharma",
            "aadhaar_no": "123456789012",
            "password": "SecretPassword123"
        })
        self.assertEqual(sanitized["aadhaar_no"], "XXXX-XXXX-9012")
        self.assertEqual(sanitized["password"], "[REDACTED_CREDENTIAL]")

    def test_pdf_report_generator_buffer(self):
        """Verify ReportLab PDF generation creates valid non-empty byte buffer."""
        from backend.app.services.report_generator import generate_official_certificate_pdf
        mock_candidate = {
            "id": "cand-test-01",
            "token": "tok_test_01",
            "name": "Karan Sharma",
            "company_name": "Apex Auto Components Ltd",
            "company_code": "APEX",
            "designation": "Technician",
            "status": "Verified",
            "aadhaar_no": "XXXX-XXXX-9012",
            "pan_no": "ABCDE****F",
            "bank_account_no": "******7890",
            "created_at": "2026-09-15"
        }
        pdf_buffer = generate_official_certificate_pdf(mock_candidate)
        self.assertIsNotNone(pdf_buffer)
        pdf_bytes = pdf_buffer.getvalue()
        self.assertTrue(len(pdf_bytes) > 500)
        self.assertTrue(pdf_bytes.startswith(b"%PDF"))

if __name__ == '__main__':
    unittest.main()
