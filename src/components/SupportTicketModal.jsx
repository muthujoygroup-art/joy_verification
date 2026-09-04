import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LifeBuoy, 
  Plus, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Star, 
  X, 
  MessageSquare, 
  ShieldCheck,
  Building2,
  Sparkles,
  Check
} from 'lucide-react';

export const SupportTicketModal = ({ onClose }) => {
  const { supportTickets, addSupportTicket, currentRole, currentUser, companies, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('tickets');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
 // 'tickets' | 'newticket' | 'feedback'

  // New Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('API Gateway');
  const [ticketPriority, setTicketPriority] = useState('High');
  const [ticketDetails, setTicketDetails] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('comp-1');

  // Feedback Form State
  const [starRating, setStarRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  const handleRaiseTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDetails) {
      alert('Please fill out Subject and Issue Details.');
      return;
    }

    const targetCompany = companies.find(c => c.id === selectedCompanyId) || { name: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED' };

    addSupportTicket({
      companyName: targetCompany.name,
      companyId: selectedCompanyId,
      reporterName: currentUser?.name || `${currentRole.toUpperCase()} User`,
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      details: ticketDetails
    });

    setTicketSubject('');
    setTicketDetails('');
    setActiveTab('tickets');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    showToast(`Thank you! Your ${starRating}-Star feedback has been received. ⭐`);
    setFeedbackText('');
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
        {/* Sticky Header */}
        <div className="shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-b border-slate-100 space-y-3 shadow-2xs">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Support Ticket Raising & Feedback Center</h2>
              <p className="text-xs text-slate-500 font-medium">Raise technical support tickets, track resolution status, and send platform feedback</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Track Company Tickets ({supportTickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('newticket')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'newticket' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Raise New Support Ticket</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'feedback' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Help & Star Feedback ⭐</span>
          </button>
        </div>

        {/* TAB 1: TRACK COMPANY SUPPORT TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            {supportTickets.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                No active support tickets found. Click "+ Raise New Support Ticket" to create one.
              </div>
            ) : (
              supportTickets.map(ticket => (
                <div key={ticket.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 hover:border-indigo-300 transition-all text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-slate-900 text-sm">#{ticket.id}</span>
                      <span className={`badge ${ticket.priority === 'High' ? 'badge-rose' : 'badge-amber'} text-[10px]`}>
                        {ticket.priority} Priority
                      </span>
                      <span className="badge badge-purple text-[10px]">{ticket.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`badge ${ticket.status === 'Resolved' ? 'badge-emerald' : 'badge-amber'} text-[10px] font-bold`}>
                        {ticket.status === 'Resolved' ? 'Resolved ✅' : 'Open 🔴'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{ticket.createdAt}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{ticket.subject}</h4>
                    <p className="text-slate-600 mt-1 font-medium">{ticket.details}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-500 font-medium">
                    <div>
                      Company: <strong className="text-slate-800">{ticket.companyName}</strong> • Reported By: <strong className="text-slate-800">{ticket.reporterName}</strong>
                    </div>

                    {ticket.resolutionNotes && (
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 w-full text-xs font-medium">
                        <strong>💡 Super Admin Resolution:</strong> {ticket.resolutionNotes}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: RAISE NEW SUPPORT TICKET FORM */}
        {activeTab === 'newticket' && (
          <form onSubmit={handleRaiseTicketSubmit} className="space-y-4 text-xs max-h-[55vh] overflow-y-auto pr-1 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Account *</label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="form-select text-xs font-bold"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.plan})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Issue Category *</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="form-select text-xs font-bold"
                >
                  <option value="API Gateway">API Gateway & OTP Router</option>
                  <option value="Billing & Quota">Billing, Tariff & Quota Top-Up</option>
                  <option value="Verification Delay">Verification Delay / Candidate Token</option>
                  <option value="Biometrics Camera">AI WebCam Face Liveness Issue</option>
                  <option value="Feature Request">Feature Request / Enhancement</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Ticket Subject / Short Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Aadhaar OTP SMS Delivery Timeout on Jio numbers"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Priority Level *</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="form-select text-xs font-bold"
                >
                  <option value="High">High 🔴 (Critical Issue)</option>
                  <option value="Medium">Medium 🟡 (Standard Support)</option>
                  <option value="Low">Low 🟢 (General Query)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Detailed Technical Description of Issue *</label>
              <textarea 
                rows="4" 
                required
                placeholder="Describe what happened, step-by-step impact, and candidate details..."
                value={ticketDetails}
                onChange={(e) => setTicketDetails(e.target.value)}
                className="form-textarea text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold">Cancel</button>
              <button type="submit" className="btn btn-superadmin text-xs flex items-center gap-2 font-bold shadow-md">
                <Send className="w-4 h-4" />
                <span>Submit Support Ticket</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: HELP & STAR FEEDBACK */}
        {activeTab === 'feedback' && (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs animate-fadeIn">
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
              <h4 className="font-extrabold text-indigo-900 text-sm">Platform Feedback & User Satisfaction</h4>
              <p className="text-slate-600 text-xs">How would you rate your experience using JOY DATA VERIFICATION?</p>
              
              <div className="flex items-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarRating(star)}
                    className="p-2 rounded-xl transition-all"
                  >
                    <Star className={`w-6 h-6 ${star <= starRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                  </button>
                ))}
                <span className="font-extrabold text-slate-900 text-sm ml-2">{starRating} / 5 Stars ⭐</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Your Comments, Feature Ideas or Suggestions</label>
              <textarea 
                rows="3"
                placeholder="Let us know how we can make candidate profile verification faster and easier for your team..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="form-textarea text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold">Cancel</button>
              <button type="submit" className="btn btn-hrexecutive text-xs flex items-center gap-2 font-bold shadow-md">
                <Check className="w-4 h-4" />
                <span>Send Product Feedback</span>
              </button>
            </div>
          </form>
        )}

        </div>
      </div>
    </div>
  );
};
