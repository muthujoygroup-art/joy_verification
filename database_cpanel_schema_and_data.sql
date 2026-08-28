-- ============================================================================
-- JOY DATA VERIFICATION - 100% PURE POSTGRESQL (cPanel phpPgAdmin) SCHEMA & DATA
-- Compatible with PostgreSQL 12+, 13+, 14+, 15+, 16+ in cPanel phpPgAdmin
-- Total Tables: 20
-- ============================================================================

-- 1. super_admin_users (Master Platform Admin Accounts)
CREATE TABLE IF NOT EXISTS super_admin_users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL DEFAULT 'Super Administrator',
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'superadmin',
    status VARCHAR(50) DEFAULT 'Active',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO super_admin_users (id, name, email, password_hash, role, status, two_factor_enabled, last_login_at, created_at)
VALUES ('superadmin-01', 'Super Administrator', 'superadmin@joyverification.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'superadmin', 'Active', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 2. companies (Enterprise Accounts)
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) DEFAULT 'Company@Admin2026',
    plan VARCHAR(100) DEFAULT 'Enterprise Premier',
    price_per_verification DOUBLE PRECISION DEFAULT 120.0,
    verified_count_this_month INTEGER DEFAULT 0,
    max_limit INTEGER DEFAULT 500,
    wallet_balance DOUBLE PRECISION DEFAULT 50000.0,
    status VARCHAR(50) DEFAULT 'Active',
    is_active BOOLEAN DEFAULT TRUE,
    features JSON DEFAULT '{}',
    terms_accepted VARCHAR(50) DEFAULT 'true',
    terms_accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    terms_accepted_by VARCHAR(100) NULL,
    terms_version VARCHAR(50) DEFAULT 'v2.4-2026',
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE companies ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT 'Company@Admin2026';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS wallet_balance DOUBLE PRECISION DEFAULT 50000.0;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

