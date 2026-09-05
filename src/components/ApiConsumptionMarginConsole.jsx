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
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { checkNetworkBeforeAction } from '../utils/networkChecker';

export const ApiConsumptionMarginConsole = () => {
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

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.getApiConsumptionReport();
      if (res) {
        setReportData(res);
      }
    } catch (err) {
      console.error('Failed to load consumption report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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
      fetchReports();
    } catch (err) {
      alert(err.message || 'Failed to adjust credits');
    } finally {
      setAdjusting(false);
    }
  };

  const companiesList = (reportData && reportData.companies) ? reportData.companies : [];
  const filteredCompanies = companiesList.filter(c => 
    (c.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.company_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const summary = reportData?.summary || {
    total_verifications: 0,
    total_revenue: 0,
    total_cost: 0,
    gross_margin: 0,
    gross_margin_percentage: 0
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📊 Company-Wise API Consumption & Margin Analytics</span>
            <span className="badge badge-indigo text-xs font-mono">{companiesList.length} Companies</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Granular breakdown of verification checks (Aadhaar, PAN, EPFO, MoRTH, Court, IMPS, Face) and live margin performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            disabled={loading}
            className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Verifications</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {summary.total_verifications.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">Across all enterprise clients</span>
        </div>

        <div className="glass-panel p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Total Billed Revenue</span>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            ₹{summary.total_revenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Client wallet debits</span>
        </div>

        <div className="glass-panel p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Estimated API Cost</span>
          <div className="text-2xl font-black text-rose-700 font-mono">
            ₹{summary.total_cost.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-rose-600 font-medium">Upstream gateway fees</span>
        </div>

        <div className="glass-panel p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Platform Gross Margin</span>
          <div className="text-2xl font-black text-indigo-700 font-mono flex items-baseline gap-2">
            <span>₹{summary.gross_margin.toLocaleString('en-IN')}</span>
            <span className="text-xs font-bold text-emerald-700 font-mono">
              ({summary.gross_margin_percentage || 0}%)
            </span>
          </div>
          <span className="text-[10px] text-indigo-600 font-medium">Net platform profit</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter matrix by company name or company code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none text-xs text-slate-900 focus:outline-none font-medium"
        />
      </div>

      {/* Consumption Matrix Table */}
      <div className="glass-panel bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider">
                <th className="p-3.5">Company & Code</th>
                <th className="p-3.5 text-center">Total Checks</th>
                <th className="p-3.5 text-center">Aadhaar</th>
                <th className="p-3.5 text-center">PAN</th>
                <th className="p-3.5 text-center">EPFO</th>
                <th className="p-3.5 text-center">MoRTH</th>
                <th className="p-3.5 text-center">Court</th>
                <th className="p-3.5 text-center">IMPS Bank</th>
                <th className="p-3.5 text-center">Face Live</th>
                <th className="p-3.5 text-right">Revenue (₹)</th>
                <th className="p-3.5 text-right">Margin (₹)</th>
                <th className="p-3.5 text-right">Wallet Balance</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="13" className="p-8 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    <span>Calculating real-time consumption matrix...</span>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="13" className="p-8 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span>No company matches the search filter.</span>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => (
                  <tr key={c.company_id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900">{c.company_name}</div>
                      <span className="font-mono text-[10px] text-slate-400">{c.company_code || 'CMP-001'}</span>
                    </td>

                    <td className="p-3.5 text-center font-bold text-slate-900 font-mono">
                      {c.total_checks || 0}
                    </td>

                    <td className="p-3.5 text-center font-mono text-slate-600 bg-slate-50/50">
                      {c.aadhaar_count || 0}
                    </td>

                    <td className="p-3.5 text-center font-mono text-slate-600">
                      {c.pan_count || 0}
                    </td>

                    <td className="p-3.5 text-center font-mono text-slate-600 bg-slate-50/50">
                      {c.epfo_count || 0}
                    </td>

                    <td className="p-3.5 text-center font-mono text-slate-600">
                      {c.morth_count || 0}
                    </td>

                    <td className="p-3.5 text-center font-mono text-slate-600 bg-slate-50/50">
                      {c.court_count || 0}
                    </td>

                    <td className="p-3.5 text-center font-mono text-slate-600">
                      {c.bank_count || 0}
                    </td>

                    <td className="p-3.5 text-center font-mono text-slate-600 bg-slate-50/50">
                      {c.face_count || 0}
                    </td>

                    <td className="p-3.5 text-right font-bold text-slate-900 font-mono">
                      ₹{(c.total_revenue || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="p-3.5 text-right font-bold font-mono">
                      <span className={(c.margin || 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        ₹{(c.margin || 0).toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="p-3.5 text-right font-extrabold font-mono">
                      <span className={(c.wallet_balance || 0) > 500 ? 'text-slate-900' : 'text-rose-600'}>
                        ₹{(c.wallet_balance || 0).toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleOpenAdjust(c)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px] hover:bg-indigo-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 mx-auto"
                        title="Top-up or adjust wallet credits directly"
                      >
                        <Wallet className="w-3 h-3" />
                        <span>Adjust</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Credit Adjustment Modal */}
      {showAdjustModal && selectedCompany && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 flex justify-center items-center animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 text-slate-900">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900">Adjust Wallet Balance</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedCompany.company_name}</p>
              </div>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">Current Balance:</span>
              <span className="font-black text-indigo-700 font-mono text-sm">
                ₹{(selectedCompany.wallet_balance || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <form onSubmit={handlePerformAdjustment} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block text-slate-700 font-bold mb-1">Adjustment Action *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('credit')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      adjustType === 'credit'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Credit (+) Top-Up</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('debit')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      adjustType === 'debit'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Debit (-) Charge</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="form-input py-2 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason / Transaction Reference *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank NEFT UTR #9823719827 verified"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="form-input py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="btn btn-superadmin text-xs py-2 px-5 font-bold cursor-pointer"
                >
                  <span>{adjusting ? 'Updating Balance...' : `Confirm ${adjustType === 'credit' ? 'Credit' : 'Debit'} ✓`}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
