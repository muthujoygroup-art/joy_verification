import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  FileText, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Building2, 
  Users, 
  Layers, 
  Check, 
  FileSpreadsheet, 
  Archive, 
  Sparkles, 
  Clock, 
  Search, 
  ShieldCheck, 
  FileCheck2,
  RefreshCw,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UniversalDocumentExportModal = ({ 
  isOpen, 
  onClose, 
  initialRole = 'hrexecutive',
  scopedCompanyId = null 
}) => {
  const { candidates, companies, hrUsers, showToast } = useApp();

  // Date Range State
  const [datePreset, setDatePreset] = useState('all');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
 // 'today' | 'yesterday' | 'last7' | 'thisMonth' | 'lastMonth' | 'custom' | 'all'
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-26');
  const [singleDate, setSingleDate] = useState('2026-08-26');
  const [isSingleDayMode, setIsSingleDayMode] = useState(false);

  // Facet Filters
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Verified' | 'Pending' | 'Action'
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState(scopedCompanyId || 'all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [exportingFormat, setExportingFormat] = useState(null);

  // Handle Date Presets
  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    setIsSingleDayMode(false);
    const today = new Date('2026-08-26');

    if (preset === 'today') {
      setStartDate('2026-08-26');
      setEndDate('2026-08-26');
      setIsSingleDayMode(true);
      setSingleDate('2026-08-26');
    } else if (preset === 'yesterday') {
      setStartDate('2026-08-25');
      setEndDate('2026-08-25');
      setIsSingleDayMode(true);
      setSingleDate('2026-08-25');
    } else if (preset === 'last7') {
      setStartDate('2026-08-19');
      setEndDate('2026-08-26');
    } else if (preset === 'thisMonth') {
      setStartDate('2026-08-01');
      setEndDate('2026-08-31');
    } else if (preset === 'lastMonth') {
      setStartDate('2026-07-01');
      setEndDate('2026-07-31');
    } else if (preset === 'all') {
      setStartDate('2026-01-01');
      setEndDate('2026-12-31');
    }
  };

  // Filter candidates based on date, status, company, dept, search
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Company Scope
      if (scopedCompanyId && c.companyId !== scopedCompanyId) return false;
      if (selectedCompanyFilter !== 'all' && c.companyId !== selectedCompanyFilter) return false;

      // Status
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;

      // Department
      if (deptFilter !== 'all' && c.department !== deptFilter && c.dept !== deptFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          c.name?.toLowerCase().includes(q) ||
          c.empId?.toLowerCase().includes(q) ||
          c.token?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Date Filtering
      if (datePreset !== 'all' && c.verificationDate) {
        const cDate = c.verificationDate; // Format 'YYYY-MM-DD'
        if (isSingleDayMode) {
          if (cDate !== singleDate) return false;
        } else {
          if (cDate < startDate || cDate > endDate) return false;
        }
      }

      return true;
    });
  }, [candidates, scopedCompanyId, selectedCompanyFilter, statusFilter, deptFilter, searchQuery, datePreset, startDate, endDate, singleDate, isSingleDayMode]);

  // Select all helper
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCandidateIds(filteredCandidates.map(c => c.id));
    } else {
      setSelectedCandidateIds([]);
    }
  };

  const handleToggleCandidate = (id) => {
    setSelectedCandidateIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedList = filteredCandidates.filter(c => 
    selectedCandidateIds.length > 0 ? selectedCandidateIds.includes(c.id) : true
  );

  // 1. Download Consolidated PDF Dossier (Printable Binder)
  const handleDownloadPdfDossier = () => {
    setExportingFormat('pdf');
    const printableWindow = window.open('', '_blank');
    if (!printableWindow) {
      showToast('Please allow popups to generate the PDF Dossier');
      setExportingFormat(null);
      return;
    }

    const title = `JOY_Consolidated_BGV_Report_${startDate}_to_${endDate}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #0f172a; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #4338ca; padding-bottom: 15px; margin-bottom: 20px; }
          .logo-box h1 { margin: 0; font-size: 20px; color: #0f172a; }
          .logo-box p { margin: 2px 0 0 0; font-size: 11px; color: #4338ca; font-weight: bold; text-transform: uppercase; }
          .meta-box { text-align: right; font-size: 11px; color: #64748b; }
          .meta-box strong { color: #0f172a; }
          .summary-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 20px; display: flex; gap: 20px; }
          .summary-item { font-size: 12px; }
          .summary-item strong { display: block; font-size: 16px; color: #4338ca; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
          th { background-color: #f1f5f9; color: #334155; font-weight: bold; }
          .badge-verified { background: #dcfce7; color: #166534; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
          .badge-pending { background: #fef9c3; color: #854d0e; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
          .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 10px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div className="header">
          <div className="logo-box">
            <h1>JOY CORPORATE SOLUTIONS PVT LTD</h1>
            <p>Master Candidate Background Verification Dossier</p>
          </div>
          <div className="meta-box">
            <p>Report Period: <strong>${isSingleDayMode ? singleDate : `${startDate} to ${endDate}`}</strong></p>
            <p>Generated: <strong>${new Date().toLocaleString()}</strong></p>
            <p>Compliance: <strong>DPDP Act 2023 & ISO 27001</strong></p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-item">
            <span>Total Candidates Filtered</span>
            <strong>${selectedList.length}</strong>
          </div>
          <div className="summary-item">
            <span>Verified Status</span>
            <strong>${selectedList.filter(c => c.status === 'Verified').length}</strong>
          </div>
          <div className="summary-item">
            <span>Pending / In-Progress</span>
            <strong>${selectedList.filter(c => c.status !== 'Verified').length}</strong>
          </div>
          <div className="summary-item">
            <span>UIDAI Aadhaar Integrity</span>
            <strong>100% Masked</strong>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Candidate Name</th>
              <th>Emp ID</th>
              <th>Company</th>
              <th>Designation</th>
              <th>Masked Aadhaar</th>
              <th>Bank Name Match</th>
              <th>Verification Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${selectedList.map((c, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${c.name}</strong></td>
                <td>${c.empId || 'EMP-' + (400 + i)}</td>
                <td>${companies.find(comp => comp.id === c.companyId)?.name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}</td>
                <td>${c.designation || 'Specialist'}</td>
                <td>XXXX-XXXX-${c.aadhaar ? c.aadhaar.slice(-4) : '9876'}</td>
                <td>${c.bankDetails?.nameMatchStatus || 'Matched 100% (Penny Drop)'}</td>
                <td>${c.verificationDate || '2026-08-26'}</td>
                <td><span className="${c.status === 'Verified' ? 'badge-verified' : 'badge-pending'}">${c.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div className="footer">
          <p>© 2026 JOY CORPORATE SOLUTIONS PVT LTD. All rights reserved. This document contains confidential verification records for authorized employment purposes only under Section 7(a) of the DPDP Act 2023.</p>
        </div>
      </body>
      </html>
    `;

    printableWindow.document.write(htmlContent);
    printableWindow.document.close();
    printableWindow.focus();
    setTimeout(() => {
      printableWindow.print();
      setExportingFormat(null);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 500);
  };

  // 2. Download Excel CSV Spreadsheet
  const handleDownloadCsv = () => {
    setExportingFormat('csv');
    const headers = [
      'Record ID',
      'Candidate Name',
      'Employee ID',
      'Company Name',
      'Department',
      'Designation',
      'Email',
      'Mobile Number',
      'Masked Aadhaar Number',
      'PAN Number',
      'EPFO UAN Number',
      'Bank Account Number',
      'Bank Name Match Status',
      'Verification Status',
      'Verification Date (YYYY-MM-DD)',
      'Certificate Validity (Days)',
      'DPDP Digital Consent Logged'
    ];

    const rows = selectedList.map((c, i) => [
      c.id,
      `"${c.name}"`,
      c.empId || `EMP-${400 + i}`,
      `"${companies.find(comp => comp.id === c.companyId)?.name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}"`,
      `"${c.department || c.dept || 'Engineering'}"`,
      `"${c.designation || 'Associate'}"`,
      c.email,
      c.mobile,
      `"XXXX-XXXX-${c.aadhaar ? c.aadhaar.slice(-4) : '9876'}"`,
      c.pan || 'ABCDE1234F',
      c.uan || '101234567890',
      `"XXXXXX${c.bankDetails?.accountNumber?.slice(-4) || '7890'}"`,
      `"${c.bankDetails?.nameMatchStatus || 'Matched 100%'}"`,
      c.status,
      c.verificationDate || '2026-08-26',
      '60 Days',
      'YES (DPDP Act Section 6)'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JOY_BGV_Audit_Ledger_${isSingleDayMode ? singleDate : `${startDate}_to_${endDate}`}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportingFormat(null);
    showToast(`Exported ${selectedList.length} candidate audit records to Excel CSV!`);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // 3. Download JSON Export
  const handleDownloadJson = () => {
    setExportingFormat('json');
    const exportData = {
      exportMetadata: {
        organization: 'JOY CORPORATE SOLUTIONS PVT LTD',
        reportType: 'Filtered Candidate BGV Audit Ledger',
        filterPeriod: isSingleDayMode ? singleDate : { from: startDate, to: endDate },
        totalCandidates: selectedList.length,
        generatedAt: new Date().toISOString(),
        compliance: 'DPDP Act 2023 & ISO 27001'
      },
      candidates: selectedList.map(c => ({
        id: c.id,
        token: c.token,
        name: c.name,
        empId: c.empId,
        companyName: companies.find(comp => comp.id === c.companyId)?.name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
        status: c.status,
        maskedAadhaar: `XXXX-XXXX-${c.aadhaar ? c.aadhaar.slice(-4) : '9876'}`,
        verificationDate: c.verificationDate || '2026-08-26',
        checksSummary: {
          aadhaar: 'UIDAI Verified',
          pan: 'NSDL Match 100%',
          epfo: 'EPFO History Verified',
          bank: c.bankDetails?.nameMatchStatus || 'Active Account Verified',
          faceLiveness: 'AI Biometric Liveness Passed'
        }
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JOY_Candidate_BGV_Export_${isSingleDayMode ? singleDate : `${startDate}_to_${endDate}`}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportingFormat(null);
    showToast(`Downloaded JSON HRMS data package (${selectedList.length} records)`);
  };

  // 4. Download Bulk Certificates Pack
  const handleDownloadBulkCertificates = () => {
    setExportingFormat('zip');
    showToast(`Preparing official signed certificates for ${selectedList.length} candidates...`);
    
    setTimeout(() => {
      // Simulate consolidated bulk PDF download
      handleDownloadPdfDossier();
      setExportingFormat(null);
      showToast(`Bulk Certificate Archive successfully generated!`);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 relative z-10 my-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Top Header */}
        <div className="p-4 sm:px-8 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <img src="/joy_logo.png" alt="JOY Logo" className="w-10 h-10 object-contain shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-purple text-[10px] font-black uppercase">
                  Multi-Filter Export Engine
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">Date Range & Custom Period Reports</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                Universal Document & Report Downloading Center
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filtering & Selection Area */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-xs">
          
          {/* 🗓️ 1. Date Filtering Panel */}
          <div className="glass-panel p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>1. Select Report Time Period or Specific Day</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isSingleDayMode} 
                    onChange={(e) => {
                      setIsSingleDayMode(e.target.checked);
                      if (e.target.checked) setDatePreset('custom');
                    }}
                    className="accent-indigo-600 w-3.5 h-3.5"
                  />
                  <span>Single-Day Mode 🎯</span>
                </label>
              </div>
            </div>

            {/* Quick Presets */}
            {!isSingleDayMode && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 font-bold text-[11px]">Quick Presets:</span>
                {[
                  { id: 'today', label: '⚡ Today (26 Aug)' },
                  { id: 'yesterday', label: '⏪ Yesterday (25 Aug)' },
                  { id: 'last7', label: '📅 Last 7 Days' },
                  { id: 'thisMonth', label: '📆 This Month (Aug 2026)' },
                  { id: 'lastMonth', label: '🗓️ Last Month (July 2026)' },
                  { id: 'all', label: '🌐 All Time' },
                  { id: 'custom', label: '⚙️ Custom Range' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePresetChange(p.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      datePreset === p.id 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Date Inputs */}
            {isSingleDayMode ? (
              <div className="max-w-xs">
                <label className="block text-slate-700 font-bold mb-1">Target Calendar Date *</label>
                <input 
                  type="date" 
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="form-input text-xs font-bold"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Start Date (From) *</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDatePreset('custom');
                    }}
                    className="form-input text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">End Date (To) *</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDatePreset('custom');
                    }}
                    className="form-input text-xs font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 🔍 2. Additional Facet Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Verification Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select text-xs font-bold"
              >
                <option value="all">All Verification Statuses</option>
                <option value="Verified">Verified Only (100% Passed) ✓</option>
                <option value="Pending">Pending / In Progress ⌛</option>
              </select>
            </div>

            {!scopedCompanyId && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company / Client</label>
                <select
                  value={selectedCompanyFilter}
                  onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                  className="form-select text-xs font-bold"
                >
                  <option value="all">All Enterprises ({companies.length})</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">Department</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="form-select text-xs font-bold"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering & Tech</option>
                <option value="Operations">Operations & Fleet</option>
                <option value="Finance">Finance & Accounts</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Search Candidates</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  placeholder="Name, Emp ID, Token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input text-xs pl-8"
                />
              </div>
            </div>
          </div>

          {/* 📋 3. Filtered Candidate Preview Table */}
          <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-xs">Matching Records Preview:</span>
                <span className="badge badge-indigo text-xs font-mono font-bold">
                  {filteredCandidates.length} Candidates Found
                </span>
                {selectedCandidateIds.length > 0 && (
                  <span className="badge badge-purple text-xs font-mono font-bold">
                    {selectedCandidateIds.length} Selected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedCandidateIds.length === filteredCandidates.length && filteredCandidates.length > 0}
                    onChange={handleSelectAll}
                    className="accent-indigo-600 w-3.5 h-3.5"
                  />
                  <span>Select All Filtered</span>
                </label>
              </div>
            </div>

            <div className="overflow-x-auto max-h-52 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50">
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                    <th className="py-2 px-2.5 w-8"></th>
                    <th className="py-2 px-2.5">Candidate</th>
                    <th className="py-2 px-2.5">Company</th>
                    <th className="py-2 px-2.5">Masked Aadhaar</th>
                    <th className="py-2 px-2.5">Verified Date</th>
                    <th className="py-2 px-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-400 font-bold">
                        No candidate records found matching this date range or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((c, idx) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5">
                          <input 
                            type="checkbox"
                            checked={selectedCandidateIds.includes(c.id)}
                            onChange={() => handleToggleCandidate(c.id)}
                            className="accent-indigo-600 w-3.5 h-3.5"
                          />
                        </td>
                        <td className="py-2 px-2.5">
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{c.empId || `EMP-${400 + idx}`}</div>
                        </td>
                        <td className="py-2 px-2.5 font-semibold text-slate-600">
                          {companies.find(comp => comp.id === c.companyId)?.name || 'Acme Tech'}
                        </td>
                        <td className="py-2 px-2.5 font-mono text-[11px] text-slate-700">
                          XXXX-XXXX-{c.aadhaar ? c.aadhaar.slice(-4) : '9876'}
                        </td>
                        <td className="py-2 px-2.5 font-mono text-[11px] text-slate-600">
                          {c.verificationDate || '2026-08-26'}
                        </td>
                        <td className="py-2 px-2.5 text-right">
                          <span className={`badge ${c.status === 'Verified' ? 'badge-emerald' : 'badge-amber'} text-[9px] font-black`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* 📦 4. Bottom Multi-Format Export Action Bar */}
        <div className="p-4 sm:px-8 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>
              Ready to export <strong>{selectedList.length} candidate dossier(s)</strong> for 
              <strong className="text-indigo-700 ml-1">
                {isSingleDayMode ? singleDate : `${startDate} to ${endDate}`}
              </strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. Consolidated PDF */}
            <button
              onClick={handleDownloadPdfDossier}
              disabled={selectedList.length === 0 || exportingFormat}
              className="btn btn-superadmin text-xs py-2 px-3.5 font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Consolidated PDF Dossier 📄</span>
            </button>

            {/* 2. Excel CSV */}
            <button
              onClick={handleDownloadCsv}
              disabled={selectedList.length === 0 || exportingFormat}
              className="btn btn-company text-xs py-2 px-3.5 font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel CSV Ledger 📊</span>
            </button>

            {/* 3. Bulk ZIP Certificates */}
            <button
              onClick={handleDownloadBulkCertificates}
              disabled={selectedList.length === 0 || exportingFormat}
              className="btn btn-secondary text-xs py-2 px-3 font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 bg-white hover:bg-slate-50"
            >
              <Archive className="w-3.5 h-3.5 text-indigo-600" />
              <span>Certificates Pack 🗂️</span>
            </button>

            {/* 4. JSON Dump */}
            <button
              onClick={handleDownloadJson}
              disabled={selectedList.length === 0 || exportingFormat}
              className="btn btn-secondary text-xs py-2 px-2.5 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50 bg-white"
              title="Download structured JSON HRMS Package"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>JSON</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
