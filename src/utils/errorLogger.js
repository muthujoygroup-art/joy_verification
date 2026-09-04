/**
 * Central Error Logger & Telemetry Dispatcher for JOY Verification Portal
 * Transmits runtime exceptions, API failures, validation crashes, and unhandled promises
 * directly to the Super Admin PostgreSQL system_error_logs table.
 */

import { api } from '../services/api';

const sanitizeMetadata = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
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
  try {
    const errorPayload = {
      portal,
      section,
      function_name: functionName,
      error_code: errorCode,
      message: String(message).slice(0, 2000),
      stack_trace: stackTrace ? String(stackTrace).slice(0, 4000) : null,
      user_info: sanitizeMetadata(userInfo),
      device_info: `${navigator.userAgent || ''} | Screen: ${window.innerWidth}x${window.innerHeight}`,
      severity
    };

    console.warn(`🚨 [${portal}] Error Captured:`, errorPayload);
    
    // Dispatches to backend PostgreSQL without blocking UI
    await api.reportErrorLog(errorPayload).catch(() => {});
  } catch (err) {
    console.error('Failed to dispatch portal error log:', err);
  }
};

/**
 * Initializes global browser unhandled error & rejection listeners
 */
export const initGlobalErrorListeners = () => {
  if (typeof window === 'undefined') return;

  // 1. Catch uncaught synchronous JS runtime errors
  window.addEventListener('error', (event) => {
    // Ignore benign resize observer or third-party extension errors
    if (event.message?.includes('ResizeObserver') || event.message?.includes('Script error')) {
      return;
    }

    const currentPath = window.location.pathname;
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
      functionName: event.filename ? `${event.filename.split('/').pop()}:${event.lineno}:${event.colno}` : 'global_runtime',
      errorCode: 'ERR_WINDOW_RUNTIME',
      message: event.message || 'Uncaught Window Exception',
      stackTrace: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
      severity: 'Critical'
    });
  });

  // 2. Catch unhandled Promise rejections (e.g. failed fetch requests)
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason?.message || String(reason || 'Unhandled Promise Rejection');
    
    if (msg.includes('ResizeObserver') || msg.includes('canceled')) {
      return;
    }

    const currentPath = window.location.pathname;
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
  });
};
