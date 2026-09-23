import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  Check,
  Paperclip,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  Eye,
  Download,
  Mail,
  FileSpreadsheet,
  FileCode,
  File
} from 'lucide-react';

export const SupportTicketModal = ({ onClose, prefillData = null }) => {
  const { supportTickets, addSupportTicket, currentRole, currentUser, companies, showToast } = useApp();

  const [activeTab, setActiveTab] = useState(prefillData ? 'newticket' : 'tickets'); // 'tickets' | 'newticket' | 'feedback'

  // New Ticket Form State
  const [ticketSubject, setTicketSubject] = useState(prefillData?.subject || '');
  const [ticketCategory, setTicketCategory] = useState(prefillData?.category || 'API Gateway');
  const [ticketPriority, setTicketPriority] = useState(prefillData?.priority || 'High');
  const [ticketDetails, setTicketDetails] = useState(prefillData?.details || '');
  const [selectedCompanyId, setSelectedCompanyId] = useState(prefillData?.companyId || currentUser?.companyId || 'comp-1');
  const [reporterEmail, setReporterEmail] = useState(prefillData?.email || currentUser?.email || '');
  
  // Attachments State (Documents & Images)
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeLightboxDoc, setActiveLightboxDoc] = useState(null);
  const fileInputRef = useRef(null);

  // Feedback Form State
  const [starRating, setStarRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeLightboxDoc) {
          setActiveLightboxDoc(null);
        } else if (typeof onClose === 'function') {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, activeLightboxDoc]);

  // Handle File Uploads (Images & Documents)
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    
    fileList.forEach(file => {
      // 10MB limit per file
      if (file.size > 10 * 1024 * 1024) {
        showToast(`⚠️ File "${file.name}" exceeds 10MB limit.`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
        const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
        const isWord = file.name.endsWith('.docx') || file.name.endsWith('.doc');

        const newAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          size: file.size,
          formattedSize: file.size < 1024 * 1024 
            ? `${(file.size / 1024).toFixed(1)} KB` 
            : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          type: file.type || 'application/octet-stream',
          isImage,
          isPdf,
          isExcel,
          isWord,
          dataUrl: e.target.result,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeAttachment = (attId) => {
    setAttachments(prev => prev.filter(a => a.id !== attId));
  };

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
      reporterName: currentUser?.name || prefillData?.name || `${currentRole.toUpperCase()} User`,
      reporterEmail: reporterEmail || currentUser?.email || 'portal.user@joycorporatesolutions.com',
      portalRole: currentRole || 'user',
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      details: ticketDetails,
      attachments: attachments
    });

    setTicketSubject('');
    setTicketDetails('');
    setAttachments([]);
    setActiveTab('tickets');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    showToast(`Thank you! Your ${starRating}-Star feedback has been received. ⭐`);
    setFeedbackText('');
    if (onClose) onClose();
  };

  const getFileIcon = (att) => {
    if (att.isImage) return <ImageIcon className="w-4 h-4 text-purple-600" />;
    if (att.isPdf) return <FileText className="w-4 h-4 text-rose-600" />;
    if (att.isExcel) return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    if (att.isWord) return <FileText className="w-4 h-4 text-blue-600" />;
    return <File className="w-4 h-4 text-slate-600" />;
  };

  return createPortal((
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !activeLightboxDoc) onClose();
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
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 font-bold shadow-2xs">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">Support Ticket & Incident Helpdesk</h2>
                  <span className="badge badge-emerald text-[9.5px]">Multi-Portal Email Enabled ✉️</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Attach evidence screenshots/documents & dispatch real-time notifications to relevant portal inboxes</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-lg font-bold cursor-pointer"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto text-xs font-bold gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Track Company Tickets ({supportTickets.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('newticket')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'newticket' ? 'bg-indigo-600 text-white shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Raise Support Ticket</span>
              {attachments.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">
                  {attachments.length} files
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'feedback' ? 'bg-indigo-600 text-white shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Help & Star Feedback ⭐</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* TAB 1: TRACK COMPANY SUPPORT TICKETS */}
          {activeTab === 'tickets' && (
            <div className="space-y-4 text-xs">
              {supportTickets.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-3">
                  <LifeBuoy className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <p className="font-bold text-slate-700">No active support tickets found</p>
                    <p className="text-[11px] text-slate-400">Click "+ Raise Support Ticket" above to submit an issue with attached images and documents.</p>
                  </div>
                </div>
              ) : (
                supportTickets.map(ticket => (
                  <div key={ticket.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 hover:border-indigo-300 transition-all text-xs shadow-2xs">
                    
                    {/* Ticket Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-slate-900 text-sm">#{ticket.id}</span>
                        <span className={`badge ${ticket.priority === 'High' ? 'badge-rose' : ticket.priority === 'Medium' ? 'badge-amber' : 'badge-slate'} text-[10px]`}>
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

                    {/* Subject & Details */}
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{ticket.subject}</h4>
                      <p className="text-slate-600 mt-1 font-medium leading-relaxed">{ticket.details}</p>
                    </div>

                    {/* 📎 ATTACHMENTS GALLERY (DOCUMENTS & IMAGES) */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[11px] text-slate-700 flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Attached Evidence & Documents ({ticket.attachments.length}):</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Secure Cloud Storage</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {ticket.attachments.map((att, idx) => (
                            <div key={idx} className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 hover:bg-slate-100/70 transition-colors">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {att.isImage ? (
                                  <div 
                                    className="w-9 h-9 rounded-md bg-slate-200 border border-slate-300 overflow-hidden shrink-0 cursor-pointer hover:opacity-80"
                                    onClick={() => setActiveLightboxDoc(att)}
                                    title="Click to zoom image"
                                  >
                                    <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-9 h-9 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                                    {getFileIcon(att)}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <span className="font-bold text-slate-800 text-[11px] truncate block" title={att.name}>{att.name}</span>
                                  <span className="text-[9.5px] text-slate-400 font-mono">{att.formattedSize || `${Math.round(att.size / 1024)} KB`}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {att.isImage ? (
                                  <button
                                    type="button"
                                    onClick={() => setActiveLightboxDoc(att)}
                                    className="p-1.5 rounded-md hover:bg-white text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                                    title="View image full size"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <a
                                    href={att.dataUrl}
                                    download={att.name}
                                    className="p-1.5 rounded-md hover:bg-white text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
                                    title="Download document"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ✉️ EMAIL NOTIFICATION DISPATCH CONFIRMATION */}
                    {ticket.notifiedEmails && ticket.notifiedEmails.length > 0 && (
                      <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-900">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>Dispatched Notifications ({ticket.notifiedEmails.length} Portal Inboxes):</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {ticket.notifiedEmails.map((email, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 font-mono text-[10px] text-emerald-800 font-bold shadow-2xs">
                              {email}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata & Admin Notes */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-500 font-medium">
                      <div>
                        Company: <strong className="text-slate-800">{ticket.companyName}</strong> • Reported By: <strong className="text-slate-800">{ticket.reporterName}</strong>
                      </div>

                      {ticket.resolutionNotes && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 w-full text-xs font-medium">
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
            <form onSubmit={handleRaiseTicketSubmit} className="space-y-4 text-xs animate-fadeIn">
              
              {/* Account & Reporter Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    <option value="Aadhaar / PAN KYC">Aadhaar / PAN KYC Verification</option>
                    <option value="Billing & Quota">Billing, Tariff & Quota Top-Up</option>
                    <option value="Verification Delay">Verification Delay / Candidate Token</option>
                    <option value="Biometrics Camera">AI WebCam Face Liveness Issue</option>
                    <option value="Joining Form Error">Joining Form / Document Issue</option>
                    <option value="Feature Request">Feature Request / Enhancement</option>
                    <option value="Other Technical Issue">Other Technical Inquiries</option>
                  </select>
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

              {/* Subject & Notification Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ticket Subject / Short Title *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Aadhaar OTP SMS Delivery Timeout on Jio numbers"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="form-input text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Notification Email *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. hr.manager@company.com"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    className="form-input text-xs font-mono"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Detailed Technical Description of Issue *</label>
                <textarea 
                  rows="3" 
                  required
                  placeholder="Describe what happened, step-by-step impact, error codes, and candidate details..."
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  className="form-textarea text-xs"
                />
              </div>

              {/* 📎 DOCUMENTS & IMAGES ATTACHMENT DRAG & DROP ZONE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-black text-xs flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-indigo-600" />
                    <span>Attach Error Screenshots & Document Evidence (Optional):</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold">Max 10MB per file • Images, PDFs, Excel, Word</span>
                </div>

                {/* Drop Zone Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer ${
                    isDragging 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900 scale-[1.01]' 
                      : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70 text-slate-600'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="p-2 rounded-full bg-white shadow-2xs border border-slate-200 text-indigo-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs text-slate-800">
                      Drag and drop files here, or <span className="text-indigo-600 underline">browse your device</span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports PNG, JPG, WEBP, PDF, DOCX, XLSX, CSV, TXT (Up to 10 files)
                    </p>
                  </div>
                </div>

                {/* Staged Attachments List */}
                {attachments.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>Ready to Upload ({attachments.length} file{attachments.length > 1 ? 's' : ''}):</span>
                      <button
                        type="button"
                        onClick={() => setAttachments([])}
                        className="text-rose-600 hover:text-rose-800 text-[10px] font-bold cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {attachments.map((att) => (
                        <div key={att.id} className="p-2 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {att.isImage ? (
                              <img src={att.dataUrl} alt={att.name} className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                                {getFileIcon(att)}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-slate-800 text-[11px] truncate block" title={att.name}>{att.name}</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">{att.formattedSize}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAttachment(att.id);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                            title="Remove attachment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ✉️ Multi-Portal Email Notification Alert */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-[11px] text-indigo-950 flex items-start gap-2">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-indigo-900">Automatic Email Notifications on Ticket Creation:</strong>
                  <p className="text-slate-600 text-[10.5px]">
                    Submitting this ticket will immediately dispatch email alerts with your ticket ID, details, and attachment roster to <strong>{reporterEmail || 'your email'}</strong>, the <strong>Company Admin</strong>, and the <strong>Super Admin Support Desk</strong>.
                  </p>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="btn btn-superadmin text-xs flex items-center gap-2 font-bold shadow-md cursor-pointer">
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket & Dispatch Notifications</span>
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
                      className="p-2 rounded-xl transition-all cursor-pointer"
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
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="btn btn-hrexecutive text-xs flex items-center gap-2 font-bold shadow-md cursor-pointer">
                  <Check className="w-4 h-4" />
                  <span>Send Product Feedback</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* 🖼️ IMAGE LIGHTBOX MODAL */}
      {activeLightboxDoc && (
        <div 
          className="fixed inset-0 z-[10000] bg-slate-950/90 flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveLightboxDoc(null)}
        >
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center space-y-3" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between w-full text-white px-2">
              <span className="font-bold text-xs truncate max-w-md">{activeLightboxDoc.name}</span>
              <div className="flex items-center gap-2">
                <a
                  href={activeLightboxDoc.dataUrl}
                  download={activeLightboxDoc.name}
                  className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setActiveLightboxDoc(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            <img 
              src={activeLightboxDoc.dataUrl} 
              alt={activeLightboxDoc.name} 
              className="max-h-[75vh] max-w-full rounded-xl object-contain border border-slate-700 shadow-2xl" 
            />
          </div>
        </div>
      )}

    </div>
  ), document.body);
};
