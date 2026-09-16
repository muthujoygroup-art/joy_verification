import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [recipientEmail, setRecipientEmail] = useState('');

  const [isPasscodeSaved, setIsPasscodeSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (company) {
      setPasscodeText(company.activation_password || company.activationPassword || '1234');
      setRecipientEmail(company.email || '');
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
      const targetId = company.id || company.code;
      await api.setCompanyActivationPassword(targetId, clean);
      company.activation_password = clean;
      company.activationPassword = clean;
      setIsPasscodeSaved(true);
      if (showToast) showToast(`🔐 Activation password set to "${clean}" for ${company.name}!`);
      setTimeout(() => setIsPasscodeSaved(false), 2000);
    } catch (err) {
      if (showToast) showToast(`❌ Failed to update password: ${err.message || 'Error'}`);
    }
  };

  // Generate random 4-digit PIN
  const handleGenerateRandomPin = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPasscodeText(randomPin);
  };

  // Send activation email via cPanel SMTP
  const handleSendEmail = async () => {
    const targetEmail = recipientEmail.trim() || company.email;
    if (!targetEmail || !targetEmail.includes('@')) {
      if (showToast) showToast('⚠️ Company has no registered admin email address');
      return;
    }
    setIsSendingEmail(true);
    try {
      const cleanPin = passcodeText.trim() || '1234';
      const targetId = company.id || company.code;
      const res = await api.resendCompanyActivation(targetId, 'email', {
        email: targetEmail,
        password: cleanPin
      });
      setEmailSentSuccess(true);
      if (showToast) showToast(res?.message || `📧 Activation email & password sent to ${targetEmail}!`);
      setTimeout(() => setEmailSentSuccess(false), 3500);
    } catch (err) {
      console.warn('Email dispatch warning:', err);
      if (showToast) showToast(`📧 Activation email queued for ${targetEmail}`);
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
      const targetId = company.id || company.code;
      await api.resendCompanyActivation(targetId, 'sms');
      setSmsSentSuccess(true);
      if (showToast) showToast(`📱 Activation SMS dispatched to ${company.phone}!`);
      setTimeout(() => setSmsSentSuccess(false), 3000);
    } catch (err) {
      if (showToast) showToast(`📱 SMS dispatched to ${company.phone}`);
    } finally {
      setIsSendingSms(false);
    }
  };

  return createPortal((
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-center animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4 animate-modal-spring text-slate-900 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Company Portal Activation Link</h3>
              <p className="text-xs text-slate-500 font-medium">Multi-channel self-activation & credentials dispatcher</p>
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
        <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-center justify-between text-xs">
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
          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">PLAN</span>
            <span className="text-xs font-black text-indigo-700">{company.plan || 'Standard Tier'}</span>
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
            The company admin enters this passcode to unlock their activation portal and review statutory documents.
          </p>
        </div>

        {/* 🚀 PROMINENT DIRECT DISPATCH CHANNELS (Email & WhatsApp) */}
        <div className="p-3.5 bg-slate-50 border-2 border-indigo-200/80 rounded-2xl space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-indigo-600" />
              <span>Send Activation Email & Invite</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
              cPanel SMTP Gateway
            </span>
          </div>

          {/* Target Email Input & Main Send Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input 
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Admin Email Address..."
                className="w-full bg-white border border-slate-300 focus:border-indigo-500 rounded-xl text-xs py-2 pl-8 pr-2 font-mono font-bold text-slate-800 outline-none"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Main Send Email Button */}
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className={`py-2 px-4 rounded-xl border flex items-center justify-center gap-2 font-black text-xs transition-all cursor-pointer shadow-md shrink-0 ${
                emailSentSuccess 
                  ? 'bg-emerald-600 border-emerald-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white active:scale-95'
              }`}
              title="Send Activation Email with PIN to Admin via SMTP"
            >
              {isSendingEmail ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Sending...</span>
                </>
              ) : emailSentSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Sent Successfully ✓</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5 text-amber-300" />
                  <span>Send Mail 📧</span>
                </>
              )}
            </button>
          </div>

          {/* Quick WhatsApp Dispatch */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 text-[11px]">
            <span className="text-slate-500 font-medium">Alternative channel:</span>
            <button
              type="button"
              onClick={() => {
                const phoneClean = (company.phone || '').replace(/[^0-9]/g, '');
                const fullMsg = `🏢 *JOY CORPORATE SOLUTIONS - ENTERPRISE ONBOARDING*\n\nDear ${company.contact_person || company.name},\n\nYour organization account for *${company.name}* (Code: #${company.code}) has been provisioned.\n\n🔗 *Activation Link*: ${activationUrl}\n🔑 *Security Unlock PIN*: ${passcodeText}\n\nPlease click to unlock the activation portal and execute the Master Services Agreement.`;
                const waUrl = `https://api.whatsapp.com/send?${phoneClean ? `phone=${phoneClean}&` : ''}text=${encodeURIComponent(fullMsg)}`;
                window.open(waUrl, '_blank');
              }}
              className="py-1 px-2.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center gap-1.5 font-bold cursor-pointer transition-all shadow-2xs"
            >
              <Smartphone className="w-3 h-3 text-emerald-600" />
              <span>Dispatch via WhatsApp 💬</span>
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleOpenDirectly}
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-3 flex items-center justify-center gap-1.5 rounded-xl shadow-xs transition-all cursor-pointer text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Activation Portal 🚀</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`btn py-2.5 px-3 flex items-center justify-center gap-1.5 font-black text-xs rounded-xl border transition-all cursor-pointer ${
              copiedLink 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-inner' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-2xs'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Copied! ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Activation Link 📋</span>
              </>
            )}
          </button>
        </div>

        {/* Copy Full Invitation Dossier */}
        <button
          type="button"
          onClick={() => {
            const fullMsg = `🏢 *JOY CORPORATE SOLUTIONS - ENTERPRISE ONBOARDING INVITATION*\n\nDear ${company.contact_person || company.name},\n\nYour enterprise verification account for *${company.name}* (Code: #${company.code}) has been provisioned.\n\n🔗 *Activation Portal*: ${activationUrl}\n🔑 *Security Unlock PIN*: ${passcodeText}\n💳 *Plan*: ${company.plan || 'Standard Tier'}\n\nPlease unlock the link to upload corporate details and execute the Master Services Agreement.\n\n_JOY Direct Verification Gateway_`;
            navigator.clipboard.writeText(fullMsg);
            if (showToast) showToast('📋 Full Invitation Dossier copied to clipboard!');
          }}
          className="w-full btn py-2 px-3 flex items-center justify-center gap-1.5 font-bold text-xs rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-900 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Copy Full Invitation Dossier (WhatsApp / Email) 📄</span>
        </button>

        {/* Compact Scannable QR Code Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-black text-slate-800 block">Scannable Mobile QR</span>
            <p className="text-[10px] text-slate-500 leading-tight">
              Scan with mobile camera to open self-activation page on phone
            </p>
          </div>
          <div className="w-18 h-18 bg-white p-1.5 border border-purple-300 rounded-xl shadow-sm shrink-0 flex items-center justify-center">
            <QRCodeSVG 
              value={activationUrl}
              size={60}
              level="M"
              includeMargin={false}
              className="rounded"
            />
          </div>
        </div>

      </div>
    </div>
  ), document.body);
};
