-- ====================================================================
-- JOY DATA VERIFICATION - POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Compatible with PostgreSQL 14 / 15 / 16 / cPanel phpPgAdmin
-- ====================================================================

-- 1. COMPANIES (Enterprise Accounts)
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    plan VARCHAR(100) DEFAULT 'Enterprise Premier',
    price_per_verification NUMERIC(10,2) DEFAULT 120.00,
    verified_count_this_month INTEGER DEFAULT 0,
    max_limit INTEGER DEFAULT 500,
    status VARCHAR(50) DEFAULT 'Active',
    features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. HR USERS (Recruiters & Staff)
CREATE TABLE IF NOT EXISTS hr_users (
    id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    dept VARCHAR(255) DEFAULT 'Engineering Recruitment',
    active_links INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CANDIDATES (Employee KYC Profiles & Verification Dossiers)
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(50) PRIMARY KEY,
    token VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    emp_id VARCHAR(100),
    email VARCHAR(255),
    mobile VARCHAR(50) NOT NULL,
    aadhaar_no VARCHAR(50),
    pan_no VARCHAR(50),
    driving_license VARCHAR(100),
    uan_epf VARCHAR(100),
    designation VARCHAR(255),
    dept VARCHAR(255),
    company_id VARCHAR(50) REFERENCES companies(id) ON DELETE SET NULL,
    hr_id VARCHAR(50) REFERENCES hr_users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    verification_config JSONB DEFAULT '{}',
    verifications_completed JSONB DEFAULT '{}',
    face_images JSONB DEFAULT '{}',
    verification_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MASTER DATA OPTIONS (Topic-Based Dropdowns)
CREATE TABLE IF NOT EXISTS master_data_options (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL, -- 'departments', 'designations', 'workLocations', 'qualifications', 'employmentTypes'
    option_value VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MASTER FORM FIELDS (Master Candidate Default Fields)
CREATE TABLE IF NOT EXISTS master_form_fields (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) DEFAULT 'text',
    category VARCHAR(100) DEFAULT 'Personal Info',
    default_mandatory BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. API CONFIGURATIONS (Government & Biometric Credentials)
CREATE TABLE IF NOT EXISTS api_configurations (
    provider_key VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    endpoint_url VARCHAR(500),
    api_key VARCHAR(500),
    secret_key VARCHAR(500),
    webhook_url VARCHAR(500),
    sandbox_mode BOOLEAN DEFAULT FALSE,
    rate_limit_per_min INTEGER DEFAULT 120,
    status VARCHAR(50) DEFAULT 'Operational',
    monthly_quota INTEGER DEFAULT 25000,
    monthly_used INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. INVOICES & BILLING LEDGER
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    month VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    verifications_count INTEGER DEFAULT 0,
    unit_price NUMERIC(10,2) DEFAULT 120.00,
    subtotal NUMERIC(10,2) DEFAULT 0.00,
    tax_rate NUMERIC(5,2) DEFAULT 18.00,
    tax_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Pending',
    due_date VARCHAR(50),
    line_items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) REFERENCES companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    reporter_name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    priority VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TICKET REPLIES
CREATE TABLE IF NOT EXISTS ticket_replies (
    id VARCHAR(50) PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_role VARCHAR(50) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SYSTEM ERROR LOGS
CREATE TABLE IF NOT EXISTS system_error_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp VARCHAR(50) NOT NULL,
    section VARCHAR(255) NOT NULL,
    error_code VARCHAR(100),
    message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'Info',
    solved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(255),
    company VARCHAR(255)
);

-- 11. COMMUNICATION GATEWAYS (WhatsApp & SMTP)
CREATE TABLE IF NOT EXISTS communication_gateways (
    gateway_type VARCHAR(50) PRIMARY KEY, -- 'whatsapp' | 'smtp'
    provider_name VARCHAR(255) NOT NULL,
    credentials JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- INITIAL PRODUCTION SEED DATA
-- ====================================================================

-- Insert Companies
INSERT INTO companies (id, name, code, contact_person, email, plan, price_per_verification, verified_count_this_month, max_limit, status, features)
VALUES 
('comp-1', 'Acme Global Technologies', 'ACME', 'Vikram Malhotra', 'admin@acmeglobal.com', 'Enterprise Premier', 120.00, 142, 500, 'Active', '{"aadhaar": true, "mobileOtp": true, "faceCapture": true, "drivingLicense": true, "pan": true, "uan": true, "education": true, "criminalCheck": false, "addressCheck": false, "bankCheck": true}'),
('comp-2', 'Apex Logistics & Freight', 'APEX', 'Ananya Sharma', 'hr-head@apexlogistics.in', 'Standard Tier', 100.00, 88, 250, 'Active', '{"aadhaar": true, "mobileOtp": true, "faceCapture": true, "drivingLicense": false, "pan": true, "uan": false, "education": false, "criminalCheck": false, "addressCheck": true, "bankCheck": false}'),
('comp-3', 'Starlight Healthcare Solutions', 'SHS', 'Dr. Ramesh Iyer', 'operations@starlighthealth.org', 'Basic Tier', 80.00, 34, 100, 'Active', '{"aadhaar": true, "mobileOtp": true, "faceCapture": false, "drivingLicense": false, "pan": false, "uan": false, "education": false, "criminalCheck": false, "addressCheck": false, "bankCheck": false}')
ON CONFLICT (id) DO NOTHING;

-- Insert HR Users
INSERT INTO hr_users (id, company_id, name, email, dept, active_links)
VALUES
('hr-1', 'comp-1', 'Priya Sundaram', 'priya.s@acmeglobal.com', 'Engineering Recruitment', 12),
('hr-2', 'comp-1', 'Rahul Verma', 'rahul.v@acmeglobal.com', 'Operations & Field Staff', 8),
('hr-3', 'comp-2', 'Sneha Patel', 'sneha.p@apexlogistics.in', 'Logistics Drivers & Fleet', 15)
ON CONFLICT (id) DO NOTHING;

-- Insert Master Dropdown Options
INSERT INTO master_data_options (category, option_value, is_active)
VALUES
('departments', 'Engineering & IT', true),
('departments', 'Logistics & Delivery Fleet', true),
('departments', 'Clinical & Medical Staff', true),
('departments', 'Human Resources', true),
('departments', 'Finance & Accounting', true),
('departments', 'Sales & Business Development', true),
('departments', 'Field Operations & Quality', true),
('departments', 'Customer Support & Helpdesk', true),
('designations', 'Senior Software Engineer', true),
('designations', 'Fleet Logistics Driver', true),
('designations', 'Clinical Nurse / Specialist', true),
('designations', 'HR Operations Associate', true),
('designations', 'Field Quality Inspector', true),
('designations', 'Project Manager & Team Lead', true),
('workLocations', 'Bengaluru Tech Park (HQ)', true),
('workLocations', 'Mumbai Financial District', true),
('workLocations', 'Delhi Logistics Hub', true),
('workLocations', 'Chennai Regional Office', true),
('workLocations', 'Hyderabad R&D Center', true),
('workLocations', 'Remote / Field Site', true),
('qualifications', 'B.Tech / B.E. in Computer Science', true),
('qualifications', 'Diploma in Commercial Driving', true),
('qualifications', 'B.Sc in Nursing / Healthcare', true),
('qualifications', 'MBA in HR & Operations', true),
('qualifications', 'Bachelor of Commerce (B.Com)', true),
('qualifications', 'Higher Secondary (10+2)', true),
('employmentTypes', 'Full Time Permanent', true),
('employmentTypes', 'Contract Staff', true),
('employmentTypes', 'Labor / Field Operative', true),
('employmentTypes', 'Internship / Trainee', true);

-- Insert Master Form Fields
INSERT INTO master_form_fields (id, label, field_type, category, default_mandatory)
VALUES
('f_aadhaar', 'Aadhaar UIDAI Number', 'number', 'Personal Info', true),
('f_dob', 'Date of Birth (DOB)', 'date', 'Personal Info', true),
('f_pan', 'Permanent Account Number (PAN)', 'text', 'Tax ID', true),
('f_uan', 'Universal Account Number (UAN)', 'number', 'Employment', false),
('f_bank_acc', 'Bank Account Number & IFSC', 'text', 'Financial', true),
('f_dl', 'Commercial Driving License No', 'text', 'Government ID', false)
ON CONFLICT (id) DO NOTHING;

-- Insert Candidates
INSERT INTO candidates (id, token, name, emp_id, email, mobile, aadhaar_no, designation, dept, company_id, hr_id, status, verification_config, verifications_completed, verification_date)
VALUES
('emp-101', 'tok_rajesh_891', 'Rajesh Kumar', 'ACME-2026-88', 'rajesh.k@gmail.com', '+91 98765 43210', '5489 1234 9876', 'Senior Software Engineer', 'Engineering', 'comp-1', 'hr-1', 'Verified', '{"requireAadhaar": true, "requireMobileOtp": true, "requireFaceMatch": true, "requirePAN": true, "requireBankCheck": true}', '{"aadhaar": true, "mobile": true, "face": true, "pan": true, "bankCheck": true}', '2026-08-19 14:32:00'),
('emp-102', 'tok_sunita_412', 'Sunita Mehra', 'ACME-2026-89', 'sunita.mehra@outlook.com', '+91 91234 56789', '7812 3456 0192', 'Fleet Operations Supervisor', 'Operations', 'comp-1', 'hr-2', 'In Verification', '{"requireAadhaar": true, "requireMobileOtp": true, "requireFaceMatch": true, "requireDL": true}', '{"aadhaar": true, "mobile": false, "face": false}', NULL),
('emp-103', 'tok_karan_903', 'Karan Malhotra', 'APEX-2026-14', 'karan.m@yahoo.com', '+91 99887 76655', '6543 9876 2109', 'Logistics Coordinator', 'Fleet Management', 'comp-2', 'hr-3', 'Link Sent', '{"requireAadhaar": true, "requireMobileOtp": true, "requireFaceMatch": true, "requirePAN": true}', '{"aadhaar": false, "mobile": false, "face": false}', NULL)
ON CONFLICT (id) DO NOTHING;
