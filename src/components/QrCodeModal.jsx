import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
  Lock,
  Sparkles,
  Info,
  KeyRound
} from 'lucide-react';

export const QrCodeModal = ({ candidate, onClose, onCopyLink, isCopied }) => {
  const { companies, showToast } = useApp();
  const [copiedInternal, setCopiedInternal] = useState(false);

  if (!candidate) return null;

  const company = companies.find(c => c.id === candidate.companyId) || companies[0];
  const verifyUrl = `${window.location.origin}/verify?token=${candidate.token}`;

  const handleCopy = () => {
    if (onCopyLink) {
      onCopyLink(candidate.token);
    } else {
      navigator.clipboard.writeText(verifyUrl);
    }
    setCopiedInternal(true);
    if (showToast) showToast('📋 Employee verification link copied to clipboard!');
    setTimeout(() => setCopiedInternal(false), 2500);
  };

  const handleOpenDirectly = () => {
    window.open(verifyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleGatewayDisabledClick = (channelName) => {
    if (showToast) {
      showToast(`ℹ️ ${channelName} dispatch is paused for testing. Use Direct Link or QR Code to open candidate portal!`);
    } else {
      alert(`${channelName} dispatch is paused for testing. Use Direct Link or QR Code.`);
    }
  };

  const copiedState = isCopied || copiedInternal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 space-y-5 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-3xl animate-scaleUp relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Employee Verification Link & QR</h3>
              <p className="text-xs text-slate-500 font-medium">Instant scannable QR Code & direct token link</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Candidate Info Card */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>{candidate.name}</span>
              <span className="badge badge-emerald text-[9px] py-0.5 px-1.5 font-bold">READY TO VERIFY</span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-0.5">
              {candidate.designation || 'Candidate'} • <span className="font-mono text-emerald-800 font-bold">#{candidate.empId}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-indigo-900 block uppercase">Unlock Passcode</span>
            <span className="text-xs font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-300 shadow-2xs inline-block">
              {candidate.portalPassword || candidate.securityPin || '1234'}
            </span>
          </div>
        </div>

        {/* 📱 Real Scannable High-Resolution QR Code */}
        <div className="text-center space-y-2 py-1">
          <div className="w-52 h-52 mx-auto bg-white p-3.5 border-2 border-emerald-400/80 rounded-3xl shadow-lg flex flex-col items-center justify-center relative hover:scale-102 transition-transform">
            <QRCodeSVG 
              value={verifyUrl}
              size={180}
              level="H"
              includeMargin={false}
              className="rounded-lg"
            />
            <div className="absolute -bottom-2.5 bg-emerald-700 text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md border border-emerald-400">
              Live Scannable QR
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-bold pt-2">
            Scan with smartphone camera to open candidate portal
          </p>
        </div>

        {/* 🚀 Primary Action Buttons (Direct Open & 1-Click Copy) */}
        <div className="space-y-2.5">
          
          {/* Action 1: Open Employee Portal Directly */}
          <button
            type="button"
            onClick={handleOpenDirectly}
            className="w-full btn bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 flex items-center justify-center gap-2 rounded-2xl shadow-md transition-all cursor-pointer btn-interactive text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Employee Portal Now 🚀</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Action 2: Copy Link + Passcode */}
            <button
              type="button"
              onClick={() => {
                const fullText = `Employee Verification Portal for ${candidate.name}:\nLink: ${verifyUrl}\nSecurity Unlock Passcode: ${candidate.portalPassword || '1234'}\n(Session valid for 15 minutes once unlocked)`;
                navigator.clipboard.writeText(fullText);
                setCopiedInternal(true);
                if (showToast) showToast('📋 Link + Passcode copied to clipboard!');
                setTimeout(() => setCopiedInternal(false), 2500);
              }}
              className="btn btn-secondary py-2.5 px-3 flex items-center justify-center gap-1.5 font-black text-xs rounded-xl border border-indigo-200 text-indigo-900 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer btn-interactive"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-600" />
              <span>Copy Link + Passcode 📋</span>
            </button>

            {/* Action 3: Copy Passcode Only */}
            <button
              type="button"
              onClick={() => {
                const pin = candidate.portalPassword || '1234';
                navigator.clipboard.writeText(pin);
                if (showToast) showToast(`🔑 Passcode (${pin}) copied to clipboard!`);
              }}
              className="btn btn-secondary py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold text-xs rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Passcode ({candidate.portalPassword || '1234'})</span>
            </button>
          </div>
        </div>

        {/* 💬 Gateway Channels (Disabled for Now / Coming in Next Phase) */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Gateway Dispatches (Next Phase)
            </span>
            <span className="badge bg-slate-100 text-slate-600 text-[9px] font-semibold border border-slate-200">
              Configurable Later
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleGatewayDisabledClick('WhatsApp')}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 flex flex-col items-center justify-center gap-1 font-bold text-[10px] transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>WhatsApp 💬</span>
            </button>

            <button
              type="button"
              onClick={() => handleGatewayDisabledClick('Carrier SMS')}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 flex flex-col items-center justify-center gap-1 font-bold text-[10px] transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-slate-400" />
              <span>SMS 📱</span>
            </button>

            <button
              type="button"
              onClick={() => handleGatewayDisabledClick('Official Email')}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 flex flex-col items-center justify-center gap-1 font-bold text-[10px] transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email 📧</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QrCodeModal;
