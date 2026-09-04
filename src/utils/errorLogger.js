/**
 * Central Error Logger & Telemetry Dispatcher for JOY Verification Portal
 * Safe implementation with strict recursion locks to prevent error cascades.
 */

let isLoggingInProgress = false;

const sanitizeMetadata = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  try {
    const sanitized = { ...obj };
    const sensitiveKeys = ['password', 'secret', 'secretKey', 'clientSecret', 'token', 'aadhaarNo'];
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        if (typeof sanitized[key] === 'string') {
          sanitized[key] = '••••••••';
        }
      }
    }
    return sanitized;
  } catch (e) {
    return {};
  }
};

/**
 * Explicitly log an error from any portal component or service
 */
export const logPortalError = async ({
  portal = 'HR Executive Portal',
  section = 'General',
  functionName = 'unknown_function',
  errorCode = 'ERR_FRONTEND_EXCEPTION',
  message = 'An unexpected error occurred',
  stackTrace = null,
  userInfo = {},
  severity = 'Critical'
}) => {
  // Prevent infinite recursive logging loops
  if (isLoggingInProgress) return;
  isLoggingInProgress = true;

  try {
    const errorPayload = {
      portal,
      section,
      function_name: functionName,
      error_code: errorCode,
      message: String(message || '').slice(0, 2000),
      stack_trace: stackTrace ? String(stackTrace).slice(0, 4000) : null,
      user_info: sanitizeMetadata(userInfo),
      device_info: typeof window !== 'undefined' ? `${navigator.userAgent || ''} | Screen: ${window.innerWidth}x${window.innerHeight}` : '',
      severity
    };

    // Use direct non-blocking fetch to avoid importing api.js and circular dependencies
    if (typeof window !== 'undefined' && window.fetch) {
      await fetch('/api/superadmin/system/error-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorPayload)
      }).catch(() => {});
    }
  } catch (err) {
    // Fail silently to never break user UI
  } finally {
    isLoggingInProgress = false;
  }
};

/**
 * Initializes global browser unhandled error & rejection listeners safely
 */
export const initGlobalErrorListeners = () => {
  if (typeof window === 'undefined') return;

  // 1. Catch uncaught synchronous JS runtime errors
  window.addEventListener('error', (event) => {
    try {
      const msg = event.message || '';
      // Ignore benign browser/extension noise and our own logger calls
      if (
        msg.includes('ResizeObserver') || 
        msg.includes('Script error') || 
        msg.includes('error-logs') ||
        (event.filename && event.filename.includes('errorLogger'))
      ) {
        return;
      }

      const currentPath = window.location.pathname || '';
      let portal = 'HR Executive Portal';
      if (currentPath.includes('/candidate') || currentPath.includes('/verify') || currentPath.includes('employee_link')) {
        portal = 'Employee Verification Link';
      } else if (currentPath.includes('/company') || currentPath.includes('/hr-onboarding')) {
        portal = 'Company Admin Portal';
      } else if (currentPath.includes('/superadmin') || currentPath.includes('/admin')) {
        portal = 'SuperAdmin Portal';
      }

      logPortalError({
        portal,
        section: 'Global Window Error',
        functionName: event.filename ? `${event.filename.split('/').pop()}:${event.lineno || 0}:${event.colno || 0}` : 'global_runtime',
        errorCode: 'ERR_WINDOW_RUNTIME',
        message: msg || 'Uncaught Window Exception',
        stackTrace: event.error?.stack || `${event.filename || ''}:${event.lineno || 0}`,
        severity: 'Critical'
      });
    } catch (e) {}
  });

  // 2. Catch unhandled Promise rejections safely
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      const msg = reason?.message || String(reason || '');
      
      if (
        !msg || 
        msg.includes('ResizeObserver') || 
        msg.includes('canceled') || 
        msg.includes('error-logs') ||
        msg.includes('Failed to fetch')
      ) {
        return;
      }

      const currentPath = window.location.pathname || '';
      let portal = 'HR Executive Portal';
      if (currentPath.includes('/candidate') || currentPath.includes('/verify')) {
        portal = 'Employee Verification Link';
      } else if (currentPath.includes('/company')) {
        portal = 'Company Admin Portal';
      } else if (currentPath.includes('/superadmin')) {
        portal = 'SuperAdmin Portal';
      }

      logPortalError({
        portal,
        section: 'Async Promise Rejection',
        functionName: 'unhandled_promise_rejection',
        errorCode: 'ERR_UNHANDLED_PROMISE',
        message: msg,
        stackTrace: reason?.stack || null,
        severity: 'High'
      });
    } catch (e) {}
  });
};
