-- MySQL Database Schema for DigiLocker Integration
-- Create this database in your server (e.g. via phpMyAdmin) and import this file.

-- Table to store verification attempts, user input parameters, and returned profiles
CREATE TABLE IF NOT EXISTS verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_type ENUM('individual', 'company') NOT NULL,
    auth_type ENUM('mobile', 'aadhaar', 'pan') NOT NULL,
    identifier_value VARCHAR(50) NOT NULL,
    digilocker_id VARCHAR(50) NULL,
    full_name VARCHAR(100) NULL,
    dob VARCHAR(20) NULL,
    gender VARCHAR(10) NULL,
    email VARCHAR(100) NULL,
    aadhaar_no VARCHAR(50) NULL,
    uan_no VARCHAR(50) NULL,
    pan_no VARCHAR(50) NULL,
    dl_no VARCHAR(50) NULL,
    address TEXT NULL,
    pincode VARCHAR(20) NULL,
    profile_photo LONGTEXT NULL,
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table to store list of documents retrieved for each successful verification
CREATE TABLE IF NOT EXISTS verification_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    verification_id INT NOT NULL,
    document_name VARCHAR(150) NOT NULL,
    `issuer` VARCHAR(255) NOT NULL,
    doc_no VARCHAR(100) NOT NULL,
    doc_uri VARCHAR(255) NOT NULL,
    doc_status VARCHAR(50) DEFAULT 'Verified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (verification_id) REFERENCES verifications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table to store authorized operators / users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin credentials (username: admin, password: admin123)
-- The password hash is generated using bcrypt
INSERT INTO users (username, password) 
VALUES ('admin', '$2y$10$SRm9mpiCvAA/Lmen74Reg.WwwQCQ0xHHUK4vqsCFWQwjwVQt5YqZG')
ON DUPLICATE KEY UPDATE password = VALUES(password);
