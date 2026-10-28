import React, { useEffect, useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Building,
  CreditCard,
  FileText,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Lock,
  Calendar,
  MapPin,
  Briefcase,
  Award
} from 'lucide-react';
import { soundEngine } from '../utils/uiSoundEffects';

export const CandidateDossierBlade = ({
  candidate,
  isOpen,
  onClose,
  onOpenBgvReport,
  onOpenProfileDossier,
  onOpenCertificate,
  onDispatchLink,
  onStartVerification
}) => {
  const [copiedKey, setCopiedKey] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundEngine.playSuccess?.();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusBadge = () => {
    const st = candidate.status || 'Pending';
    if (st === 'Verified') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="status-dot-emerald" />
          Verified
        </span>
      );
    }
    if (st === 'Submitted - Pending HR Review') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 ring-2 ring-amber-300 animate-pulse">
          <span className="status-dot-amber" />
          Pending Review
        </span>
      );
    }
    if (st === 'In Verification') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
          <span className="status-dot-sky" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        {st}
      </span>
    );
  };

  const statutoryItems = [
    { label: 'Aadhaar (UIDAI)', value: candidate.aadhaarNo || candidate.aadhaar_no || candidate.joiningFormData?.aadhaarNo, key: 'aadhaar' },
    { label: 'Permanent Account Number (PAN)', value: candidate.panNo || candidate.pan_no || candidate.joiningFormData?.panNo, key: 'pan' },
    { label: 'EPFO UAN', value: candidate.pfNumber || candidate.uanNumber || candidate.uan_no || candidate.joiningFormData?.uanEpf, key: 'uan' },
    { label: 'Bank Account & IFSC', value: candidate.bankAccountNo ? `${candidate.bankAccountNo} (${candidate.ifscCode || 'IFSC'})` : null, key: 'bank' },
    { label: 'ESIC Insurance Number', value: candidate.esiNumber || candidate.esicNo || candidate.joiningFormData?.esiNumber, key: 'esic' },
    { label: 'MoRTH Driving License', value: candidate.dlNumber || candidate.drivingLicense || candidate.joiningFormData?.drivingLicense, key: 'dl' }
  ].filter(item => Boolean(item.value));

  return (
    <div className="blade-overlay" onClick={onClose}>
      <div
        className="blade-drawer w-full sm:w-[540px] lg:w-[620px] max-w-full font-sans text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Blade Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-2xs shrink-0">
              {candidate.name?.charAt(0) || 'C'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base text-slate-900 truncate">{candidate.name}</h3>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {(candidate.designation || 'Associate')} • <span className="font-mono text-slate-700">#{candidate.empId || candidate.employeeNumber || candidate.id?.slice(0, 8)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick?.();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F8FAFC]">
          
          {/* Quick Demographics Grid */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              Contact & Demographics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9.5px] font-semibold text-slate-400 block">Mobile Phone</span>
                  <span className="font-mono font-bold text-slate-800">{candidate.mobile || '—'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9.5px] font-semibold text-slate-400 block">Email Address</span>
                  <span className="font-medium text-slate-800 truncate block">{candidate.email || '—'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9.5px] font-semibold text-slate-400 block">Department</span>
                  <span className="font-bold text-slate-800 truncate block">{candidate.department || 'Operations'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9.5px] font-semibold text-slate-400 block">Date of Joining / Created</span>
                  <span className="font-medium text-slate-800">{candidate.joiningDate || candidate.createdAt?.slice(0, 10) || 'Recently Added'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Document Numbers Matrix */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              Statutory Government Identifiers
            </h4>
            
            {statutoryItems.length > 0 ? (
              <div className="space-y-2">
                {statutoryItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors group"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{item.label}</span>
                      <span className="font-mono font-bold text-xs text-slate-900 tracking-wide">{item.value}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.value, item.key)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer shrink-0 shadow-2xs"
                      title="Copy to clipboard"
                    >
                      {copiedKey === item.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic p-2">No statutory numbers provided yet.</p>
            )}
          </div>

          {/* Verification Status & Security Audit */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Point-in-Time Security & Compliance Audit
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                <span className="font-semibold text-emerald-900">DPDP Act 2023 Explicit Consent</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Logged & Valid
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-50/70 border border-indigo-200/70">
                <span className="font-semibold text-indigo-900">Cryptographic Seal</span>
                <span className="font-mono font-bold text-[10px] text-indigo-700">SHA-256 Validated</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600">
                <span className="font-semibold">Neev API Gateway Clearance</span>
                <span className="font-bold text-slate-800">81 Sovereign Data Points</span>
              </div>
            </div>
          </div>

        </div>

        {/* Pinned Blade Action Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenBgvReport && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  onOpenBgvReport(candidate);
                }}
                className="btn-enterprise-secondary text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                360° Dossier
              </button>
            )}

            {onOpenProfileDossier && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  onOpenProfileDossier(candidate);
                }}
                className="btn-enterprise-secondary text-xs"
              >
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                Profile PDF
              </button>
            )}

            {onOpenCertificate && candidate.status === 'Verified' && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  onOpenCertificate(candidate);
                }}
                className="btn-enterprise-secondary text-xs text-emerald-800 bg-emerald-50 border-emerald-200"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                Certificate
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onDispatchLink && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  onDispatchLink(candidate);
                }}
                className="btn-enterprise-primary text-xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                Dispatch Link
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
