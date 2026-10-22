/**
 * JOY DATA VERIFICATION - Incident Forensics & Diagnostic Playbook Engine
 * 
 * Provides automated root cause diagnosis, location identification, timestamp analysis,
 * and prescriptive step-by-step remediation playbooks for every error across all platform portals.
 */

// 1. Comprehensive Diagnostic Playbook Knowledge Base
export const DIAGNOSTIC_PLAYBOOKS = {
  ERR_SMTP_DISPATCH_FAILED: {
    title: 'cPanel SMTP Email Server Authentication / Dispatch Failure',
    category: 'Email Gateway',
    severity: 'Critical',
    defaultWhere: {
      portal: 'SuperAdmin / Email Gateway',
      module: 'cPanel SMTP Gateway Service',
      component: 'backend/app/services/email_service.py',
      apiEndpoint: 'SMTP Port 465 (SSL) / 587 (TLS)'
    },
    why: 'The mail server rejected authentication (e.g. 535 Incorrect authentication data) or the socket timed out during handshake with mail.joycorporatesolutions.com. Outgoing OTPs, password recovery links, and invitation emails are blocked.',
    how: [
      'Step 1: Navigate to SuperAdmin ➔ Email & System Settings (or Messaging Gateways 💬).',
      'Step 2: Verify the master SMTP configuration: Host: mail.joycorporatesolutions.com, Port: 465, SSL: Enabled.',
      'Step 3: Confirm the mailbox password for admin@joycorporatesolutions.com in cPanel Webmail matches the configured password.',
      'Step 4: Click "Send Test Email Probe 📨" to test real-time socket authentication and confirm zero 535 rejection.',
      'Step 5: Once verified, click "Mark as Solved" on this incident card.'
    ],
    quickAction: 'test_smtp'
  },

  ERR_SMTP_DISPATCH_FAILURE: {
    title: 'cPanel SMTP Email Server Dispatch Timeout',
    category: 'Email Gateway',
    severity: 'High',
    defaultWhere: {
      portal: 'SuperAdmin / Email Gateway',
      module: 'cPanel SMTP Gateway Service',
      component: 'backend/app/services/email_service.py',
      apiEndpoint: 'SMTP Port 465 / 587 (SSL/TLS)'
    },
    why: 'The platform was unable to establish a secure SSL/TLS handshake with the SMTP host (mail.joycorporatesolutions.com) within the 15-second timeout threshold.',
    how: [
      'Step 1: Check server socket reachability to mail.joycorporatesolutions.com on port 465.',
      'Step 2: Ensure hosting provider firewall has not blocked outgoing SMTP TCP connections.',
      'Step 3: Test alternate TLS port 587 if port 465 encounters carrier-level throttling.',
      'Step 4: Run the SuperAdmin SMTP test dispatch probe to verify delivery.'
    ],
    quickAction: 'test_smtp'
  },

  ERR_AIRTEL_IQ_SMS_FAILED: {
    title: 'Airtel IQ Prepaid SMS Carrier Gateway Dispatch Error',
    category: 'SMS & Telecom Gateway',
    severity: 'Critical',
    defaultWhere: {
      portal: 'SuperAdmin / SMS Gateway',
      module: 'Airtel IQ Prepaid SMS Engine',
      component: 'backend/app/services/airtel_iq_sms_service.py',
      apiEndpoint: 'POST https://iqsms.airtel.in/api/v1/send-prepaid-sms'
    },
    why: 'Airtel IQ API rejected the prepaid SMS request. Potential causes: invalid HTTP Basic Auth credentials, missing customerId/entityId, non-whitelisted destination number format, or prepaid SMS credit balance exhausted.',
    how: [
      'Step 1: Open SuperAdmin ➔ Messaging Gateways ➔ Airtel IQ Prepaid SMS Console.',
      'Step 2: Verify Airtel IQ Customer ID, Username, Password, and Entity ID are correctly entered.',
      'Step 3: Ensure destination phone numbers are formatted with India country code prefix "91" (e.g. 919876543210).',
      'Step 4: Check prepaid SMS account balance on the Airtel Business Commercial Communications portal.',
      'Step 5: Send a live test dispatch using the built-in "Send Test SMS ⚡" modal to verify gateway response code.'
    ],
    quickAction: 'test_airtel'
  },

  ERR_DLT_TEMPLATE_MISMATCH: {
    title: 'TRAI DLT Template ID / Variable Validation Rejection',
    category: 'SMS Regulatory (TRAI DLT)',
    severity: 'High',
    defaultWhere: {
      portal: 'SuperAdmin / DLT Content Registry',
      module: 'TRAI DLT Template Parser',
      component: 'backend/app/services/airtel_iq_sms_service.py',
      apiEndpoint: 'POST https://iqsms.airtel.in/api/v1/send-prepaid-sms'
    },
    why: 'Carrier DLT scrubbing gateway rejected the message payload because the 19-digit DLT Template ID is unapproved, header JYCORP does not match, or variable parameters violate the TRAI Nov 18, 2025 variable pre-tagging directive.',
    how: [
      'Step 1: Cross-reference the 19-digit Template ID in the SuperAdmin DLT Content Template Registry against your Airtel DLT portal.',
      'Step 2: Ensure variable substitution values match registered types: {#numeric#} strictly numeric digits, {#alphanumeric#} text <= 40 chars, {#url#} whitelisted URL.',
      'Step 3: Confirm the sender header is exactly "JYCORP" (Service Implicit / Transactional).',
      'Step 4: Verify message ends with mandatory registered signature: "- JOY TRUE PROFILE".',
      'Step 5: Update the template in SuperAdmin and trigger a test dispatch.'
    ],
    quickAction: 'test_airtel'
  },

  ERR_RAZORPAY_SIGNATURE_INVALID: {
    title: 'Razorpay Payment Gateway HMAC-SHA256 Signature Verification Mismatch',
    category: 'Billing & Payments',
    severity: 'Critical',
    defaultWhere: {
      portal: 'SuperAdmin / Billing Router',
      module: 'Razorpay Security Engine',
      component: 'backend/app/services/razorpay_service.py',
      apiEndpoint: 'POST /api/billing/razorpay/verify-payment'
    },
    why: 'Client payment payload failed cryptographic verification: hmac_sha256(order_id + "|" + payment_id, secret) does not match the received razorpay_signature. The plan was not settled to prevent fraudulent order activation.',
    how: [
      'Step 1: Open SuperAdmin ➔ Invoices, Billing & Payments ➔ Razorpay Gateway Config.',
      'Step 2: Verify Razorpay Key ID (rzp_live_... or rzp_test_...) and Key Secret match the active Razorpay Dashboard API Keys.',
      'Step 3: Ensure Webhook Secret matches the registered webhook endpoint in the Razorpay Webhook Dashboard.',
      'Step 4: Check if currency amount was converted properly in paise (1 INR = 100 paise).',
      'Step 5: If valid manual payment received, use "Approve Offline Settlement" in SuperAdmin to credit candidate quota.'
    ],
    quickAction: 'test_razorpay'
  },

  ERR_NAMEERROR: {
    title: 'Backend Python Runtime NameError / Unbound Variable',
    category: 'Backend Core Runtime',
    severity: 'Critical',
    defaultWhere: {
      portal: 'Backend FastAPI Core',
      module: 'FastAPI Router Execution',
      component: 'backend/app/routers/ or services/',
      apiEndpoint: 'Internal Python ASGI Pipeline'
    },
    why: 'A Python identifier or SQLAlchemy model class was referenced before import or assignment in the FastAPI router execution scope, resulting in an unhandled 500 error.',
    how: [
      'Step 1: Review the exact stack trace in the Technical Forensics card below to identify the missing variable name.',
      'Step 2: Verify models and schemas are imported from backend.app.models in the affected router.',
      'Step 3: In cPanel ➔ Setup Python App, click "Restart" to reload Passenger WSGI worker threads.',
      'Step 4: Re-test the endpoint to confirm HTTP 200 OK.'
    ],
    quickAction: 'recycle_db'
  },

  ERR_UIDAI_503_OUTAGE: {
    title: 'UIDAI Central Identities Data Repository (CIDR) Outage [#503]',
    category: 'Government Statutory Gateway',
    severity: 'High',
    defaultWhere: {
      portal: 'HR Executive Portal / Candidate Onboarding',
      module: 'Aadhaar e-KYC Verification',
      component: 'src/components/DigiLockerSectionView.jsx',
      apiEndpoint: 'accounts.digitallocker.gov.in / UIDAI CIDR'
    },
    why: 'UIDAI Central Identities Data Repository returned HTTP 503 Service Unavailable during external DigiLocker web SSO redirect. This is an upstream government server outage or CIDR network congestion.',
    how: [
      'Step 1: Direct candidate or HR to use the in-app "Direct UIDAI OTP (Zero PIN Friction) ⚡" mode instead of external web redirects.',
      'Step 2: If live UIDAI is completely down, accept candidate manual document upload (Aadhaar masked copy) with HR visual sign-off.',
      'Step 3: Ping UIDAI Gateway in 360° Platform Health to monitor recovery latency.',
      'Step 4: Re-trigger Aadhaar verification once UIDAI CIDR service resumes normal operation.'
    ],
    quickAction: 'ping_uidai'
  },

  ERR_UIDAI_GATEWAY_TIMEOUT: {
    title: 'UIDAI Aadhaar OTP / e-KYC Gateway Timeout',
    category: 'Government Statutory Gateway',
    severity: 'High',
    defaultWhere: {
      portal: 'Candidate Verification Link / HR Workstation',
      module: 'Aadhaar e-KYC Verification',
      component: 'backend/app/services/live_verification_service.py',
      apiEndpoint: 'POST /api/verification/aadhaar/generate-otp'
    },
    why: 'The upstream UIDAI / Sub-AUA API gateway did not respond within the 20-second timeout threshold, or mobile carrier SMS OTP delivery was delayed by telecom routing.',
    how: [
      'Step 1: Verify API Gateway credentials in SuperAdmin ➔ Verification Gateways.',
      'Step 2: Trigger live socket ping to UIDAI node in 360° Health Monitoring.',
      'Step 3: Advise candidate to click "Resend OTP" to generate a fresh UIDAI transaction reference.',
      'Step 4: Confirm candidate mobile number is actively linked with their Aadhaar card.'
    ],
    quickAction: 'ping_uidai'
  },

  ERR_DIGILOCKER_PIN_REQUIRED: {
    title: 'DigiLocker Security 6-Digit PIN Prompt Drop-off',
    category: 'DigiLocker OAuth Protocol',
    severity: 'Medium',
    defaultWhere: {
      portal: 'Candidate Self-Service',
      module: 'DigiLocker Consent Vault',
      component: 'src/components/DigiLockerSectionView.jsx',
      apiEndpoint: 'https://accounts.digitallocker.gov.in/signin/auth'
    },
    why: 'NeGD DigiLocker 2FA security protocol requires candidate to enter their existing 6-digit PIN or set a new one. Candidates who forgot their PIN drop off during onboarding.',
    how: [
      'Step 1: Advise candidate to use the in-app "Direct UIDAI OTP (Zero PIN Friction) ⚡" flow in JOY TrueProfile.',
      'Step 2: The Direct OTP flow verifies Aadhaar instantly without requiring any 6-digit DigiLocker PIN.',
      'Step 3: If candidate needs other DigiLocker certificates (CBSE/DL), they can reset PIN on the official DigiLocker app.'
    ],
    quickAction: 'ping_uidai'
  },

  ERR_NSDL_PAN_VERIFICATION_FAILED: {
    title: 'NSDL PAN Verification Mismatch / Service Inactive',
    category: 'Statutory Verification',
    severity: 'Medium',
    defaultWhere: {
      portal: 'HR Executive Portal',
      module: 'Statutory PAN Verification',
      component: 'src/views/HrExecutiveView.jsx ➔ CandidateDossier',
      apiEndpoint: 'POST /api/verification/pan/verify-live'
    },
    why: 'Income Tax / NSDL database returned mismatch or inactive status for the provided PAN. Common causes: typographical error in 10-character PAN, name mismatch against ITD records, or unlinked Aadhaar-PAN.',
    how: [
      'Step 1: Verify candidate PAN matches strict 10-character alphanumeric structure (e.g. ABCDE1234F).',
      'Step 2: Cross-verify candidate Full Name and Date of Birth against PAN card physical copy.',
      'Step 3: Check if PAN is operative under Section 139AA (Aadhaar linked).',
      'Step 4: In Candidate Dossier, check OCR document upload and perform HR manual verification.'
    ],
    quickAction: 'test_pan'
  },

  ERR_EPFO_UAN_SERVICE_UNAVAILABLE: {
    title: 'EPFO Unified Portal Service Maintenance / Timeout',
    category: 'EPFO Statutory API',
    severity: 'Medium',
    defaultWhere: {
      portal: 'Candidate Onboarding / HR Portal',
      module: 'EPFO UAN Passbook Check',
      component: 'backend/app/services/live_verification_service.py',
      apiEndpoint: 'POST /api/verification/epfo/uan-details'
    },
    why: 'EPFO Unified Member Portal servers undergo regular statutory maintenance during peak hours (11:00 PM – 2:00 AM IST) or impose IP rate-limiting.',
    how: [
      'Step 1: Retry EPFO passbook verification during official business hours (9:00 AM – 6:00 PM IST).',
      'Step 2: If UAN service is down, provide candidate direct link to EPFO Member Portal in Statutory Document Redirect Hub.',
      'Step 3: Accept recent EPFO Member Passbook PDF or Form 16 / Salary Slip as valid secondary evidence.'
    ],
    quickAction: 'ping_epfo'
  },

  ERR_DB_CONNECTION_LIMIT: {
    title: 'PostgreSQL Database Connection Pool Limit Reached',
    category: 'Database & Infrastructure',
    severity: 'Critical',
    defaultWhere: {
      portal: 'Backend API Service',
      module: 'PostgreSQL Database Vault',
      component: 'backend/app/database.py',
      apiEndpoint: 'SQL Connection Pool (127.0.0.1:5432)'
    },
    why: 'Concurrent client requests exceeded the configured PostgreSQL pool size limit (pool_size=20, max_overflow=15), leading to query queue wait timeouts.',
    how: [
      'Step 1: Recycle connection pool via SuperAdmin ➔ PostgreSQL Database Explorer.',
      'Step 2: Check active PostgreSQL processes via terminal: SELECT count(*) FROM pg_stat_activity;',
      'Step 3: If traffic exceeds 500 concurrent users, increase pool_size in backend/app/config.py to 40.',
      'Step 4: Click "🧹 Purge Solved Logs" to prune obsolete audit rows.'
    ],
    quickAction: 'recycle_db'
  },

  ERR_REACT_COMPONENT_CRASH: {
    title: 'Frontend React UI Runtime Exception',
    category: 'Client UI Runtime',
    severity: 'High',
    defaultWhere: {
      portal: 'Client Web Browser',
      module: 'React Component Hierarchy',
      component: 'src/components/ErrorBoundary.jsx',
      apiEndpoint: 'Client-Side DOM Rendering'
    },
    why: 'An unhandled JavaScript error or undefined variable occurred during component rendering. The application ErrorBoundary caught the exception to protect user session.',
    how: [
      'Step 1: Inspect the Component Stack Trace in the Technical Forensics card below.',
      'Step 2: Clear browser session storage and reload fresh assets using "Clear Session & Reload".',
      'Step 3: Verify backend API response DTO provides default empty arrays/objects for missing relationships.',
      'Step 4: Test in Incognito window to rule out third-party browser extensions mutating DOM.'
    ],
    quickAction: 'clear_cache'
  },

  ERR_CANDIDATE_CREATION_TIMEOUT: {
    title: 'Candidate Profile Creation Validation / Network Delay',
    category: 'HR Operations',
    severity: 'Medium',
    defaultWhere: {
      portal: 'HR Executive Portal',
      module: 'Candidate Roster Management',
      component: 'src/views/HrExecutiveView.jsx ➔ OnboardCandidateModal',
      apiEndpoint: 'POST /api/hr/candidates'
    },
    why: 'Candidate creation failed due to duplicate Mobile/Aadhaar in company roster, missing mandatory field inputs, or database lock latency during bulk import.',
    how: [
      'Step 1: Verify candidate mobile number contains exactly 10 digits and valid email format.',
      'Step 2: Check if candidate with the same phone or Aadhaar already exists in the company roster.',
      'Step 3: Use "🧹 Deduplicate & Clean" in SuperAdmin to re-index profile IDs.',
      'Step 4: Re-submit candidate creation form.'
    ],
    quickAction: 'dedup_candidates'
  },

  ERR_JWT_SESSION_EXPIRED: {
    title: 'Authentication JWT Token Expired / Session Invalidation',
    category: 'Security & Auth',
    severity: 'Low',
    defaultWhere: {
      portal: 'All Portals (SuperAdmin / HR / Company / Candidate)',
      module: 'JWT Auth Interceptor',
      component: 'src/services/api.js',
      apiEndpoint: 'Bearer Token Header'
    },
    why: 'The user session token has expired past its security validity window under DPDP Act compliance requirements.',
    how: [
      'Step 1: Re-authenticate credentials at the portal login screen.',
      'Step 2: If 2FA passcode required, enter the 6-digit code received on registered administrator email.',
      'Step 3: SuperAdmin can adjust session TTL in Platform Settings if longer sessions are required.',
      'Step 4: Ensure browser permits localStorage persistence and cookies.'
    ],
    quickAction: 'reauth'
  }
};

