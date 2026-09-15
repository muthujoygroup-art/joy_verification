# JOY TRUE PROFILE — Security Audit & Hardening Report

## 1. Threat Model & Audit Scope
As a workforce identity and document verification platform, security, data minimization, and regulatory compliance under the **Digital Personal Data Protection (DPDP) Act 2023** are paramount.

## 2. Vulnerability Assessment & Implemented Mitigations

| Vulnerability Category | Risk Level | Mitigation Implemented |
| :--- | :--- | :--- |
| **Insecure Direct Object Reference (IDOR)** | Critical | Scoped database queries enforce company_id and hr_id ownership checks on every API request. Cross-company access is blocked at the ORM layer. |
| **Sensitive PII Exposure in Logs** | High | Sanitizer middleware masks Aadhaar numbers (first 8 digits masked: XXXX XXXX 1234), PAN cards (ABCDE****F), and OTP values from all server stdout and error loggers. |
| **Brute-Force & Denial of Service** | High | EnterpriseSecurityMiddleware enforces IP-based rate limiting (120 requests/minute per IP) and exponential backoff for failed OTP verification attempts (max 3 tries). |
| **SQL Injection** | Critical | 100% of database operations use parameterized queries via SQLAlchemy 2.0 ORM. Raw string formatting in queries is prohibited. |
| **Cross-Site Scripting (XSS)** | High | React 19 virtual DOM automatic HTML escaping + sanitization on all user-submitted form comments, candidate notes, and company names. |
| **Unauthorized Portal Indexing** | Medium | Configured 
obots.txt, no-index headers on authenticated responses, and route-level token validation preventing private candidate dossiers from appearing in search engine caches. |
| **Data Encryption** | High | Sensitive payload fields and token signatures utilize 256-bit AES encryption at rest and TLS 1.3 in transit. |

## 3. Privacy & Statutory Compliance
- **Explicit Candidate Consent**: Every verification link presents a clear, tamper-evident consent banner before any external check is performed.
- **Aadhaar Masking**: The platform strictly avoids unredacted storage of national identity numbers.
- **Audit Trails**: Every API call, status change, and login event is permanently recorded in udit_trail_logs with UTC timestamps.
