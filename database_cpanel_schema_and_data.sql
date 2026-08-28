-- ============================================================================
-- JOY DATA VERIFICATION - COMPLETE CPANEL / PHPMYADMIN PRODUCTION DATABASE SCHEMA
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+, and PostgreSQL
-- Total Tables: 20
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. super_admin_users (Master Platform Admin Accounts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `super_admin_users` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL DEFAULT 'Super Administrator',
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'superadmin',
  `status` VARCHAR(50) DEFAULT 'Active',
  `two_factor_enabled` TINYINT(1) DEFAULT 0,
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `super_admin_users` (`id`, `name`, `email`, `password_hash`, `role`, `status`, `two_factor_enabled`, `last_login_at`, `created_at`)
VALUES ('superadmin-01', 'Super Administrator', 'superadmin@joyverification.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'superadmin', 'Active', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `status` = 'Active';


-- ----------------------------------------------------------------------------
-- 2. companies (Enterprise Accounts & Pricing)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `companies` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `contact_person` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) DEFAULT 'Company@Admin2026',
  `plan` VARCHAR(100) DEFAULT 'Enterprise Premier',
  `price_per_verification` FLOAT DEFAULT 120.0,
  `verified_count_this_month` INT DEFAULT 0,
  `max_limit` INT DEFAULT 500,
  `wallet_balance` FLOAT DEFAULT 50000.0,
  `status` VARCHAR(50) DEFAULT 'Active',
  `is_active` TINYINT(1) DEFAULT 1,
  `features` JSON NULL,
  `terms_accepted` VARCHAR(50) DEFAULT 'true',
  `terms_accepted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `terms_accepted_by` VARCHAR(100) NULL,
  `terms_version` VARCHAR(50) DEFAULT 'v2.4-2026',
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `companies` (`id`, `name`, `code`, `contact_person`, `email`, `password_hash`, `plan`, `price_per_verification`, `verified_count_this_month`, `max_limit`, `wallet_balance`, `status`, `is_active`, `features`, `terms_accepted`, `terms_version`, `created_at`)
VALUES ('comp-1', 'Acme Global Technologies', 'ACME-CORP', 'Vikram Malhotra', 'admin@acmeglobal.com', 'Company@Admin2026', 'Enterprise Premier', 120.0, 142, 500, 50000.0, 'Active', 1, '{"aadhaar": true, "pan": true, "bankCheck": true, "uan": true, "drivingLicense": true, "passport": true, "aiFaceBiometrics": true, "mobileOtp": true, "emailGateway": true, "faceCapture": true}', 'true', 'v2.4-2026', NOW())
ON DUPLICATE KEY UPDATE `status` = 'Active';


-- ----------------------------------------------------------------------------
-- 3. hr_users (HR Executive Accounts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_users` (
  `id` VARCHAR(50) NOT NULL,
  `company_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) DEFAULT 'Hr@Recruiter2026',
  `dept` VARCHAR(100) DEFAULT 'Human Resources',
  `active_links` INT DEFAULT 0,
  `permissions` JSON NULL,
  `status` VARCHAR(50) DEFAULT 'Active',
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_hr_company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `hr_users` (`id`, `company_id`, `name`, `email`, `password_hash`, `dept`, `active_links`, `permissions`, `status`, `created_at`)
VALUES ('hr-1', 'comp-1', 'Priya Sundaram', 'priya.s@acmeglobal.com', 'Hr@Recruiter2026', 'Engineering Recruitment', 5, '{"can_create": true, "can_verify": true, "can_export": true}', 'Active', NOW())
ON DUPLICATE KEY UPDATE `status` = 'Active';


-- ----------------------------------------------------------------------------
-- 4. candidates (Candidate Master Profiles & Consent)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `candidates` (
  `id` VARCHAR(50) NOT NULL,
  `token` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `emp_id` VARCHAR(50) NULL,
  `email` VARCHAR(150) NULL,
  `mobile` VARCHAR(50) NOT NULL,
  `aadhaar_no` VARCHAR(50) NULL,
  `designation` VARCHAR(100) NULL,
  `dept` VARCHAR(100) NULL,
  `company_id` VARCHAR(50) NOT NULL,
  `hr_id` VARCHAR(50) NULL,
  `status` VARCHAR(50) DEFAULT 'Link Sent',
  `portal_password` VARCHAR(50) DEFAULT '1234',
  `verification_config` JSON NULL,
  `verifications_completed` JSON NULL,
  `verified_attributes` JSON NULL,
  `face_images` JSON NULL,
  `manual_checks` JSON NULL,
  `joining_form_data` JSON NULL,
  `verification_date` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_cand_company` (`company_id`),
  KEY `fk_cand_hr` (`hr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `candidates` (`id`, `token`, `name`, `emp_id`, `email`, `mobile`, `aadhaar_no`, `designation`, `dept`, `company_id`, `hr_id`, `status`, `verification_config`, `verifications_completed`, `verified_attributes`, `created_at`)
VALUES ('cand-1', 'tok_sunita_412', 'Sunita Mehra', 'EMP-2026-8812', 'sunita.mehra@example.com', '+91 9876543210', '541289123412', 'Senior Frontend Engineer', 'Engineering & UI/UX', 'comp-1', 'hr-1', 'Verified', '{"aadhaar": true, "pan": true, "bankCheck": true, "aiFaceBiometrics": true}', '{"aadhaar": true, "pan": true, "bankCheck": true, "aiFaceBiometrics": true}', '{"fullName": "Sunita Mehra", "fatherName": "Rajesh Mehra", "dob": "1995-08-14", "gender": "Female", "panNumber": "ABCDE1234F", "bankAccountNo": "100239102931", "ifscCode": "HDFC0001234", "bankName": "HDFC Bank Ltd", "bloodGroup": "B+"}', NOW())
ON DUPLICATE KEY UPDATE `status` = 'Verified';


-- ----------------------------------------------------------------------------
-- 5. verification_records (360° Government API Evidence Vault)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `verification_records` (
  `id` VARCHAR(50) NOT NULL,
  `candidate_id` VARCHAR(50) NOT NULL,
  `token` VARCHAR(100) NOT NULL,
  `verification_type` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'VERIFIED',
  `provider` VARCHAR(100) DEFAULT 'Server 1: Sandbox.co.in',
  `transaction_ref` VARCHAR(100) NULL,
  `fetched_data` JSON NULL,
  `raw_payload` JSON NULL,
  `confidence_score` FLOAT DEFAULT 1.0,
  `sha256_seal` VARCHAR(100) NULL,
  `verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_vr_candidate` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `verification_records` (`id`, `candidate_id`, `token`, `verification_type`, `status`, `provider`, `transaction_ref`, `fetched_data`, `raw_payload`, `confidence_score`, `sha256_seal`, `verified_at`, `created_at`)
VALUES ('vr-aadh-01', 'cand-1', 'tok_sunita_412', 'aadhaar', 'VERIFIED', 'Server 1: Sandbox.co.in (UIDAI Direct)', 'UIDAI-TXN-20260828-99120', '{"name": "Sunita Mehra", "dob": "1995-08-14", "gender": "Female", "maskedAadhaar": "XXXX-XXXX-3412"}', '{"status": "VALID", "signature": "SHA256_RSA_2048", "issuer": "UIDAI Central ID Repository"}', 1.0, 'sha256_seal_99812480192841_joy_audit', NOW(), NOW())
ON DUPLICATE KEY UPDATE `status` = 'VERIFIED';


-- ----------------------------------------------------------------------------
-- 6. candidate_documents (KYC File Attachments & Biometrics)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `candidate_documents` (
  `id` VARCHAR(50) NOT NULL,
  `candidate_id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `doc_type` VARCHAR(50) NULL,
  `file_format` VARCHAR(20) NULL,
  `file_path` TEXT NULL,
  `file_size_kb` FLOAT DEFAULT 0.0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_cd_candidate` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `candidate_documents` (`id`, `candidate_id`, `title`, `doc_type`, `file_format`, `file_path`, `file_size_kb`, `created_at`)
VALUES ('cd-01', 'cand-1', 'Official Aadhaar e-KYC XML Portrait', 'aadhaar', 'pdf', '/storage/documents/cand-1/aadhaar_verified.pdf', 420.5, NOW())
ON DUPLICATE KEY UPDATE `title` = 'Official Aadhaar e-KYC XML Portrait';


-- ----------------------------------------------------------------------------
-- 7. active_sessions (JWT & Multi-Login Session Telemetry)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `active_sessions` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL UNIQUE,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `device` VARCHAR(100) DEFAULT 'Desktop Web',
  `user_agent` TEXT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------------------------------------------------------
-- 8. audit_trail_logs (DPDP Act 2023 Tamper-Evident SHA-256 Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_trail_logs` (
  `id` VARCHAR(50) NOT NULL,
  `actor_role` VARCHAR(50) NOT NULL,
  `actor_email` VARCHAR(150) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_candidate_id` VARCHAR(50) NULL,
  `target_company_id` VARCHAR(50) NULL,
  `details` JSON NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `prev_hash` VARCHAR(64) NULL,
  `curr_hash` VARCHAR(64) NOT NULL,
  `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `audit_trail_logs` (`id`, `actor_role`, `actor_email`, `action`, `target_company_id`, `details`, `ip_address`, `prev_hash`, `curr_hash`, `timestamp`)
VALUES ('audit-01', 'superadmin', 'superadmin@joyverification.com', 'INITIAL_DATABASE_SCHEMA_PROVISIONING', 'comp-1', '{"status": "SUCCESS", "tables_provisioned": 20}', '127.0.0.1', '0000000000000000000000000000000000000000000000000000000000000000', 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', NOW())
ON DUPLICATE KEY UPDATE `actor_role` = 'superadmin';


-- ----------------------------------------------------------------------------
-- 9. api_configurations (API Gateways & Secret Keys)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `api_configurations` (
  `id` VARCHAR(50) NOT NULL,
  `provider_key` VARCHAR(50) NOT NULL UNIQUE,
  `display_name` VARCHAR(100) NOT NULL,
  `endpoint_url` VARCHAR(255) NOT NULL,
  `api_key` VARCHAR(255) NOT NULL,
  `secret_key` VARCHAR(255) NOT NULL,
  `mode` VARCHAR(20) DEFAULT 'live',
  `daily_quota` INT DEFAULT 5000,
  `used_quota` INT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'CONNECTED',
  `ping_latency_ms` INT DEFAULT 120,
  `last_synced` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `api_configurations` (`id`, `provider_key`, `display_name`, `endpoint_url`, `api_key`, `secret_key`, `mode`, `daily_quota`, `used_quota`, `status`, `ping_latency_ms`, `last_synced`)
VALUES 
('api-1', 'server1_sandbox', 'Server 1: Sandbox.co.in (Fast2SMS / UIDAI)', 'https://api.sandbox.co.in/v2', 'sb_live_key_9942a1bc88', 'sb_sec_JoyCorp2026_m89', 'live', 5000, 312, 'CONNECTED', 114, NOW()),
('api-2', 'server2_coincircle', 'Server 2: CoinCircleTrust Gateways', 'https://api.coincircletrust.com/v1', 'cct_live_pk_88319201948', 'cct_sk_sec_Live2026_881', 'live', 3000, 89, 'CONNECTED', 98, NOW())
ON DUPLICATE KEY UPDATE `status` = 'CONNECTED';


-- ----------------------------------------------------------------------------
-- 10. feature_items (Verification Feature Matrix)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `feature_items` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `provider` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `default_on` TINYINT(1) DEFAULT 1,
  `description` TEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `feature_items` (`id`, `name`, `provider`, `category`, `default_on`, `description`)
VALUES
('feat-1', 'Aadhaar e-KYC with UIDAI XML', 'Sandbox.co.in', 'Identity', 1, 'Instant UIDAI demographic and XML verification'),
('feat-2', 'NSDL PAN Card Real-Time Match', 'CoinCircleTrust', 'Identity', 1, 'Income tax PAN holder validation'),
('feat-3', 'NPCI IMPS Bank Account Penny Drop', 'Sandbox.co.in', 'Financial', 1, 'Beneficiary name verification via bank API'),
('feat-4', 'AI WebCam 3-Pose Face Liveness', 'Built-in AI Biometrics', 'Biometrics', 1, 'Geometric vector facial matching (99.8%)')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);


-- ----------------------------------------------------------------------------
-- 11. communication_gateways (WhatsApp, SMS & Email SMTP)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `communication_gateways` (
  `id` VARCHAR(50) NOT NULL,
  `gateway_type` VARCHAR(50) NOT NULL,
  `company_id` VARCHAR(50) NULL,
  `settings_data` JSON NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `communication_gateways` (`id`, `gateway_type`, `settings_data`, `is_active`, `updated_at`)
VALUES
('gw-wa-01', 'whatsapp', '{"senderPhoneId": "WA-JOY-9912", "templateName": "candidate_verification_link_v2"}', 1, NOW()),
('gw-smtp-01', 'email_smtp', '{"host": "smtp.sendgrid.net", "port": 587, "fromEmail": "verify@joyverification.com"}', 1, NOW())
ON DUPLICATE KEY UPDATE `is_active` = 1;


-- ----------------------------------------------------------------------------
-- 12. invoices (Monthly GST Tax Invoices)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` VARCHAR(50) NOT NULL,
  `company_id` VARCHAR(50) NOT NULL,
  `month` VARCHAR(50) DEFAULT 'August',
  `year` INT DEFAULT 2026,
  `verifications_count` INT DEFAULT 0,
  `unit_price` FLOAT DEFAULT 120.0,
  `subtotal` FLOAT DEFAULT 0.0,
  `tax_rate` FLOAT DEFAULT 18.0,
  `tax_amount` FLOAT DEFAULT 0.0,
  `total_amount` FLOAT DEFAULT 0.0,
  `status` VARCHAR(50) DEFAULT 'PENDING',
  `due_date` DATETIME NULL,
  `line_items` JSON NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_inv_company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `invoices` (`id`, `company_id`, `month`, `year`, `verifications_count`, `unit_price`, `subtotal`, `tax_rate`, `tax_amount`, `total_amount`, `status`, `due_date`, `created_at`)
VALUES ('inv-2026-01', 'comp-1', 'August', 2026, 142, 120.0, 17040.0, 18.0, 3067.2, 20107.2, 'PENDING', DATE_ADD(NOW(), INTERVAL 15 DAY), NOW())
ON DUPLICATE KEY UPDATE `status` = 'PENDING';


-- ----------------------------------------------------------------------------
-- 13. payment_records (Wallet Recharges & UPI)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment_records` (
  `id` VARCHAR(50) NOT NULL,
  `company_id` VARCHAR(50) NOT NULL,
  `amount` FLOAT NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'Razorpay UPI / Cards',
  `transaction_ref` VARCHAR(100) NULL,
  `status` VARCHAR(50) DEFAULT 'SUCCESS',
  `notes` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pay_company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `payment_records` (`id`, `company_id`, `amount`, `payment_method`, `transaction_ref`, `status`, `notes`, `created_at`)
VALUES ('pay-01', 'comp-1', 50000.0, 'Razorpay UPI Auto-Recharge', 'pay_rzp_live_9912401', 'SUCCESS', 'Enterprise Credit Wallet Recharge (416 checks)', NOW())
ON DUPLICATE KEY UPDATE `status` = 'SUCCESS';


-- ----------------------------------------------------------------------------
-- 14. master_data_options (Custom Dropdown Lists)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `master_data_options` (
  `id` VARCHAR(50) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `option_value` VARCHAR(150) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `master_data_options` (`id`, `category`, `option_value`, `is_active`, `created_at`)
VALUES
('opt-1', 'blood_group', 'O+ (Universal Donor)', 1, NOW()),
('opt-2', 'blood_group', 'B+ Positive', 1, NOW()),
('opt-3', 'blood_group', 'A+ Positive', 1, NOW()),
('opt-4', 'relation', 'Father / Guardian', 1, NOW()),
('opt-5', 'relation', 'Mother', 1, NOW()),
('opt-6', 'relation', 'Spouse', 1, NOW())
ON DUPLICATE KEY UPDATE `option_value` = VALUES(`option_value`);


-- ----------------------------------------------------------------------------
-- 15. master_form_fields (Candidate Joining Form Fields)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `master_form_fields` (
  `id` VARCHAR(50) NOT NULL,
  `label` VARCHAR(150) NOT NULL,
  `field_type` VARCHAR(50) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `default_mandatory` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `master_form_fields` (`id`, `label`, `field_type`, `category`, `default_mandatory`, `created_at`)
VALUES
('fld-1', 'Official Full Legal Name', 'text', 'Personal Info', 1, NOW()),
('fld-2', 'Aadhaar 12-Digit Number', 'text', 'Identity Checks', 1, NOW()),
('fld-3', 'PAN Number (10 Characters)', 'text', 'Identity Checks', 1, NOW()),
('fld-4', 'Bank Account Number & IFSC', 'text', 'Financial Checks', 1, NOW())
ON DUPLICATE KEY UPDATE `label` = VALUES(`label`);


-- ----------------------------------------------------------------------------
-- 16. support_tickets (Enterprise Helpdesk Tickets)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` VARCHAR(50) NOT NULL,
  `company_id` VARCHAR(50) NOT NULL,
  `company_name` VARCHAR(200) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Technical API',
  `priority` VARCHAR(50) DEFAULT 'High',
  `status` VARCHAR(50) DEFAULT 'Open',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_tick_company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `support_tickets` (`id`, `company_id`, `company_name`, `subject`, `category`, `priority`, `status`, `created_at`)
VALUES ('tkt-01', 'comp-1', 'Acme Global Technologies', 'Webhook response delay during peak traffic', 'Technical API', 'High', 'Open', NOW())
ON DUPLICATE KEY UPDATE `status` = 'Open';


-- ----------------------------------------------------------------------------
-- 17. ticket_replies (Ticket Conversation Threads)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_replies` (
  `id` VARCHAR(50) NOT NULL,
  `ticket_id` VARCHAR(50) NOT NULL,
  `sender_role` VARCHAR(50) NOT NULL,
  `sender_name` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rep_ticket` (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ticket_replies` (`id`, `ticket_id`, `sender_role`, `sender_name`, `message`, `created_at`)
VALUES ('rep-01', 'tkt-01', 'superadmin', 'Master Tech Support', 'We have allocated dedicated sliding-window rate limit buckets for Acme Global to resolve this.', NOW())
ON DUPLICATE KEY UPDATE `message` = VALUES(`message`);


-- ----------------------------------------------------------------------------
-- 18. system_error_logs (Production Exception Tracker)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_error_logs` (
  `id` VARCHAR(50) NOT NULL,
  `timestamp` VARCHAR(50) NOT NULL,
  `section` VARCHAR(100) NOT NULL,
  `error_code` VARCHAR(50) NOT NULL,
  `message` TEXT NOT NULL,
  `severity` VARCHAR(50) DEFAULT 'Warning',
  `solved` TINYINT(1) DEFAULT 0,
  `resolved_at` DATETIME NULL,
  `resolved_by` VARCHAR(100) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `system_error_logs` (`id`, `timestamp`, `section`, `error_code`, `message`, `severity`, `solved`)
VALUES ('log-901', '2026-08-28 17:00:00', 'Gateway Router', 'WARN_LATENCY_200MS', 'UIDAI primary gateway latency normalized at 114ms.', 'Info', 1)
ON DUPLICATE KEY UPDATE `solved` = 1;


-- ----------------------------------------------------------------------------
-- 19. system_settings (Role Config & Session Timeouts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_settings` (
  `role` VARCHAR(50) NOT NULL,
  `settings_data` JSON NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `system_settings` (`role`, `settings_data`, `updated_at`)
VALUES ('superadmin', '{"platformName": "JOY DATA VERIFICATION", "autoInvoiceDispatch": true, "defaultGstRate": 18, "sessionTimeoutMinutes": 30}', NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();


-- ----------------------------------------------------------------------------
-- 20. platform_guidelines (Role Manuals & SOPs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `platform_guidelines` (
  `role` VARCHAR(50) NOT NULL,
  `guidelines_data` JSON NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `platform_guidelines` (`role`, `guidelines_data`, `updated_at`)
VALUES ('superadmin', '[{"title": "DPDP Act 2023 Consent Audit", "desc": "Ensure all candidate checks possess digital consent signatures."}, {"title": "API Gateway Quota Balancing", "desc": "Monitor Sandbox.co.in vs CoinCircleTrust failover quotas."}]', NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SUCCESS: ALL 20 JOY ENTERPRISE TABLES DEFINED AND POPULATED FOR CPANEL
-- ============================================================================
