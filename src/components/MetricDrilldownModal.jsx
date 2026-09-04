import React, { useEffect, useState } from 'react';
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
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const MetricDrilldownModal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  metricValue, 
  metricType,
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


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
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] text-slate-900 my-auto animate-modal-spring">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Metric Inspector
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">• Live Telemetry</span>
              </div>
              
              <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
                <h2 className="text-base sm:text-xl font-black tracking-tight text-white">
                  {title}
                </h2>
                <span className="text-indigo-300 font-mono text-sm sm:text-base font-bold bg-indigo-900/60 px-2.5 py-0.5 rounded-lg border border-indigo-700/50 shadow-xs">
                  {metricValue}
                </span>
              </div>
              
              <p className="text-[11px] text-slate-300 font-medium line-clamp-1 sm:line-clamp-none">{subtitle}</p>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Export */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search by name, ID, contact, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="all">All Statuses ({data.length})</option>
              <option value="verified">Verified Only</option>
              <option value="pending">Pending Only</option>
            </select>

            <button
              onClick={handleExportCsv}
              disabled={filteredItems.length === 0}
              className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold shadow-2xs cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Records Container (Responsive Desktop Table + Mobile Cards) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
          
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No records found</h4>
              <p className="text-xs text-slate-400">Try adjusting your search query or status filter.</p>
            </div>
          ) : (
            <>
              {/* 📱 MOBILE VIEW: Compact Responsive Cards (< sm screens) */}
              <div className="sm:hidden space-y-2.5">
                {filteredItems.map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs">{item.name || item.title || 'Record'}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.empId || item.id || ''}</p>
                      </div>
                      <span className={`badge text-[9px] py-0.5 px-2 font-bold ${
                        item.status === 'Verified' ? 'badge-emerald' : 'badge-amber'
                      }`}>
                        {item.status || 'Active'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1.5 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Entity / Dept:</span>
                        <strong className="text-slate-700 truncate block">{item.companyName || item.dept || 'Engineering'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Contact / Ref:</span>
                        <strong className="font-mono text-slate-700 truncate block">{item.mobile || item.email || item.timestamp || 'N/A'}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 🖥️ DESKTOP VIEW: High-Density Table (>= sm screens) */}
              <div className="hidden sm:block border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="custom-horizontal-scroll">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white font-bold text-[10.5px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Record Detail</th>
                        <th className="p-3">Entity / Department</th>
                        <th className="p-3">Contact / Reference</th>
                        <th className="p-3 text-center">Status / Gate</th>
                        <th className="p-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredItems.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{item.name || item.title || 'Record'}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{item.empId || item.id || ''}</div>
                          </td>
                          <td className="p-3 text-slate-700 font-medium">
                            {item.companyName || item.dept || 'Engineering & Operations'}
                          </td>
                          <td className="p-3 font-mono text-slate-600">
                            {item.mobile || item.email || item.category || 'N/A'}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`badge text-[9px] py-0.5 px-2 font-bold ${
                              item.status === 'Verified' ? 'badge-emerald' : 'badge-amber'
                            }`}>
                              {item.status || 'Active'}
                            </span>
                          </td>
                          <td className="p-3 text-right text-[10.5px] text-slate-500 font-mono">
                            {item.verificationDate || item.timestamp || '2026-08-29'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            🔒 DPDP Act 2023 & ISO 27001 Certified Audit Trail
          </span>
          <span className="text-[11px] text-slate-500 font-bold sm:hidden">
            {filteredItems.length} records
          </span>

          <button
            onClick={onClose}
            className="btn btn-secondary py-1.5 px-4 text-xs font-bold shadow-2xs cursor-pointer ml-auto"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
