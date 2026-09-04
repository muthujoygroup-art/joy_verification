import React, { useEffect, useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Save, 
  FileText, 
  FileCheck, 
  Scale, 
  Briefcase, 
  GraduationCap, 
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
  Lock
} from 'lucide-react';
import { api } from '../services/api';

export const HrGovernanceModal = ({ 
  hrUser, 
  companyId, 
  isOpen, 
  onClose, 
  onUpdateHr, 
  showToast 
}) => {
  if (!isOpen || !hrUser) return null;

  const [activeTab, setActiveTab] = useState('profile');
 // 'profile' | 'education' | 'documents' | 'security' | 'legal'

  const personal = hrUser.personal_details || {};
  const employment = hrUser.employment_details || {};
  const education = hrUser.education_details || {};
  const docs = hrUser.documents || {};

  // Form State
  const [formData, setFormData] = useState({
    name: hrUser.name || '',
    phone: hrUser.phone || personal.phone || '',
    dept: hrUser.dept || employment.department || 'Human Resources',
    designation: hrUser.designation || employment.designation || 'HR Recruiter',
    dob: personal.dob || '',
    gender: personal.gender || 'Male',
    emergency_contact: personal.emergency_contact || '',
    current_address: personal.current_address || '',
    emp_id: employment.emp_id || '',
    doj: employment.doj || '',
    work_location: employment.work_location || '',
    highest_degree: education.highest_degree || 'Bachelor of Technology (B.Tech / B.E.)',
    institution: education.institution || '',
    passing_year: education.passing_year || '2022',
    specialization: education.specialization || ''
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security / Password State
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendPasswordEmail, setSendPasswordEmail] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  // 1. Save HR Profile Changes
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSavingProfile(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        dept: formData.dept,
        designation: formData.designation,
        personal_details: {
          ...personal,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          emergency_contact: formData.emergency_contact,
          current_address: formData.current_address
        },
        employment_details: {
          ...employment,
          emp_id: formData.emp_id,
          doj: formData.doj,
          work_location: formData.work_location,
          department: formData.dept,
          designation: formData.designation
        },
        education_details: {
          ...education,
          highest_degree: formData.highest_degree,
          institution: formData.institution,
          passing_year: formData.passing_year,
          specialization: formData.specialization
        }
      };

      const res = await api.updateHrProfile(companyId, hrUser.id, payload);
      showToast(res.message || `👤 ${hrUser.name} profile updated successfully!`);
      if (onUpdateHr) {
        onUpdateHr({ ...hrUser, ...payload });
      }
    } catch (err) {
      showToast(`❌ Failed to update HR profile: ${err.message}`, 'error');
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
      const res = await api.updateHrPassword(companyId, hrUser.id, newPassword, sendPasswordEmail);
      showToast(res.message || `🔐 Password updated successfully!`);
      setNewPassword('');
    } catch (err) {
      showToast(`❌ Failed to update password: ${err.message}`, 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // 3. Toggle Status (Active vs Suspended)
  const handleToggleStatus = async () => {
    setIsTogglingStatus(true);
    const newStatus = (hrUser.status === 'Active') ? 'Suspended' : 'Active';
    try {
      await api.updateHrStatus(companyId, hrUser.id, newStatus);
      showToast(`👤 Recruiter login access ${newStatus === 'Active' ? 'ENABLED 🟢' : 'DISABLED 🔴'}!`);
      if (onUpdateHr) {
        onUpdateHr({ ...hrUser, status: newStatus, activation_status: newStatus });
      }
    } catch (err) {
      showToast(`❌ Failed to update status: ${err.message}`, 'error');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const isPendingActivation = hrUser.status === 'Pending Activation' || hrUser.activation_status === 'Pending Activation';
  const isPendingApproval = hrUser.status === 'Pending Approval' || hrUser.activation_status === 'Pending Approval';
  const isActive = hrUser.status === 'Active';

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden relative z-10 my-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">{hrUser.name}</h2>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  #{hrUser.id}
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
                  {isActive ? '🟢 Active Recruiter' : isPendingApproval ? '🟣 Pending Approval' : isPendingActivation ? '🟡 Pending Activation' : '🔴 Suspended'}
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5 flex items-center gap-2">
                <span>{hrUser.designation || 'HR Recruiter'}</span>
                <span>•</span>
                <span>{hrUser.dept || 'Human Resources'}</span>
                <span>•</span>
                <span>{hrUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Login Toggle */}
            <button
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40 hover:bg-rose-500/30'
              }`}
              title={isActive ? 'Click to Suspend HR Login Access' : 'Click to Enable HR Login Access'}
            >
              {isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-rose-400" />}
              <span>{isActive ? 'Login Allowed' : 'Login Blocked'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <User className="w-4 h-4" />
            <span>👤 Personal & Employment</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'education'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>🎓 Academic Credentials</span>
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
            <span>📄 Document Proofs ({Object.keys(docs).length})</span>
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
            <span>🔐 Login & Password</span>
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
            <span>⚖️ DPDP Consent Status</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* TAB 1: PERSONAL & EMPLOYMENT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Login Email (Read Only)</label>
                  <input
                    type="email"
                    value={hrUser.email}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 bg-slate-100 text-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Staff / Employee ID</label>
                  <input
                    type="text"
                    value={formData.emp_id}
                    onChange={(e) => setFormData({ ...formData, emp_id: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. JOY-HR-004"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role Title</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Residential Address</label>
                  <textarea
                    rows={2}
                    value={formData.current_address}
                    onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Enter complete residential address"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : '💾 Save Changes to PostgreSQL'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ACADEMIC CREDENTIALS */}
          {activeTab === 'education' && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Academic & Educational Credentials</h4>
                  <p className="text-xs text-slate-500 font-medium">Educational background recorded during self-onboarding</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Highest Qualification</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{formData.highest_degree}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Institution / University</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{formData.institution || 'Provided in onboarding'}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Specialization / Domain</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{formData.specialization || 'Human Resources'}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Year of Graduation</div>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">{formData.passing_year || '2022'}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UPLOADED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <h4 className="text-sm font-black text-slate-900 mb-1">Uploaded Statutory Documents & Proofs</h4>
                <p className="text-xs text-slate-500 font-medium">Identity and academic proof documents submitted by {hrUser.name}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'gov_id', label: 'Government ID Proof (Aadhaar / PAN / Passport)', desc: 'Official identity document proof' },
                  { key: 'degree_cert', label: 'Highest Degree Certificate / Marksheet', desc: 'University Degree / Diploma certificate' },
                  { key: 'exp_letter', label: 'Experience / Relieving Letter', desc: 'Prior employment service letter' },
                  { key: 'photo', label: 'Passport Size Profile Photograph', desc: 'Recruiter profile image' }
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
                              <CheckCircle2 className="w-3 h-3" /> Attached & Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                              Pending Submission
                            </span>
                          )}
                        </div>
                      </div>

                      {docVal && typeof docVal === 'string' && docVal.startsWith('data:') && (
                        <a
                          href={docVal}
                          download={`${hrUser.id}_${key}`}
                          className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & PASSWORD */}
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
                      Recruiter Login Status: {isActive ? 'ACTIVE & ENABLED 🟢' : 'SUSPENDED / BLOCKED 🔴'}
                    </h4>
                    <p className="text-xs opacity-80">
                      {isActive 
                        ? 'HR Recruiter can log in to initiate and audit candidate background verifications.' 
                        : 'Recruiter access is locked. User cannot sign in to the HR workstation.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  disabled={isTogglingStatus}
                  className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isActive ? '⛔ Suspend Access' : '✅ Enable Access'}
                </button>
              </div>

              {/* CHANGE PASSWORD */}
              <form onSubmit={handleUpdatePassword} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <KeyRound className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Reset HR Recruiter Login Password</h4>
                    <p className="text-xs text-slate-500 font-medium">Set a new permanent workstation password for {hrUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">HR Recruiter Email</label>
                    <input
                      type="text"
                      value={hrUser.email}
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
                        placeholder="e.g. Recruiter@2026#"
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
                    <span>📧 Automatically email the new password to {hrUser.email}</span>
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

              {/* ACTIVATION DETAILS */}
              {hrUser.activation_token && (
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Self-Activation Security Details</div>
                    <div className="text-xs font-medium text-slate-700 mt-1">
                      Token: <code className="bg-indigo-100/70 text-indigo-800 px-1.5 py-0.5 rounded font-mono font-bold">{hrUser.activation_token}</code>
                      <span className="mx-2">•</span>
                      4-Digit PIN: <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-black">{hrUser.activation_password || '1234'}</code>
                    </div>
                  </div>

                  <a
                    href={`${window.location.origin}/hr-activation?token=${hrUser.activation_token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-bold bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open HR Activation Link</span>
                  </a>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: DPDP & LEGAL */}
          {activeTab === 'legal' && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">HR Confidentiality & DPDP Act 2023 Audit</h4>
                  <p className="text-xs text-slate-500 font-medium">Digital compliance and data confidentiality acceptance record</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Agreement Version</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">HR-DPDP-v2.4-2026</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Acceptance Status</div>
                  <div className="text-sm font-black text-emerald-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Digitally Signed & Accepted
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Authorized Signatory</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{hrUser.name} ({hrUser.designation || 'HR Recruiter'})</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Timestamp of Acceptance</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                    {hrUser.terms_accepted_at ? new Date(hrUser.terms_accepted_at).toLocaleString('en-IN') : 'Completed during Onboarding'}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
