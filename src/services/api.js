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
    try {
      const res = await fetch(url, config);
      if (!res.ok) {
        if (res.status === 401 && endpoint !== '/auth/login') {
          // Token expired or invalid
          sessionStorage.removeItem('joy_auth_token');
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
      console.warn(`API Error [${endpoint}]:`, error.message);
      throw error;
    } finally {
      if (method === 'GET' && useCache) {
        inFlightRequests.delete(endpoint);
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
  updateApiConfig: (providerKey, configData) => {
    requestCache.clear();
    return request(`/superadmin/api-configs/${providerKey}`, {
      method: 'PUT',
      body: JSON.stringify(configData),
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

  // Dedicated Document Exporters
  exportCertificatePdfUrl: (identifier) => `${API_BASE_URL}/documents/certificate/${identifier}`,
  exportLaborProfileDossierUrl: (identifier) => `${API_BASE_URL}/documents/profile-dossier/${identifier}`,
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
};
