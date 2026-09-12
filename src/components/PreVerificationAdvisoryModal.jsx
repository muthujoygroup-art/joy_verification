import React from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldCheck, 
  Wifi, 
  Smartphone, 
  Camera, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  X 
} from 'lucide-react';

export const PreVerificationAdvisoryModal = ({ isOpen, onClose, candidateName, companyName, companyLogo }) => {
  if (!isOpen) return null;

  return createPortal((
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white border-2 border-indigo-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 animate-modal-spring relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="w-12 h-12 object-contain rounded-xl border p-1 bg-white" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
                {(companyName || 'C').charAt(0)}
              </div>
            )}
            <div>
              <span className="badge badge-emerald font-black text-[9.5px] uppercase tracking-wider">Onboarding Advisory</span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                Before You Begin Verification
              </h3>
              <p className="text-xs text-slate-500 font-medium">Welcome {candidateName || 'Candidate'}! ({companyName || 'JOY CORPORATE'})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close Guidelines"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Essential Guidelines List */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Please verify the following 4 items before starting:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. Internet */}
            <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-200 space-y-1">
              <div className="flex items-center gap-2 text-sky-950 font-bold text-xs">
                <Wifi className="w-4 h-4 text-sky-600 shrink-0" />
                <span>1. Stable Internet</span>
              </div>
              <p className="text-[11px] text-sky-900/80 font-medium leading-relaxed">
                Ensure strong 4G/5G mobile data or Wi-Fi for fast e-KYC validation.
              </p>
            </div>

            {/* 2. Mobile Phone */}
            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-1">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>2. Aadhaar Phone Nearby</span>
              </div>
              <p className="text-[11px] text-amber-900/80 font-medium leading-relaxed">
                Keep your Aadhaar-registered mobile phone handy for UIDAI OTP code.
              </p>
            </div>

            {/* 3. Camera */}
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>3. Camera Allowed</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 font-medium leading-relaxed">
                Allow browser camera permission when prompted for live 3D photo match.
              </p>
            </div>

            {/* 4. Bank & Tax */}
            <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 space-y-1">
              <div className="flex items-center gap-2 text-purple-950 font-bold text-xs">
                <CreditCard className="w-4 h-4 text-purple-600 shrink-0" />
                <span>4. PAN & Bank Details</span>
              </div>
              <p className="text-[11px] text-purple-900/80 font-medium leading-relaxed">
                Keep your Income Tax PAN number and Bank Account/IFSC details ready.
              </p>
            </div>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center gap-2.5 text-slate-600">
          <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
          <p className="text-[11px] font-medium leading-tight">
            Active session timer: <strong className="text-slate-900 font-bold">15 Minutes</strong> • Data encrypted under DPDP Act 2023.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>I Understand — Proceed to Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  ), document.body);
};
