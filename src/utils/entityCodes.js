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
  if (typeof hrIndexOrCode === 'string' && hrIndexOrCode.startsWith(compCode + 'HR')) {
    return hrIndexOrCode.toUpperCase();
  }
  const num = parseInt(String(hrIndexOrCode).replace(/\D/g, ''), 10) || 1;
  return `${compCode}HR${String(num).padStart(3, '0')}`;
};

export const formatEmployeeCode = (companyCode, empIndexOrCode) => {
  const compCode = formatCompanyCode(companyCode || 'COMP001');
  if (typeof empIndexOrCode === 'string' && empIndexOrCode.startsWith(compCode + 'EMP')) {
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
  // 1. Enrich & Deduplicate Companies
  const seenCompanyKeys = new Set();
  const companyCodeMap = new Map();
  const enrichedCompanies = [];
  
  (companies || []).forEach((c, idx) => {
    if (!c) return;
    const compKey = (c.id || c.code || c.email || '').toLowerCase().trim();
    if (compKey && seenCompanyKeys.has(compKey)) return;
    if (compKey) seenCompanyKeys.add(compKey);

    const code = c.code && c.code.startsWith('COMP') ? c.code.toUpperCase() : `COMP${String(enrichedCompanies.length + 1).padStart(3, '0')}`;
    companyCodeMap.set(c.id, code);
    if (c.code) companyCodeMap.set(c.code, code);

    enrichedCompanies.push({
      ...c,
      code,
      uniqueProfileId: code
    });
  });

  // 2. Enrich & Deduplicate HR Users grouped by Company
  const seenHrKeys = new Set();
  const hrCountByCompany = new Map();
  const enrichedHrUsers = [];

  (hrUsers || []).forEach(hr => {
    if (!hr) return;
    const hrKey = (hr.id || hr.email || hr.hrCode || '').toLowerCase().trim();
    if (hrKey && seenHrKeys.has(hrKey)) return;
    if (hrKey) seenHrKeys.add(hrKey);

    const compCode = companyCodeMap.get(hr.companyId) || companyCodeMap.get(hr.company_id) || 'COMP001';
    const currentCount = (hrCountByCompany.get(compCode) || 0) + 1;
    hrCountByCompany.set(compCode, currentCount);

    const rawHrCode = String(hr.hrCode || hr.hr_code || hr.id || '').toUpperCase().trim();
    let hrCode = '';
    if (rawHrCode.startsWith(compCode + 'HR')) {
      hrCode = rawHrCode;
    } else if (rawHrCode.startsWith('COMP') && rawHrCode.includes('HR')) {
      hrCode = rawHrCode;
    } else {
      hrCode = `${compCode}HR${String(currentCount).padStart(3, '0')}`;
    }

    enrichedHrUsers.push({
      ...hr,
      companyCode: compCode,
      hrCode,
      uniqueProfileId: hrCode
    });
  });

  // 3. Enrich & Deduplicate Candidates / Employees grouped by Company
  const seenCandidateKeys = new Set();
  const empCountByCompany = new Map();
  const enrichedCandidates = [];

  (candidates || []).forEach(cand => {
    if (!cand) return;
    const idKey = (cand.id || '').toLowerCase().trim();
    const tokenKey = (cand.token || '').toLowerCase().trim();
    const emailKey = (cand.email || '').toLowerCase().trim();
    const mobileDigits = (cand.mobile || '').replace(/\D/g, '');
    const mobileKey = mobileDigits.length === 10 && !['9876543210', '1234567890', '0000000000'].includes(mobileDigits) ? mobileDigits : '';
    const aadhaarDigits = (cand.aadhaarNo || cand.aadhaar_no || '').replace(/\D/g, '');
    const aadhaarKey = aadhaarDigits.length === 12 ? aadhaarDigits : '';

    // Check if duplicate across multiple dimensions
    const isDup = (idKey && seenCandidateKeys.has(`ID:${idKey}`)) ||
                  (tokenKey && seenCandidateKeys.has(`TOK:${tokenKey}`)) ||
                  (emailKey && emailKey.includes('@') && seenCandidateKeys.has(`EML:${emailKey}`)) ||
                  (mobileKey && seenCandidateKeys.has(`MOB:${mobileKey}`)) ||
                  (aadhaarKey && seenCandidateKeys.has(`ADH:${aadhaarKey}`));

    if (isDup) return;

    if (idKey) seenCandidateKeys.add(`ID:${idKey}`);
    if (tokenKey) seenCandidateKeys.add(`TOK:${tokenKey}`);
    if (emailKey && emailKey.includes('@')) seenCandidateKeys.add(`EML:${emailKey}`);
    if (mobileKey) seenCandidateKeys.add(`MOB:${mobileKey}`);
    if (aadhaarKey) seenCandidateKeys.add(`ADH:${aadhaarKey}`);

    const compCode = companyCodeMap.get(cand.companyId) || companyCodeMap.get(cand.company_id) || 'COMP001';
    const currentCount = (empCountByCompany.get(compCode) || 0) + 1;
    empCountByCompany.set(compCode, currentCount);

    const rawEmpCode = String(cand.employeeNumber || cand.employeeCode || cand.empId || '').toUpperCase().trim();
    let empCode = '';
    if (rawEmpCode.startsWith(compCode + 'EMP')) {
      empCode = rawEmpCode;
    } else if (rawEmpCode.startsWith('COMP') && rawEmpCode.includes('EMP')) {
      empCode = rawEmpCode;
    } else {
      empCode = `${compCode}EMP${String(currentCount).padStart(3, '0')}`;
    }

    enrichedCandidates.push({
      ...cand,
      companyCode: compCode,
      employeeCode: empCode,
      uniqueProfileId: empCode
    });
  });

  return {
    companies: enrichedCompanies,
    hrUsers: enrichedHrUsers,
    candidates: enrichedCandidates
  };
};

/**
 * Omnisearch Indexer: Searches across Companies, HRs, and Employees
 * Returns matched categorized results with relevance ranking and deduplication.
 */
export const searchUniversalDirectory = (query, { companies = [], hrUsers = [], candidates = [] }) => {
  if (!query || !query.trim()) {
    return { companies: [], hrUsers: [], candidates: [], totalMatches: 0 };
  }

  const q = query.trim().toLowerCase();
  const cleanQ = q.replace(/[\s\-_]/g, '');

  // Search Companies (deduplicated)
  const seenComps = new Set();
  const matchedCompanies = (companies || []).filter(c => {
    if (!c) return false;
    const cid = c.id || c.code || '';
    if (seenComps.has(cid)) return false;
    const code = (c.code || c.uniqueProfileId || '').toLowerCase();
    const name = (c.name || '').toLowerCase();
    const contact = (c.contact_person || c.contactPerson || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const id = (c.id || '').toLowerCase();
    const matched = code.includes(q) || cleanQ.includes(code.replace(/\D/g, '')) || name.includes(q) || contact.includes(q) || email.includes(q) || id.includes(q);
    if (matched) seenComps.add(cid);
    return matched;
  });

  // Search HR Users (deduplicated)
  const seenHrs = new Set();
  const matchedHrs = (hrUsers || []).filter(hr => {
    if (!hr) return false;
    const hId = hr.id || hr.email || hr.hrCode || '';
    if (seenHrs.has(hId)) return false;
    const code = (hr.hrCode || hr.uniqueProfileId || '').toLowerCase();
    const name = (hr.name || '').toLowerCase();
    const email = (hr.email || '').toLowerCase();
    const phone = (hr.phone || hr.mobile || '').toLowerCase();
    const dept = (hr.dept || '').toLowerCase();
    const compCode = (hr.companyCode || '').toLowerCase();
    const matched = code.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q) || dept.includes(q) || compCode.includes(q);
    if (matched) seenHrs.add(hId);
    return matched;
  });

  // Search Candidates / Employees (deduplicated)
  const seenCands = new Set();
  const matchedCandidates = (candidates || []).filter(cand => {
    if (!cand) return false;
    const candId = cand.token || cand.id || cand.email || '';
    if (seenCands.has(candId)) return false;
    const code = (cand.employeeCode || cand.uniqueProfileId || cand.empId || '').toLowerCase();
    const name = (cand.name || '').toLowerCase();
    const email = (cand.email || '').toLowerCase();
    const mobile = (cand.mobile || '').toLowerCase();
    const aadhaar = (cand.aadhaarNo || cand.aadhaar_no || '').toLowerCase();
    const token = (cand.token || '').toLowerCase();
    const desig = (cand.designation || '').toLowerCase();
    const compCode = (cand.companyCode || '').toLowerCase();
    const matched = code.includes(q) || name.includes(q) || email.includes(q) || mobile.includes(q) || aadhaar.includes(q) || token.includes(q) || desig.includes(q) || compCode.includes(q);
    if (matched) seenCands.add(candId);
    return matched;
  });

  return {
    companies: matchedCompanies,
    hrUsers: matchedHrs,
    candidates: matchedCandidates,
    totalMatches: matchedCompanies.length + matchedHrs.length + matchedCandidates.length
  };
};
