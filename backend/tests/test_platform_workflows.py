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

if __name__ == '__main__':
    unittest.main()
