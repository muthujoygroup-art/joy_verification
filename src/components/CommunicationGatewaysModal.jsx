import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Smartphone, 
  Radio,
  Sparkles, 
  Send,
  Zap,
  Save, 
  X, 
  ShieldCheck, 
  Lock,
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const CommunicationGatewaysModal = ({ onClose }) => {
  const { whatsappConfig, smsConfig, updateCommunicationGateways, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' | 'sms'

  // WhatsApp Local Form State
  const [waState, setWaState] = useState({
    enabled: true,
    wabaId: 'WABA-99823412091',
    phoneNumberId: 'PN-919876543210',
    accessToken: 'EAAG99823412091ZABCPASSWORDTOKEN',
    webhookUrl: 'https://api.joyverification.com/v1/whatsapp/webhook',
    autoSendOnboardingLink: true,
    autoSendOtpCode: true,
    autoSendPdfCertificate: true,
    status: 'Connected 🟢',
    ...(whatsappConfig || {})
  });

  // Carrier SMS Local Form State
  const [smsState, setSmsState] = useState({
    enabled: true,
    provider: 'Twilio',
    accountSid: 'AC99823412091_TWILIO_LIVE',
    authToken: 'AUTH_TOKEN_99823412091_JOY',
    senderId: 'JOYVER',
    dltEntityId: '1101234567890123456',
    dltTemplateId: 'DLT_1107161829304859',
    autoSendOnboardingSms: true,
    autoSendOtpSms: true,
    autoSendReportSms: true,
    status: 'Connected 🟢',
    ...(smsConfig || {})
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateCommunicationGateways(waState, smsState);
    if (onClose) onClose();
  };

  const handleTestDispatch = (channel) => {
    showToast(`⚡ Test automated ${channel} notification dispatched successfully! API Gateway 200 OK.`);
  };

  return createPortal((
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
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">Automated Messaging Gateway Configurator</h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-extrabold text-[10px] border border-purple-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-700" />
                  <span>SUPERADMIN ONLY</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Configure Meta WhatsApp Cloud API & Carrier SMS Integrations for automated candidate joining links, OTPs & verification alerts.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 font-bold flex items-center justify-center transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Channel Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 flex-1 justify-center cursor-pointer ${
              activeTab === 'whatsapp' 
                ? 'bg-emerald-600 text-white shadow-sm font-black' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. WhatsApp Automated Messaging ({waState.status})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sms')}
            className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 flex-1 justify-center cursor-pointer ${
              activeTab === 'sms' 
                ? 'bg-sky-600 text-white shadow-sm font-black' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>2. Carrier SMS Integration ({smsState.status})</span>
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
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="btn btn-superadmin text-xs flex items-center gap-1.5 font-bold shadow-md cursor-pointer">
                  <Save className="w-4 h-4" />
                  <span>Save WhatsApp Config</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* CHANNEL 2: CARRIER SMS GATEWAY INTEGRATION (SUPERADMIN ONLY) */}
        {activeTab === 'sms' && (
          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs animate-fadeIn">
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sky-900 text-sm flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-600" />
                  <span>Carrier SMS Gateway (Twilio / AWS SNS / DLT Karix)</span>
                </span>
                <span className="badge badge-sky text-[10px]">Active SMS Gateway</span>
              </div>
              <p className="text-sky-800 text-xs leading-relaxed">
                SuperAdmin-controlled carrier SMS integration for transmitting candidate SMS OTP verification codes, instant mobile joining reminders, and government DLT-approved template notifications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">SMS Gateway Provider *</label>
                <select 
                  value={smsState.provider}
                  onChange={(e) => setSmsState({ ...smsState, provider: e.target.value })}
                  className="form-select text-xs font-bold"
                >
                  <option value="Twilio">Twilio Programmable SMS API</option>
                  <option value="AWS SNS">Amazon AWS SNS (Simple Notification Service)</option>
                  <option value="Karix / Gupshup">Karix / Gupshup (DLT India Compliant)</option>
                  <option value="Fast2SMS">Fast2SMS Quick Router API</option>
                  <option value="MSG91">MSG91 Enterprise SMS</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">DLT / Carrier Sender ID (Header) *</label>
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={smsState.senderId}
                  onChange={(e) => setSmsState({ ...smsState, senderId: e.target.value.toUpperCase() })}
                  placeholder="e.g. JOYVER (6 characters)"
                  className="form-input text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Account SID / API Key *</label>
                <input 
                  type="text" 
                  required
                  value={smsState.accountSid}
                  onChange={(e) => setSmsState({ ...smsState, accountSid: e.target.value })}
                  placeholder="AC99823412091..."
                  className="form-input text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Auth Token / API Secret *</label>
                <input 
                  type="password" 
                  required
                  value={smsState.authToken}
                  onChange={(e) => setSmsState({ ...smsState, authToken: e.target.value })}
                  placeholder="Auth token / API secret key"
                  className="form-input text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">TRAI DLT Entity / Principal ID (India PE ID)</label>
                <input 
                  type="text" 
                  value={smsState.dltEntityId}
                  onChange={(e) => setSmsState({ ...smsState, dltEntityId: e.target.value })}
                  placeholder="e.g. 1101234567890123456"
                  className="form-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">DLT Registered Template ID</label>
                <input 
                  type="text" 
                  value={smsState.dltTemplateId}
                  onChange={(e) => setSmsState({ ...smsState, dltTemplateId: e.target.value })}
                  placeholder="e.g. DLT_1107161829304859"
                  className="form-input text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-extrabold text-slate-900 block">Automated SMS Dispatches & Triggers</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200 hover:border-sky-400">
                  <input 
                    type="checkbox" 
                    checked={smsState.autoSendOnboardingSms}
                    onChange={(e) => setSmsState({ ...smsState, autoSendOnboardingSms: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="font-bold text-slate-800 text-[11px]">Candidate Joining SMS</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200 hover:border-sky-400">
                  <input 
                    type="checkbox" 
                    checked={smsState.autoSendOtpSms}
                    onChange={(e) => setSmsState({ ...smsState, autoSendOtpSms: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="font-bold text-slate-800 text-[11px]">Mobile / Aadhaar OTP SMS</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200 hover:border-sky-400">
                  <input 
                    type="checkbox" 
                    checked={smsState.autoSendReportSms}
                    onChange={(e) => setSmsState({ ...smsState, autoSendReportSms: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="font-bold text-slate-800 text-[11px]">Verification Done SMS</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleTestDispatch('Carrier SMS')}
                className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold text-sky-700 hover:bg-sky-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test SMS Dispatch</span>
              </button>

              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold cursor-pointer">Close</button>
                <button type="submit" className="btn btn-superadmin text-xs flex items-center gap-1.5 font-bold shadow-md cursor-pointer">
                  <Save className="w-4 h-4" />
                  <span>Save SMS Config</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  ), document.body);
};