INSERT INTO companies (id, name, code, contact_person, email, password_hash, plan, price_per_verification, verified_count_this_month, max_limit, wallet_balance, status, is_active, features, terms_accepted, terms_version, created_at)
VALUES ('comp-1', 'Acme Global Technologies', 'ACME-CORP', 'Vikram Malhotra', 'admin@acmeglobal.com', 'Company@Admin2026', 'Enterprise Premier', 120.0, 142, 500, 50000.0, 'Active', TRUE, '{"aadhaar": true, "pan": true, "bankCheck": true, "uan": true, "drivingLicense": true, "passport": true, "aiFaceBiometrics": true, "mobileOtp": true, "emailGateway": true, "faceCapture": true}'::json, 'true', 'v2.4-2026', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 3. hr_users (HR Recruiter Accounts)
CREATE TABLE IF NOT EXISTS hr_users (
    id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) DEFAULT 'Hr@Recruiter2026',
    dept VARCHAR(100) DEFAULT 'Human Resources',
    active_links INTEGER DEFAULT 0,
    permissions JSON DEFAULT '{"can_create": true, "can_verify": true, "can_export": true}',
    status VARCHAR(50) DEFAULT 'Active',
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT 'Hr@Recruiter2026';
ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS permissions JSON DEFAULT '{"can_create": true, "can_verify": true, "can_export": true}';
ALTER TABLE hr_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

INSERT INTO hr_users (id, company_id, name, email, password_hash, dept, active_links, permissions, status, created_at)
VALUES ('hr-1', 'comp-1', 'Priya Sundaram', 'priya.s@acmeglobal.com', 'Hr@Recruiter2026', 'Engineering Recruitment', 5, '{"can_create": true, "can_verify": true, "can_export": true}'::json, 'Active', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 4. candidates (Candidate Master Profiles & Token Access)
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(50) PRIMARY KEY,
    token VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    emp_id VARCHAR(50) NULL,
    email VARCHAR(150) NULL,
    mobile VARCHAR(50) NOT NULL,
    aadhaar_no VARCHAR(50) NULL,
    designation VARCHAR(100) NULL,
    dept VARCHAR(100) NULL,
    company_id VARCHAR(50) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    hr_id VARCHAR(50) NULL REFERENCES hr_users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Link Sent',
    portal_password VARCHAR(50) DEFAULT '1234',
    verification_config JSON DEFAULT '{}',
    verifications_completed JSON DEFAULT '{}',
    verified_attributes JSON DEFAULT '{}',
    face_images JSON DEFAULT '{}',
    manual_checks JSON DEFAULT '{}',
    joining_form_data JSON DEFAULT '{}',
    verification_date TIMESTAMP NULL,
    industry_specialization JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE candidates ADD COLUMN IF NOT EXISTS portal_password VARCHAR(50) DEFAULT '1234';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS joining_form_data JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS verified_attributes JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS manual_checks JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS industry_specialization JSON DEFAULT '{}';

INSERT INTO candidates (id, token, name, emp_id, email, mobile, aadhaar_no, designation, dept, company_id, hr_id, status, verification_config, verifications_completed, verified_attributes, created_at)
VALUES ('cand-1', 'tok_sunita_412', 'Sunita Mehra', 'EMP-2026-8812', 'sunita.mehra@example.com', '+91 9876543210', '541289123412', 'Senior Frontend Engineer', 'Engineering & UI/UX', 'comp-1', 'hr-1', 'Verified', '{"aadhaar": true, "pan": true, "bankCheck": true, "aiFaceBiometrics": true}'::json, '{"aadhaar": true, "pan": true, "bankCheck": true, "aiFaceBiometrics": true}'::json, '{"fullName": "Sunita Mehra", "fatherName": "Rajesh Mehra", "dob": "1995-08-14", "gender": "Female", "panNumber": "ABCDE1234F", "bankAccountNo": "100239102931", "ifscCode": "HDFC0001234", "bankName": "HDFC Bank Ltd", "bloodGroup": "B+"}'::json, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 5. verification_records (360° Government API Evidence Vault)
CREATE TABLE IF NOT EXISTS verification_records (
    id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    token VARCHAR(100) NOT NULL,
    verification_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'VERIFIED',
    provider VARCHAR(100) DEFAULT 'Server 1: Sandbox.co.in',
    transaction_ref VARCHAR(100) NULL,
    fetched_data JSON DEFAULT '{}',
    raw_payload JSON DEFAULT '{}',
    confidence_score DOUBLE PRECISION DEFAULT 1.0,
    sha256_seal VARCHAR(100) NULL,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO verification_records (id, candidate_id, token, verification_type, status, provider, transaction_ref, fetched_data, raw_payload, confidence_score, sha256_seal, verified_at, created_at)
SELECT 'vr-aadh-01', id, 'tok_sunita_412', 'aadhaar', 'VERIFIED', 'Server 1: Sandbox.co.in (UIDAI Direct)', 'UIDAI-TXN-20260828-99120', '{"name": "Sunita Mehra", "dob": "1995-08-14", "gender": "Female", "maskedAadhaar": "XXXX-XXXX-3412"}'::json, '{"status": "VALID", "signature": "SHA256_RSA_2048", "issuer": "UIDAI Central ID Repository"}'::json, 1.0, 'sha256_seal_99812480192841_joy_audit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM candidates WHERE token = 'tok_sunita_412'
ON CONFLICT DO NOTHING;


-- 6. candidate_documents (KYC File Attachments & Biometrics)
CREATE TABLE IF NOT EXISTS candidate_documents (
    id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    doc_type VARCHAR(50) NULL,
    file_format VARCHAR(20) NULL,
    file_path TEXT NULL,
    file_size_kb DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO candidate_documents (id, candidate_id, title, doc_type, file_format, file_path, file_size_kb, created_at)
SELECT 'cd-01', id, 'Official Aadhaar e-KYC XML Portrait', 'aadhaar', 'pdf', '/storage/documents/cand-1/aadhaar_verified.pdf', 420.5, CURRENT_TIMESTAMP
FROM candidates WHERE token = 'tok_sunita_412'
ON CONFLICT DO NOTHING;


-- 7. active_sessions (JWT Telemetry)
CREATE TABLE IF NOT EXISTS active_sessions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    device VARCHAR(100) DEFAULT 'Desktop Web',
    user_agent TEXT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 8. audit_trail_logs (DPDP Act 2023 SHA-256 Chained Ledger)
CREATE TABLE IF NOT EXISTS audit_trail_logs (
    id VARCHAR(50) PRIMARY KEY,
    actor_role VARCHAR(50) NOT NULL,
    actor_email VARCHAR(150) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_candidate_id VARCHAR(50) NULL,
    target_company_id VARCHAR(50) NULL,
    details JSON DEFAULT '{}',
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    prev_hash VARCHAR(64) NULL,
    curr_hash VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO audit_trail_logs (id, actor_role, actor_email, action, target_company_id, details, ip_address, prev_hash, curr_hash, timestamp)
VALUES ('audit-01', 'superadmin', 'superadmin@joyverification.com', 'INITIAL_DATABASE_SCHEMA_PROVISIONING', 'comp-1', '{"status": "SUCCESS", "tables_provisioned": 20}'::json, '127.0.0.1', '0000000000000000000000000000000000000000000000000000000000000000', 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 9. api_configurations (API Gateways & Secret Keys)
CREATE TABLE IF NOT EXISTS api_configurations (
    provider_key VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    endpoint_url VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    webhook_url VARCHAR(255) NULL,
    sandbox_mode BOOLEAN DEFAULT FALSE,
    rate_limit_per_min INTEGER DEFAULT 120,
    status VARCHAR(50) DEFAULT 'CONNECTED',
    monthly_quota INTEGER DEFAULT 5000,
    monthly_used INTEGER DEFAULT 0,
    last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO api_configurations (provider_key, display_name, endpoint_url, api_key, secret_key, sandbox_mode, rate_limit_per_min, status, monthly_quota, monthly_used, last_synced)
VALUES 
('server1_sandbox', 'Server 1: Sandbox.co.in (Fast2SMS / UIDAI)', 'https://api.sandbox.co.in/v2', 'sb_live_key_9942a1bc88', 'sb_sec_JoyCorp2026_m89', FALSE, 120, 'CONNECTED', 5000, 312, CURRENT_TIMESTAMP),
('server2_coincircle', 'Server 2: CoinCircleTrust Gateways', 'https://api.coincircletrust.com/v1', 'cct_live_pk_88319201948', 'cct_sk_sec_Live2026_881', FALSE, 90, 'CONNECTED', 3000, 89, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 10. feature_items (Verification Feature Items)
CREATE TABLE IF NOT EXISTS feature_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    default_on BOOLEAN DEFAULT TRUE,
    cost_per_verification DOUBLE PRECISION DEFAULT 25.0
);

INSERT INTO feature_items (id, name, provider, category, default_on, cost_per_verification)
VALUES
('feat-1', 'Aadhaar e-KYC with UIDAI XML', 'Sandbox.co.in', 'Identity', TRUE, 25.0),
('feat-2', 'NSDL PAN Card Real-Time Match', 'CoinCircleTrust', 'Identity', TRUE, 20.0),
('feat-3', 'NPCI IMPS Bank Account Penny Drop', 'Sandbox.co.in', 'Financial', TRUE, 15.0),
('feat-4', 'AI WebCam 3-Pose Face Liveness', 'Built-in AI Biometrics', 'Biometrics', TRUE, 10.0)
ON CONFLICT DO NOTHING;


-- 11. communication_gateways (WhatsApp, SMS & Email SMTP)
CREATE TABLE IF NOT EXISTS communication_gateways (
    id VARCHAR(50) PRIMARY KEY,
    gateway_type VARCHAR(50) NOT NULL,
    company_id VARCHAR(50) NULL,
    settings_data JSON DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE communication_gateways ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

INSERT INTO communication_gateways (id, gateway_type, settings_data, is_active, updated_at)
VALUES
('gw-wa-01', 'whatsapp', '{"senderPhoneId": "WA-JOY-9912", "templateName": "candidate_verification_link_v2"}'::json, TRUE, CURRENT_TIMESTAMP),
('gw-smtp-01', 'email_smtp', '{"host": "smtp.sendgrid.net", "port": 587, "fromEmail": "verify@joyverification.com"}'::json, TRUE, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 12. invoices (Monthly GST Tax Invoices)
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    month VARCHAR(20) DEFAULT 'August',
    year INTEGER DEFAULT 2026,
    verifications_count INTEGER DEFAULT 0,
    unit_price DOUBLE PRECISION DEFAULT 120.0,
    subtotal DOUBLE PRECISION DEFAULT 0.0,
    tax_rate DOUBLE PRECISION DEFAULT 18.0,
    tax_amount DOUBLE PRECISION DEFAULT 0.0,
    total_amount DOUBLE PRECISION DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'PENDING',
    due_date VARCHAR(50) NULL,
    line_items JSON DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO invoices (id, company_id, month, year, verifications_count, unit_price, subtotal, tax_rate, tax_amount, total_amount, status, due_date, line_items, created_at)
VALUES ('inv-2026-01', 'comp-1', 'August', 2026, 142, 120.0, 17040.0, 18.0, 3067.2, 20107.2, 'PENDING', '2026-09-15', '[{"item": "Aadhaar e-KYC Verifications", "qty": 142, "unit": 60.0, "total": 8520.0}, {"item": "PAN + Bank Account Verifications", "qty": 142, "unit": 60.0, "total": 8520.0}]'::json, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 13. payment_records (Wallet Recharges & UPI)
CREATE TABLE IF NOT EXISTS payment_records (
    id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Razorpay UPI / Cards',
    transaction_ref VARCHAR(100) NULL,
    status VARCHAR(50) DEFAULT 'SUCCESS',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO payment_records (id, company_id, amount, payment_method, transaction_ref, status, notes, created_at)
VALUES ('pay-01', 'comp-1', 50000.0, 'Razorpay UPI Auto-Recharge', 'pay_rzp_live_9912401', 'SUCCESS', 'Enterprise Credit Wallet Recharge (416 checks)', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 14. master_data_options (Custom Dropdown Lists)
CREATE TABLE IF NOT EXISTS master_data_options (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    option_value VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO master_data_options (category, option_value, is_active, created_at)
VALUES
('blood_group', 'O+ (Universal Donor)', TRUE, CURRENT_TIMESTAMP),
('blood_group', 'B+ Positive', TRUE, CURRENT_TIMESTAMP),
('blood_group', 'A+ Positive', TRUE, CURRENT_TIMESTAMP),
('relation', 'Father / Guardian', TRUE, CURRENT_TIMESTAMP),
('relation', 'Mother', TRUE, CURRENT_TIMESTAMP),
('relation', 'Spouse', TRUE, CURRENT_TIMESTAMP);


-- 15. master_form_fields (Candidate Joining Form Fields)
CREATE TABLE IF NOT EXISTS master_form_fields (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(150) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    default_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO master_form_fields (id, label, field_type, category, default_mandatory, created_at)
VALUES
('fld-1', 'Official Full Legal Name', 'text', 'Personal Info', TRUE, CURRENT_TIMESTAMP),
('fld-2', 'Aadhaar 12-Digit Number', 'text', 'Identity Checks', TRUE, CURRENT_TIMESTAMP),
('fld-3', 'PAN Number (10 Characters)', 'text', 'Identity Checks', TRUE, CURRENT_TIMESTAMP),
('fld-4', 'Bank Account Number & IFSC', 'text', 'Financial Checks', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 16. support_tickets (Enterprise Helpdesk Tickets)
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Technical API',
    priority VARCHAR(50) DEFAULT 'High',
    status VARCHAR(50) DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO support_tickets (id, company_id, company_name, subject, category, priority, status, created_at)
VALUES ('tkt-01', 'comp-1', 'Acme Global Technologies', 'Webhook response delay during peak traffic', 'Technical API', 'High', 'Open', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 17. ticket_replies (Ticket Conversation Threads)
CREATE TABLE IF NOT EXISTS ticket_replies (
    id VARCHAR(50) PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_role VARCHAR(50) NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ticket_replies (id, ticket_id, sender_role, sender_name, message, timestamp)
VALUES ('rep-01', 'tkt-01', 'superadmin', 'Master Tech Support', 'We have allocated dedicated sliding-window rate limit buckets for Acme Global to resolve this.', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 18. system_error_logs (Production Exception Tracker)
CREATE TABLE IF NOT EXISTS system_error_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp VARCHAR(50) NOT NULL,
    section VARCHAR(100) NOT NULL,
    error_code VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'Warning',
    solved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(100) NULL
);

INSERT INTO system_error_logs (id, timestamp, section, error_code, message, severity, solved)
VALUES ('log-901', '2026-08-28 17:00:00', 'Gateway Router', 'WARN_LATENCY_200MS', 'UIDAI primary gateway latency normalized at 114ms.', 'Info', TRUE)
ON CONFLICT DO NOTHING;


-- 19. system_settings (Role Config & Session Timeouts)
CREATE TABLE IF NOT EXISTS system_settings (
    role VARCHAR(50) PRIMARY KEY,
    settings_data JSON DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_settings (role, settings_data, updated_at)
VALUES ('superadmin', '{"platformName": "JOY DATA VERIFICATION", "autoInvoiceDispatch": true, "defaultGstRate": 18, "sessionTimeoutMinutes": 30}'::json, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- 20. platform_guidelines (Role Manuals & SOPs)
CREATE TABLE IF NOT EXISTS platform_guidelines (
    role VARCHAR(50) PRIMARY KEY,
    guidelines_data JSON DEFAULT '[]',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO platform_guidelines (role, guidelines_data, updated_at)
VALUES ('superadmin', '[{"title": "DPDP Act 2023 Consent Audit", "desc": "Ensure all candidate checks possess digital consent signatures."}, {"title": "API Gateway Quota Balancing", "desc": "Monitor Sandbox.co.in vs CoinCircleTrust failover quotas."}]'::json, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
