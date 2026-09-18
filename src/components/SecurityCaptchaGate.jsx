import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, Lock, CheckCircle2, AlertTriangle, Sparkles, Volume2 } from 'lucide-react';

export const SecurityCaptchaGate = ({ candidateName, candidateEmpId, companyName, onCaptchaVerified }) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const canvasRef = useRef(null);

  // Generate a random 6-character alphanumeric string
  const generateCaptchaString = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous chars like O, 0, I, 1
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Draw the visual CAPTCHA on HTML5 Canvas
  const drawCaptcha = (code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add noise background lines
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 200)}, 0.3)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Add noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render distorted characters
    ctx.font = 'bold 24px monospace';
    ctx.textBaseline = 'middle';

    const colors = ['#4f46e5', '#0284c7', '#059669', '#d97706', '#7c3aed'];
    const letterSpacing = width / (code.length + 1);

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = (i + 1) * letterSpacing - 5;
      const y = height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 0.3 - 0.15); // Slight tilt

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillText(char, -10, 0);
      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newCode = generateCaptchaString();
    setCaptchaCode(newCode);
    setUserInput('');
    setErrorMsg('');
    setTimeout(() => drawCaptcha(newCode), 50);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!userInput || !userInput.trim()) {
      setErrorMsg('Please enter the CAPTCHA code shown in the image.');
      return;
    }

    if (userInput.trim().toUpperCase() === captchaCode.toUpperCase()) {
      setIsVerified(true);
      setErrorMsg('');
      if (onCaptchaVerified) onCaptchaVerified();
    } else {
      setErrorMsg('⚠️ Incorrect CAPTCHA code. Please check and try again.');
      refreshCaptcha();
    }
  };

  const handleSpeakCaptcha = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(captchaCode.split('').join(' '));
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 max-w-md w-full mx-auto my-6 animate-fadeIn">
      {/* Header Badge */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Visual Security Verification
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Complete the CAPTCHA challenge below to unlock your onboarding session.
        </p>
      </div>

      {/* Candidate Profile Info Badge */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-xs text-slate-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Candidate:</span>
          <span className="font-bold text-slate-900">{candidateName || 'Valued Candidate'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Employer:</span>
          <span className="font-bold text-indigo-700">{companyName || 'Joy Corporate Solutions'}</span>
        </div>
      </div>

      {/* CAPTCHA Challenge Form */}
      <form onSubmit={handleVerify} className="space-y-4">
        {/* Canvas Visual CAPTCHA Display */}
        <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-3 flex items-center justify-between shadow-inner">
          <canvas 
            ref={canvasRef} 
            width={180} 
            height={50} 
            className="rounded-lg bg-white shadow-sm border border-slate-200 cursor-pointer"
            onClick={refreshCaptcha}
            title="Click to refresh CAPTCHA image"
          />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSpeakCaptcha}
              className="p-2 rounded-lg bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
              title="Listen to CAPTCHA Audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
              title="Refresh CAPTCHA Code"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Enter 6-Character Security Code:
          </label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value.toUpperCase());
              setErrorMsg('');
            }}
            placeholder="e.g. K9X2P7"
            maxLength={6}
            className="w-full text-center text-lg font-mono font-black tracking-widest uppercase p-3 border-2 border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
            autoFocus
          />
        </div>

        {/* Error Popup Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 font-semibold animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full btn bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Verify CAPTCHA & Unlock Portal →</span>
        </button>
      </form>

      {/* DPDP Footnote */}
      <div className="mt-4 text-center text-[10px] text-slate-400">
        🛡️ Protected under Digital Personal Data Protection (DPDP) Act 2023.
      </div>
    </div>
  );
};
