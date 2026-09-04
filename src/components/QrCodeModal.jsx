import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
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
  RefreshCw,
  UserCheck,
  Building2,
  Share2
} from 'lucide-react';

export const QrCodeModal = ({ 
  candidate, 
  onClose, 
  onCopyLink, 
  isCopied, 
  activeHr, 
  hrPreferences 
}) => {
  const { companies, showToast, updateCandidatePassword } = useApp();
  const [copiedInternal, setCopiedInternal] = useState(false);
  const [passcodeText, setPasscodeText] = useState('1234');
  const [isPasscodeSaved, setIsPasscodeSaved] = useState(false);
  
  // Email dispatching states
  const [targetEmail, setTargetEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState('');

  useEffect(() => {
    if (candidate) {
      setPasscodeText(candidate.portalPassword || candidate.securityPin || '1234');
      setTargetEmail(candidate.email || '');
    }
  }, [candidate]);

  if (!candidate) return null;

  const company = companies.find(c => c.id === candidate.companyId) || companies[0] || { name: 'JOY Corporate Solutions' };
  const activePin = (passcodeText || candidate.portalPassword || '1234').toString().trim();
  const verifyUrl = `${window.location.origin}/verify?token=${candidate.token}`;
  const isLinkCopied = Boolean(isCopied || copiedInternal);

  const hrSenderName = hrPreferences?.sender_display_name || activeHr?.name || 'HR Recruiter';
  const hrSenderEmail = hrPreferences?.sender_email || hrPreferences?.smtp_user || activeHr?.email || 'hr@joycorporatesolutions.com';

  // Copy ONLY the pure, clean verification link
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

  // 📧 Send Real Onboarding Invitation Email from HR Mail to Employee Email
  const handleSendEmailInvite = async () => {
    const destEmail = targetEmail.trim() || candidate.email;
    if (!destEmail || !destEmail.includes('@')) {
      if (showToast) showToast('⚠️ Please enter a valid employee email address.');
      return;
    }

    setIsSendingEmail(true);
    setEmailSentSuccess(false);
    try {
      const clean = (passcodeText || '1234').trim();
      if (updateCandidatePassword) {
        await updateCandidatePassword(candidate.token, clean);
      }
      candidate.portalPassword = clean;
      candidate.email = destEmail;

      const payload = {
        candidate_id: candidate.id || candidate.token,
        token: candidate.token,
        candidate_email: destEmail,
        candidate_name: candidate.name,
        candidate_code: candidate.empId || candidate.employeeNumber || candidate.emp_id || 'JOY-EMP-001',
        security_pin: clean,
        company_id: candidate.companyId || (company && company.id),
        company_name: company?.name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
        designation: candidate.designation || 'Associate',
        hr_id: activeHr?.id,
        hr_email: hrSenderEmail,
        hr_name: hrSenderName,
        custom_smtp: hrPreferences?.smtp_user && hrPreferences?.smtp_pass ? {
          host: hrPreferences.smtp_host,
          port: hrPreferences.smtp_port,
          user: hrPreferences.smtp_user,
          password: hrPreferences.smtp_pass,
          from_email: hrPreferences.sender_email || hrSenderEmail,
          from_name: hrPreferences.sender_display_name || hrSenderName
        } : null
      };

      const res = await api.dispatchCandidateEmail(payload);
      if (res && res.success) {
        setEmailSentSuccess(true);
        setEmailSuccessMsg(`Email delivered to ${destEmail} (PIN: ${clean})!`);
        if (showToast) showToast(`📧 Onboarding Link & PIN (${clean}) sent to ${destEmail}!`);
        setTimeout(() => setEmailSentSuccess(false), 6000);
      } else {
        throw new Error(res?.error || 'Email delivery failed');
      }
    } catch (err) {
      console.warn('Email dispatch notice:', err);
      setEmailSentSuccess(false);
      if (showToast) showToast(`❌ Email failed: ${err.message || 'SMTP delivery issue'}`, 'error');
    } finally {
      setIsSendingEmail(false);
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

  const handleShareWhatsApp = () => {
    const cleanPin = (passcodeText || '1234').trim();
    const phone = (candidate.mobile || '').replace(/[^0-9]/g, '');
    const message = `Hello ${candidate.name},\n\nPlease complete your official digital onboarding verification for ${company.name} using the link below:\n\n🔗 Link: ${verifyUrl}\n🔐 Security PIN: ${cleanPin}\n\nIssued by: ${hrSenderName} (${company.name})`;
    const waUrl = `https://api.whatsapp.com/send?${phone ? `phone=${phone}&` : ''}text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleOpenMailClient = () => {
    const cleanPin = (passcodeText || '1234').trim();
    const destEmail = targetEmail.trim() || candidate.email;
    const subject = encodeURIComponent(`Official Onboarding Verification - ${company.name} (${candidate.name})`);
    const body = encodeURIComponent(
      `Dear ${candidate.name},\n\nCongratulations on your role as ${candidate.designation || 'Associate'} at ${company.name}!\n\nPlease complete your digital identity onboarding verification and statutory disclosures using the secure link below:\n\n🔗 Verification Link: ${verifyUrl}\n🔐 Access PIN: ${cleanPin}\n\nIssued by: ${hrSenderName} (${company.name})\nContact: ${hrSenderEmail}\n\nBest regards,\n${hrSenderName}\nHuman Resources Team\n${company.name}`
    );
    window.location.href = `mailto:${destEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-lg border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl sm:rounded-3xl relative max-h-[92vh] flex flex-col my-auto animate-modal-spring overflow-hidden">
        
        {/* Sticky Fixed Header - NEVER scrolls away */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 shrink-0 bg-white/95 backdrop-blur-sm z-10 sticky top-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Onboarding Link & QR Dispatch</h3>
              <p className="text-xs text-slate-500 font-medium">Send onboarding link from HR email to candidate</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center text-slate-500 font-black text-sm transition-all cursor-pointer"
            title="Close Modal (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Candidate Info Card */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-50/60 via-slate-50 to-emerald-50/50 border border-indigo-200/80 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>{candidate.name}</span>
                <span className="badge badge-emerald text-[9px] py-0.5 px-1.5 font-bold">READY TO ONBOARD</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                {candidate.designation || 'New Hire'} • <span className="font-mono text-indigo-800 font-bold">#{candidate.empId || candidate.employeeNumber || 'COMP001'}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-bold text-slate-700 shadow-2xs">
              {company.name}
            </span>
          </div>

          {/* 📧 SECTION 1: HR SENDER TO EMPLOYEE RECIPIENT EMAIL DISPATCH BOX */}
          <div className="p-4 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border-2 border-indigo-300/80 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Send Link to Employee Mail (From HR)</span>
              </label>
              <span className="badge badge-indigo text-[9px] font-bold">Official SMTP</span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Sender HR Details */}
              <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">From (HR):</span>
                  <span className="font-bold text-slate-900">{hrSenderName}</span>
                  <span className="text-[11px] font-mono text-indigo-700 font-semibold">&lt;{hrSenderEmail}&gt;</span>
                </div>
              </div>

              {/* Recipient Employee Email Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">To Employee Email:</span>
                  {!targetEmail && <span className="text-[10px] text-rose-600 font-bold">Enter candidate email</span>}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input 
                    type="email"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="e.g. employee@gmail.com"
                    className="flex-1 bg-white border-2 border-indigo-200 focus:border-indigo-600 text-slate-900 text-xs py-2 px-3 rounded-xl outline-none font-medium"
                  />
                  
                  <button
                    type="button"
                    onClick={handleSendEmailInvite}
                    disabled={isSendingEmail}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    {isSendingEmail ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : emailSentSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Sent ✓</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Mail 📧</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Fallback & Email Status Details */}
              {emailSuccessMsg && (
                <div className={`p-2.5 rounded-xl text-[11px] font-bold flex items-center justify-between gap-1.5 animate-fadeIn ${
                  emailSentSuccess ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' : 'bg-amber-50 border border-amber-300 text-amber-900'
                }`}>
                  <div className="flex items-center gap-1.5">
                    {emailSentSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    <span>{emailSuccessMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenMailClient}
                    className="underline text-indigo-700 hover:text-indigo-900 cursor-pointer text-[10px] shrink-0"
                  >
                    Open Mail App ↗
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 🔐 SECTION 2: PORTAL UNLOCK PASSCODE / SECURITY PIN */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>Portal Unlock PIN (Set by HR)</span>
              </label>
              <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                Required for Candidate Access
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <input 
                type="text" 
                value={passcodeText}
                onChange={(e) => handlePasscodeChange(e.target.value)}
                placeholder="e.g. 1234 or Joy@2026"
                className="flex-1 min-w-0 bg-white border-2 border-slate-300 focus:border-indigo-600 text-indigo-950 font-mono font-bold text-xs sm:text-sm py-2 px-2.5 rounded-xl outline-none"
              />

              <button
                type="button"
                onClick={handleSavePasscode}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isPasscodeSaved ? 'Saved ✓' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateRandomPin}
                className="py-2 px-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-indigo-800 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                title="Generate Random PIN"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>PIN</span>
              </button>
            </div>
          </div>

          {/* 📱 SECTION 3: REAL SCANNABLE QR CODE */}
          <div className="text-center space-y-1.5 py-1">
            <div className="w-40 h-40 mx-auto bg-white p-2.5 border-2 border-emerald-400/80 rounded-2xl shadow-md flex flex-col items-center justify-center relative hover:scale-102 transition-transform">
              <QRCodeSVG 
                value={verifyUrl}
                size={140}
                level="H"
                includeMargin={false}
                className="rounded-lg"
              />
              <div className="absolute -bottom-2 bg-emerald-700 text-white text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full shadow-md border border-emerald-400">
                Live Scannable QR
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold pt-1">
              Candidate scans QR code with mobile camera to open onboarding portal
            </p>
          </div>

          {/* 🚀 PRIMARY ACTIONS */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              {/* Action 1: Open Employee Portal Directly */}
              <button
                type="button"
                onClick={handleOpenDirectly}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-3 flex items-center justify-center gap-1.5 rounded-xl shadow-md transition-all cursor-pointer text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Portal 🚀</span>
              </button>

              {/* Action 2: WhatsApp Share */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 px-3 flex items-center justify-center gap-1.5 rounded-xl shadow-md transition-all cursor-pointer text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp 💬</span>
              </button>
            </div>

            {/* Action 3: Copy Pure Clean Verification Link */}
            <button
              type="button"
              onClick={handleCopyCleanLink}
              className={`w-full btn py-2.5 px-4 flex items-center justify-center gap-2 font-black text-xs rounded-xl border transition-all cursor-pointer ${
                isLinkCopied 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-inner' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-sm'
              }`}
            >
              {isLinkCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Verification Link Copied to Clipboard! ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copy Onboarding Verification Link 📋</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Sticky Fixed Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
          <button
            type="button"
            onClick={handleOpenMailClient}
            className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-slate-600"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open Email Client</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="btn bg-slate-800 hover:bg-slate-900 text-white text-xs py-1.5 px-5 font-bold rounded-xl shadow-xs"
          >
            Done / Close ✕
          </button>
        </div>

      </div>
    </div>
  );
};

export default QrCodeModal;
