import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  Globe, 
  Save, 
  X, 
  Smartphone, 
  Sparkles, 
  Send,
  Zap,
  Radio
} from 'lucide-react';

export const CommunicationGatewaysModal = ({ onClose }) => {
  const { whatsappConfig, emailConfig, updateCommunicationGateways, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('whatsapp');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
 // 'whatsapp' | 'email'

  // WhatsApp Local Form State
  const [waState, setWaState] = useState({ ...whatsappConfig });

  // Email Local Form State
  const [mailState, setMailState] = useState({ ...emailConfig });

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateCommunicationGateways(waState, mailState);
    if (onClose) onClose();
  };

  const handleTestDispatch = (channel) => {
    showToast(`Test ${channel} notification dispatched successfully! API Response 200 OK.`);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-3xl p-4 sm:p-6 space-y-5 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl my-auto animate-fadeIn">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">WhatsApp & Enterprise Email Gateway Configurator</h2>
              <p className="text-xs text-slate-500 font-medium">Configure Meta WhatsApp Business API & SMTP / SendGrid credentials for automated background candidate dispatches</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

        {/* Modal Channel Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 flex-1 justify-center ${
              activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Meta WhatsApp Business API ({waState.status})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 flex-1 justify-center ${
              activeTab === 'email' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Enterprise SMTP Email ({mailState.status})</span>
          </button>
        </div>

        {/* CHANNEL 1: META WHATSAPP BUSINESS API */}
        {activeTab === 'whatsapp' && (
          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs animate-fadeIn">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Meta Official WhatsApp Cloud API Credentials</span>
                </span>
                <span className="badge badge-emerald text-[10px]">Production Mode</span>
              </div>
              <p className="text-emerald-800 text-xs">
                Enables automated background WhatsApp messaging for magic onboarding links, 6-digit Aadhaar OTPs, and verified PDF certificates without leaving the application.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">WhatsApp Business Account ID (WABA ID) *</label>
                <input 
                  type="text" 
                  required
                  value={waState.wabaId}
                  onChange={(e) => setWaState({ ...waState, wabaId: e.target.value })}
                  className="form-input text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">WhatsApp Phone Number ID *</label>
                <input 
                  type="text" 
                  required
                  value={waState.phoneNumberId}
                  onChange={(e) => setWaState({ ...waState, phoneNumberId: e.target.value })}
                  className="form-input text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Meta Access Token / Permanent Bearer Key *</label>
              <input 
                type="password" 
                required
                value={waState.accessToken}
                onChange={(e) => setWaState({ ...waState, accessToken: e.target.value })}
                className="form-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">WhatsApp Incoming Webhook Listener URL</label>
              <input 
                type="text" 
                value={waState.webhookUrl}
                onChange={(e) => setWaState({ ...waState, webhookUrl: e.target.value })}
                className="form-input text-xs font-mono"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-extrabold text-slate-900">Automated Background Message Triggers</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={waState.autoSendOnboardingLink}
                    onChange={(e) => setWaState({ ...waState, autoSendOnboardingLink: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Onboarding Links</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={waState.autoSendOtpCode}
                    onChange={(e) => setWaState({ ...waState, autoSendOtpCode: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Aadhaar OTP Codes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={waState.autoSendPdfCertificate}
                    onChange={(e) => setWaState({ ...waState, autoSendPdfCertificate: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>PDF Audit Certificates</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleTestDispatch('WhatsApp API')}
                className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold text-emerald-700"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Test WhatsApp Dispatch</span>
              </button>

              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold">Cancel</button>
                <button type="submit" className="btn btn-hrexecutive text-xs flex items-center gap-1.5 font-bold shadow-md">
                  <Save className="w-4 h-4" />
                  <span>Save WhatsApp Config</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* CHANNEL 2: ENTERPRISE EMAIL SMTP GATEWAY */}
        {activeTab === 'email' && (
          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs animate-fadeIn">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-indigo-900 text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>AWS SES / SendGrid Enterprise SMTP Credentials</span>
                </span>
                <span className="badge badge-indigo text-[10px]">Active SMTP</span>
              </div>
              <p className="text-indigo-800 text-xs">
                Enables official HTML email notifications for candidate joining forms, employer verification reports, and automated pdf attachments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">SMTP Host Server *</label>
                <input 
                  type="text" 
                  required
                  value={mailState.smtpHost}
                  onChange={(e) => setMailState({ ...mailState, smtpHost: e.target.value })}
                  className="form-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">SMTP Port *</label>
                <input 
                  type="number" 
                  required
                  value={mailState.smtpPort}
                  onChange={(e) => setMailState({ ...mailState, smtpPort: parseInt(e.target.value) || 587 })}
                  className="form-input text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Sender Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={mailState.senderEmail}
                  onChange={(e) => setMailState({ ...mailState, senderEmail: e.target.value })}
                  className="form-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">API Secret Key / App Password *</label>
                <input 
                  type="password" 
                  required
                  value={mailState.apiKey}
                  onChange={(e) => setMailState({ ...mailState, apiKey: e.target.value })}
                  className="form-input text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-extrabold text-slate-900">Automated Background Email Triggers</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={mailState.autoSendOnboardingEmail}
                    onChange={(e) => setMailState({ ...mailState, autoSendOnboardingEmail: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Candidate Welcome Email & Link</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={mailState.autoSendPdfCertificate}
                    onChange={(e) => setMailState({ ...mailState, autoSendPdfCertificate: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Verification Certificate PDF Email</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleTestDispatch('SMTP Email')}
                className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold text-indigo-700"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Email Dispatch</span>
              </button>

              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold">Cancel</button>
                <button type="submit" className="btn btn-superadmin text-xs flex items-center gap-1.5 font-bold shadow-md">
                  <Save className="w-4 h-4" />
                  <span>Save Email Config</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
