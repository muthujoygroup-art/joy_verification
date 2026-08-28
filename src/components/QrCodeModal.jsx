import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  QrCode, 
  MessageSquare, 
  Send, 
  Mail, 
  Copy, 
  Check, 
  X, 
  ExternalLink,
  Smartphone,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const QrCodeModal = ({ candidate, onClose, onCopyLink, isCopied }) => {
  const { companies } = useApp();
  if (!candidate) return null;

  const company = companies.find(c => c.id === candidate.companyId) || companies[0];
  
  // Hierarchical Permission Checks (Super Admin features & Company Admin HR permissions)
  const isWhatsAppEnabled = (company.features?.whatsappGateway !== false) && (company.hrPermissions?.allowWhatsAppDispatch !== false);
  const isEmailEnabled = (company.features?.emailGateway !== false) && (company.hrPermissions?.allowEmailDispatch !== false);
  const isSmsEnabled = (company.features?.smsGateway !== false) && (company.hrPermissions?.allowSmsDispatch !== false);

  const verifyUrl = `${window.location.origin}/verify?token=${candidate.token}`;
  
  // WhatsApp Share URL generator
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Hello ${candidate.name}, please complete your employee identity verification for ${company.name} here: ${verifyUrl}`
  )}`;

  // Email Mailto URL generator
  const emailUrl = `mailto:${candidate.email}?subject=${encodeURIComponent(
    `Employee Verification Link - ${candidate.name}`
  )}&body=${encodeURIComponent(
    `Dear ${candidate.name},\n\nPlease click the link below to complete your secure identity verification:\n${verifyUrl}\n\nThank you,\n${company.name} HR Team`
  )}`;

  // Simulated SMS Trigger
  const handleSmsTrigger = () => {
    if (!isSmsEnabled) return;
    alert(`SMS message containing magic verification link dispatched to ${candidate.mobile}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 space-y-5 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Multi-Channel Link Dispatcher</h3>
              <p className="text-xs text-slate-500 font-medium">Send onboarding link via WhatsApp, SMS, Email, or QR Code</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        {/* Candidate Info Pill */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900">
          <div>
            <div className="text-sm font-extrabold text-slate-900">{candidate.name}</div>
            <div className="text-[11px] text-slate-500 font-medium">{candidate.designation} • #{candidate.empId}</div>
          </div>
          <span className="badge badge-emerald text-[10px]">Active Token</span>
        </div>

        {/* QR Code Container */}
        <div className="text-center space-y-2 py-2">
          <div className="w-48 h-48 mx-auto bg-white p-3 border-2 border-dashed border-emerald-400 rounded-2xl shadow-inner flex flex-col items-center justify-center relative">
            <QrCode className="w-36 h-36 text-slate-900" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-white px-2 py-0.5 rounded text-[10px] font-black text-emerald-700 border border-emerald-300 shadow-sm">
                SCAN TO VERIFY
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">Scan QR Code with smartphone camera to open candidate portal</p>
        </div>

        {/* Multi-Channel Action Buttons */}
        <div className="space-y-2 text-xs">
          
          {/* Channel 1: WhatsApp Direct Share */}
          {isWhatsAppEnabled ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 flex items-center justify-center gap-2 rounded-xl shadow-sm transition-all btn-interactive"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Onboarding Link via WhatsApp 💬</span>
            </a>
          ) : (
            <div className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-center font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>WhatsApp Dispatch Disabled by Policy 📴</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {/* Channel 2: Automated SMS Router */}
            {isSmsEnabled ? (
              <button
                type="button"
                onClick={handleSmsTrigger}
                className="btn btn-company py-2.5 flex items-center justify-center gap-1.5 font-bold text-xs btn-interactive cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SMS Dispatch 📱</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center gap-1 font-bold text-xs cursor-not-allowed"
                title="SMS Gateway Disabled by Admin"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>SMS Disabled</span>
              </button>
            )}

            {/* Channel 3: Email Dispatch */}
            {isEmailEnabled ? (
              <a
                href={emailUrl}
                className="btn btn-superadmin py-2.5 flex items-center justify-center gap-1.5 font-bold text-xs btn-interactive"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Link 📧</span>
              </a>
            ) : (
              <div
                className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center gap-1 font-bold text-xs cursor-not-allowed"
                title="Email Gateway Disabled by Admin"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Email Disabled</span>
              </div>
            )}
          </div>

          {/* Channel 4: Copy Direct Link */}
          <button
            onClick={() => onCopyLink(candidate.token)}
            className="w-full btn btn-secondary py-2.5 flex items-center justify-center gap-2 font-bold text-xs text-slate-800"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{isCopied ? 'Link Copied to Clipboard!' : 'Copy Direct Token Link 📋'}</span>
          </button>

        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button onClick={onClose} className="btn btn-secondary text-xs font-bold">Close Window</button>
        </div>

      </div>
    </div>
  );
};
