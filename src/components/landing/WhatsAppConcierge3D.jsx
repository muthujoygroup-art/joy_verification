import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  X, 
  CheckCheck, 
  Sparkles, 
  Lock, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  ExternalLink
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

export const WhatsAppConcierge3D = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  // Corporate Joy TrueProfile WhatsApp Line
  const defaultPhone = '919994699044';

  const quickPrompts = [
    { 
      title: 'Book 10-Min Live Demo', 
      text: 'Hi JOY TRUE PROFILE Team, I would like to book a 10-minute live demo of the workforce verification platform.', 
      icon: '🚀', 
      tag: 'Fast-Track' 
    },
    { 
      title: 'Candidate Verification Pricing', 
      text: 'Hi Team, I am interested in understanding candidate verification pricing and postpaid credit plans.', 
      icon: '💳', 
      tag: 'Instant Rates' 
    },
    { 
      title: 'EPFO Dual-Employment Audit', 
      text: 'Hi, I need assistance with EPFO dual-employment detection and moonlighting radar screening for our workforce.', 
      icon: '🔍', 
      tag: 'Fraud Radar' 
    },
    { 
      title: 'Factory Gate Pass & CLRA Form XVI', 
      text: 'Hello, We want to automate our contractor gate passes and CLRA Form XVI statutory audit dossiers.', 
      icon: '🏭', 
      tag: 'Statutory' 
    },
    { 
      title: 'API Integration & Webhooks', 
      text: 'Hi, I would like to receive the API documentation and webhook setup guide for HRMS integration.', 
      icon: '⚡', 
      tag: 'Developers' 
    },
    { 
      title: 'Aadhaar, PAN & Police Court Checks', 
      text: 'Hello, Please share details on automated Aadhaar e-KYC, PAN validation, and court record checks.', 
      icon: '🛡️', 
      tag: 'Compliance' 
    }
  ];

  const handleToggle = () => {
    soundEngine.playClick();
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = (customText) => {
    soundEngine.playSuccess();
    const finalMsg = customText || message || 'Hello JOY TRUE PROFILE Team! I would like to learn more about instant workforce background verification for my company.';
    const url = 'https://wa.me/' + defaultPhone + '?text=' + encodeURIComponent(finalMsg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 select-none">
      
      {/* =========================================================================
       * CONCIERGE CHAT / QUERY TEMPLATE WINDOW
       * ========================================================================= */}
      {isOpen && (
        <div 
          className="mb-4 w-[360px] sm:w-[410px] max-w-[calc(100vw-2rem)] rounded-3xl bg-white border border-[#E5EAF0] shadow-[0_25px_60px_rgba(24,34,48,0.22)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 zoom-in-95 flex flex-col font-sans"
          style={{ maxHeight: 'calc(100vh - 130px)' }}
        >
          {/* Header: Solid Emerald/Forest Green with Verified Brand Emblem */}
          <div 
            style={{ backgroundColor: '#064e3b', color: '#ffffff' }}
            className="relative px-5 py-4 flex items-center justify-between border-b border-emerald-800 select-none"
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366] p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-[14px] bg-[#064e3b] flex items-center justify-center overflow-hidden">
                    <img 
                      src="/assets/logos/joy_true_profile_shield_emblem.png" 
                      alt="JOY Desk" 
                      className="w-6 h-6 object-contain drop-shadow"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <ShieldCheck className="w-5 h-5 text-emerald-300 hidden" />
                  </div>
                </div>
                {/* Live Online Beacon */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#064e3b] shadow-xs animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white font-outfit tracking-tight">
                    JOY TrueProfile Support
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#25D366] text-[#064e3b] text-[9px] font-mono font-bold border border-emerald-300 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-[#064e3b]" />
                    <span>VERIFIED</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-100 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#25D366]" />
                    <span>Avg response: &lt; 2 mins</span>
                  </span>
                  <span>•</span>
                  <span className="text-[#25D366] font-bold">Online Now</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleToggle}
              className="relative z-10 w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Body: Template Queries and Direct Message */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 bg-[#FCFCFA]">
            
            {/* Timestamp */}
            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5EAF0] text-[10px] font-mono text-[#5C6878] font-bold shadow-xs">
                SELECT A QUERY TEMPLATE
              </span>
            </div>

            {/* Greeting */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#E5EAF0] shadow-xs text-xs text-[#182230]">
              <p className="font-bold text-[#182230] mb-1 flex items-center gap-1.5">
                <span>Welcome to JOY True Profile!</span> 👋
              </p>
              <p className="text-[#5C6878] leading-relaxed">
                Click any topic template below to chat directly with our enterprise verification advisors on WhatsApp.
              </p>
            </div>

            {/* Query Templates List */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#5C6878] block px-1">
                Frequently Asked Topics
              </span>
              <div className="grid grid-cols-1 gap-2">
                {quickPrompts.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip.text)}
                    className="text-left text-xs font-semibold p-3 rounded-2xl bg-white hover:bg-[#EAF8F0] border border-[#E5EAF0] hover:border-[#299C68] text-[#182230] hover:text-[#064e3b] transition-all flex items-center justify-between group shadow-xs cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 truncate pr-2">
                      <span className="text-base shrink-0">{chip.icon}</span>
                      <span className="truncate">{chip.title}</span>
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FCFCFA] group-hover:bg-[#299C68]/15 text-[#5C6878] group-hover:text-[#064e3b] transition-colors border border-[#E5EAF0]">
                        {chip.tag}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#5C6878] group-hover:text-[#299C68] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Direct Message Input */}
            <div className="pt-2 border-t border-[#E5EAF0]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Or type a custom question..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EAF0] text-xs text-[#182230] placeholder:text-[#5C6878] focus:outline-none focus:border-[#299C68] shadow-xs font-medium"
                />
                <button
                  type="submit"
                  style={{ backgroundColor: '#25D366' }}
                  className="p-2.5 rounded-xl hover:bg-[#20bd5a] text-white shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 border border-[#1da851]"
                  title="Send via WhatsApp"
                >
                  <Send className="w-4 h-4 text-white stroke-[2.5]" />
                </button>
              </form>
            </div>

          </div>

          {/* Footer: Security & Legal Info */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-[#E5EAF0] flex items-center justify-between text-[11px] font-mono text-[#5C6878]">
            <span className="flex items-center gap-1.5 text-[#299C68] font-semibold">
              <Lock className="w-3 h-3 text-[#299C68]" />
              <span>DPDP 2023 Encrypted</span>
            </span>
            <button
              onClick={() => handleSend()}
              className="font-bold text-[#064e3b] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open WhatsApp</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
       * ROUND WHATSAPP FLOATING BUTTON (CLEAN CIRCULAR TRIGGER)
       * ========================================================================= */}
      <button
        onClick={handleToggle}
        style={{ backgroundColor: '#25D366' }}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white shadow-[0_12px_30px_rgba(0,0,0,0.25),0_4px_12px_rgba(37,211,102,0.4)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.35),0_6px_16px_rgba(37,211,102,0.5)] hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center border-2 border-white group"
        aria-label="Toggle WhatsApp Contact"
      >
        {/* Live Notification Indicator Pulse */}
        <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#064e3b] text-white text-[9px] font-bold items-center justify-center border border-white">
            1
          </span>
        </span>

        {/* Center Icon: Toggle between Close 'X' and Official WhatsApp SVG */}
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <svg 
            viewBox="0 0 24 24" 
            className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" 
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.405" />
          </svg>
        )}
      </button>

    </aside>
  );
};

export default WhatsAppConcierge3D;

