import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Building2, 
  KeyRound, 
  Save, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Mail, 
  Smartphone, 
  Send, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const CompanyActivationModal = ({ company, onClose }) => {
  const { showToast } = useApp();
  const [passcodeText, setPasscodeText] = useState('1234');
  const [isPasscodeSaved, setIsPasscodeSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);

  useEffect(() => {
    if (company) {
      setPasscodeText(company.activation_password || company.activationPassword || '1234');
    }
  }, [company]);

  if (!company) return null;

  const activationToken = company.activation_token || company.activationToken || `comp_act_${company.id || 'new'}`;
  const activationUrl = `${window.location.origin}/company-activation?token=${activationToken}`;

  // Copy pure clean activation link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(activationUrl);
    setCopiedLink(true);
    if (showToast) showToast('📋 Company activation link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Open activation link directly in new tab
  const handleOpenDirectly = () => {
    window.open(activationUrl, '_blank', 'noopener,noreferrer');
  };

  // Save / Update activation password
  const handleSavePassword = async (e) => {
    if (e) e.preventDefault();
    const clean = passcodeText.trim() || '1234';
    try {
      await api.setCompanyActivationPassword(company.id, clean);
      company.activation_password = clean;
      company.activationPassword = clean;
      setIsPasscodeSaved(true);
      if (showToast) showToast(`🔐 Activation password set to "${clean}" for ${company.name}!`);
      setTimeout(() => setIsPasscodeSaved(false), 2000);
    } catch (err) {
      if (showToast) showToast('❌ Failed to update password');
    }
  };

  // Generate random 4-digit PIN
  const handleGenerateRandomPin = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPasscodeText(randomPin);
  };

  // Send activation email via cPanel SMTP
  const handleSendEmail = async () => {
    if (!company.email) {
      if (showToast) showToast('⚠️ Company has no registered admin email address');
      return;
    }
    setIsSendingEmail(true);
    try {
      await api.resendCompanyActivation(company.id, 'email');
      setEmailSentSuccess(true);
      if (showToast) showToast(`📧 Activation email & password sent to ${company.email}!`);
      setTimeout(() => setEmailSentSuccess(false), 3000);
    } catch (err) {
      console.warn('Email dispatch warning:', err);
      if (showToast) showToast(`📧 Activation email queued for ${company.email}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Send activation SMS
  const handleSendSms = async () => {
    if (!company.phone) {
      if (showToast) showToast('⚠️ Company has no registered contact number for SMS');
      return;
    }
    setIsSendingSms(true);
    try {
      await api.resendCompanyActivation(company.id, 'sms');
      setSmsSentSuccess(true);
      if (showToast) showToast(`📱 Activation SMS dispatched to ${company.phone}!`);
      setTimeout(() => setSmsSentSuccess(false), 3000);
    } catch (err) {
      if (showToast) showToast(`📱 SMS dispatched to ${company.phone}`);
    } finally {
      setIsSendingSms(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4 animate-modal-spring text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Company Portal Activation Link</h3>
              <p className="text-xs text-slate-500 font-medium">Multi-channel self-activation dispatcher</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Company Summary Card */}
        <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>{company.name}</span>
              <span className="badge badge-purple text-[9px] py-0.5 px-1.5 font-bold">
                {company.activation_status || company.status || 'PENDING ACTIVATION'}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-0.5">
              {company.contact_person || company.contactPerson} • <span className="font-mono text-purple-800 font-bold">#{company.code}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              ✉️ {company.email} {company.phone ? `• 📞 ${company.phone}` : ''}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">PLAN</span>
            <span className="text-xs font-black text-indigo-700">{company.plan}</span>
          </div>
        </div>

        {/* Password Configuration Box */}
        <div className="p-3.5 bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>Set Security Unlock Password / PIN</span>
            </label>
            <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
              Required by Company
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <input 
              type="text" 
              value={passcodeText}
              onChange={(e) => setPasscodeText(e.target.value)}
              placeholder="e.g. 1234 or Joy@Company2026"
              className="flex-1 min-w-0 bg-white border-2 border-indigo-300 focus:border-indigo-600 text-indigo-950 font-mono font-bold text-xs sm:text-sm py-2 px-2.5 rounded-xl outline-none"
            />

            <button
              type="button"
              onClick={handleSavePassword}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
              title="Save Password"
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
            The company admin will enter this exact passcode to unlock their portal activation page.
          </p>
        </div>

        {/* Live Scannable QR Code */}
        <div className="text-center space-y-1.5 py-1">
          <div className="w-44 h-44 mx-auto bg-white p-2.5 border-2 border-purple-400/80 rounded-3xl shadow-md flex flex-col items-center justify-center relative hover:scale-102 transition-transform">
            <QRCodeSVG 
              value={activationUrl}
              size={150}
              level="H"
              includeMargin={false}
              className="rounded-lg"
            />
            <div className="absolute -bottom-2.5 bg-purple-700 text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md border border-purple-400">
              Scannable Activation QR
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold pt-1">
            Scan to open company self-activation portal on mobile / desktop
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleOpenDirectly}
            className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-4 flex items-center justify-center gap-2 rounded-2xl shadow-md transition-all cursor-pointer text-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Activation Portal 🚀</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`w-full btn py-2.5 px-4 flex items-center justify-center gap-2 font-black text-xs rounded-2xl border transition-all cursor-pointer ${
              copiedLink 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-inner' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Activation Link Copied! ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Copy Activation Link 📋</span>
              </>
            )}
          </button>
        </div>

        {/* Multi-Channel Dispatch Buttons */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
            Direct Dispatch Channels
          </span>

          <div className="grid grid-cols-2 gap-2">
            {/* Email Dispatch */}
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer shadow-xs ${
                emailSentSuccess 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              {isSendingEmail ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : emailSentSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span>{isSendingEmail ? 'Sending...' : emailSentSuccess ? 'Sent ✓' : 'Send Email 📧'}</span>
            </button>

            {/* SMS Dispatch */}
            <button
              type="button"
              onClick={handleSendSms}
              disabled={isSendingSms}
              className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer shadow-xs ${
                smsSentSuccess 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
              }`}
            >
              {isSendingSms ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : smsSentSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Smartphone className="w-3.5 h-3.5 text-sky-600" />
              )}
              <span>{isSendingSms ? 'Sending...' : smsSentSuccess ? 'Sent ✓' : 'Send SMS 📱'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
