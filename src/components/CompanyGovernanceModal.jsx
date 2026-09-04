import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Save, 
  FileText, 
  FileCheck, 
  Scale, 
  Globe, 
  MapPin, 
  Briefcase, 
  Phone, 
  Mail, 
  CheckCircle2, 
  X, 
  Download, 
  ExternalLink, 
  ToggleLeft, 
  ToggleRight, 
  Send,
  AlertTriangle,
  Sparkles,
  Sliders,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';

export const CompanyGovernanceModal = ({ 
  company, 
  isOpen, 
  onClose, 
  onUpdateCompany, 
  showToast 
}) => {
  if (!isOpen || !company) return null;

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
 // 'profile' | 'security' | 'documents' | 'legal'

  // Corporate Profile State
  const [formData, setFormData] = useState({
    name: company.name || '',
    contact_person: company.contact_person || '',
    phone: company.phone || '',
    email: company.email || '',
    plan: company.plan || 'Standard Tier',
    price_per_verification: company.price_per_verification || 120,
    max_limit: company.max_limit || 500,
    cin_number: company.cin_number || '',
    gstin_number: company.gstin_number || '',
    company_pan: company.company_pan || '',
    registered_address: company.registered_address || '',
    industry_sector: company.industry_sector || 'Information Technology (IT/ITeS)',
    website: company.website || ''
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security / Password State
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendPasswordEmail, setSendPasswordEmail] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // 1. Save Corporate Profile
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await api.updateCompanyProfile(company.id, formData);
      showToast(res.message || `🏢 ${company.name} profile updated successfully!`);
      if (onUpdateCompany) {
        onUpdateCompany({ ...company, ...formData });
      }
    } catch (err) {
      showToast(`❌ Failed to update profile: ${err.message}`, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 2. Update Password
  const handleUpdatePassword = async (e) => {
    e?.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      showToast('⚠️ Please enter a password with at least 4 characters');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await api.updateCompanyPassword(company.id, newPassword, sendPasswordEmail);
      showToast(res.message || `🔐 Password updated successfully!`);
      setNewPassword('');
    } catch (err) {
      showToast(`❌ Failed to update password: ${err.message}`, 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // 3. Toggle Login Access (Active vs Suspended)
  const handleToggleLoginAccess = async () => {
    setIsTogglingStatus(true);
    const newStatus = (company.status === 'Active') ? 'Suspended' : 'Active';
    try {
      await api.updateCompanyStatus(company.id, newStatus);
      showToast(`🏢 Company login access ${newStatus === 'Active' ? 'ENABLED 🟢' : 'DISABLED 🔴'}!`);
      if (onUpdateCompany) {
        onUpdateCompany({ ...company, status: newStatus, is_active: newStatus === 'Active' });
      }
    } catch (err) {
      showToast(`❌ Failed to change status: ${err.message}`, 'error');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const docs = company.documents || {};
  const isPendingActivation = company.status === 'Pending Activation' || company.activation_status === 'Pending Activation';
  const isPendingApproval = company.status === 'Pending Approval' || company.activation_status === 'Pending Approval';
  const isActive = company.status === 'Active';

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden relative z-10 my-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* MODAL HEADER */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">{company.name}</h2>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  #{company.code}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                    : isPendingApproval 
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                    : isPendingActivation
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                }`}>
                  {isActive ? '🟢 Active & Verified' : isPendingApproval ? '🟣 Pending Approval' : isPendingActivation ? '🟡 Pending Activation' : '🔴 Suspended'}
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5 flex items-center gap-2">
                <span>{company.contact_person}</span>
                <span>•</span>
                <span>{company.email}</span>
                {company.phone && (
                  <>
                    <span>•</span>
                    <span>{company.phone}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Login Toggle */}
            <button
              onClick={handleToggleLoginAccess}
              disabled={isTogglingStatus}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40 hover:bg-rose-500/30'
              }`}
              title={isActive ? 'Click to Disable Login Access' : 'Click to Enable Login Access'}
            >
              {isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-rose-400" />}
              <span>{isActive ? 'Login Enabled' : 'Login Blocked'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>🏢 Corporate Profile & Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>🔐 Login & Password Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📄 Uploaded Documents ({Object.keys(docs).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'legal'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>⚖️ Legal DPDP & Terms Status</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* 1. CORPORATE PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person / Signatory *</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Mobile / Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Login Email (Read Only)</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 bg-slate-100 text-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subscription Plan</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Basic Tier">Basic Tier</option>
                    <option value="Standard Tier">Standard Tier</option>
                    <option value="Enterprise Premier">Enterprise Premier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={formData.industry_sector}
                    onChange={(e) => setFormData({ ...formData, industry_sector: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Information Technology & Software"
                  />
                </div>

                {/* STATUTORY REGISTRATION IDENTIFIERS */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Identification Number (CIN)</label>
                  <input
                    type="text"
                    value={formData.cin_number}
                    onChange={(e) => setFormData({ ...formData, cin_number: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. U74999KA2026PTC192841"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={formData.gstin_number}
                    onChange={(e) => setFormData({ ...formData, gstin_number: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. 33AAAAA0000A1Z5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company PAN Card Number</label>
                  <input
                    type="text"
                    value={formData.company_pan}
                    onChange={(e) => setFormData({ ...formData, company_pan: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. AAACJ1234F"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Website URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Office Address</label>
                  <textarea
                    rows={2}
                    value={formData.registered_address}
                    onChange={(e) => setFormData({ ...formData, registered_address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Enter complete legal registered office address"
                  />
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : '💾 Save Profile to PostgreSQL'}</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. SECURITY & PASSWORD MANAGEMENT TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* CURRENT LOGIN ACCESS STATUS */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isActive 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black">
                      Company Login Status: {isActive ? 'ACTIVE & ENABLED 🟢' : 'SUSPENDED / BLOCKED 🔴'}
                    </h4>
                    <p className="text-xs opacity-80">
                      {isActive 
                        ? 'Company Admin can authenticate and manage recruitment operations.' 
                        : 'Company portal access is locked. Recruiters and Admins cannot log in.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleLoginAccess}
                  disabled={isTogglingStatus}
                  className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isActive ? '⛔ Disable Login Access' : '✅ Enable Login Access'}
                </button>
              </div>

              {/* CHANGE / RESET LOGIN PASSWORD */}
              <form onSubmit={handleUpdatePassword} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <KeyRound className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Change Company Admin Login Password</h4>
                    <p className="text-xs text-slate-500 font-medium">Set a new permanent password for {company.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Login Username</label>
                    <input
                      type="text"
                      value={company.email}
                      disabled
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 bg-slate-100 font-mono text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enter New Login Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="e.g. Joyson@2026#"
                        className="w-full pl-3.5 pr-10 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={sendPasswordEmail}
                      onChange={(e) => setSendPasswordEmail(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-md border-slate-300"
                    />
                    <span>📧 Automatically email the new password to {company.email}</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isUpdatingPassword || !newPassword}
                    className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUpdatingPassword ? 'Updating...' : '🔐 Update Password'}</span>
                  </button>
                </div>
              </form>

              {/* ACTIVATION TOKEN & PIN INFO */}
              {company.activation_token && (
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Self-Activation Security Details</div>
                    <div className="text-xs font-medium text-slate-700 mt-1">
                      Token: <code className="bg-indigo-100/70 text-indigo-800 px-1.5 py-0.5 rounded font-mono font-bold">{company.activation_token}</code>
                      <span className="mx-2">•</span>
                      4-Digit Security PIN: <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-black">{company.activation_password || '1234'}</code>
                    </div>
                  </div>

                  <a
                    href={`${window.location.origin}/company-activation?token=${company.activation_token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-bold bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Activation Link</span>
                  </a>
                </div>
              )}

            </div>
          )}

          {/* 3. UPLOADED DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <h4 className="text-sm font-black text-slate-900 mb-1">Statutory Verification Documents & Proofs</h4>
                <p className="text-xs text-slate-500 font-medium">Files submitted during the 4-step corporate activation wizard</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'coi', label: 'Certificate of Incorporation (COI)', desc: 'Official MCA Company Registration Certificate' },
                  { key: 'pan', label: 'Company PAN Card Proof', desc: 'Permanent Account Number Card Document' },
                  { key: 'gst', label: 'GSTIN Registration Certificate', desc: 'Form GST REG-06 Document' },
                  { key: 'signatory_proof', label: 'Authorized Signatory Proof', desc: 'Board Resolution / Power of Attorney' },
                  { key: 'company_logo', label: 'Official Company Logo', desc: 'Custom branding for candidate forms' },
                ].map(({ key, label, desc }) => {
                  const docVal = docs[key];
                  return (
                    <div key={key} className="p-4 rounded-2xl border bg-white border-slate-200 flex items-start justify-between gap-3 shadow-2xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <FileCheck className={`w-4 h-4 ${docVal ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <h5 className="text-xs font-bold text-slate-900">{label}</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                        <div className="mt-2">
                          {docVal ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Submitted & Saved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                              Pending Upload
                            </span>
                          )}
                        </div>
                      </div>

                      {docVal && (
                        <div className="flex items-center gap-1">
                          {typeof docVal === 'string' && docVal.startsWith('data:') ? (
                            <a
                              href={docVal}
                              download={`${company.code}_${key}`}
                              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer"
                              title="Download Document"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400">Stored on disk</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. LEGAL DPDP & TERMS STATUS TAB */}
          {activeTab === 'legal' && (
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Master Services Agreement & DPDP Act 2023 Consent Audit</h4>
                    <p className="text-xs text-slate-500 font-medium">Digital contract execution records and compliance timestamps</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Agreement Version</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">{company.terms_version || 'v2.4-2026'}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Acceptance Status</div>
                    <div className="text-sm font-black text-emerald-600 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Digitally Signed & Accepted
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Authorized Signatory</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">{company.terms_accepted_by || company.contact_person || 'Authorized Officer'}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Timestamp of Acceptance</div>
                    <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                      {company.terms_accepted_at ? new Date(company.terms_accepted_at).toLocaleString('en-IN') : 'Completed during Onboarding'}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Legally compliant with Digital Personal Data Protection (DPDP) Act 2023 data processing obligations.</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
