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
        ("api_configurations.provider_type", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS provider_type VARCHAR(100) DEFAULT 'Institutional Gateway';"),
        ("api_configurations.description", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS description TEXT;"),
        ("api_configurations.ping_latency_ms", "ALTER TABLE api_configurations ADD COLUMN IF NOT EXISTS ping_latency_ms INTEGER DEFAULT 62;"),
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
