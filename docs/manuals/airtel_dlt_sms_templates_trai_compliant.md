# JOY TrueProfile: Airtel DLT TRAI-Compliant SMS Content Templates
**Document Reference**: TRAI Direction F.No. D-27/1/(2)/2024-QoS (E-13563) dated November 18, 2025  
**DLT Portal**: Airtel Commercial Communications Portal (`https://www.airtel.in/business/commercial-communication/`)  
**Principal Entity (PE)**: Joy Corporate Solutions Private Limited / JOY TrueProfile  
**Recommended 6-Char Headers (Sender IDs)**: `JOYTRU`, `JOYTPF`, `JOYCRP`, `MUTJOY`  

---

## 🏛️ TRAI Variable Pre-Tagging Standards (Annexure-I Compliance)

Under the TRAI Direction dated **November 18, 2025**, every variable field in SMS content templates registered on Access Provider portals (Airtel DLT, Jio DLT, VilPower, BSNL) **must be pre-tagged** with descriptive labels specifying content type and validation criteria:

| Tag Identifier | Permitted Content | Scrubbing & Validation Rules | Application in JOY TrueProfile |
| :--- | :--- | :--- | :--- |
| **`#number#`** / **`#numeric#`** | Numeric digits only (`0-9`) | No letters or special chars permitted. Strictly numeric. | 6-digit OTPs, Validity in Minutes, Bill Amounts, Days |
| **`#alphanumeric#`** | Letters, numbers, and allowed punctuation | Length validation required. **Max 40 characters allowed**. | Candidate Name, Company Name, Unique Profile ID, Process Name |
| **`#url#`** | Registered Web URL / Short Link | Must match pre-whitelisted CTA URL domain on Airtel DLT. | Verification Links, Portal Login Links, Receipt Downloads |
| **`#cbn#`** | Call-Back Phone Number | Must match pre-whitelisted CTA Phone Number (Mobile/Toll-Free). | Official Support Desk Helpline Number |
| **`#email#`** | Support Email Address | Must match valid standard RFC email regex. | Official Support Email (`support@joycorporatesolutions.com`) |

> [!IMPORTANT]
> **TRAI Anti-Contiguity Rule**: Variables must be **non-contiguous** (e.g. you cannot place two variables adjacent to each other separated only by spaces or commas). Every variable must be separated by meaningful fixed static text. Every template must end with the brand entity name (e.g., `- JOY TRUE PROFILE`).

---

## 📱 Master SMS Template Library (9 Categories)

---

### Category 1: Welcome SMS (Platform Overview for All Users)

