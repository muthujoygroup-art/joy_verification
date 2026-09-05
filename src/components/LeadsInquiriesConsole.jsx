import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Download, 
  RefreshCw, 
  Trash2, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { checkNetworkBeforeAction } from '../utils/networkChecker';

export const LeadsInquiriesConsole = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workforceFilter, setWorkforceFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.getAllInquiries(statusFilter !== 'all' ? statusFilter : undefined);
      if (res && res.inquiries) {
        setInquiries(res.inquiries);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleStatusChange = async (inquiryId, newStatus, currentNotes) => {
    if (!checkNetworkBeforeAction('updating lead status')) return;
    try {
      setUpdatingId(inquiryId);
      await api.updateInquiryStatus(inquiryId, newStatus, currentNotes);
      setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (inquiryId, currentStatus) => {
    if (!checkNetworkBeforeAction('saving notes')) return;
    try {
      setUpdatingId(inquiryId);
      await api.updateInquiryStatus(inquiryId, currentStatus, notesDraft);
      setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, notes: notesDraft } : inq));
      setSelectedInquiry(null);
    } catch (err) {
      alert(err.message || 'Failed to save notes');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this demo inquiry?')) return;
    if (!checkNetworkBeforeAction('deleting inquiry')) return;
    try {
      setUpdatingId(inquiryId);
      await api.deleteInquiry(inquiryId);
      setInquiries(prev => prev.filter(inq => inq.id !== inquiryId));
    } catch (err) {
      alert(err.message || 'Failed to delete inquiry');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      (inq.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.phone || '').includes(searchTerm);
    
    const matchesWorkforce = workforceFilter === 'all' || inq.workforce_type === workforceFilter;
    return matchesSearch && matchesWorkforce;
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted' || i.status === 'demo_scheduled').length,
    converted: inquiries.filter(i => i.status === 'converted').length
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Estimated Hires', 'Workforce Type', 'Status', 'Date', 'Notes'];
    const rows = filteredInquiries.map(i => [
      i.id,
      `"${i.name}"`,
      `"${i.company}"`,
      i.email,
      `"${i.phone}"`,
      `"${i.estimated_monthly_hires}"`,
      i.workforce_type,
      i.status,
      new Date(i.created_at).toLocaleDateString(),
      `"${(i.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JOY_Demo_Inquiries_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📬 Demo Inquiries & Sales Leads Pipeline</span>
            <span className="badge badge-purple text-xs font-mono">{inquiries.length} Total</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage incoming live enterprise demo requests from the JOY TrueProfile marketing portal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportCSV}
            className="btn btn-superadmin text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{stats.total}</div>
          <span className="text-[10px] text-slate-500">From public portal</span>
        </div>

        <div className="glass-panel p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">New Inquiries</span>
          <div className="text-2xl font-black text-amber-700 font-mono">{stats.new}</div>
          <span className="text-[10px] text-amber-600 font-medium">Pending initial outreach</span>
        </div>

        <div className="glass-panel p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">In Progress</span>
          <div className="text-2xl font-black text-indigo-700 font-mono">{stats.contacted}</div>
          <span className="text-[10px] text-indigo-600 font-medium">Contacted / Demo Booked</span>
        </div>

        <div className="glass-panel p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Converted Clients</span>
          <div className="text-2xl font-black text-emerald-700 font-mono">{stats.converted}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Active platform accounts</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company, name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select py-2 text-xs font-bold bg-slate-50 border-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="new">New (Uncontacted)</option>
            <option value="contacted">Contacted</option>
            <option value="demo_scheduled">Demo Scheduled</option>
            <option value="converted">Converted Client</option>
            <option value="closed">Closed / Inactive</option>
          </select>

          <select
            value={workforceFilter}
            onChange={(e) => setWorkforceFilter(e.target.value)}
            className="form-select py-2 text-xs font-bold bg-slate-50 border-slate-200"
          >
            <option value="all">All Workforce Types</option>
            <option value="labor">Contract Labor</option>
            <option value="corporate">Corporate BGV</option>
            <option value="both">Both Labor & Corporate</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-panel bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Lead / Contact</th>
                <th className="p-3.5">Company Name</th>
                <th className="p-3.5">Volume & Scope</th>
                <th className="p-3.5">Pipeline Status</th>
                <th className="p-3.5">Received Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    <span>Loading leads pipeline...</span>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span>No demo inquiries match the selected criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  return (
                    <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900">{inq.name}</div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <a href={`mailto:${inq.email}`} className="hover:text-indigo-600 flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{inq.email}</span>
                          </a>
                          <a href={`tel:${inq.phone}`} className="hover:text-indigo-600 flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{inq.phone}</span>
                          </a>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{inq.company}</span>
                        </div>
                        {inq.notes && (
                          <p className="text-[11px] text-slate-400 italic truncate max-w-xs mt-0.5">
                            "{inq.notes}"
                          </p>
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 font-mono">~{inq.estimated_monthly_hires} hires/mo</div>
                        <span className="badge badge-purple text-[9px] font-bold mt-0.5">
                          {inq.workforce_type === 'labor' ? '👷 Contract Labor' : inq.workforce_type === 'corporate' ? '💼 Corporate BGV' : '🚀 Dual Scope'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <select
                          value={inq.status}
                          disabled={updatingId === inq.id}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value, inq.notes)}
                          className={`form-select py-1 px-2 text-[11px] font-bold rounded-lg ${
                            inq.status === 'new' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            inq.status === 'converted' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                            inq.status === 'demo_scheduled' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                            'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="demo_scheduled">Demo Scheduled</option>
                          <option value="converted">Converted Client ✓</option>
                          <option value="closed">Closed / Inactive</option>
                        </select>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-500">
                        {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'Recent'}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setNotesDraft(inq.notes || '');
                            }}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="Edit notes / call log"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)},%20thank%20you%20for%20requesting%20a%20demo%20of%20JOY%20TrueProfile!`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(inq.id)}
                            disabled={updatingId === inq.id}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes / Call Log Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 flex justify-center items-center animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900">Lead Interaction Log</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedInquiry.name} • {selectedInquiry.company}</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Internal Sales & Demo Notes:</label>
              <textarea
                rows="4"
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="e.g. Discussed pricing for 800 contract laborers. Demo scheduled for Friday at 3 PM with HR VP."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveNotes(selectedInquiry.id, selectedInquiry.status)}
                disabled={updatingId === selectedInquiry.id}
                className="btn btn-superadmin text-xs py-2 px-4 font-bold cursor-pointer"
              >
                <span>{updatingId === selectedInquiry.id ? 'Saving...' : 'Save Notes ✓'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
