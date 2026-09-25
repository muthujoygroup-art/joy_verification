/**
 * JOY DATA VERIFICATION - Incident Forensics & Diagnostic Playbook Engine
 * 
 * Provides automated root cause diagnosis, location identification, timestamp analysis,
 * and prescriptive step-by-step remediation playbooks for every error across all platform portals.
 */

// 1. Comprehensive Diagnostic Playbook Knowledge Base
export const DIAGNOSTIC_PLAYBOOKS = {
  ERR_UIDAI_GATEWAY_TIMEOUT: {
    title: 'UIDAI Aadhaar OTP / e-KYC Gateway Timeout',
    category: 'Gateway & Upstream API',
    severity: 'High',
    defaultWhere: {
      portal: 'Employee Verification Link',
      module: 'Aadhaar e-KYC Verification',
      component: 'EmployeeVerificationStep.jsx',
      apiEndpoint: 'POST /api/verification/aadhaar/verify-otp'
    },
    why: 'The upstream UIDAI/API Setu Gateway did not respond within the 20-second threshold. This usually occurs during intermittent UIDAI server latency spikes or when network carrier OTP deliveries are delayed.',
    how: [
      '1. Verify active Server 2 / Verification Gateway credentials in Settings ➔ Verification Gateways tab.',
      '2. Trigger a live gateway ping in SuperAdmin ➔ 360° Health Monitoring to check UIDAI latency.',
      '3. Advise the candidate to click "Resend OTP" to generate a fresh OTP transaction.',
      '4. If UIDAI servers remain unresponsive, switch Company Routing Engine to "Server 1 Sandbox" or "Smart Hybrid" mode.'
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
      component: 'HrExecutiveView.jsx ➔ CandidateDossier',
      apiEndpoint: 'POST /api/verification/pan/verify-live'
    },
    why: 'NSDL Income Tax Database rejected the query due to invalid PAN format, inactive PAN status, or mismatch between candidate legal name and PAN tax records.',
    how: [
      '1. Verify candidate PAN format matches 10-character alphanumeric structure (e.g. ABCDE1234F).',
      '2. Cross-verify candidate Full Name and Date of Birth against PAN card physical copy.',
      '3. In Candidate Dossier, check if PAN was manually verified via document OCR.',
      '4. If upstream NSDL is down, perform manual HR approval with audit comment.'
    ],
    quickAction: 'test_pan'
  },

  ERR_EPFO_UAN_SERVICE_UNAVAILABLE: {
    title: 'EPFO Unified Portal Service Maintenance / Timeout',
    category: 'EPFO Statutory API',
    severity: 'Medium',
    defaultWhere: {
      portal: 'Employee Verification Link',
      module: 'EPFO UAN / Passbook Check',
      component: 'EmployeePortalView.jsx ➔ EmploymentCheck',
      apiEndpoint: 'POST /api/verification/epfo/uan-details'
    },
    why: 'EPFO Unified Portal servers undergo regular statutory maintenance or rate-limiting during peak evening hours (11:00 PM – 2:00 AM IST).',
    how: [
      '1. Advise candidate to retry EPFO check during official business hours (9:00 AM – 6:00 PM IST).',
      '2. Accept recent EPFO Member Passbook PDF or Form 16 / Salary Slips as valid secondary verification.',
      '3. Verify company API threshold balance for EPFO passbook fetches.'
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
      apiEndpoint: 'SQL Connection Pool'
    },
    why: 'Concurrent client queries exceeded the configured PostgreSQL pool size limit, causing connection backlog and increased query latency.',
    how: [
      '1. Execute connection pool recycle via SuperAdmin ➔ PostgreSQL Explorer.',
      '2. Click "🧹 Purge Solved Logs" to prune completed audit records.',
      '3. In server configuration, increase SQLALCHEMY_POOL_SIZE from 20 to 50 if concurrent traffic exceeds 500 users.',
      '4. Check PostgreSQL process memory and disk I/O metrics in 360° Health Monitoring.'
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
      component: 'ErrorBoundary.jsx',
      apiEndpoint: 'Client-Side DOM Rendering'
    },
    why: 'An unhandled JavaScript error or unexpected undefined property occurred during component rendering. The application ErrorBoundary safely intercepted the crash to protect the session.',
    how: [
      '1. Inspect Component Stack Trace in the Technical Forensics viewer below.',
      '2. Clear browser session storage and reload fresh assets using "Clear Session & Reload".',
      '3. Verify backend API response contract matches frontend model DTO (ensure required arrays/objects are defaulted).',
      '4. If persistent, test feature in Incognito window to rule out browser extension DOM mutation.'
    ],
    quickAction: 'clear_cache'
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
    why: 'The platform was unable to establish a secure SSL/TLS handshake with the SMTP host (e.g. mail.joycorporatesolutions.com) or the SMTP user credentials failed authentication.',
    how: [
      '1. Navigate to SuperAdmin ➔ Verification Gateways ➔ Email SMTP Server 📧.',
      '2. Verify SMTP Host (`mail.joycorporatesolutions.com`), Port (`465` for SSL or `587` for TLS), Username, and Password.',
      '3. Click "Send Test Email Probe" to verify the end-to-end socket connection.',
      '4. Ensure host firewall does not block outgoing TCP ports 465 and 587.'
    ],
    quickAction: 'test_smtp'
  },

  ERR_CANDIDATE_CREATION_TIMEOUT: {
    title: 'Candidate Profile Creation Validation / Network Delay',
    category: 'HR Operations',
    severity: 'Medium',
    defaultWhere: {
      portal: 'HR Executive Portal',
      module: 'Candidate Roster Management',
      component: 'HrExecutiveView.jsx ➔ OnboardCandidateModal',
      apiEndpoint: 'POST /api/hr/candidates'
    },
    why: 'Form submission validation failed due to missing mandatory statutory inputs (Mobile, Email) or database write latency during high bulk import operations.',
    how: [
      '1. Verify candidate mobile number contains exactly 10 digits and valid email format.',
      '2. Check if a candidate with the same Mobile or Aadhaar already exists in the company roster.',
      '3. Click "🧹 Deduplicate & Clean" in SuperAdmin Omnisearch to re-index profile IDs.',
      '4. Re-submit candidate creation form.'
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
    why: 'The user session token has expired past its 10-minute inactivity security window under DPDP Act compliance requirements.',
    how: [
      '1. The user must re-enter their security passcode or credentials at the login screen.',
      '2. SuperAdmin can adjust session TTL in Platform Settings if longer sessions are required.',
      '3. Verify browser allows localStorage persistence and cookies.'
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

  const rawMsg = log.message || log.details || '';
  const rawCode = log.errorCode || log.event || log.error_code || 'ERR_SYSTEM_GENERAL';
  const rawPortal = log.portal || 'HR Executive Portal';
  const rawSection = log.section || 'General Operations';
  const rawFunc = log.functionName || log.function_name || '';
  const rawStack = log.stackTrace || log.stack_trace || '';
  const rawTimestamp = log.timestamp || new Date().toLocaleString();

  // 1. Match Known Playbook or Synthesize Dynamic Diagnostic
  let matchedKey = Object.keys(DIAGNOSTIC_PLAYBOOKS).find(k => 
    rawCode.toUpperCase().includes(k.replace('ERR_', '')) || 
    rawMsg.toUpperCase().includes(k.replace('ERR_', ''))
  );

  let playbook = matchedKey ? DIAGNOSTIC_PLAYBOOKS[matchedKey] : null;

  // Dynamic Synthesis if no explicit playbook matched
  if (!playbook) {
    const isNetwork = /network|fetch|timeout|econnrefused|socket|502|503|504/i.test(rawMsg + rawCode);
    const isValidation = /validation|invalid|missing|format|required|pattern/i.test(rawMsg + rawCode);
    const isDb = /database|postgres|sql|table|relation|constraint|foreign key/i.test(rawMsg + rawCode);
    const isAuth = /auth|unauthorized|jwt|forbidden|401|403|token/i.test(rawMsg + rawCode);
    const isUi = /react|cannot read|undefined|null|render|component/i.test(rawMsg + rawStack);

    let category = 'System Service';
    let whyText = `The platform encountered an operational exception: "${rawMsg.slice(0, 200)}".`;
    let howSteps = [
      '1. Review the technical exception details and stack trace below.',
      '2. Verify database connection and upstream gateway statuses in 360° Platform Health.',
      '3. Test feature reproducibility in a separate workstation or browser tab.',
      '4. Mark incident as Solved once verified.'
    ];

    if (isNetwork) {
      category = 'Network & Gateway Gateway';
      whyText = 'A network connection or upstream gateway timeout occurred while dispatching API requests.';
      howSteps = [
        '1. Check internet connectivity and host server DNS resolution.',
        '2. Verify upstream API gateway statuses in SuperAdmin ➔ 360° Health Monitoring.',
        '3. Retry the operation; transient network packet drops are automatically retried by the client.'
      ];
    } else if (isValidation) {
      category = 'Data Validation';
      whyText = 'Input parameters did not satisfy strict enterprise validation criteria or mandatory field requirements.';
      howSteps = [
        '1. Verify input data formatting (e.g. 10-digit mobile, valid email, 12-digit Aadhaar).',
        '2. Check for duplicate profile records using SuperAdmin Omnisearch ➔ "🧹 Deduplicate & Clean".',
        '3. Re-submit with verified data.'
      ];
    } else if (isDb) {
      category = 'PostgreSQL Database';
      whyText = 'A database query execution or schema constraint exception occurred during transactional write.';
      howSteps = [
        '1. Open SuperAdmin ➔ PostgreSQL Database Explorer to inspect table rows.',
        '2. Verify database migrations are up to date with "Run Migrations".',
        '3. Ensure PostgreSQL server has sufficient connection pool capacity.'
      ];
    } else if (isAuth) {
      category = 'Security & Authentication';
      whyText = 'The request lacked valid authorization credentials or the current JWT session has expired.';
      howSteps = [
        '1. Re-authenticate user credentials at the portal login screen.',
        '2. Check user role permissions in SuperAdmin ➔ Login Directory.',
        '3. Confirm session token exists in browser localStorage.'
      ];
    } else if (isUi) {
      category = 'Frontend Component Runtime';
      whyText = 'A client-side rendering exception occurred due to unexpected state or undefined object property.';
      howSteps = [
        '1. Inspect Component Stack in the traceback viewer below.',
        '2. Clear browser cache and perform a hard refresh (Ctrl + Shift + R).',
        '3. Ensure backend API response model matches expected frontend structure.'
      ];
    }

    playbook = {
      title: rawCode.replace(/_/g, ' '),
      category,
      severity: log.severity || 'Critical',
      why: whyText,
      how: howSteps
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

  // 3. Assemble Full 4-Pillar Incident Forensics Object
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
      apiEndpoint: log.apiEndpoint || log.userInfo?.endpoint || rawFunc || 'Internal Dispatch',
      ipAddress: log.ipAddress || log.ip_address || '127.0.0.1 (Local / Proxied)',
      deviceInfo: log.deviceInfo || log.device_info || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Server Container'),
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
      rootCauseSummary: playbook.why,
      stackTrace: rawStack || 'No technical stack trace provided.',
      userInfo: log.userInfo || log.user_info || {},
      resolutionNotes: log.resolutionNotes || log.resolution_notes || null
    },

    // PILLAR 4: HOW TO SOLVE
    how: {
      steps: playbook.how || [
        '1. Inspect the stack trace details.',
        '2. Verify database and upstream service connectivity.',
        '3. Test and mark as solved.'
      ],
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
