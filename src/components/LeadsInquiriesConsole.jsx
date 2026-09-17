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
  AlertCircle,
  FileSpreadsheet,
  Send,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { checkNetworkBeforeAction } from '../utils/networkChecker';

export const LeadsInquiriesConsole = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Notes Modal
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  
  // Email Reply Modal
  const [replyInquiry, setReplyInquiry] = useState(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.getAllInquiries(statusFilter !== 'all' ? statusFilter : undefined);
      if (Array.isArray(res)) {
        setInquiries(res);
      } else if (res && res.inquiries) {
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
      setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, internal_notes: notesDraft, notes: notesDraft } : inq));
      setSelectedInquiry(null);
    } catch (err) {
      alert(err.message || 'Failed to save notes');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendEmailReply = async (e) => {
    if (e) e.preventDefault();
    if (!replyInquiry) return;
    if (!replySubject.trim() || !replyMessage.trim()) {
      alert('Please provide both subject and message body.');
      return;
    }
    if (!checkNetworkBeforeAction('sending email reply')) return;

    try {
      setSendingReply(true);
      const res = await api.replyToInquiry(replyInquiry.id, {
        subject: replySubject.trim(),
        message: replyMessage.trim()
      });

      alert(`✅ Reply successfully sent to ${replyInquiry.email || replyInquiry.full_name}!`);
      
      // Update local state
      setInquiries(prev => prev.map(inq => inq.id === replyInquiry.id ? { 
        ...inq, 
        status: 'Contacted',
        internal_notes: res.internal_notes || inq.internal_notes 
      } : inq));

      setReplyInquiry(null);
      setReplySubject('');
      setReplyMessage('');
    } catch (err) {
      alert(`Failed to send email: ${err.message || 'SMTP Connection Error'}`);
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
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
    const name = inq.full_name || inq.name || '';
    const company = inq.company_name || inq.company || '';
    const email = inq.email || '';
    const phone = inq.phone || '';
    const type = inq.inquiry_type || 'General Query';

    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);
    
    const matchesType = typeFilter === 'all' || type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  const stats = {
    total: inquiries.length,
    general: inquiries.filter(i => (i.inquiry_type || '').toLowerCase().includes('general')).length,
    planPurchase: inquiries.filter(i => (i.inquiry_type || '').toLowerCase().includes('plan') || (i.inquiry_type || '').toLowerCase().includes('purchas')).length,
    other: inquiries.filter(i => (i.inquiry_type || '').toLowerCase().includes('other')).length
  };

  const exportExcel = () => {
    const headers = ['ID', 'Type', 'Name', 'Company', 'Email', 'Phone', 'Volume/Plan', 'Message', 'Status', 'Date', 'Internal Notes'];
    const rows = filteredInquiries.map(i => [
      i.id,
      i.inquiry_type || 'General Query',
      i.full_name || i.name || '',
      i.company_name || i.company || '',
      i.email || '',
      i.phone || '',
      i.expected_volume || i.estimated_monthly_hires || '',
      i.message || '',
      i.status || 'New',
      i.created_at ? new Date(i.created_at).toLocaleDateString() : '',
      i.internal_notes || i.notes || ''
    ]);

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head>
      <body>
        <h2>JOY PORTAL - INCOMING INQUIRIES & DEMO LEADS</h2>
        <p>Export Date: ${new Date().toLocaleString()} | Total Leads: ${filteredInquiries.length}</p>
        <table border="1">
          <thead><tr style="background:#426CF5;color:white;">${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `JOY_Inquiries_Leads_${new Date().toISOString().slice(0,10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeBadge = (typeStr) => {
    const t = (typeStr || '').toLowerCase();
    if (t.includes('plan') || t.includes('purchas')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CreditCard className="w-3 h-3" /> Purchasing Plan
        </span>
      );
    }
    if (t.includes('other')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
          <HelpCircle className="w-3 h-3" /> Other
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
        <Sparkles className="w-3 h-3" /> General Query
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📬 Inquiries & Leads Management</span>
            <span className="badge badge-purple text-xs font-mono">{inquiries.length} Total</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage inquiries, purchase requests, and communicate with prospective companies directly via configured Super Admin SMTP.
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
            onClick={exportExcel}
            className="btn btn-superadmin text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer font-bold"
            title="Export inquiries to Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for the 3 Types */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Received</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{stats.total}</div>
          <span className="text-[10px] text-slate-500">Across all channels</span>
        </div>

        <div className="glass-panel p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">General Queries</span>
          <div className="text-2xl font-black text-blue-700 font-mono">{stats.general}</div>
          <span className="text-[10px] text-blue-600 font-medium">Questions & Product Info</span>
        </div>

        <div className="glass-panel p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Plan Purchases</span>
          <div className="text-2xl font-black text-emerald-700 font-mono">{stats.planPurchase}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Postpaid Activation Requests</span>
        </div>

        <div className="glass-panel p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Other Inquiries</span>
          <div className="text-2xl font-black text-purple-700 font-mono">{stats.other}</div>
          <span className="text-[10px] text-purple-600 font-medium">Custom SLAs & Partnerships</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company, contact name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-select py-2 text-xs font-bold bg-slate-50 border-slate-200"
          >
            <option value="all">All 3 Categories</option>
            <option value="general">1. General Queries</option>
            <option value="plan">2. Purchasing Plan</option>
            <option value="other">3. Other Inquiries</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select py-2 text-xs font-bold bg-slate-50 border-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="new">New (Uncontacted)</option>
            <option value="contacted">Contacted / Replied</option>
            <option value="converted">Converted Client</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-panel bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Lead / Contact</th>
                <th className="p-3.5">Company Name</th>
                <th className="p-3.5">Message / Requirements</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    <span>Loading inquiries...</span>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span>No inquiries match the selected filters.</span>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const name = inq.full_name || inq.name || 'Unknown Contact';
                  const company = inq.company_name || inq.company || 'Unknown Company';
                  const notes = inq.internal_notes || inq.notes || '';

                  return (
                    <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        {getTypeBadge(inq.inquiry_type)}
                      </td>

                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900">{name}</div>
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
                          <span>{company}</span>
                        </div>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <p className="text-slate-700 text-xs line-clamp-2">{inq.message || 'No specific message provided.'}</p>
                        {notes && (
                          <p className="text-[10px] text-indigo-600 font-medium italic mt-1 line-clamp-1">
                            💬 Notes: {notes}
                          </p>
                        )}
                      </td>

                      <td className="p-3.5">
                        <select
                          value={inq.status}
                          disabled={updatingId === inq.id}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value, notes)}
                          className={`form-select py-1 px-2 text-[11px] font-bold rounded-lg ${
                            inq.status === 'New' || inq.status === 'new' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            inq.status === 'Converted' || inq.status === 'converted' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                            'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="New">New Lead</option>
                          <option value="Contacted">Contacted / Replied</option>
                          <option value="Converted">Converted Client ✓</option>
                          <option value="Closed">Closed / Inactive</option>
                        </select>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'Recent'}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct Email Reply Button */}
                          <button
                            onClick={() => {
                              setReplyInquiry(inq);
                              setReplySubject(`Re: ${inq.inquiry_type || 'Inquiry'} - JOY Corporate Solutions`);
                              setReplyMessage(`Hello ${name},\n\nThank you for reaching out regarding ${inq.inquiry_type || 'workforce verification'}.\n\n`);
                            }}
                            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                            title="Reply via configured SMTP Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          {/* Notes Button */}
                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setNotesDraft(notes);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit notes / interaction log"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          {/* WhatsApp Link */}
                          <a
                            href={`https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(name)},%20thank%20you%20for%20contacting%20JOY%20TrueProfile!`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Delete Button */}
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

      {/* SMTP Email Reply Modal */}
      {replyInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 flex justify-center items-center animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" /> Send Email Reply
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  To: <strong>{replyInquiry.full_name || replyInquiry.name}</strong> ({replyInquiry.email}) • Ref: {replyInquiry.id}
                </p>
              </div>
              <button onClick={() => setReplyInquiry(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSendEmailReply} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Subject:</label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Body (HTML formatted):</label>
                <textarea
                  rows="6"
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your response to the company..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Email will be dispatched securely using the Super Admin configured SMTP Server.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplyInquiry(null)}
                  className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="btn btn-superadmin text-xs py-2 px-5 font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingReply ? 'Sending Email...' : 'Send Reply via SMTP'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes / Call Log Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 flex justify-center items-center animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 text-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900">Lead Interaction Log</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedInquiry.full_name || selectedInquiry.name} • {selectedInquiry.company_name || selectedInquiry.company}</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Internal Sales & Outreach Notes:</label>
              <textarea
                rows="4"
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="e.g. Sent proposal for Tier 3 postpaid plan. Follow up on Monday with HR team."
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
