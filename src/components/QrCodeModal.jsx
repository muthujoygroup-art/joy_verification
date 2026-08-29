import React, { useState, useEffect } from 'react';
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
  KeyRound,
  Save,
  RefreshCw
} from 'lucide-react';

export const QrCodeModal = ({ candidate, onClose, onCopyLink, isCopied }) => {
  const { companies, showToast, updateCandidatePassword } = useApp();
  const [copiedInternal, setCopiedInternal] = useState(false);
  const [passcodeText, setPasscodeText] = useState('1234');
  const [isPasscodeSaved, setIsPasscodeSaved] = useState(false);

  useEffect(() => {
    if (candidate) {
      setPasscodeText(candidate.portalPassword || candidate.securityPin || '1234');
    }
  }, [candidate]);

  if (!candidate) return null;

  const company = companies.find(c => c.id === candidate.companyId) || companies[0];
  const activePin = (passcodeText || candidate.portalPassword || '1234').toString().trim();
  const encodedPin = btoa(encodeURIComponent(activePin));
  const verifyUrl = `${window.location.origin}/verify?token=${candidate.token}&p=${encodedPin}`;

  // Copy ONLY the pure, clean verification link (with encoded security token)
  const handleCopyCleanLink = async () => {
    const clean = (passcodeText || '1234').trim();
    if (updateCandidatePassword) {
      await updateCandidatePassword(candidate.token, clean);
    }
    candidate.portalPassword = clean;
    navigator.clipboard.writeText(verifyUrl);
    setCopiedInternal(true);
    if (showToast) showToast('📋 Direct verification link copied to clipboard!');
    setTimeout(() => setCopiedInternal(false), 2500);
  };

  // Open the portal directly in a new tab
  const handleOpenDirectly = async () => {
    const clean = (passcodeText || '1234').trim();
    if (updateCandidatePassword) {
      await updateCandidatePassword(candidate.token, clean);
    }
    candidate.portalPassword = clean;
    window.open(verifyUrl, '_blank', 'noopener,noreferrer');
  };

  // Save / Update HR configured passcode on the spot
  const handleSavePasscode = async (e) => {
    if (e) e.preventDefault();
    const clean = passcodeText.trim() || '1234';
    candidate.portalPassword = clean;
    if (updateCandidatePassword) {
      await updateCandidatePassword(candidate.token, clean);
    }
    setIsPasscodeSaved(true);
    if (showToast) showToast(`🔐 Passcode set to "${clean}" for ${candidate.name}!`);
    setTimeout(() => setIsPasscodeSaved(false), 2000);
  };

  const handlePasscodeChange = (newVal) => {
    setPasscodeText(newVal);
    const clean = newVal.trim();
    if (clean) {
      candidate.portalPassword = clean;
      if (updateCandidatePassword) {
        updateCandidatePassword(candidate.token, clean);
      }
    }
  };

  const handleGenerateRandomPin = async () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPasscodeText(randomPin);
    candidate.portalPassword = randomPin;
    if (updateCandidatePassword) {
      await updateCandidatePassword(candidate.token, randomPin);
    }
    if (showToast) showToast(`🎲 Generated & saved random PIN: ${randomPin}`);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start sm:items-center animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-4 sm:p-6 space-y-4 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-3xl animate-modal-spring relative max-h-[92vh] overflow-y-auto my-2 sm:my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Employee Verification Link & QR</h3>
              <p className="text-xs text-slate-500 font-medium">Configure unlock passcode & share onboarding access</p>
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
        <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>{candidate.name}</span>
              <span className="badge badge-emerald text-[9px] py-0.5 px-1.5 font-bold">ACTIVE</span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-0.5">
              {candidate.designation || 'Candidate'} • <span className="font-mono text-emerald-800 font-bold">#{candidate.empId}</span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-white px-2 py-1 rounded-lg border border-emerald-200 font-bold text-emerald-800">
            {company.name}
          </span>
        </div>

        {/* 🔐 Interactive HR Passcode Typing & Setting Box */}
        <div className="p-3.5 bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>Set Portal Unlock Password / PIN</span>
            </label>
            <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
              Required by Candidate
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <input 
              type="text" 
              value={passcodeText}
              onChange={(e) => handlePasscodeChange(e.target.value)}
              placeholder="e.g. 1234 or Joy@2026"
              className="flex-1 min-w-0 bg-white border-2 border-indigo-300 focus:border-indigo-600 text-indigo-950 font-mono font-bold text-xs sm:text-sm py-2 px-2.5 rounded-xl outline-none"
            />

            <button
              type="button"
              onClick={handleSavePasscode}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
              title="Save Passcode"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isPasscodeSaved ? 'Saved ✓' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateRandomPin}
              className="py-2 px-2 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-800 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              title="Generate Random PIN"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>PIN</span>
            </button>
          </div>

          <p className="text-[10px] text-indigo-800/80 font-medium">
            Type any passcode above and click <strong>Save</strong>. The candidate will enter this exact passcode to unlock their verification session.
          </p>
        </div>

        {/* 📱 Real Scannable High-Resolution QR Code */}
        <div className="text-center space-y-2 py-1">
          <div className="w-48 h-48 mx-auto bg-white p-3 border-2 border-emerald-400/80 rounded-3xl shadow-md flex flex-col items-center justify-center relative hover:scale-102 transition-transform">
            <QRCodeSVG 
              value={verifyUrl}
              size={160}
              level="H"
              includeMargin={false}
              className="rounded-lg"
            />
            <div className="absolute -bottom-2.5 bg-emerald-700 text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md border border-emerald-400">
              Live Scannable QR
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-bold pt-1">
            Scan with smartphone camera to open candidate portal
          </p>
        </div>

        {/* 🚀 Primary Action Buttons (Direct Open & Clean Copy Link) */}
        <div className="space-y-2">
          
          {/* Action 1: Open Employee Portal Directly */}
          <button
            type="button"
            onClick={handleOpenDirectly}
            className="w-full btn bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 flex items-center justify-center gap-2 rounded-2xl shadow-md transition-all cursor-pointer btn-interactive text-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Employee Portal Now 🚀</span>
          </button>

          {/* Action 2: Copy Pure Clean Verification Link (Without Password in Link) */}
          <button
            type="button"
            onClick={handleCopyCleanLink}
            className={`w-full btn py-2.5 px-4 flex items-center justify-center gap-2 font-black text-xs rounded-2xl border transition-all cursor-pointer btn-interactive ${
              copiedState 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-inner' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            {copiedState ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Link Copied to Clipboard! ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Copy Direct Verification Link 📋</span>
              </>
            )}
          </button>
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