/**
 * Intelligent Forensic Analyzer
 * Takes any system error log and automatically computes the exact 4 Diagnostic Pillars:
 * 1. WHERE: Exact Portal, Module, Component, Function & Device Telemetry
 * 2. WHEN: Precise IST Timestamp, relative time elapsed & epoch
 * 3. WHY: Root Cause Diagnosis, failure category & payload telemetry
 * 4. HOW: Prescriptive actionable remediation playbook & quick actions
 */
export const analyzeIncidentForensics = (log) => {
  if (!log) return null;

  const rawMsg = String(log.message || log.details || '');
  const rawCode = String(log.errorCode || log.event || log.error_code || 'ERR_SYSTEM_GENERAL');
  const rawPortal = log.portal || 'HR Executive Portal';
  const rawSection = log.section || 'General Operations';
  const rawFunc = log.functionName || log.function_name || '';
  const rawStack = log.stackTrace || log.stack_trace || '';
  const rawTimestamp = log.timestamp || new Date().toLocaleString();

  // 1. Match Known Playbook or Synthesize Dynamic Diagnostic
  let matchedKey = Object.keys(DIAGNOSTIC_PLAYBOOKS).find(k => 
    rawCode.toUpperCase() === k.toUpperCase() ||
    rawCode.toUpperCase().includes(k.replace('ERR_', '')) || 
    rawMsg.toUpperCase().includes(k.replace('ERR_', ''))
  );

  let playbook = matchedKey ? DIAGNOSTIC_PLAYBOOKS[matchedKey] : null;

  // Dynamic Synthesis if no explicit playbook matched
  if (!playbook) {
    const isSmtp = /smtp|mail|exim|535|email/i.test(rawMsg + rawCode);
    const isSms = /sms|airtel|dlt|telecom|trai/i.test(rawMsg + rawCode);
    const isRazorpay = /razorpay|payment|order|signature|paise/i.test(rawMsg + rawCode);
    const isNetwork = /network|fetch|timeout|econnrefused|socket|502|503|504/i.test(rawMsg + rawCode);
    const isValidation = /validation|invalid|missing|format|required|pattern/i.test(rawMsg + rawCode);
    const isDb = /database|postgres|sql|table|relation|constraint|foreign key/i.test(rawMsg + rawCode);
    const isAuth = /auth|unauthorized|jwt|forbidden|401|403|token|passcode|2fa/i.test(rawMsg + rawCode);
    const isUi = /react|cannot read|undefined|null|render|component/i.test(rawMsg + rawStack);

    let category = 'System Service';
    let whyText = `The platform encountered an operational exception: "${rawMsg.slice(0, 200)}".`;
    let howSteps = [
      'Step 1: Review the technical exception details and stack trace below.',
      'Step 2: Verify database connection and upstream gateway statuses in 360° Platform Health.',
      'Step 3: Test feature reproducibility in a separate workstation or browser tab.',
      'Step 4: Mark incident as Solved once verified.'
    ];
    let quickAction = 'none';

    if (isSmtp) {
      category = 'Email Gateway';
      whyText = 'cPanel Exim mail server rejected authentication or experienced socket latency. Outgoing email dispatches failed.';
      howSteps = [
        'Step 1: Navigate to SuperAdmin ➔ Email & System Settings.',
        'Step 2: Confirm SMTP password for admin@joycorporatesolutions.com matches cPanel Webmail.',
        'Step 3: Click "Send Test Email Probe" to verify SSL handshake on port 465.',
        'Step 4: Check if cPanel server firewall blocks outbound connections.'
      ];
      quickAction = 'test_smtp';
    } else if (isSms) {
      category = 'SMS & Telecom Gateway';
      whyText = 'Airtel IQ Prepaid SMS gateway or TRAI DLT template validation failed during carrier dispatch.';
      howSteps = [
        'Step 1: Check Airtel IQ credentials in SuperAdmin ➔ Messaging Gateways.',
        'Step 2: Verify 19-digit DLT Template ID and ensure variables match approved pattern.',
        'Step 3: Confirm phone number has 91 country code prefix.',
        'Step 4: Check prepaid SMS account balance on Airtel portal.'
      ];
      quickAction = 'test_airtel';
    } else if (isRazorpay) {
      category = 'Billing & Payments';
      whyText = 'Razorpay payment order creation, webhook verification, or HMAC signature validation encountered an exception.';
      howSteps = [
        'Step 1: Verify Razorpay Key ID and Secret in SuperAdmin ➔ Invoices & Payments.',
        'Step 2: Ensure webhook secret matches Razorpay dashboard setting.',
        'Step 3: Confirm amount is sent in paise (₹1 = 100 paise).',
        'Step 4: If payment succeeded in Razorpay, settle plan manually via SuperAdmin.'
      ];
      quickAction = 'test_razorpay';
    } else if (isNetwork) {
      category = 'Network & Gateway';
      whyText = 'A network connection or upstream gateway timeout occurred while dispatching API requests.';
      howSteps = [
        'Step 1: Check server internet connectivity and host DNS resolution.',
        'Step 2: Verify upstream API gateway statuses in SuperAdmin ➔ 360° Health Monitoring.',
        'Step 3: Retry the operation; transient network packet drops are automatically retried by the client.'
      ];
    } else if (isValidation) {
      category = 'Data Validation';
      whyText = 'Input parameters did not satisfy strict enterprise validation criteria or mandatory field requirements.';
      howSteps = [
        'Step 1: Verify input data formatting (e.g. 10-digit mobile, valid email, 12-digit Aadhaar).',
        'Step 2: Check for duplicate profile records using SuperAdmin ➔ "🧹 Deduplicate & Clean".',
        'Step 3: Re-submit with verified data.'
      ];
    } else if (isDb) {
      category = 'PostgreSQL Database';
      whyText = 'A database query execution or schema constraint exception occurred during transactional write.';
      howSteps = [
        'Step 1: Open SuperAdmin ➔ PostgreSQL Database Explorer to inspect table rows.',
        'Step 2: Verify database migrations are up to date.',
        'Step 3: Ensure PostgreSQL server has sufficient connection pool capacity.'
      ];
      quickAction = 'recycle_db';
    } else if (isAuth) {
      category = 'Security & Authentication';
      whyText = 'The request lacked valid authorization credentials, 2FA passcode was invalid/expired, or session token timed out.';
      howSteps = [
        'Step 1: Re-authenticate user credentials at the portal login screen.',
        'Step 2: Check user role permissions in SuperAdmin ➔ Login Directory.',
        'Step 3: Confirm session token exists in browser localStorage.'
      ];
      quickAction = 'reauth';
    } else if (isUi) {
      category = 'Frontend Component Runtime';
      whyText = 'A client-side rendering exception occurred due to unexpected state or undefined object property.';
      howSteps = [
        'Step 1: Inspect Component Stack in the traceback viewer below.',
        'Step 2: Clear browser cache and perform a hard refresh (Ctrl + Shift + R).',
        'Step 3: Ensure backend API response model matches expected frontend structure.'
      ];
      quickAction = 'clear_cache';
    }

    playbook = {
      title: rawCode.replace(/_/g, ' '),
      category,
      severity: log.severity || 'Critical',
      why: whyText,
      how: howSteps,
      quickAction
    };
  }

  // 2. Compute Relative Time (e.g. "3 mins ago")
  let relativeTime = 'Recent';
  try {
    const cleanTime = rawTimestamp.replace(' IST', '').replace(' UTC', '');
    const logDate = new Date(cleanTime);
    if (!isNaN(logDate.getTime())) {
      const diffMs = Date.now() - logDate.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSec < 60) relativeTime = `${Math.max(1, diffSec)}s ago`;
      else if (diffMin < 60) relativeTime = `${diffMin}m ago`;
      else if (diffHours < 24) relativeTime = `${diffHours}h ago`;
      else relativeTime = `${diffDays}d ago`;
    }
  } catch (e) {}

  const stepsList = playbook.how || [
    'Step 1: Inspect the technical stack trace details.',
    'Step 2: Verify database and upstream service connectivity in 360° Platform Health.',
    'Step 3: Test feature reproducibility in an incognito window.',
    'Step 4: Mark incident as solved once resolution is verified.'
  ];

  // 3. Assemble Full 4-Pillar Incident Forensics Object with Unified Aliases
  return {
    id: log.id,
    solved: !!log.solved,
    severity: log.severity || playbook.severity || 'Critical',
    title: playbook.title || rawCode,
    category: playbook.category || 'General System',

    // PILLAR 1: WHERE
    where: {
      portal: rawPortal,
      section: rawSection,
      functionName: rawFunc || 'N/A',
      summary: `${rawPortal} ➔ ${rawSection}`,
      apiEndpoint: log.apiEndpoint || log.userInfo?.endpoint || rawFunc || 'Internal Dispatch',
      ipAddress: log.ipAddress || log.ip_address || '127.0.0.1 (Local / Proxied)',
      clientIp: log.ipAddress || log.ip_address || '127.0.0.1 (Local / Proxied)',
      deviceInfo: log.deviceInfo || log.device_info || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Server Container'),
      userAgent: log.deviceInfo || log.device_info || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Server Container'),
      component: log.userInfo?.component || rawSection
    },

    // PILLAR 2: WHEN
    when: {
      timestamp: rawTimestamp,
      relativeTime,
      iso: log.created_at || rawTimestamp,
      resolvedAt: log.resolvedTimestamp || log.resolved_at || null,
      resolvedBy: log.resolvedBy || log.resolved_by || null
    },

    // PILLAR 3: WHY
    why: {
      errorCode: rawCode,
      message: rawMsg,
      category: playbook.category || 'System Exception',
      rootCauseSummary: playbook.why,
      rootCauseDiagnosis: playbook.why,
      stackTrace: rawStack || 'No technical stack trace provided.',
      userInfo: log.userInfo || log.user_info || {},
      resolutionNotes: log.resolutionNotes || log.resolution_notes || null
    },

    // PILLAR 4: HOW TO SOLVE (Provides both `how` and `howToSolve` aliases for complete compatibility)
    how: {
      summary: playbook.why,
      steps: stepsList,
      quickAction: playbook.quickAction || 'none'
    },
    howToSolve: {
      summary: playbook.why,
      steps: stepsList,
      quickAction: playbook.quickAction || 'none'
    }
  };
};

