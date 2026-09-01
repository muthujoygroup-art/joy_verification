/**
 * JOY DATA VERIFICATION - Frontend REST API Client
 * Equipped with JWT Authentication, Request Deduplication & Smart Client Load Balancing.
 */

const API_BASE_URL = '/api';

// In-Memory Request Cache & Deduplication Map
const requestCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 1500; // 1.5 seconds deduplication window

// Token Management
let authToken = sessionStorage.getItem('joy_auth_token') || '';

export const setAuthToken = (token) => {
  authToken = token || '';
  if (token) {
    sessionStorage.setItem('joy_auth_token', token);
  } else {
    sessionStorage.removeItem('joy_auth_token');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = sessionStorage.getItem('joy_auth_token') || '';
  }
  return authToken;
};

async function request(endpoint, options = {}, useCache = false) {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  // GET Request Deduplication & Load-Balancing Cache
  if (method === 'GET' && useCache) {
    const cached = requestCache.get(endpoint);
    const now = Date.now();
    if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    if (inFlightRequests.has(endpoint)) {
      return await inFlightRequests.get(endpoint);
    }
  }

  const fetchPromise = (async () => {
    let attempts = 0;
    const maxAttempts = method === 'GET' ? 2 : 1; // Retry idempotent GET requests on network glitches
    
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s safety timeout

        const res = await fetch(url, { ...config, signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          if (res.status === 401 && endpoint !== '/auth/login') {
            // Token expired or invalid
            sessionStorage.removeItem('joy_auth_token');
          }
          if (res.status === 429) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Rate limit exceeded. Please slow down.');
          }
          if (res.status >= 500 && attempts < maxAttempts) {
            // Retry on server glitches with backoff
            await new Promise(r => setTimeout(r, 600 * attempts));
            continue;
          }
          const errorData = await res.json().catch(() => ({}));
          const errorMessage = errorData.detail || errorData.message || `Request failed with status ${res.status}`;
          throw new Error(errorMessage);
        }
        const data = await res.json();

        if (method === 'GET' && useCache) {
          requestCache.set(endpoint, { data, timestamp: Date.now() });
        }

        return data;
      } catch (error) {
        if (attempts >= maxAttempts) {
          // Only log relevant API errors, suppress noisy background sync 401/404 pings
          if (!endpoint.startsWith('/system/') && endpoint !== '/companies' && endpoint !== '/candidates') {
            console.warn(`API [${endpoint}]:`, error.message);
          }
          throw error;
        }
        await new Promise(r => setTimeout(r, 600 * attempts));
      } finally {
        if (method === 'GET' && useCache) {
          inFlightRequests.delete(endpoint);
        }
      }
    }
  })();

  if (method === 'GET' && useCache) {
    inFlightRequests.set(endpoint, fetchPromise);
  }

  return await fetchPromise;
}

