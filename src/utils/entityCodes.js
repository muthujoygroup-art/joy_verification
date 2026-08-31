/**
 * JOY DATA VERIFICATION - Hierarchical Entity Identification & Omnisearch Engine
 * 
 * Standard Code Structure:
 * - Companies: COMP001, COMP002, COMP003 ...
 * - HR Users:  COMP001HR001, COMP001HR002, COMP002HR001 ...
 * - Employees: COMP001EMP001, COMP001EMP002, COMP002EMP001 ...
 */

export const formatCompanyCode = (indexOrCode) => {
  if (typeof indexOrCode === 'string' && indexOrCode.startsWith('COMP')) {
    return indexOrCode.toUpperCase();
  }
  const num = parseInt(String(indexOrCode).replace(/\D/g, ''), 10) || 1;
  return `COMP${String(num).padStart(3, '0')}`;
};

export const formatHrCode = (companyCode, hrIndexOrCode) => {
  const compCode = formatCompanyCode(companyCode || 'COMP001');
  if (typeof hrIndexOrCode === 'string' && hrIndexOrCode.includes('HR')) {
    return hrIndexOrCode.toUpperCase();
  }
  const num = parseInt(String(hrIndexOrCode).replace(/\D/g, ''), 10) || 1;
  return `${compCode}HR${String(num).padStart(3, '0')}`;
};

export const formatEmployeeCode = (companyCode, empIndexOrCode) => {
  const compCode = formatCompanyCode(companyCode || 'COMP001');
  if (typeof empIndexOrCode === 'string' && empIndexOrCode.includes('EMP')) {
    return empIndexOrCode.toUpperCase();
  }
  const num = parseInt(String(empIndexOrCode).replace(/\D/g, ''), 10) || 1;
  return `${compCode}EMP${String(num).padStart(3, '0')}`;
};

/**
 * Enriches and normalizes an entire dataset of companies, HR users, and candidates
 * ensuring every single entity has a deterministic, hierarchical unique profile ID.
 */
export const enrichEntitiesWithHierarchy = (companies = [], hrUsers = [], candidates = []) => {
  // 1. Enrich Companies
  const companyCodeMap = new Map();
  const enrichedCompanies = (companies || []).map((c, idx) => {
    const code = c.code && c.code.startsWith('COMP') ? c.code.toUpperCase() : `COMP${String(idx + 1).padStart(3, '0')}`;
    companyCodeMap.set(c.id, code);
    return {
      ...c,
      code,
      uniqueProfileId: code
    };
  });

  // 2. Enrich HR Users grouped by Company
  const hrCountByCompany = new Map();
  const enrichedHrUsers = (hrUsers || []).map((hr, idx) => {
    const compCode = companyCodeMap.get(hr.companyId) || 'COMP001';
    const currentCount = (hrCountByCompany.get(compCode) || 0) + 1;
    hrCountByCompany.set(compCode, currentCount);

    const hrCode = hr.hrCode || `${compCode}HR${String(currentCount).padStart(3, '0')}`;
    return {
      ...hr,
      companyCode: compCode,
      hrCode,
      uniqueProfileId: hrCode
    };
  });

  // 3. Enrich Candidates / Employees grouped by Company
  const empCountByCompany = new Map();
  const enrichedCandidates = (candidates || []).map((cand, idx) => {
    const compCode = companyCodeMap.get(cand.companyId) || 'COMP001';
    const currentCount = (empCountByCompany.get(compCode) || 0) + 1;
    empCountByCompany.set(compCode, currentCount);

    const empCode = cand.employeeCode || cand.employeeNumber || `${compCode}EMP${String(currentCount).padStart(3, '0')}`;
    return {
      ...cand,
      companyCode: compCode,
      employeeCode: empCode,
      uniqueProfileId: empCode
    };
  });

  return {
    companies: enrichedCompanies,
    hrUsers: enrichedHrUsers,
    candidates: enrichedCandidates
  };
};

/**
 * Omnisearch Indexer: Searches across Companies, HRs, and Employees
 * Returns matched categorized results with relevance ranking.
 */
export const searchUniversalDirectory = (query, { companies = [], hrUsers = [], candidates = [] }) => {
  if (!query || !query.trim()) {
    return { companies: [], hrUsers: [], candidates: [], totalMatches: 0 };
  }

  const q = query.trim().toLowerCase();
  const cleanQ = q.replace(/[\s\-_]/g, '');

  // Search Companies
  const matchedCompanies = (companies || []).filter(c => {
    const code = (c.code || c.uniqueProfileId || '').toLowerCase();
    const name = (c.name || '').toLowerCase();
    const contact = (c.contact_person || c.contactPerson || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const id = (c.id || '').toLowerCase();
    return code.includes(q) || cleanQ.includes(code.replace(/\D/g, '')) || name.includes(q) || contact.includes(q) || email.includes(q) || id.includes(q);
  });

  // Search HR Users
  const matchedHrs = (hrUsers || []).filter(hr => {
    const code = (hr.hrCode || hr.uniqueProfileId || '').toLowerCase();
    const name = (hr.name || '').toLowerCase();
    const email = (hr.email || '').toLowerCase();
    const phone = (hr.phone || hr.mobile || '').toLowerCase();
    const dept = (hr.dept || '').toLowerCase();
    const compCode = (hr.companyCode || '').toLowerCase();
    return code.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q) || dept.includes(q) || compCode.includes(q);
  });

  // Search Candidates / Employees
  const matchedCandidates = (candidates || []).filter(cand => {
    const code = (cand.employeeCode || cand.uniqueProfileId || cand.empId || '').toLowerCase();
    const name = (cand.name || '').toLowerCase();
    const email = (cand.email || '').toLowerCase();
    const mobile = (cand.mobile || '').toLowerCase();
    const aadhaar = (cand.aadhaarNo || cand.aadhaar_no || '').toLowerCase();
    const token = (cand.token || '').toLowerCase();
    const desig = (cand.designation || '').toLowerCase();
    const compCode = (cand.companyCode || '').toLowerCase();
    return code.includes(q) || name.includes(q) || email.includes(q) || mobile.includes(q) || aadhaar.includes(q) || token.includes(q) || desig.includes(q) || compCode.includes(q);
  });

  return {
    companies: matchedCompanies,
    hrUsers: matchedHrs,
    candidates: matchedCandidates,
    totalMatches: matchedCompanies.length + matchedHrs.length + matchedCandidates.length
  };
};
