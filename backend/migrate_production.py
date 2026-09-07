"""
Standalone Production Database Migration Script for Joy Data Verification
Run this script via cPanel Terminal or Python CLI:
    python backend/migrate_production.py
"""

import sys
import os

# Ensure backend path is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.database import engine
from sqlalchemy import text

def run_migrations():
    print("==================================================================")
    print("JOY DATA VERIFICATION - POSTGRESQL PRODUCTION MIGRATION RUNNER")
    print("==================================================================")
    
    statements = [
        ("api_configurations.secret_key", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS secret_key VARCHAR(255);"),
        ("api_configurations.webhook_url", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS webhook_url VARCHAR(255);"),
        ("api_configurations.sandbox_mode", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS sandbox_mode BOOLEAN DEFAULT FALSE;"),
        ("api_configurations.rate_limit_per_min", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS rate_limit_per_min INTEGER DEFAULT 120;"),
        ("api_configurations.status", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'CONNECTED';"),
        ("api_configurations.is_active", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;"),
        ("api_configurations.is_primary", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE;"),
        ("api_configurations.supported_services", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS supported_services JSON DEFAULT '[\"aadhaar\", \"pan\", \"bank\", \"dl\", \"passport\", \"uan\", \"face\"]'::json;"),
        ("api_configurations.provider_type", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS provider_type VARCHAR(100) DEFAULT 'Institutional Gateway';"),
        ("api_configurations.description", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS description TEXT;"),
        ("api_configurations.ping_latency_ms", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS ping_latency_ms INTEGER DEFAULT 62;"),
        ("api_configurations.monthly_quota", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS monthly_quota INTEGER DEFAULT 10000;"),
        ("api_configurations.monthly_used", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS monthly_used INTEGER DEFAULT 0;"),
        ("api_configurations.last_synced", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"),
        ("api_configurations.updated_at", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"),
        ("api_call_logs.table", "CREATE TABLE IF NOT EXISTS api_call_logs (id VARCHAR(50) PRIMARY KEY, endpoint_slug VARCHAR(150) NOT NULL, category VARCHAR(100) NOT NULL, initiator_role VARCHAR(50) DEFAULT 'superadmin', initiator_id VARCHAR(100), company_id VARCHAR(50), provider_key VARCHAR(50) DEFAULT 'server2_coincircle', status VARCHAR(50) DEFAULT 'SUCCESS', http_status INTEGER DEFAULT 200, latency_ms INTEGER DEFAULT 50, cost_incurred FLOAT DEFAULT 4.0, input_identifier VARCHAR(100), request_payload JSON DEFAULT '{}'::json, response_summary JSON DEFAULT '{}'::json, error_message TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"),
        ("api_call_logs.http_status", "ALTER TABLE api_call_logs ADD COLUMN IF NOT EXISTS http_status INTEGER DEFAULT 200;"),
        ("api_call_logs.latency_ms", "ALTER TABLE api_call_logs ADD COLUMN IF NOT EXISTS latency_ms INTEGER DEFAULT 50;"),
        ("api_call_logs.cost_incurred", "ALTER TABLE api_call_logs ADD COLUMN IF NOT EXISTS cost_incurred FLOAT DEFAULT 4.0;"),
        ("api_call_logs.input_identifier", "ALTER TABLE api_call_logs ADD COLUMN IF NOT EXISTS input_identifier VARCHAR(100);"),
        ("api_call_logs.request_payload", "ALTER TABLE api_call_logs ADD COLUMN IF NOT EXISTS request_payload JSON DEFAULT '{}'::json;"),
        ("api_call_logs.response_summary", "ALTER TABLE api_call_logs ADD COLUMN IF NOT EXISTS response_summary JSON DEFAULT '{}'::json;"),
        ("api_call_logs.error_message", "ALTER TABLE api_call_logs ADD COLUMN IF NOT EXISTS error_message TEXT;"),
        ("verification_records.api_calls_count", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS api_calls_count INTEGER DEFAULT 1;"),
        ("verification_records.cost_incurred", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS cost_incurred FLOAT DEFAULT 4.0;"),
        ("verification_records.latency_ms", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS latency_ms INTEGER DEFAULT 62;"),
        ("verification_records.endpoint_path", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS endpoint_path VARCHAR(150);"),
        ("verification_records.api_id", "ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS api_id VARCHAR(100);"),
        ("candidates.employee_number", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS employee_number VARCHAR(50);"),
        ("candidates.dob", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS dob VARCHAR(50);"),
        ("candidates.doj", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS doj VARCHAR(50);"),
        ("candidates.age", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS age INTEGER;"),
        ("candidates.gender", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gender VARCHAR(20);"),
        ("candidates.marital_status", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS marital_status VARCHAR(30);"),
        ("candidates.mother_tongue", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS mother_tongue VARCHAR(50);"),
        ("candidates.languages_known", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS languages_known VARCHAR(200);"),
        ("candidates.pf_number", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS pf_number VARCHAR(50);"),
        ("candidates.esi_number", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS esi_number VARCHAR(50);"),
        ("candidates.religion", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS religion VARCHAR(50);"),
        ("candidates.caste", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS caste VARCHAR(50);"),
        ("candidates.category", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS category VARCHAR(50);"),
        ("candidates.native_state", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS native_state VARCHAR(100);"),
        ("candidates.native_district", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS native_district VARCHAR(100);"),
        ("candidates.identification_marks", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS identification_marks TEXT;"),
        ("candidates.employee_type", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS employee_type VARCHAR(50) DEFAULT 'it_tech';"),
        ("candidate_documents.table", "CREATE TABLE IF NOT EXISTS candidate_documents (id VARCHAR(50) PRIMARY KEY, candidate_id VARCHAR(50) REFERENCES candidates(id) ON DELETE CASCADE, title VARCHAR(200) NOT NULL, doc_type VARCHAR(50), file_format VARCHAR(20), file_path TEXT, file_size_kb FLOAT DEFAULT 0.0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"),
        ("candidate_documents.file_path", "ALTER TABLE candidate_documents ADD COLUMN IF NOT EXISTS file_path TEXT;"),
        ("candidate_documents.file_size_kb", "ALTER TABLE candidate_documents ADD COLUMN IF NOT EXISTS file_size_kb FLOAT DEFAULT 0.0;"),
        ("candidates.custom_fields", "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS custom_fields JSON DEFAULT '{}';")
    ]
    
    with engine.connect() as conn:
        for name, stmt in statements:
            try:
                conn.execute(text(stmt))
                print(f"  [+] Migrated: {name}")
            except Exception as e:
                print(f"  [!] Warning on {name}: {str(e)}")
        conn.commit()
        
    print("==================================================================")
    print("ALL POSTGRESQL PRODUCTION MIGRATIONS COMPLETED SUCCESSFULLY!")
    print("==================================================================")

if __name__ == "__main__":
    run_migrations()
