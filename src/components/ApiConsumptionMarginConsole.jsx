import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  RefreshCw, 
  Search, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Wallet,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Users,
  Smartphone,
  Landmark,
  Car,
  Briefcase,
  Scale,
  FileCheck,
  Vote,
  Truck,
  Activity
} from 'lucide-react';
import { api } from '../services/api';
import { checkNetworkBeforeAction } from '../utils/networkChecker';

const CATEGORY_ICONS = {
  'Mobile Number Checks': Smartphone,
  'PAN Card Checks': CreditCard,
  'Aadhaar UIDAI Checks': ShieldCheck,
  'Bank & UPI Penny Drop': Landmark,
  'Driving License (MoRTH)': Car,
  'EPFO UAN & Dual Employment': Briefcase,
  'Court & Criminal Records': Scale,
  'Passport Verification': FileCheck,
  'Voter ID (ECI)': Vote,
  'Vehicle RC & Challan': Truck,
  'Corporate MCA & GSTIN': Building2
};

export const ApiConsumptionMarginConsole = () => {
  const [activePerspective, setActivePerspective] = useState('overview'); 
  // 'overview' | 'category' | 'role' | 'company' | 'stream'
  const [timeframe, setTimeframe] = useState('all'); 
  // 'all' | 'today' | '7d' | '30d'

  const [statsData, setStatsData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Wallet Adjustment Modal State
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(1000);
  const [adjustType, setAdjustType] = useState('credit');
  const [adjustReason, setAdjustReason] = useState('Bank NEFT / RTGS payment verified');
  const [adjusting, setAdjusting] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, reportRes] = await Promise.allSettled([
        api.getApiAnalyticsStatistics(timeframe),
        api.getApiConsumptionReport()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStatsData(statsRes.value);
      }
      if (reportRes.status === 'fulfilled' && reportRes.value) {
        setReportData(reportRes.value);
      }
    } catch (err) {
      console.error('Failed to load API telemetry data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [timeframe]);

  const handleOpenAdjust = (company) => {
    setSelectedCompany(company);
    setAdjustAmount(1000);
    setAdjustType('credit');
    setAdjustReason('Bank NEFT / RTGS payment verified');
    setShowAdjustModal(true);
  };

  const handlePerformAdjustment = async (e) => {
    e.preventDefault();
    if (!selectedCompany || !adjustAmount) return;
    if (!checkNetworkBeforeAction('adjusting company wallet balance')) return;

    try {
      setAdjusting(true);
      await api.adjustCompanyCredits(
        selectedCompany.company_id,
        Number(adjustAmount),
        adjustType,
        adjustReason
      );

      setShowAdjustModal(false);
      alert(`Successfully ${adjustType === 'credit' ? 'credited' : 'debited'} ₹${adjustAmount} to ${selectedCompany.company_name}`);
      fetchAllData();
    } catch (err) {
      alert(err.message || 'Failed to adjust credits');
    } finally {
      setAdjusting(false);
    }
  };

  const summary = statsData?.summary || {
    total_calls: reportData?.summary?.total_verifications || 0,
    success_calls: reportData?.summary?.total_verifications || 0,
    failed_calls: 0,
    success_rate: 100.0,
    avg_latency_ms: 55,
    total_cost: reportData?.summary?.total_cost || 0,
    today_calls: 0,
    month_calls: 0
  };

  const categories = statsData?.by_category || [];
  const roles = statsData?.by_role || [];
  const topEndpoints = statsData?.top_endpoints || [];
  const recentStream = statsData?.recent_stream || [];

  const companiesList = (reportData && reportData.companies) ? reportData.companies : [];
  const filteredCompanies = companiesList.filter(c => 
    (c.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.company_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel p-6 border-indigo-200 bg-white rounded-3xl space-y-6 shadow-sm animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-emerald text-[10px] font-black uppercase">REAL-TIME METERED TELEMETRY & AUDIT</span>
            <span className="text-xs text-slate-500 font-bold">• 11 Document Categories</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>API Usage & Telemetry Statistics (All Perspectives)</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Universal audit of all platform API calls across document categories, initiator roles, client companies, and live upstream gateways.
          </p>
        </div>

        {/* Timeframe Filter & Refresh Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: '⚡ Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: 'This Month' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeframe(t.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeframe === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAllData}
            disabled={loading}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 5-Perspective Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { id: 'overview', label: '🌐 Platform Overview & KPIs', icon: Activity },
          { id: 'category', label: '📑 By Document Category (11 Modules)', icon: Layers },
          { id: 'role', label: '👥 By Initiator & Role', icon: Users },
          { id: 'company', label: '🏢 By Client Company Ledger', icon: Building2 },
          { id: 'stream', label: '⚡ Live API Call Stream', icon: Zap }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePerspective(tab.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PERSPECTIVE 1: UNIVERSAL OVERVIEW & KPIS */}
      {/* ========================================================================= */}
      {activePerspective === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Platform API Calls</span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {summary.total_calls.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">
                Today: <strong className="text-indigo-600 font-mono">{summary.today_calls}</strong> • Month: <strong className="font-mono">{summary.month_calls}</strong>
              </span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Gateway Success Rate</span>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                {summary.success_rate}%
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                {summary.success_calls} Passed • {summary.failed_calls} Failed
              </span>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Avg Gateway Latency</span>
              <div className="text-2xl font-black text-purple-700 font-mono flex items-center gap-1">
                <span>{summary.avg_latency_ms}</span>
                <span className="text-xs font-normal">ms</span>
              </div>
              <span className="text-[10px] text-purple-600 font-medium">Neev & Gov Endpoints</span>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Estimated Upstream Cost</span>
              <div className="text-2xl font-black text-rose-700 font-mono">
                ₹{summary.total_cost.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-rose-600 font-medium">₹4.00 metered base rate</span>
            </div>
          </div>

          {/* Top 10 Most Consumed Endpoints */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Top Consumed API Endpoints</span>
            </h4>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-bold">
                    <th className="p-3">Endpoint Path</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Calls Count</th>
                    <th className="p-3 text-right">Success Rate</th>
                    <th className="p-3 text-right">Avg Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {topEndpoints.length > 0 ? (
                    topEndpoints.map((ep, idx) => (
                      <tr key={idx} className="hover:bg-white transition-colors">
                        <td className="p-3 font-mono font-bold text-indigo-600">{ep.endpoint_slug}</td>
                        <td className="p-3 text-slate-600">{ep.category}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">{ep.total_calls}</td>
                        <td className="p-3 text-right font-mono text-emerald-600 font-bold">{ep.success_rate}%</td>
                        <td className="p-3 text-right font-mono text-slate-600">{ep.avg_latency_ms} ms</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        No endpoint telemetry recorded yet. Run live verifications from the sandbox above to populate data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE 2: BY 11 DOCUMENT CATEGORIES */}
      {/* ========================================================================= */}
      {activePerspective === 'category' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => {
              const Icon = CATEGORY_ICONS[cat.category] || Layers;
              return (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-black text-xs text-slate-900">{cat.category}</span>
                    </div>
                    <span className="badge badge-indigo text-[10px] font-mono font-bold">{cat.total_calls} calls</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Success Rate:</span>
                      <strong className="text-emerald-600 font-mono">{cat.success_rate}%</strong>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(5, cat.percentage || 10))}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block">Avg Latency</span>
                      <strong className="font-mono text-slate-700">{cat.avg_latency_ms} ms</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Cost Incurred</span>
                      <strong className="font-mono text-slate-700">₹{cat.cost}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE 3: BY INITIATOR & ROLE */}
      {/* ========================================================================= */}
      {activePerspective === 'role' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r, idx) => (
              <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-indigo-600 font-black tracking-wider block">ROLE: {r.role}</span>
                    <h4 className="text-sm font-black text-slate-900">{r.label}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 font-mono block">{r.total_calls}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{r.percentage}% of total</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(5, r.percentage || 10))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-slate-600">
                  <span>Passed: <strong className="text-emerald-600 font-mono">{r.success_calls}</strong></span>
                  <span>Estimated Cost: <strong className="font-mono">₹{r.cost}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE 4: BY CLIENT COMPANY */}
      {/* ========================================================================= */}
      {activePerspective === 'company' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search company by name or code..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Companies Table */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-bold">
                  <th className="p-3">Company Legal Name</th>
                  <th className="p-3 text-right">Verifications</th>
                  <th className="p-3 text-right">Wallet Balance</th>
                  <th className="p-3 text-right">Billed (₹)</th>
                  <th className="p-3 text-right">API Cost (₹)</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCompanies.map((c) => (
                  <tr key={c.company_id} className="hover:bg-white transition-colors">
                    <td className="p-3">
                      <strong className="text-slate-900 block">{c.company_name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{c.company_code} • {c.plan}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">{c.total_verifications}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600">₹{c.wallet_balance?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono text-slate-700">₹{c.billed_revenue?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono text-rose-600">₹{c.estimated_api_cost?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenAdjust(c)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                      >
                        Adjust Credits
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE 5: REAL-TIME LIVE API STREAM */}
      {/* ========================================================================= */}
      {activePerspective === 'stream' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-bold">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Endpoint & Category</th>
                  <th className="p-3">Initiator / Role</th>
                  <th className="p-3">Target ID</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentStream.length > 0 ? (
                  recentStream.map((log) => (
                    <tr key={log.id} className="hover:bg-white transition-colors">
                      <td className="p-3 text-[11px] text-slate-500 font-mono whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-indigo-600 block truncate">{log.endpoint_slug}</span>
                        <span className="text-[10px] text-slate-400">{log.category}</span>
                      </td>
                      <td className="p-3">
                        <span className="badge badge-indigo text-[10px] font-mono">{log.initiator_role}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{log.initiator_id}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-700">{log.input_identifier || 'N/A'}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {log.status} ({log.http_status})
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-600">{log.latency_ms} ms</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No live API calls recorded in this session yet. Run test verifications above to view live audit stream.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Company Credits Modal */}
      {showAdjustModal && selectedCompany && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-600" />
                <span>Adjust Client Credits</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handlePerformAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-500 font-bold block mb-1">Company</label>
                <div className="p-2.5 bg-slate-50 rounded-xl font-bold text-slate-800">
                  {selectedCompany.company_name} ({selectedCompany.company_code})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-bold block mb-1">Action Type</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="credit">➕ Credit (Top-up)</option>
                    <option value="debit">➖ Debit (Deduct)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 font-bold block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    min="1"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-bold block mb-1">Audit Reason</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Reason for adjustment..."
                />
              </div>

              <button
                type="submit"
                disabled={adjusting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                {adjusting ? 'Updating Database...' : 'Confirm Balance Adjustment'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApiConsumptionMarginConsole;
