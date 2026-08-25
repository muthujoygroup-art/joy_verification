import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Building2, 
  Users, 
  Smartphone, 
  Send, 
  ShieldCheck, 
  FileText, 
  Award, 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign, 
  Server,
  Layers,
  Filter,
  ExternalLink
} from 'lucide-react';

export const MetricDrilldownModal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  metricValue, 
  metricType, // 'total_verifications' | 'gross_revenue' | 'upstream_cost' | 'net_profit' | 'company_hr' | 'company_verified' | 'company_pending' | 'company_quota' | 'hr_active' | 'hr_dispatched' | 'hr_verified' | 'hr_pending'
  role = 'superadmin', 
  data = [], 
  companies = [], 
  candidates = [], 
  hrUsers = [],
  onViewCandidateDossier,
  onViewCandidateCertificate,
  onDispatchLink
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!isOpen) return null;

  // Filter items based on search query and status
  const filteredItems = (data || []).filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      (item.name && item.name.toLowerCase().includes(searchLower)) ||
      (item.empId && item.empId.toLowerCase().includes(searchLower)) ||
      (item.email && item.email.toLowerCase().includes(searchLower)) ||
      (item.mobile && item.mobile.toLowerCase().includes(searchLower)) ||
      (item.companyName && item.companyName.toLowerCase().includes(searchLower)) ||
      (item.title && item.title.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    if (statusFilter === 'verified') return item.status === 'Verified';
    if (statusFilter === 'pending') return item.status !== 'Verified';
    return true;
  });

  const handleExportCsv = () => {
    if (!filteredItems.length) return;
    const headers = Object.keys(filteredItems[0] || {}).join(',');
    const rows = filteredItems.map(item => 
      Object.values(item).map(v => typeof v === 'object' ? JSON.stringify(v) : `"${String(v).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${metricType || 'metric_breakdown'}_drilldown_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-900">
        
        {/* Modal Top Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Detailed Metric Breakdown Inspector
              </span>
              <span className="text-xs text-slate-400 font-medium">• Live Telemetry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{title}</span>
              <span className="text-indigo-300 font-mono text-lg font-bold bg-indigo-900/50 px-2.5 py-0.5 rounded-lg border border-indigo-700/50">
                {metricValue}
              </span>
            </h2>
            <p className="text-xs text-slate-300 font-medium max-w-xl">{subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all self-start sm:self-center cursor-pointer"
            title="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, ID, contact, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 shadow-2xs"
              />
            </div>

            {['total_verifications', 'company_verified', 'hr_verified', 'hr_pending'].includes(metricType) && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer shadow-2xs"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Only</option>
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-xs font-medium">
              Showing {filteredItems.length} records
            </span>

            <button
              onClick={handleExportCsv}
              className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold cursor-pointer bg-white hover:bg-slate-100 shadow-2xs"
              title="Download filtered records as CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Content Body / Record Table */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600 text-sm">No records found matching your search</p>
              <p className="text-xs text-slate-400">Try adjusting your search query or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] bg-slate-50/80">
                    <th className="py-3 px-4 rounded-l-xl">Record Detail</th>
                    <th className="py-3 px-4">Entity / Department</th>
                    <th className="py-3 px-4 text-center">Status / Metrics</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredItems.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">{item.name || item.title || item.company || `Item #${idx + 1}`}</div>
                        <div className="text-slate-500 text-[10px] font-mono">
                          {item.empId ? `ID: ${item.empId} • ` : ''}
                          {item.mobile || item.email || item.subtext || ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 text-xs">{item.companyName || item.dept || item.category || 'Standard'}</div>
                        <div className="text-slate-400 text-[10px] font-mono">{item.date || item.verificationDate || item.plan || ''}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.status ? (
                          <span className={`badge text-[9px] py-0.5 px-2 font-bold ${
                            item.status === 'Verified' ? 'badge-emerald' : item.status === 'In Verification' ? 'badge-cyan' : 'badge-amber'
                          }`}>
                            {item.status}
                          </span>
                        ) : item.amount ? (
                          <span className="font-mono font-bold text-slate-900 text-xs">{item.amount}</span>
                        ) : (
                          <span className="badge badge-purple text-[9px] font-bold">{item.badge || 'Active'}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onViewCandidateDossier && item.token && (
                            <button
                              onClick={() => {
                                onViewCandidateDossier(item);
                                onClose();
                              }}
                              className="btn btn-secondary text-[10px] py-1 px-2 font-bold text-sky-800 bg-sky-50 border-sky-200 hover:bg-sky-100 cursor-pointer"
                              title="View Employee Profile PDF"
                            >
                              <FileText className="w-3 h-3 text-sky-700" />
                              <span>PDF Dossier</span>
                            </button>
                          )}

                          {onViewCandidateCertificate && item.token && item.status === 'Verified' && (
                            <button
                              onClick={() => {
                                onViewCandidateCertificate(item);
                                onClose();
                              }}
                              className="btn btn-secondary text-[10px] py-1 px-2 font-bold text-indigo-800 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer"
                              title="View JOY Certificate PDF"
                            >
                              <Award className="w-3 h-3 text-indigo-700" />
                              <span>Certificate</span>
                            </button>
                          )}

                          {onDispatchLink && item.token && item.status !== 'Verified' && (
                            <button
                              onClick={() => {
                                onDispatchLink(item);
                                onClose();
                              }}
                              className="btn btn-hrexecutive text-[10px] py-1 px-2 font-bold shadow-2xs cursor-pointer"
                              title="Dispatch Magic Link"
                            >
                              <Send className="w-3 h-3" />
                              <span>Dispatch</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">DPDP Act 2023 & ISO 27001 Certified Audit Trail</span>
          <button onClick={onClose} className="btn btn-secondary text-xs py-1.5 px-4 font-bold cursor-pointer">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
