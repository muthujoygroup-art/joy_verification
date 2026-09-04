import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Users, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  FileText, 
  Award, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileDown, 
  Lock,
  Layers,
  Search,
  Eye,
  KeyRound
} from 'lucide-react';

export const UniversalEntityTrackerModal = ({ 
  entity, 
  entityType = 'candidate', // 'company' | 'hr' | 'candidate'
  onClose,
  onOpenDossier,
  onOpenCertificate,
  onImpersonateRole
}) => {
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  if (!entity) return null;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isCompany = entityType === 'company';
  const isHr = entityType === 'hr';
  const isCandidate = entityType === 'candidate';

  const profileId = entity.uniqueProfileId || entity.code || entity.hrCode || entity.employeeCode || entity.empId || entity.id;

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* TOP HEADER */}
        <div className={`p-5 sm:p-6 text-white flex items-center justify-between gap-4 relative overflow-hidden ${
          isCompany 
            ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900' 
            : isHr 
              ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900' 
              : 'bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900'
        }`}>
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3.5 min-w-0 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shrink-0 shadow-sm">
              {isCompany ? '🏢' : isHr ? '👔' : '👤'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  isCompany 
                    ? 'bg-purple-500/20 text-purple-200 border-purple-400/30' 
                    : isHr 
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' 
                      : 'bg-sky-500/20 text-sky-200 border-sky-400/30'
                }`}>
                  {isCompany ? 'Company Entity' : isHr ? 'HR Executive Entity' : 'Employee / Candidate Entity'}
                </span>
                
                {/* Hierarchical Profile ID Badge */}
                <button
                  onClick={() => handleCopy(profileId, 'profileId')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white font-mono font-black text-xs transition-colors cursor-pointer border border-white/30 shadow-2xs"
                  title="Click to copy unique profile ID"
                >
                  <span>🆔 {profileId}</span>
                  {copiedField === 'profileId' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-slate-300" />}
                </button>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight truncate mt-1">
                {entity.name || entity.companyName || 'Entity Record'}
              </h3>
              <p className="text-xs text-slate-300 font-medium truncate">
                {isCompany ? entity.email : isHr ? `${entity.dept || 'HR'} • ${entity.companyName || entity.companyCode}` : `${entity.designation || 'Associate'} • ${entity.companyName || entity.companyCode}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
          
          {/* HIERARCHY TRACE BREADCRUMB */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2 text-xs flex-wrap">
            <span className="text-[10px] font-black uppercase text-slate-400">Hierarchy Trace:</span>
            <span className="font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
              🏢 {entity.companyCode || entity.code || 'COMP001'}
            </span>
            {(isHr || isCandidate) && (
              <>
                <span className="text-slate-400 font-bold">➔</span>
                <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  👔 {entity.hrCode || entity.hrId || `${entity.companyCode || 'COMP001'}HR001`}
                </span>
              </>
            )}
            {isCandidate && (
              <>
                <span className="text-slate-400 font-bold">➔</span>
                <span className="font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
                  👤 {profileId}
                </span>
              </>
            )}
          </div>

          {/* =================================================================== */}
          {/* 1. COMPANY 360° VIEW */}
          {/* =================================================================== */}
          {isCompany && (
            <div className="space-y-5">
              {/* Stat Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
                  <span className="text-[10px] text-purple-700 font-black uppercase block">Company Code</span>
                  <strong className="text-sm font-mono font-black text-purple-950">{entity.code || profileId}</strong>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] text-emerald-700 font-black uppercase block">Subscription Plan</span>
                  <strong className="text-sm font-black text-emerald-950">{entity.plan || 'Enterprise Premier'}</strong>
                </div>
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl">
                  <span className="text-[10px] text-sky-700 font-black uppercase block">Price / Verif</span>
                  <strong className="text-sm font-mono font-black text-sky-950">₹{entity.price_per_verification || entity.pricePerVerification || 120}</strong>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <span className="text-[10px] text-amber-700 font-black uppercase block">Total Quota</span>
                  <strong className="text-sm font-mono font-black text-amber-950">{entity.max_limit || entity.maxLimit || 500} Users</strong>
                </div>
              </div>

              {/* Detailed Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div><span className="text-slate-400 block text-[10px]">Contact Person:</span><strong className="text-slate-900 font-bold">{entity.contact_person || entity.contactPerson || 'HR Director'}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Official Email:</span><strong className="text-slate-900 font-mono">{entity.email}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Account Status:</span><span className="badge badge-emerald font-bold">{entity.status || 'Active'}</span></div>
                <div><span className="text-slate-400 block text-[10px]">GSTIN / Tax ID:</span><strong className="font-mono text-slate-800">{entity.gstin || '29AABCU9603R1ZM'}</strong></div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                {onImpersonateRole && (
                  <button
                    onClick={() => onImpersonateRole('company', entity)}
                    className="btn btn-company text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Launch Company Admin Workstation 🚀</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* 2. HR EXECUTIVE 360° VIEW */}
          {/* =================================================================== */}
          {isHr && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] text-emerald-700 font-black uppercase block">HR Profile ID</span>
                  <strong className="text-sm font-mono font-black text-emerald-950">{profileId}</strong>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
                  <span className="text-[10px] text-purple-700 font-black uppercase block">Parent Company</span>
                  <strong className="text-sm font-black text-purple-950">{entity.companyCode || 'COMP001'}</strong>
                </div>
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl">
                  <span className="text-[10px] text-sky-700 font-black uppercase block">Active Links Dispatched</span>
                  <strong className="text-sm font-mono font-black text-sky-950">{entity.activeLinks || 1} Links</strong>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <span className="text-[10px] text-amber-700 font-black uppercase block">Department</span>
                  <strong className="text-xs font-bold text-amber-950 truncate block">{entity.dept || 'HR Talent'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div><span className="text-slate-400 block text-[10px]">HR Full Name:</span><strong className="text-slate-900 font-bold">{entity.name}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Official Email:</span><strong className="text-slate-900 font-mono">{entity.email}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Contact Mobile:</span><strong className="text-slate-900 font-mono">{entity.phone || '+91 98765 43210'}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Authorization Role:</span><span className="badge badge-emerald font-bold">HR Executive Authorized</span></div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                {onImpersonateRole && (
                  <button
                    onClick={() => onImpersonateRole('hrexecutive', entity)}
                    className="btn btn-hrexecutive text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Launch HR Executive Workstation 🚀</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* 3. EMPLOYEE / CANDIDATE 360° VIEW */}
          {/* =================================================================== */}
          {isCandidate && (
            <div className="space-y-5">
              {/* Stat Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl">
                  <span className="text-[10px] text-sky-700 font-black uppercase block">Employee Unique ID</span>
                  <strong className="text-sm font-mono font-black text-sky-950">{profileId}</strong>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
                  <span className="text-[10px] text-purple-700 font-black uppercase block">Parent Company</span>
                  <strong className="text-sm font-black text-purple-950">{entity.companyCode || 'COMP001'}</strong>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] text-emerald-700 font-black uppercase block">Verification Status</span>
                  <span className="badge badge-emerald font-black text-[10px] mt-0.5">{entity.status || 'Verified ✓'}</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl">
                  <span className="text-[10px] text-indigo-700 font-black uppercase block">Verification Token</span>
                  <strong className="text-xs font-mono font-black text-indigo-950 truncate block">{entity.token}</strong>
                </div>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div><span className="text-slate-400 block text-[10px]">Full Name:</span><strong className="text-slate-900 font-bold">{entity.name}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Designation:</span><strong className="text-slate-900">{entity.designation || 'Specialist'}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Department:</span><strong className="text-slate-900">{entity.dept || 'Engineering'}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Mobile:</span><strong className="text-slate-900 font-mono">{entity.mobile}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Aadhaar No:</span><strong className="font-mono text-slate-800">{entity.aadhaarNo || '5489 1234 9876'}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">PAN No:</span><strong className="font-mono text-slate-800">{entity.panNo || 'ABCDE1234F'}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Passcode (PIN):</span><strong className="font-mono text-emerald-700 font-bold">{entity.portalPassword || '1234'}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Sector:</span><span className="badge badge-indigo text-[9px] uppercase font-bold">{entity.employee_type || entity.employeeCategory || 'IT & Tech'}</span></div>
              </div>

              {/* 10-Feature Verification Results */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>10-Point Verification Engine Results</span>
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                  {[
                    { label: '1. Aadhaar UIDAI', key: 'aadhaar', ok: entity.verificationsCompleted?.aadhaar },
                    { label: '2. Mobile OTP', key: 'mobile', ok: entity.verificationsCompleted?.mobile },
                    { label: '3. Face Liveness', key: 'face', ok: entity.verificationsCompleted?.face },
                    { label: '4. PAN NSDL', key: 'pan', ok: entity.verificationsCompleted?.pan },
                    { label: '5. Bank IMPS', key: 'bank', ok: entity.verificationsCompleted?.bankCheck },
                    { label: '6. EPFO UAN', key: 'uan', ok: entity.verificationsCompleted?.uan },
                    { label: '7. Education Cert', key: 'education', ok: entity.verificationsCompleted?.education },
                    { label: '8. Criminal BGV', key: 'criminal', ok: entity.verificationsCompleted?.criminalCheck },
                    { label: '9. Address Physical', key: 'address', ok: entity.verificationsCompleted?.addressCheck },
                    { label: '10. Driving License', key: 'dl', ok: entity.verificationsCompleted?.drivingLicense }
                  ].map((v) => (
                    <div key={v.key} className={`p-2 rounded-xl border flex items-center justify-between gap-1.5 ${
                      v.ok ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <span className="truncate">{v.label}</span>
                      <span className={`text-[10px] ${v.ok ? 'text-emerald-700' : 'text-slate-400'}`}>{v.ok ? '✓' : '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action Document Triggers */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200">
                {onOpenDossier && (
                  <button
                    onClick={() => onOpenDossier(entity)}
                    className="btn btn-superadmin text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-300" />
                    <span>View Profile PDF Dossier 📄</span>
                  </button>
                )}

                {onOpenCertificate && (
                  <button
                    onClick={() => onOpenCertificate(entity)}
                    className="btn btn-company text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>View Official Certificate 🏆</span>
                  </button>
                )}

                <a
                  href={`/verify?token=${entity.token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary text-xs py-2 px-4 font-bold flex items-center gap-1.5 text-sky-800 bg-sky-50 border-sky-200 hover:bg-sky-100"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Candidate Portal Link 📲</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono text-[11px]">
            🔒 Cryptographically Bound to JOY Enterprise Master Directory
          </span>
          <button
            onClick={onClose}
            className="btn btn-secondary text-xs py-1.5 px-4 font-bold cursor-pointer"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