/**
 * Converts any raw error (technical error, 500 status, JavaScript exception)
 * into a polite, professional user-facing notification while preventing ugly technical leaks.
 */
export const getUserFriendlyErrorMessage = (rawError) => {
  if (!rawError) return 'An unexpected temporary hiccup occurred. Please try again.';

  const str = String(rawError?.message || rawError?.detail || rawError || '').trim();

  // Explicit, safe business messages that are helpful to the user
  const allowedExactMessages = [
    'Invalid or expired passcode',
    'Incorrect email or password',
    'Aadhaar number must be exactly 12 digits',
    'PAN format is invalid (must be 10 characters: e.g. ABCDE1234F)',
    'Mobile number must be 10 digits',
    'Passcode has been sent to your registered mobile number',
    'Please enter the 6-digit OTP received on your mobile',
    'Candidate with this Mobile or Email already exists'
  ];

  for (const allowed of allowedExactMessages) {
    if (str.toLowerCase().includes(allowed.toLowerCase())) {
      return allowed;
    }
  }

  // Network or Server Errors
  if (/fetch|network|econnrefused|failed to fetch|networkerror/i.test(str)) {
    return 'Unable to connect to server. Please check your internet connection or try again shortly.';
  }

  if (/500|502|503|504|internal server error|traceback|syntaxerror|typeerror|null pointer/i.test(str)) {
    return 'We are experiencing a temporary server issue. Please try again in a few moments.';
  }

  if (/429|rate limit|too many requests/i.test(str)) {
    return 'Too many requests received. Please wait a moment before trying again.';
  }

  if (/401|403|unauthorized|forbidden|token expired|jwt expired/i.test(str)) {
    return 'Your session has expired. Please log in again to continue.';
  }

  // Fallback for short, safe messages
  if (str.length > 0 && str.length < 80 && !/[{<>()\\]/.test(str)) {
    return str;
  }

  return 'We encountered a temporary issue processing your request. Please try again shortly.';
};
