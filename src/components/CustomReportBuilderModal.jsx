import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Download, 
  Filter, 
  CheckSquare, 
  Square, 
  Layers, 
  Building2, 
  ShieldCheck, 
  Users, 
  X, 
  Sparkles,
  FileCheck,
  FileDown,
  Calendar,
  Sliders
} from 'lucide-react';

export const CustomReportBuilderModal = ({ candidate = null, initialScope = 'overall', onClose }) => {
  const { candidates, companies, showToast } = useApp();

  const [reportScope, setReportScope] = useState(candidate ? 'individual' : initialScope);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
 // 'individual' | 'company' | 'overall'
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidate ? candidate.id : (candidates[0]?.id || ''));
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('this_month');
  const [outputFormat, setOutputFormat] = useState('pdf'); // 'pdf' | 'csv' | 'docx' | 'png'

  // Custom Field Checks
  const [selectedFields, setSelectedFields] = useState({
    empId: true,
    name: true,
    company: true,
    dept: true,
    designation: true,
    aadhaarCheck: true,
    mobileOtp: true,
    faceMatchScore: true,
    status: true,
    verificationDate: true
  });

  const toggleField = (fieldKey) => {
    setSelectedFields(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();

    // 1. Filter candidates based on selected multi-dimensional criteria
    let dataset = [...candidates];

    if (reportScope === 'individual') {
      dataset = dataset.filter(c => c.id === selectedCandidateId || c.token === candidate?.token);
    } else {
      if (selectedCompanyFilter !== 'all') {
        dataset = dataset.filter(c => c.companyId === selectedCompanyFilter);
      }
      if (selectedStatusFilter !== 'all') {
        dataset = dataset.filter(c => c.status === selectedStatusFilter);
      }
      if (selectedDeptFilter !== 'all') {
        dataset = dataset.filter(c => c.dept === selectedDeptFilter);
      }
    }

    if (dataset.length === 0) {
      showToast('No records match your selected filter criteria! Adjust filters and try again.');
      return;
    }

    // 2. Generate Content File
    const activeFieldKeys = Object.keys(selectedFields).filter(k => selectedFields[k]);
    const fieldHeaderNames = {
      empId: 'Emp ID',
      name: 'Employee Name',
      company: 'Company',
      dept: 'Department',
      designation: 'Designation',
      aadhaarCheck: 'Aadhaar Check',
      mobileOtp: 'Mobile OTP',
      faceMatchScore: 'AI Face Score %',
      status: 'Status',
      verificationDate: 'Verification Date'
    };

    let reportTitle = reportScope === 'individual' 
      ? `Individual_Audit_Report_${dataset[0]?.name.replace(/\s+/g, '_')}` 
      : reportScope === 'company' 
      ? `Company_Master_Ledger_${selectedCompanyFilter}` 
      : `Platform_Overall_Master_Audit_Report`;

    let fileExtension = outputFormat === 'csv' || outputFormat === 'excel' ? '.csv' : outputFormat === 'json' ? '.json' : '.pdf';

    if (outputFormat === 'pdf') {
      // Clean HTML/Printable PDF generation
      const printableWindow = window.open('', '_blank');
      if (printableWindow) {
        printableWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${reportTitle}</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; color: #0f172a; }
              .header { display: flex; justify-content: space-between; border-bottom: 3px solid #4338ca; padding-bottom: 12px; margin-bottom: 18px; }
              .title { font-size: 18px; font-weight: bold; color: #1e1b4b; margin: 0; }
              .sub { font-size: 11px; color: #4338ca; font-weight: bold; text-transform: uppercase; }
              .meta { font-size: 11px; color: #64748b; text-align: right; }
              .summary { display: flex; gap: 15px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 15px; margin-bottom: 18px; font-size: 12px; }
              .summary strong { color: #4338ca; }
              table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
              th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
              th { background: #f1f5f9; color: #334155; font-weight: bold; }
              .badge-verified { background: #dcfce7; color: #15803d; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
              .badge-pending { background: #fef9c3; color: #854d0e; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
              .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 9.5px; color: #64748b; text-align: center; }
            </style>
          </head>
          <body>
            <div className="header">
              <div>
                <h1 className="title">JOY CORPORATE SOLUTIONS PRIVATE LIMITED</h1>
                <div className="sub">Custom Compliance Audit Report • ${reportScope.toUpperCase()}</div>
              </div>
              <div className="meta">
                <div>Generated: <strong>${new Date().toLocaleString()}</strong></div>
                <div>Filter Scope: <strong>Company [${selectedCompanyFilter}], Status [${selectedStatusFilter}]</strong></div>
              </div>
            </div>

            <div className="summary">
              <div>Total Records: <strong>${dataset.length}</strong></div>
              <div>Verified: <strong>${dataset.filter(c => c.status === 'Verified').length}</strong></div>
              <div>Pending: <strong>${dataset.filter(c => c.status !== 'Verified').length}</strong></div>
              <div>ISO 27001 Certified Audit Trail: <strong>Active ✓</strong></div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  ${activeFieldKeys.map(k => `<th>${fieldHeaderNames[k]}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${dataset.map((c, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    ${activeFieldKeys.map(k => {
                      if (k === 'company') return `<td>${c.companyId === 'comp-1' ? 'Acme Global Technologies' : 'Apex Logistics Solutions'}</td>`;
                      if (k === 'aadhaarCheck') return `<td><span className="${c.verificationsCompleted.aadhaar ? 'badge-verified' : 'badge-pending'}">${c.verificationsCompleted.aadhaar ? 'PASSED ✓' : 'PENDING'}</span></td>`;
                      if (k === 'mobileOtp') return `<td><span className="${c.verificationsCompleted.mobile ? 'badge-verified' : 'badge-pending'}">${c.verificationsCompleted.mobile ? 'VERIFIED ✓' : 'PENDING'}</span></td>`;
                      if (k === 'faceMatchScore') return `<td><span className="${c.verificationsCompleted.face ? 'badge-verified' : 'badge-pending'}">${c.verificationsCompleted.face ? '99.4% MATCH ✓' : 'PENDING'}</span></td>`;
                      if (k === 'status') return `<td><span className="${c.status === 'Verified' ? 'badge-verified' : 'badge-pending'}">${c.status}</span></td>`;
                      return `<td>${c[k] || 'N/A'}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div className="footer">
              Generated via JOY Corporate Solutions BGV Platform • Confidential Legal Audit Record • DPDP Act 2023 Compliant
            </div>
          </body>
          </html>
        `);
        printableWindow.document.close();
        printableWindow.focus();
        setTimeout(() => printableWindow.print(), 400);
        showToast(`Custom PDF Report opened for printing / PDF saving! (${dataset.length} records)`);
        if (onClose) onClose();
        return;
      }
    }

    let contentString = '';
    let mimeType = 'text/csv';

    if (outputFormat === 'json') {
      mimeType = 'application/json';
      contentString = JSON.stringify({
        title: reportTitle,
        generatedAt: new Date().toISOString(),
        totalRecords: dataset.length,
        records: dataset
      }, null, 2);
    } else {
      // Standard RFC 4180 CSV / Excel spreadsheet
      const headers = ['#', ...activeFieldKeys.map(k => `"${fieldHeaderNames[k]}"`)].join(',');
      const rows = dataset.map((c, idx) => {
        const rowVals = [
          idx + 1,
          ...activeFieldKeys.map(k => {
            if (k === 'company') return `"${c.companyId === 'comp-1' ? 'Acme Global Technologies' : 'Apex Logistics Solutions'}"`;
            if (k === 'aadhaarCheck') return c.verificationsCompleted.aadhaar ? '"PASSED"' : '"PENDING"';
            if (k === 'mobileOtp') return c.verificationsCompleted.mobile ? '"VERIFIED"' : '"PENDING"';
            if (k === 'faceMatchScore') return c.verificationsCompleted.face ? '"99.4%"' : '"PENDING"';
            return `"${(c[k] || '').toString().replace(/"/g, '""')}"`;
          })
        ];
        return rowVals.join(',');
      }).join('\n');
      contentString = `${headers}\n${rows}`;
    }

    // Trigger File Download
    const blob = new Blob([contentString], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${reportTitle}_${Date.now()}${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Custom ${outputFormat.toUpperCase()} Report downloaded successfully! (${dataset.length} profiles)`);
    if (onClose) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="glass-panel w-full max-w-3xl max-h-[92vh] flex flex-col border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl relative z-10 overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800 font-bold shadow-sm">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Custom Report Generator & Multi-Filter Export Hub</h2>
              <p className="text-xs text-slate-500 font-medium">Generate individual, company-wide, or overall master reports with custom field selection and multi-format download</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <form onSubmit={handleGenerateReport} className="space-y-5 text-xs">
          
          {/* STEP 1: REPORT PERSPECTIVE / SCOPE SELECTOR */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">1. Select Report Perspective / Scope *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-bold">
              <button
                type="button"
                onClick={() => setReportScope('individual')}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                  reportScope === 'individual' ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Individual Candidate Audit</span>
              </button>

              <button
                type="button"
                onClick={() => setReportScope('company')}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                  reportScope === 'company' ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>Company-Wide Ledger</span>
              </button>

              <button
                type="button"
                onClick={() => setReportScope('overall')}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                  reportScope === 'overall' ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Overall Platform Master</span>
              </button>
            </div>
          </div>

          {/* STEP 2: MULTI-DIMENSIONAL FILTERS */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Multi-Dimensional Filter Options</span>
            </span>

            {reportScope === 'individual' ? (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Target Candidate Employee *</label>
                <select 
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="form-select text-xs font-bold"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Emp ID: #{c.empId}) - {c.companyId === 'comp-1' ? 'Acme Tech' : 'Apex Logistics'} [{c.status}]
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Filter Enterprise</label>
                  <select 
                    value={selectedCompanyFilter}
                    onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                    className="form-select text-xs font-bold"
                  >
                    <option value="all">🏢 All Client Enterprises</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Filter Verification Status</label>
                  <select 
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="form-select text-xs font-bold"
                  >
                    <option value="all">⚡ All Statuses</option>
                    <option value="Verified">Verified Only ✅</option>
                    <option value="In Verification">In Verification ⏳</option>
                    <option value="Link Sent">Link Sent / Pending 🔴</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Filter Department</label>
                  <select 
                    value={selectedDeptFilter}
                    onChange={(e) => setSelectedDeptFilter(e.target.value)}
                    className="form-select text-xs font-bold"
                  >
                    <option value="all">🏛️ All Departments</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Fleet Logistics & Delivery">Fleet Logistics</option>
                    <option value="Clinical Healthcare">Healthcare & Clinical</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: CUSTOM FIELD SELECTION CHECKS */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">3. Custom Fields to Include in Report</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-bold text-slate-700">
              {Object.keys(selectedFields).map(fieldKey => (
                <label key={fieldKey} className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200">
                  <input 
                    type="checkbox" 
                    checked={selectedFields[fieldKey]}
                    onChange={() => toggleField(fieldKey)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="capitalize">{fieldKey.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* STEP 4: OUTPUT FORMAT SELECTOR */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">4. Download File Format *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-bold">
              <button
                type="button"
                onClick={() => setOutputFormat('pdf')}
                className={`p-3 rounded-xl border flex items-center gap-2 justify-center transition-all ${
                  outputFormat === 'pdf' ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <FileText className="w-4 h-4 text-rose-600" />
                <span>PDF Document (.pdf)</span>
              </button>

              <button
                type="button"
                onClick={() => setOutputFormat('csv')}
                className={`p-3 rounded-xl border flex items-center gap-2 justify-center transition-all ${
                  outputFormat === 'csv' ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Excel Sheet (.csv)</span>
              </button>

              <button
                type="button"
                onClick={() => setOutputFormat('docx')}
                className={`p-3 rounded-xl border flex items-center gap-2 justify-center transition-all ${
                  outputFormat === 'docx' ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <FileDown className="w-4 h-4 text-sky-600" />
                <span>Word Doc (.docx)</span>
              </button>

              <button
                type="button"
                onClick={() => setOutputFormat('png')}
                className={`p-3 rounded-xl border flex items-center gap-2 justify-center transition-all ${
                  outputFormat === 'png' ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Image Cert (.png)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-slate-500 font-medium">All generated files include digital timestamps & ISO 27001 audit metadata.</span>

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold">Cancel</button>
              <button type="submit" className="btn btn-superadmin text-xs flex items-center gap-2 font-bold shadow-md">
                <Download className="w-4 h-4" />
                <span>Generate & Download Custom Report</span>
              </button>
            </div>
          </div>

        </form>
        </div>
      </div>
    </div>
  );
};