#### Template 1A: Welcome SMS for Corporate Tenants (Company Admins)
- **DLT Template Name**: `JTP_WELCOME_COMPANY_ADMIN`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Company Owner / Authorized Corporate Signatory
- **TRAI Pre-Tagged Template**:
  ```text
  Welcome #alphanumeric# to JOY TrueProfile. Your enterprise verification portal is active. Manage candidate BGV and statutory DPDP compliance at #url#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Welcome {#var#} to JOY TrueProfile. Your enterprise verification portal is active. Manage candidate BGV and statutory DPDP compliance at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (Max 40 chars, e.g. `Acme Corp`)
  - `{#var#}` 2 = URL (Whitelisted domain: `https://trueprofile.joycorporatesolutions.com/company`)
- **Sample Message**:
  > Welcome Acme Corp to JOY TrueProfile. Your enterprise verification portal is active. Manage candidate BGV and statutory DPDP compliance at https://trueprofile.joycorporatesolutions.com/company. - JOY TRUE PROFILE
- **Character Count**: 172 chars (~2 SMS units)

#### Template 1B: Welcome SMS for HR Recruiters & Executives
- **DLT Template Name**: `JTP_WELCOME_HR_RECRUITER`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: HR Managers and Talent Acquisition Recruiters
- **TRAI Pre-Tagged Template**:
  ```text
  Welcome #alphanumeric#. You are authorized as HR Recruiter for #alphanumeric# on JOY TrueProfile. Dispatch verification links and inspect candidate dossiers at #url#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Welcome {#var#}. You are authorized as HR Recruiter for {#var#} on JOY TrueProfile. Dispatch verification links and inspect candidate dossiers at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (Recruiter Name, e.g. `Hari Priya`)
  - `{#var#}` 2 = Alphanumeric (Company Name, e.g. `Joy Corporate Solutions`)
  - `{#var#}` 3 = URL (Whitelisted domain: `https://trueprofile.joycorporatesolutions.com/hr`)
- **Sample Message**:
  > Welcome Hari Priya. You are authorized as HR Recruiter for Joy Corporate Solutions on JOY TrueProfile. Dispatch verification links and inspect candidate dossiers at https://trueprofile.joycorporatesolutions.com/hr. - JOY TRUE PROFILE
- **Character Count**: 183 chars (~2 SMS units)

#### Template 1C: Welcome SMS for Candidates & Employees
- **DLT Template Name**: `JTP_WELCOME_CANDIDATE`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Job Candidates & New Joiners
- **TRAI Pre-Tagged Template**:
  ```text
  Dear #alphanumeric#, welcome to JOY TrueProfile. Your digital background verification workspace is ready for paperless onboarding. Complete your checks at #url#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, welcome to JOY TrueProfile. Your digital background verification workspace is ready for paperless onboarding. Complete your checks at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (Candidate Name, e.g. `Dharun Kumar`)
  - `{#var#}` 2 = URL (Whitelisted verification domain)
- **Sample Message**:
  > Dear Dharun Kumar, welcome to JOY TrueProfile. Your digital background verification workspace is ready for paperless onboarding. Complete your checks at https://trueprofile.joycorporatesolutions.com/verify. - JOY TRUE PROFILE
- **Character Count**: 174 chars (~2 SMS units)

---

### Category 2: Onboarding Verification Link SMS (Company, Vendor, HR, Employee)

#### Template 2A: Employee / Candidate Onboarding Verification Link
- **DLT Template Name**: `JTP_EMPLOYEE_ONBOARD_LINK`
- **DLT Category / Message Type**: Service Implicit / Transactional
- **Header**: `JYCORP`
- **Target Audience**: Candidates & New Joiner Employees completing KYC verification
- **DLT Tagged Format (Airtel / Jio / TRAI Portal)**:
  ```text
  Dear {#alphanumeric#}, {#alphanumeric#} has initiated your employee verification on JOY TrueProfile. Please complete your KYC details at {#url#}. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, {#var#} has initiated your employee verification on JOY TrueProfile. Please complete your KYC details at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#alphanumeric#}` 1 = Candidate / Employee Name (e.g. `Rahul Sharma`)
  - `{#alphanumeric#}` 2 = Employer / Company Name (e.g. `Joy Manpower Service`)
  - `{#url#}` 3 = Verification URL (e.g. `https://trueprofile.joycorporatesolutions.com/verify?t=tok_rahul`)
- **Sample Message**:
  > Dear Rahul Sharma, Joy Manpower Service has initiated your employee verification on JOY TrueProfile. Please complete your KYC details at https://trueprofile.joycorporatesolutions.com/verify?t=tok_rahul. - JOY TRUE PROFILE
- **Character Count**: ~173 chars (~2 SMS units)
- **1-Credit Alternative (<= 160 Chars)**:
  ```text
  Dear {#alphanumeric#}, complete your employee verification for {#alphanumeric#} on JOY TrueProfile at {#url#}. - JOY TRUE PROFILE
  ```

#### Template 2B: Company Client Onboarding & Enterprise Setup Link
- **DLT Template Name**: `JTP_COMPANY_ONBOARD_LINK`
- **DLT Category / Message Type**: Service Implicit / Transactional
- **Header**: `JYCORP`
- **Target Audience**: Corporate Enterprise Clients & Company Administrators
- **DLT Tagged Format (Airtel / Jio / TRAI Portal)**:
  ```text
  Dear {#alphanumeric#}, your enterprise account for {#alphanumeric#} is ready on JOY TrueProfile. Complete your company verification at {#url#}. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, your enterprise account for {#var#} is ready on JOY TrueProfile. Complete your company verification at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#alphanumeric#}` 1 = Company Admin Name (e.g. `Muthu Kumar`)
  - `{#alphanumeric#}` 2 = Company Name (e.g. `Apex Logistics`)
  - `{#url#}` 3 = Corporate Setup URL (e.g. `https://trueprofile.joycorporatesolutions.com/company`)
- **Sample Message**:
  > Dear Muthu Kumar, your enterprise account for Apex Logistics is ready on JOY TrueProfile. Complete your company verification at https://trueprofile.joycorporatesolutions.com/company. - JOY TRUE PROFILE
- **Character Count**: ~176 chars (~2 SMS units)
- **1-Credit Alternative (<= 160 Chars)**:
  ```text
  Dear {#alphanumeric#}, complete corporate verification for {#alphanumeric#} on JOY TrueProfile at {#url#}. - JOY TRUE PROFILE
  ```

#### Template 2C: Vendor Partner Onboarding Verification Link
- **DLT Template Name**: `JTP_VENDOR_ONBOARD_LINK`
- **DLT Category / Message Type**: Service Implicit / Transactional
- **Header**: `JYCORP`
- **Target Audience**: Third-Party Staffing Vendors, BGV Agencies & Contractors
- **DLT Tagged Format (Airtel / Jio / TRAI Portal)**:
  ```text
  Dear {#alphanumeric#}, vendor onboarding for {#alphanumeric#} has been initiated on JOY TrueProfile. Complete your verification profile at {#url#}. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, vendor onboarding for {#var#} has been initiated on JOY TrueProfile. Complete your verification profile at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#alphanumeric#}` 1 = Vendor Contact / Agency Name (e.g. `Rajesh Kumar`)
  - `{#alphanumeric#}` 2 = Corporate Partner Name (e.g. `Joy Corporate Solutions`)
  - `{#url#}` 3 = Vendor Verification URL (e.g. `https://trueprofile.joycorporatesolutions.com/vendor`)
- **Sample Message**:
  > Dear Rajesh Kumar, vendor onboarding for Joy Corporate Solutions has been initiated on JOY TrueProfile. Complete your verification profile at https://trueprofile.joycorporatesolutions.com/vendor. - JOY TRUE PROFILE
- **Character Count**: ~185 chars (~2 SMS units)
- **1-Credit Alternative (<= 160 Chars)**:
  ```text
  Dear {#alphanumeric#}, complete vendor verification for {#alphanumeric#} on JOY TrueProfile at {#url#}. - JOY TRUE PROFILE
  ```

#### Template 2D: HR Recruiter Onboarding & Console Activation Link
- **DLT Template Name**: `JTP_HR_ONBOARD_LINK`
- **DLT Category / Message Type**: Service Implicit / Transactional
- **Header**: `JYCORP`
- **Target Audience**: Newly provisioned HR Managers & Talent Acquisition Recruiters
- **DLT Tagged Format (Airtel / Jio / TRAI Portal)**:
  ```text
  Dear {#alphanumeric#}, you are invited as HR Recruiter for {#alphanumeric#} on JOY TrueProfile. Complete your account activation at {#url#}. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, you are invited as HR Recruiter for {#var#} on JOY TrueProfile. Complete your account activation at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#alphanumeric#}` 1 = Recruiter Name (e.g. `Hari Priya`)
  - `{#alphanumeric#}` 2 = Company Name (e.g. `Joy Corporate Solutions`)
  - `{#url#}` 3 = HR Console URL (e.g. `https://trueprofile.joycorporatesolutions.com/hr`)
- **Sample Message**:
  > Dear Hari Priya, you are invited as HR Recruiter for Joy Corporate Solutions on JOY TrueProfile. Complete your account activation at https://trueprofile.joycorporatesolutions.com/hr. - JOY TRUE PROFILE
- **Character Count**: ~172 chars (~2 SMS units)
- **1-Credit Alternative (<= 160 Chars)**:
  ```text
  Dear {#alphanumeric#}, activate your HR account for {#alphanumeric#} on JOY TrueProfile at {#url#}. - JOY TRUE PROFILE
  ```

---

### Category 3: Account Creation Completion SMS

#### Template 3A: Company / HR Account Activation Complete
- **DLT Template Name**: `JTP_ACCOUNT_ACTIVATION_COMPLETE`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Company Admins and HR Executives
- **TRAI Pre-Tagged Template**:
  ```text
  Dear #alphanumeric#, your account for #alphanumeric# has been successfully verified and activated. You can now access all portal features at #url#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, your account for {#var#} has been successfully verified and activated. You can now access all portal features at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (User Name, e.g. `Agilan M`)
  - `{#var#}` 2 = Alphanumeric (Role/Company, e.g. `HR Recruiter Console`)
  - `{#var#}` 3 = URL (Portal Link)
- **Sample Message**:
  > Dear Agilan M, your account for HR Recruiter Console has been successfully verified and activated. You can now access all portal features at https://trueprofile.joycorporatesolutions.com/hr. - JOY TRUE PROFILE
- **Character Count**: 174 chars (~2 SMS units)

#### Template 3B: Candidate Onboarding & Verification Complete
- **DLT Template Name**: `JTP_CANDIDATE_COMPLETION_SMS`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Candidates who completed all verification steps
- **TRAI Pre-Tagged Template**:
  ```text
  Dear #alphanumeric#, your background verification submission is complete and recorded under DPDP compliance. Download your digital certificate at #url#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, your background verification submission is complete and recorded under DPDP compliance. Download your digital certificate at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (Candidate Name, e.g. `Kavitha S`)
  - `{#var#}` 2 = URL (Certificate download link)
- **Sample Message**:
  > Dear Kavitha S, your background verification submission is complete and recorded under DPDP compliance. Download your digital certificate at https://trueprofile.joycorporatesolutions.com/verify. - JOY TRUE PROFILE
- **Character Count**: 177 chars (~2 SMS units)

---

### Category 4: Verification Process OTP SMS (Aadhaar / Mobile / Bank)

#### Template 4A: Mobile Phone / Document Verification OTP
- **DLT Template Name**: `JTP_VERIFY_MOBILE_OTP`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Candidates and Portal Users during KYC / Mobile verification
- **TRAI Pre-Tagged Template**:
  ```text
  #number# is your One Time Password (OTP) for verification on JOY TrueProfile. Valid for #number# minutes. Do not share this code with anyone. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  {#var#} is your One Time Password (OTP) for verification on JOY TrueProfile. Valid for {#var#} minutes. Do not share this code with anyone. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Numeric (6-digit OTP, e.g. `742918`)
  - `{#var#}` 2 = Numeric (Validity minutes, e.g. `10`)
- **Sample Message**:
  > 742918 is your One Time Password (OTP) for verification on JOY TrueProfile. Valid for 10 minutes. Do not share this code with anyone. - JOY TRUE PROFILE
- **Character Count**: 147 chars (**1 SMS unit** - Optimal Delivery Cost)

#### Template 4B: Candidate e-Sign & Consent Authorization OTP
- **DLT Template Name**: `JTP_CANDIDATE_ESIGN_OTP`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Candidates giving statutory consent for DigiLocker / BGV checks
- **TRAI Pre-Tagged Template**:
  ```text
  #number# is your statutory OTP to authorize digital background verification consent for #alphanumeric# on JOY TrueProfile. Valid for #number# mins. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  {#var#} is your statutory OTP to authorize digital background verification consent for {#var#} on JOY TrueProfile. Valid for {#var#} mins. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Numeric (6-digit OTP, e.g. `839201`)
  - `{#var#}` 2 = Alphanumeric (Employer/Tenant Name, e.g. `Joy Corporate Solutions`)
  - `{#var#}` 3 = Numeric (Validity in mins, e.g. `10`)
- **Sample Message**:
  > 839201 is your statutory OTP to authorize digital background verification consent for Joy Corporate Solutions on JOY TrueProfile. Valid for 10 mins. - JOY TRUE PROFILE
- **Character Count**: 160 chars (**1 SMS unit**)

---

### Category 5: Two-Factor Authentication (2FA) OTP SMS

#### Template 5A: Mandatory Portal Login 2FA Passcode
- **DLT Template Name**: `JTP_MANDATORY_2FA_LOGIN_OTP`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Super Admin, Company Admin, and HR Recruiter Login 2FA
- **TRAI Pre-Tagged Template**:
  ```text
  #number# is your Two-Factor Authentication (2FA) security passcode for #alphanumeric# login on JOY TrueProfile. Valid for #number# mins. Keep confidential. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  {#var#} is your Two-Factor Authentication (2FA) security passcode for {#var#} login on JOY TrueProfile. Valid for {#var#} mins. Keep confidential. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Numeric (6-digit Passcode, e.g. `518492`)
  - `{#var#}` 2 = Alphanumeric (Portal Name / Identifier, e.g. `Super Admin`)
  - `{#var#}` 3 = Numeric (Validity in mins, e.g. `5`)
- **Sample Message**:
  > 518492 is your Two-Factor Authentication (2FA) security passcode for Super Admin login on JOY TrueProfile. Valid for 5 mins. Keep confidential. - JOY TRUE PROFILE
- **Character Count**: 159 chars (**1 SMS unit** - Guaranteed Fast Transit)

#### Template 5B: Password Recovery & Reset 6-Digit Passcode (3-Variable DLT Compliant)
- **DLT Template Name**: `JTP_PASSWORD_RESET_PASSCODE`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Administrators & Users requesting password recovery

##### Option 1 (Recommended - 1 SMS Credit / <= 160 Characters):
- **TRAI Pre-Tagged Template**:
  ```text
  #number# is your password reset passcode for your JOY TrueProfile account. Valid for #number# minutes. If not requested, contact #email#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format (3 Variables)**:
  ```text
  {#var#} is your password reset passcode for your JOY TrueProfile account. Valid for {#var#} minutes. If not requested, contact {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Numeric (6-digit OTP, e.g. `390214`)
  - `{#var#}` 2 = Numeric (Validity in Minutes, e.g. `10`)
  - `{#var#}` 3 = Email / Phone (Support Contact, e.g. `admin@joycorporatesolutions.com`)
- **Sample Message**:
  > 390214 is your password reset passcode for your JOY TrueProfile account. Valid for 10 minutes. If not requested, contact admin@joycorporatesolutions.com. - JOY TRUE PROFILE
- **Character Count**: ~154 chars (**1 SMS unit** - Saves 50% SMS cost & passes 3-variable portal limit)

##### Option 2 (Role Variable with Static Support Contact):
- **Airtel Standard Format (3 Variables)**:
  ```text
  {#var#} is your password reset passcode for your JOY TrueProfile {#var#} account. Valid for {#var#} minutes. If not requested, contact admin@joycorporatesolutions.com. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Numeric (6-digit OTP, e.g. `390214`)
  - `{#var#}` 2 = Alphanumeric (Role / Account Name, e.g. `Admin`)
  - `{#var#}` 3 = Numeric (Validity in Minutes, e.g. `10`)
- **Sample Message**:
  > 390214 is your password reset passcode for your JOY TrueProfile Admin account. Valid for 10 minutes. If not requested, contact admin@joycorporatesolutions.com. - JOY TRUE PROFILE
- **Character Count**: ~175 chars (~2 SMS units)

---

### Category 6: Reminder SMS for Pending Processes

#### Template 6A: Candidate Verification Incomplete Reminder
- **DLT Template Name**: `JTP_CANDIDATE_REMINDER_SUBMIT`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Candidates with pending or partially filled verification forms
- **TRAI Pre-Tagged Template**:
  ```text
  Reminder: Dear #alphanumeric#, your employee onboarding verification for #alphanumeric# is pending. Please complete your submission at #url# to prevent delay. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Reminder: Dear {#var#}, your employee onboarding verification for {#var#} is pending. Please complete your submission at {#var#} to prevent delay. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (Candidate Name, e.g. `Manoj Kumar`)
  - `{#var#}` 2 = Alphanumeric (Company Name, e.g. `Joy Manpower Service`)
  - `{#var#}` 3 = URL (Verification link)
- **Sample Message**:
  > Reminder: Dear Manoj Kumar, your employee onboarding verification for Joy Manpower Service is pending. Please complete your submission at https://trueprofile.joycorporatesolutions.com/verify. - JOY TRUE PROFILE
- **Character Count**: 189 chars (~2 SMS units)

#### Template 6B: Company Postpaid Bill Settlement Reminder
- **DLT Template Name**: `JTP_COMPANY_BILL_REMINDER`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Corporate Finance Admins with outstanding monthly invoices
- **TRAI Pre-Tagged Template**:
  ```text
  Dear #alphanumeric#, invoice #alphanumeric# for INR #number# is due for payment. Settle your postpaid bill via Razorpay at #url# to maintain uninterrupted API service. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, invoice {#var#} for INR {#var#} is due for payment. Settle your postpaid bill via Razorpay at {#var#} to maintain uninterrupted API service. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (Company Name, e.g. `Acme Corp`)
  - `{#var#}` 2 = Alphanumeric (Invoice Number, e.g. `INV-2026-1002`)
  - `{#var#}` 3 = Numeric (Invoice Amount, e.g. `4500`)
  - `{#var#}` 4 = URL (Billing portal link)
- **Sample Message**:
  > Dear Acme Corp, invoice INV-2026-1002 for INR 4500 is due for payment. Settle your postpaid bill via Razorpay at https://trueprofile.joycorporatesolutions.com/company to maintain uninterrupted API service. - JOY TRUE PROFILE
- **Character Count**: 204 chars (~2 SMS units)

---

### Category 7: Feedback SMS (With Process Specifics)

#### Template 7A: Candidate Onboarding & Verification Experience Feedback
- **DLT Template Name**: `JTP_CANDIDATE_EXPERIENCE_FEEDBACK`
- **DLT Category / Message Type**: Service Explicit
- **Target Audience**: Candidates who concluded identity verification
- **TRAI Pre-Tagged Template**:
  ```text
  Dear #alphanumeric#, your verification for #alphanumeric# is complete. Help us improve your onboarding experience by sharing feedback at #url#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, your verification for {#var#} is complete. Help us improve your onboarding experience by sharing feedback at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (Candidate Name, e.g. `Anitha R`)
  - `{#var#}` 2 = Alphanumeric (Process Name, e.g. `Digital KYC Check`)
  - `{#var#}` 3 = URL (Feedback form link)
- **Sample Message**:
  > Dear Anitha R, your verification for Digital KYC Check is complete. Help us improve your onboarding experience by sharing feedback at https://trueprofile.joycorporatesolutions.com/feedback. - JOY TRUE PROFILE
- **Character Count**: 186 chars (~2 SMS units)

#### Template 7B: Support Helpdesk Ticket Resolution Feedback
- **DLT Template Name**: `JTP_TICKET_RESOLUTION_FEEDBACK`
- **DLT Category / Message Type**: Service Explicit
- **Target Audience**: Corporate clients after support ticket closure
- **TRAI Pre-Tagged Template**:
  ```text
  Dear #alphanumeric#, ticket #alphanumeric# regarding #alphanumeric# has been resolved. Please rate our support quality at #url#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, ticket {#var#} regarding {#var#} has been resolved. Please rate our support quality at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (User Name, e.g. `Suresh K`)
  - `{#var#}` 2 = Alphanumeric (Ticket ID, e.g. `TICK-8021`)
  - `{#var#}` 3 = Alphanumeric (Subject, e.g. `API Rate Limits`)
  - `{#var#}` 4 = URL (Feedback URL)
- **Sample Message**:
  > Dear Suresh K, ticket TICK-8021 regarding API Rate Limits has been resolved. Please rate our support quality at https://trueprofile.joycorporatesolutions.com/support. - JOY TRUE PROFILE
- **Character Count**: 176 chars (~2 SMS units)

---

### Category 8: Unique Profile ID Allocation SMS

#### Template 8A: Universal Portal User Unique ID Dispatch (Company/HR Tag + Keep Safe Reminder)
- **DLT Template Name**: `JTP_PORTAL_USER_UNIQUE_ID`
- **DLT Category / Message Type**: Service Implicit / Transactional
- **Header**: `JYCORP`
- **Target Audience**: Candidates, Employees, and Portal Users receiving their ID

##### Primary Format (Recommended - 1 SMS Unit / <= 160 Characters):
- **DLT Tagged Format (Airtel / Jio / TRAI Portal)**:
  ```text
  Dear {#alphanumeric#}, your unique ID for {#alphanumeric#} on JOY TrueProfile is {#alphanumeric#}. Kindly save this ID for your future reference. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, your unique ID for {#var#} on JOY TrueProfile is {#var#}. Kindly save this ID for your future reference. - JOY TRUE PROFILE
  ```
  - `{#alphanumeric#}` 1 = User Full Name (e.g. `Muthu Kumar`)
  - `{#alphanumeric#}` 2 = Company Name or HR Name (e.g. `Joy Corporate Solutions` or `HR Team`)
  - `{#alphanumeric#}` 3 = Unique Profile ID (e.g. `COMP001EMP004`)
- **Sample Message (with Company)**:
  > Dear Muthu Kumar, your unique ID for Joy Corporate Solutions on JOY TrueProfile is COMP001EMP004. Kindly save this ID for your future reference. - JOY TRUE PROFILE
- **Sample Message (with HR)**:
  > Dear Muthu Kumar, your unique ID for HR Team on JOY TrueProfile is COMP001EMP004. Kindly save this ID for your future reference. - JOY TRUE PROFILE
- **Character Count**: ~152 chars (**1 SMS unit** - Single credit cost)

##### Alternative Format ("Issued by Company/HR" + "Keep this ID safe"):
- **DLT Tagged Format**:
  ```text
  Dear {#alphanumeric#}, your unique ID on JOY TrueProfile is {#alphanumeric#}, issued by {#alphanumeric#}. Please keep this ID safe for all records. - JOY TRUE PROFILE
  ```
- **Character Count**: ~150 chars (**1 SMS unit**)

#### Template 8B: Portal User Unique ID with Role Tag (3 Variables)
- **DLT Template Name**: `JTP_USER_ROLE_UNIQUE_ID`
- **DLT Category / Message Type**: Service Implicit / Transactional
- **Header**: `JYCORP`
- **DLT Tagged Format**:
  ```text
  Dear {#alphanumeric#}, your {#alphanumeric#} unique ID on JOY TrueProfile is {#alphanumeric#}. Login at {#url#}. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, your {#var#} unique ID on JOY TrueProfile is {#var#}. Login at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 (`{#alphanumeric#}`) = User Full Name (e.g. `Agilan M`)
  - `{#var#}` 2 (`{#alphanumeric#}`) = Portal Role (e.g. `HR Recruiter` or `Employee`)
  - `{#var#}` 3 (`{#alphanumeric#}`) = Unique ID (e.g. `COMP001HR001`)
  - `{#var#}` 4 (`{#url#}`) = Login Portal Link
- **Sample Message**:
  > Dear Agilan M, your HR Recruiter unique ID on JOY TrueProfile is COMP001HR001. Login at https://trueprofile.joycorporatesolutions.com. - JOY TRUE PROFILE

#### Template 8C: Welcome & Official ID Allocation (3 Variables)
- **DLT Template Name**: `JTP_OFFICIAL_PROFILE_CODE_DISPATCH`
- **DLT Category / Message Type**: Service Implicit / Transactional
- **Header**: `JYCORP`
- **DLT Tagged Format**:
  ```text
  Welcome {#alphanumeric#}. Your unique ID on JOY TrueProfile is {#alphanumeric#}. Access your portal account at {#url#}. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Welcome {#var#}. Your unique ID on JOY TrueProfile is {#var#}. Access your portal account at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 (`{#alphanumeric#}`) = Name (e.g. `Agilan M`)
  - `{#var#}` 2 (`{#alphanumeric#}`) = Official ID Code (e.g. `COMP001HR001`)
  - `{#var#}` 3 (`{#url#}`) = Portal URL (`https://trueprofile.joycorporatesolutions.com`)
- **Sample Message**:
  > Welcome Agilan M. Your unique ID on JOY TrueProfile is COMP001HR001. Access your portal account at https://trueprofile.joycorporatesolutions.com. - JOY TRUE PROFILE
- **Character Count**: ~157 chars (**1 SMS unit**)

---

### Category 9: Payment Confirmation & Transaction Status SMS

#### Template 9A: Postpaid Bill Settlement Confirmation (Razorpay)
- **DLT Template Name**: `JTP_PAYMENT_CONFIRMATION_SUCCESS`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Company Admins after successful invoice settlement
- **TRAI Pre-Tagged Template**:
  ```text
  Dear #alphanumeric#, payment of INR #number# for invoice #alphanumeric# is successful via Razorpay (Ref: #alphanumeric#). Download receipt at #url#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, payment of INR {#var#} for invoice {#var#} is successful via Razorpay (Ref: {#var#}). Download receipt at {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (Company Name, e.g. `Acme Corp`)
  - `{#var#}` 2 = Numeric (Amount Paid, e.g. `12500`)
  - `{#var#}` 3 = Alphanumeric (Invoice Number, e.g. `INV-2026-088`)
  - `{#var#}` 4 = Alphanumeric (Payment Ref/Txn ID, e.g. `pay_Ot91K8d2`)
  - `{#var#}` 5 = URL (Receipt download URL)
- **Sample Message**:
  > Dear Acme Corp, payment of INR 12500 for invoice INV-2026-088 is successful via Razorpay (Ref: pay_Ot91K8d2). Download receipt at https://trueprofile.joycorporatesolutions.com/company. - JOY TRUE PROFILE
- **Character Count**: 189 chars (~2 SMS units)

#### Template 9B: Payment Failure & Auto-Retry Notice
- **DLT Template Name**: `JTP_PAYMENT_TRANSACTION_FAILED`
- **DLT Category / Message Type**: Service Implicit
- **Target Audience**: Corporate accounts when Razorpay payment fails
- **TRAI Pre-Tagged Template**:
  ```text
  Dear #alphanumeric#, payment attempt of INR #number# for invoice #alphanumeric# has failed. Please retry settlement at #url# or contact #email#. - JOY TRUE PROFILE
  ```
- **Airtel Standard Format**:
  ```text
  Dear {#var#}, payment attempt of INR {#var#} for invoice {#var#} has failed. Please retry settlement at {#var#} or contact {#var#}. - JOY TRUE PROFILE
  ```
  - `{#var#}` 1 = Alphanumeric (Company Name, e.g. `Acme Corp`)
  - `{#var#}` 2 = Numeric (Amount, e.g. `7800`)
  - `{#var#}` 3 = Alphanumeric (Invoice ID, e.g. `INV-2026-092`)
  - `{#var#}` 4 = URL (Billing portal link)
  - `{#var#}` 5 = Email (`admin@joycorporatesolutions.com`)
- **Sample Message**:
  > Dear Acme Corp, payment attempt of INR 7800 for invoice INV-2026-092 has failed. Please retry settlement at https://trueprofile.joycorporatesolutions.com/company or contact admin@joycorporatesolutions.com. - JOY TRUE PROFILE
- **Character Count**: 195 chars (~2 SMS units)

---

## 📋 Airtel DLT Portal Registration Checklist & Runbook

### Step 1: Pre-Register Call-To-Action (CTA) Items on Airtel DLT
Before submitting content templates, TRAI mandates that all URLs, callback numbers, and emails inside templates must be approved under the **CTA / Whitelist** tab on Airtel DLT:
1. **Whitelist URLs (Static & Dynamic)**:
   - `https://trueprofile.joycorporatesolutions.com`
   - `https://trueprofile.joycorporatesolutions.com/company`
   - `https://trueprofile.joycorporatesolutions.com/hr`
   - `https://trueprofile.joycorporatesolutions.com/verify`
   - `https://trueprofile.joycorporatesolutions.com/support`
2. **Whitelist Callback Phone Numbers (CBN)**:
   - Your official support helpline: e.g. `+91-XXXXXXXXXX` or Toll-Free number.
3. **Whitelist Support Email**:
   - `admin@joycorporatesolutions.com` / `support@joycorporatesolutions.com`.

### Step 2: Content Template Submission on Airtel Portal
1. Login to **Airtel Commercial Communication Portal**: `https://www.airtel.in/business/commercial-communication/`.
2. Navigate to **Template Management** &rarr; **Content Template** &rarr; **Add New Template**.
3. Fill details:
   - **Template Name**: Enter corresponding name (e.g., `JTP_MANDATORY_2FA_LOGIN_OTP`).
   - **Header (Sender ID)**: Select your approved 6-character header (e.g. `JOYTRU`).
   - **Communication Type**: Choose **Service Implicit** (for OTP, Onboarding, Unique ID, and Invoices) or **Service Explicit** (for Feedback).
   - **Consent Template**: Leave blank for Service Implicit.
   - **Template Message Text**: Paste the template body.
   - **Variable Tagging (Nov 2025 TRAI Rule)**: For each variable dropdown, select the matching validation type:
     - For OTPs/Amounts &rarr; Select `Numeric` (`#number#`).
     - For Names/IDs &rarr; Select `Alphanumeric` (`#alphanumeric#`).
     - For Links &rarr; Select `URL` (`#url#`) and choose your registered domain.
     - For Emails &rarr; Select `Email` (`#email#`).
4. Click **Submit for Approval**. Airtel DLT typically approves Service Implicit templates within **2 to 24 business hours**.
