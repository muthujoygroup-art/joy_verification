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
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

export const WhatsAppConcierge3D = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef(null);

  const defaultPhone = '919940000000'; // Enterprise Joy TrueProfile WhatsApp Line

  const quickPrompts = [
    { text: 'Book 10-Min Live Demo', icon: '🚀', tag: 'Fast-Track' },
    { text: 'Candidate Verification Pricing', icon: '💳', tag: 'Instant Rates' },
    { text: 'EPFO Dual-Employment Audit', icon: '🔍', tag: 'Fraud Detection' },
    { text: 'Factory Gate Pass / Form XVI', icon: '🏭', tag: 'Compliance' },
    { text: 'API Integration & Webhooks', icon: '⚡', tag: 'Developers' }
  ];

  const handleToggle = () => {
    soundEngine.playClick();
    setIsOpen(!isOpen);
    setHasInteracted(true);
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
    <aside aria-label="WhatsApp Support Concierge" className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 select-none">
      
      {/* =========================================================================
       * CONCIERGE CHAT WINDOW (ULTRA-LUXURY GLASSMORPHIC POPUP)
       * ========================================================================= */}
      {isOpen && (
        <div 
          className="mb-4 w-[360px] sm:w-[410px] max-w-[calc(100vw-2rem)] rounded-3xl bg-white border-2 border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 zoom-in-95 flex flex-col font-sans"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header: Full Solid Dark Forest Green with High-Contrast Typography */}
          <div 
            style={{ backgroundColor: '#064e3b', color: '#ffffff' }}
            className="relative px-5 py-4 flex items-center justify-between border-b-2 border-emerald-700 select-none"
          >
            <div className="flex items-center gap-3 relative z-10">
              {/* 3D Verified Avatar Frame */}
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-[#25D366] p-0.5 shadow-md">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/assets/logos/joy_true_profile_shield_emblem.png" 
                      alt="JOY Desk" 
                      className="w-7 h-7 object-contain drop-shadow"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <ShieldCheck className="w-6 h-6 text-emerald-400 hidden" />
                  </div>
                </div>
                {/* Live Online Beacon */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-slate-900 shadow-sm animate-pulse"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white font-outfit tracking-tight" style={{ color: '#ffffff' }}>
                    JOY TrueProfile Desk
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#25D366] text-slate-950 text-[9px] font-mono font-black border border-emerald-300 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                    <span>VERIFIED</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-100 font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#25D366]" />
                    <span>Avg response: &lt;90 secs</span>
                  </span>
                  <span>•</span>
                  <span className="text-[#25D366] font-black">Online Now</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleToggle}
              className="relative z-10 w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer border border-white/25"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Chat Body: Realistic WhatsApp Style Conversation */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 bg-slate-50">
            
            {/* Timestamp Pill */}
            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-full bg-white border border-slate-300 text-[10px] font-mono text-slate-700 font-bold shadow-xs">
                TODAY • OFFICIAL ENTERPRISE INQUIRY
              </span>
            </div>

            {/* Inbound Agent Message Bubble */}
            <div className="flex items-start gap-2.5 max-w-[88%]">
              <div 
                style={{ backgroundColor: '#047857', color: '#ffffff' }}
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs mt-0.5"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 border border-slate-300 shadow-md text-slate-900 text-xs leading-relaxed">
                <p className="font-black text-slate-950 mb-1 flex items-center gap-1">
                  <span>Welcome to JOY TrueProfile!</span> 👋
                </p>
                <p className="text-slate-700 font-medium mb-2">
                  Looking to verify employees, detect moonlighting, or automate factory gate passes? Our enterprise BGV specialists are standing by on WhatsApp.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono font-bold">
                  <span>JOY Enterprise Desk</span>
                  <span className="flex items-center gap-1 text-emerald-800 font-bold">
                    <span>Active</span>
                    <CheckCheck className="w-3 h-3 text-sky-600" />
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-mono font-black tracking-wider text-slate-600 block px-1">
                Frequently Requested Topics
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {quickPrompts.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip.text)}
                    className="text-left text-xs font-bold px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-600 text-slate-800 hover:text-emerald-950 transition-all flex items-center justify-between group shadow-xs cursor-pointer"
                  >
                    <span className="flex items-center gap-2 truncate pr-2">
                      <span className="text-sm">{chip.icon}</span>
                      <span className="truncate">{chip.text}</span>
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 group-hover:bg-emerald-200 text-slate-700 group-hover:text-emerald-900 transition-colors">
                        {chip.tag}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Direct Message Box */}
            <div className="pt-2 border-t border-slate-300">
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
                  placeholder="Type your custom question here..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border-2 border-slate-300 text-xs text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-emerald-600 shadow-xs font-semibold"
                />
                <button
                  type="submit"
                  style={{ backgroundColor: '#25D366', color: '#ffffff' }}
                  className="p-3 rounded-xl hover:bg-[#20bd5a] text-white shadow-md shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 border border-[#1da851]"
                  title="Send via WhatsApp"
                >
                  <Send className="w-4 h-4 text-white stroke-[2.5]" />
                </button>
              </form>
            </div>

          </div>

          {/* Footer: Legal Encryption & Direct Call */}
          <div className="px-4 py-2.5 bg-slate-100/90 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>DPDP 2023 End-to-End Encrypted</span>
            </span>
            <button
              onClick={() => handleSend()}
              className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Instant Chat</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
       * 3D MULTI-LAYER GLASSMORPHIC WHATSAPP BEACON (TRIGGER BUTTON)
       * ========================================================================= */}
      <div className="relative group flex items-center gap-3">
        
        {/* Tooltip prompt when closed and not interacted */}
        {!isOpen && !hasInteracted && (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-500/30 shadow-xl shadow-emerald-950/10 text-xs font-bold text-slate-800 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Need verification help? Chat on WhatsApp</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        )}

        <button
          onClick={handleToggle}
          style={{ backgroundColor: '#25D366', color: '#ffffff' }}
          className="relative flex items-center gap-3 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full text-white font-black text-xs sm:text-sm shadow-[0_10px_25px_rgba(0,0,0,0.35),0_4px_10px_rgba(37,211,102,0.4)] hover:shadow-[0_14px_35px_rgba(0,0,0,0.45)] hover:bg-[#20bd5a] hover:-translate-y-1 hover:scale-105 active:scale-95 active:translate-y-0 transition-all duration-200 cursor-pointer border-2 border-[#1da851]"
          aria-label="Toggle WhatsApp Concierge"
        >
          {/* 3D High-Fidelity WhatsApp Emblem */}
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center">
            {/* Official WhatsApp Vector */}
            <svg 
              viewBox="0 0 24 24" 
              className="relative w-5 h-5 sm:w-6 sm:h-6 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" 
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.405" />
            </svg>
          </div>

          {/* Button Label */}
          <div className="flex flex-col items-start text-left">
            <span className="font-outfit text-xs sm:text-sm font-black tracking-wide text-white drop-shadow leading-tight" style={{ color: '#ffffff' }}>
              {isOpen ? 'Close Concierge' : 'WhatsApp Concierge'}
            </span>
            <span className="text-[10px] text-white/95 font-mono font-bold -mt-0.5 hidden sm:inline" style={{ color: '#ffffff' }}>
              Instant BGV Advisory
            </span>
          </div>

          {/* Live Notification Indicator */}
          <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white text-emerald-950 text-[10px] font-black shadow-md border-2 border-emerald-600">
            <span className="relative z-10 font-black">1</span>
          </span>
        </button>

      </div>

    </aside>
  );
};

export default WhatsAppConcierge3D;