export const api = {
  // Authentication & Session Management
  login: async (credentials) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.access_token) {
      setAuthToken(data.access_token);
    }
    return data;
  },
  checkSession: () => request('/auth/session'),
  refreshSession: async () => {
    const data = await request('/auth/refresh', { method: 'POST' });
    if (data.access_token) {
      setAuthToken(data.access_token);
    }
    return data;
  },
  logoutSession: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setAuthToken('');
      requestCache.clear();
    }
  },

  // Super Admin - Companies & Platform Governance
  getCompanies: () => request('/superadmin/companies', {}, true),
  createCompany: (companyData) => {
    requestCache.clear();
    return request('/superadmin/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },
  updateCompanyFeatures: (companyId, features) => {
    requestCache.clear();
    return request(`/superadmin/companies/${companyId}/features`, {
      method: 'PUT',
      body: JSON.stringify({ features }),
    });
  },
  getApiConfigs: () => request('/superadmin/api-configs', {}, true),
  createApiConfig: (configData) => {
    requestCache.clear();
    return request('/superadmin/api-configs', {
      method: 'POST',
      body: JSON.stringify(configData),
    });
  },
  updateApiConfig: (providerKey, configData) => {
    requestCache.clear();
    return request(`/superadmin/api-configs/${providerKey}`, {
      method: 'PUT',
      body: JSON.stringify(configData),
    });
  },
  toggleApiConfig: (providerKey, isActive) => {
    requestCache.clear();
    return request(`/superadmin/api-configs/${providerKey}/toggle`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    });
  },
  setPrimaryApiConfig: (providerKey) => {
    requestCache.clear();
    return request(`/superadmin/api-configs/${providerKey}/primary`, {
      method: 'PUT',
    });
  },
  deleteApiConfig: (providerKey) => {
    requestCache.clear();
    return request(`/superadmin/api-configs/${providerKey}`, {
      method: 'DELETE',
    });
  },
  getLogs: () => request('/superadmin/logs', {}, true),
  toggleLogSolved: (logId, solved, resolvedBy = 'Super Admin') => {
    requestCache.clear();
    return request(`/superadmin/logs/${logId}/toggle`, {
      method: 'PUT',
      body: JSON.stringify({ solved, resolved_by: resolvedBy }),
    });
  },
  getSuperAdminStats: () => request('/superadmin/stats', {}, true),
  
  // Super Admin - API Telemetry & Candidate Document Ledger
  getCompanyApiTelemetry: (timeRange = 'all') => request(`/superadmin/telemetry/company-stats?time_range=${timeRange}`, {}, false),
  getCandidateApiLedger: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/superadmin/telemetry/candidate-ledger${query ? `?${query}` : ''}`, {}, false);
  },
  getCandidateDetailedApiBreakdown: (candidateId) => request(`/superadmin/telemetry/candidate-ledger/${candidateId}`, {}, false),

  // Company Admin
  getCompanyDetails: (companyId) => request(`/company/${companyId}`, {}, true),
  getHrUsers: (companyId) => request(`/company/${companyId}/hr-users`, {}, true),
  addHrUser: (companyId, hrData) => {
    requestCache.clear();
    return request(`/company/${companyId}/hr-users`, {
      method: 'POST',
      body: JSON.stringify(hrData),
    });
  },
  getCompanyCandidates: (companyId) => request(`/company/${companyId}/candidates`, {}, true),
  getCompanyStats: (companyId) => request(`/company/${companyId}/dashboard-stats`, {}, true),

  // HR Executive
  getCandidates: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/hr/candidates${query ? `?${query}` : ''}`, {}, true);
  },
  createCandidate: (candidateData) => {
    requestCache.clear();
    return request('/hr/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    });
  },
  dispatchLink: (dispatchData) => request('/hr/dispatch-link', {
    method: 'POST',
    body: JSON.stringify(dispatchData),
  }),

  // Employee Link Portal & Verifications
  getCandidateByToken: (token) => request(`/verification/candidate/${token}`),
  setCandidatePassword: (token, password) => {
    requestCache.clear();
    return request(`/verification/candidate/${token}/set-password`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },
  unlockPortal: (token, password) => {
    return request('/verification/unlock', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
  sendOtp: (otpData) => request('/verification/otp/send', {
    method: 'POST',
    body: JSON.stringify(otpData),
  }),
  verifyOtp: (verifyData) => request('/verification/otp/verify', {
    method: 'POST',
    body: JSON.stringify(verifyData),
  }),
  submitFaceCapture: (faceData) => request('/verification/face-capture', {
    method: 'POST',
    body: JSON.stringify(faceData),
  }),
  completeVerification: (completionData) => {
    requestCache.clear();
    return request('/verification/complete', {
      method: 'POST',
      body: JSON.stringify(completionData),
    });
  },

  // 🏛️ Upstream Government & Institutional Verification APIs
  verifyAadhaarLive: (token, aadhaarNumber, otp) => request('/verification/verify-aadhaar', {
    method: 'POST',
    body: JSON.stringify({ token, aadhaar_number: aadhaarNumber, otp }),
  }),
  verifyPanLive: (token, panNumber) => request('/verification/verify-pan', {
    method: 'POST',
    body: JSON.stringify({ token, pan_number: panNumber }),
  }),
  verifyBankLive: (token, accountNumber, ifscCode) => request('/verification/verify-bank', {
    method: 'POST',
    body: JSON.stringify({ token, account_number: accountNumber, ifsc_code: ifscCode }),
  }),
  verifyDlLive: (token, dlNumber, dob = '1996-05-15') => request('/verification/verify-dl', {
    method: 'POST',
    body: JSON.stringify({ token, dl_number: dlNumber, dob }),
  }),
  verifyEpfoLive: (token, uanNumber) => request('/verification/verify-epfo', {
    method: 'POST',
    body: JSON.stringify({ token, uan_number: uanNumber }),
  }),
  verifyPassportLive: (token, passportNumber, dob = '1996-05-15') => request('/verification/verify-passport', {
    method: 'POST',
    body: JSON.stringify({ token, passport_number: passportNumber, dob }),
  }),
  getVerificationRecords: (token) => request(`/verification/candidate/${token}/records`),

  // Master Data & Custom Form Fields
  getMasterDropdowns: () => request('/master-data/dropdowns', {}, true),
  addMasterDropdownOption: (category, optionValue) => {
    requestCache.clear();
    return request('/master-data/dropdowns', {
      method: 'POST',
      body: JSON.stringify({ category, option_value: optionValue }),
    });
  },
  removeMasterDropdownOption: (category, optionValue) => {
    requestCache.clear();
    return request(`/master-data/dropdowns?category=${encodeURIComponent(category)}&option_value=${encodeURIComponent(optionValue)}`, {
      method: 'DELETE',
    });
  },
  getMasterFormFields: () => request('/master-data/form-fields', {}, true),
  addMasterFormField: (fieldData) => {
    requestCache.clear();
    return request('/master-data/form-fields', {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
  },

  // Support Tickets & Replies
  getTickets: (companyId) => request(`/tickets${companyId ? `?company_id=${companyId}` : ''}`, {}, true),
  createTicket: (ticketData) => {
    requestCache.clear();
    return request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },
  addTicketReply: (ticketId, replyData) => {
    requestCache.clear();
    return request(`/tickets/${ticketId}/replies`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  },
  updateTicketStatus: (ticketId, status) => {
    requestCache.clear();
    return request(`/tickets/${ticketId}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
    });
  },

  // Billing & Invoices
  getInvoices: (companyId) => request(`/billing/invoices${companyId ? `?company_id=${companyId}` : ''}`, {}, true),
  generateInvoice: (companyId, month = 'August', year = 2026) => {
    requestCache.clear();
    return request(`/billing/invoices/generate/${companyId}?month=${encodeURIComponent(month)}&year=${year}`, {
      method: 'POST',
    });
  },
  updateInvoice: (invoiceId, updateData) => {
    requestCache.clear();
    return request(`/billing/invoices/${invoiceId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  getPayments: (companyId) => request(`/billing/payments${companyId ? `?company_id=${companyId}` : ''}`, {}, true),
  recordPayment: (paymentData) => {
    requestCache.clear();
    return request('/billing/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // 📧 cPanel SMTP Email Gateway & Automated Notifications
  getEmailConfig: () => request('/settings/email-config'),
  saveEmailConfig: (smtpSettings) => {
    requestCache.clear();
    return request('/settings/gateways', {
      method: 'POST',
      body: JSON.stringify({ gateway_type: 'email_smtp', settings: smtpSettings }),
    });
  },
  sendTestEmail: (toEmail, smtpConfig = null) => {
    return request('/settings/test-email', {
      method: 'POST',
      body: JSON.stringify({ to_email: toEmail, smtp_config: smtpConfig }),
    });
  },
  dispatchCandidateEmail: (candidateId) => {
    return request('/hr/dispatch-link', {
      method: 'POST',
      body: JSON.stringify({ channel: 'email', candidate_id: candidateId }),
    });
  },

  // Role Settings & Guidelines
  getRoleSettings: (role) => request(`/settings/role/${role}`, {}, true),
  updateRoleSettings: (role, settings) => {
    requestCache.clear();
    return request('/settings/role', {
      method: 'PUT',
      body: JSON.stringify({ role, settings }),
    });
  },
  getGuidelines: (role) => request(`/settings/guidelines/${role}`, {}, true),
  getGateways: () => request('/settings/gateways', {}, true),
  saveGateway: (gatewayData) => {
    requestCache.clear();
    return request('/settings/gateways', {
      method: 'POST',
      body: JSON.stringify(gatewayData),
    });
  },

  // Dedicated Document Exporters & Robust Blob Downloader
  downloadDocument: async (endpointOrUrl, defaultFilename = 'document.pdf') => {
    const token = getAuthToken();
    const url = endpointOrUrl.startsWith('http') || endpointOrUrl.startsWith('/api') 
      ? endpointOrUrl 
      : `${API_BASE_URL}${endpointOrUrl.startsWith('/') ? '' : '/'}${endpointOrUrl}`;
      
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Download failed (status ${res.status}): ${errText || res.statusText}`);
    }
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    return true;
  },
  exportCertificatePdfUrl: (identifier) => `${API_BASE_URL}/documents/certificate/${identifier}`,
  exportLaborProfileDossierUrl: (identifier) => `${API_BASE_URL}/documents/profile-dossier/${identifier}`,
  exportBgvDossierPdfUrl: (identifier) => `${API_BASE_URL}/documents/bgv-dossier/${identifier}`,
  exportInvoicePdfUrl: (invoiceId) => `${API_BASE_URL}/documents/invoice/${invoiceId}`,
  exportPdfUrl: (companyId, candidateId) => {
    const params = new URLSearchParams();
    if (companyId) params.append('company_id', companyId);
    if (candidateId) params.append('candidate_id', candidateId);
    return `${API_BASE_URL}/documents/export/pdf?${params.toString()}`;
  },
  exportExcelUrl: (companyId) => {
    return `${API_BASE_URL}/documents/export/excel${companyId ? `?company_id=${companyId}` : ''}`;
  },
  exportWordUrl: (companyId) => {
    return `${API_BASE_URL}/documents/export/word${companyId ? `?company_id=${companyId}` : ''}`;
  },

  // System & Security Telemetry
  getSecurityMetrics: () => request('/system/security-metrics', {}, true),
};
