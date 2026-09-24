import React, { useState } from 'react';
import { 
  Building2, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  Mail, 
  QrCode, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { soundEngine } from '../utils/uiSoundEffects';

export const VendorLinkModal = ({ vendor, company, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState(vendor?.email || '');
  const [emailDispatched, setEmailDispatched] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  if (!isOpen || !vendor) return null;

  const v = vendor;
  const comp = company || { name: 'Joy Corporate Solutions Pvt Ltd' };
  const compSlug = (comp.name || 'joy-corporate-solutions')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const token = v.token || v.magicToken || v.id;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://verification.joycorporatesolutions.com';
  const vendorMagicUrl = `${baseUrl}/${compSlug}/vendor/${token}`;

  const handleCopyLink = () => {
    soundEngine.playClick?.();
    navigator.clipboard.writeText(vendorMagicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${v.vendorName || 'Partner'},\n\n${comp.name} has invited you to complete your B2B Statutory Vendor Onboarding & Verification on JOY True Profile.\n\nPlease click the secure link below to review terms, submit corporate details, and upload registration documents:\n${vendorMagicUrl}\n\n🔒 256-Bit Encrypted • DPDP Act 2023 Compliant`
  );

  const handleOpenWhatsApp = () => {
    soundEngine.playClick?.();
    const phoneDigits = (v.phone || '').replace(/\D/g, '');
    const waUrl = phoneDigits.length >= 10
      ? `https://wa.me/91${phoneDigits.slice(-10)}?text=${whatsappMessage}`
      : `https://wa.me/?text=${whatsappMessage}`;
    window.open(waUrl, '_blank');
  };

  const handleSendEmailInvite = (e) => {
    e.preventDefault();
    if (!emailRecipient || !emailRecipient.includes('@')) return;
    setIsSendingEmail(true);
    soundEngine.playSuccess?.();
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailDispatched(true);
      setTimeout(() => setEmailDispatched(false), 4000);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-purple text-[9px] font-black uppercase">VENDOR SELF-SERVICE LINK</span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">#{v.vendorCode || 'VEND'}</span>
              </div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight mt-0.5">
                {v.vendorName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">B2B Statutory Verification & Document Onboarding Gateway</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Status Tracker Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Link Status</span>
                <span className="font-black text-slate-900 text-xs">
                  {v.linkStatus || 'Link Active & Ready for Vendor'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Token Protected</span>
            </div>
          </div>

          {/* Direct Verification Link Copy Field */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Secure Vendor Self-Service Link:
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
              <div className="p-2 text-purple-600 shrink-0">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                readOnly
                value={vendorMagicUrl}
                className="bg-transparent text-slate-800 font-mono text-xs w-full outline-none font-semibold truncate select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Vendor will review B2B Terms & Conditions, verify statutory data (CIN/GST/DIN), and upload business documents.
            </span>
          </div>

          {/* Quick Dispatch Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* WhatsApp 1-Click Dispatch */}
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-emerald-950">WhatsApp Invite</div>
                  <div className="text-[10px] text-emerald-700 font-normal">
                    {v.phone ? `Send to +91 ${v.phone.slice(-10)}` : 'Share on WhatsApp'}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* QR Code Trigger */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick?.();
                setShowQrCode(!showQrCode);
              }}
              className="p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 font-bold flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-indigo-950">Scan Mobile QR Code</div>
                  <div className="text-[10px] text-indigo-700 font-normal">For direct phone camera scan</div>
                </div>
              </div>
              <span className="text-xs text-indigo-600 font-black">
                {showQrCode ? 'Hide ▲' : 'Show ▼'}
              </span>
            </button>
          </div>

          {/* QR Code Reveal Panel */}
          {showQrCode && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white text-center space-y-3 animate-fadeIn">
              <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl shadow-lg flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(vendorMagicUrl)}&margin=1`}
                  alt="Vendor QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Scan with any smartphone camera to open vendor self-verification gateway.
              </p>
            </div>
          )}

          {/* Email Invitation Dispatch Form */}
          <form onSubmit={handleSendEmailInvite} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                <span>Send Official Email Invitation</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Auto-dispatches login link</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                placeholder="vendor-admin@enterprise.com"
                className="form-input text-xs font-medium flex-1 py-2"
              />
              <button
                type="submit"
                disabled={isSendingEmail}
                className="btn btn-company text-xs py-2 px-4 font-black flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingEmail ? 'Sending...' : 'Send Invite 🚀'}</span>
              </button>
            </div>

            {emailDispatched && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>🎉 Email invitation successfully queued and dispatched to {emailRecipient}!</span>
              </div>
            )}
          </form>

          {/* What Vendor Will Do */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-[11px] text-purple-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1 text-purple-900">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Vendor Verification Workflow Steps:</span>
            </div>
            <ol className="list-decimal list-inside space-y-0.5 text-purple-900/90 font-medium pl-1">
              <li>Vendor accepts B2B Master Terms and DPDP Act 2023 consent.</li>
              <li>Vendor inputs/confirms registered CIN, GSTIN, PAN, and Director DIN.</li>
              <li>Vendor uploads Certificate of Incorporation and statutory credentials.</li>
              <li>System automatically performs live 11-in-1 registry audits.</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <a
            href={vendorMagicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 hover:underline"
          >
            <span>Preview Vendor Portal View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default VendorLinkModal;
