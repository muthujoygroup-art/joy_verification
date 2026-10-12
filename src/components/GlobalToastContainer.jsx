import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const GlobalToastContainer = () => {
  const { toastMessage, setToastMessage } = useApp();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toastMessage) {
      setVisible(true);
      setProgress(100);

      const interval = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - 2.5));
      }, 85);

      return () => clearInterval(interval);
    } else {
      setVisible(false);
      setProgress(100);
    }
  }, [toastMessage]);

  if (!visible || !toastMessage) return null;

  const { msg, type = 'info' } = toastMessage;

  // Determine styling based on type
  const isError = type === 'error' || type === 'danger';
  const isSuccess = type === 'success';
  const isWarning = type === 'warning';

  const badgeBg = isError
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    : isSuccess
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : isWarning
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : 'bg-sky-500/20 text-sky-300 border-sky-500/30';

  const progressBarBg = isError
    ? 'bg-rose-500'
    : isSuccess
    ? 'bg-emerald-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-sky-500';

  const Icon = isError
    ? AlertCircle
    : isSuccess
    ? CheckCircle2
    : isWarning
    ? AlertTriangle
    : Info;

  const iconColor = isError
    ? 'text-rose-400'
    : isSuccess
    ? 'text-emerald-400'
    : isWarning
    ? 'text-amber-400'
    : 'text-sky-400';

  const glowBorder = isError
    ? 'border-rose-500/40 shadow-rose-950/40'
    : isSuccess
    ? 'border-emerald-500/40 shadow-emerald-950/40'
    : isWarning
    ? 'border-amber-500/40 shadow-amber-950/40'
    : 'border-sky-500/40 shadow-sky-950/40';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 right-6 z-[999999] max-w-md w-[calc(100vw-3rem)] pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100"
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-xl border ${glowBorder} text-white shadow-2xl p-4 transition-all`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl bg-white/5 shrink-0 ${iconColor}`}>
            <Icon className="w-5 h-5 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeBg}`}>
                {isError ? 'System Notice' : isSuccess ? 'Success' : isWarning ? 'Warning' : 'Notification'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
              {msg}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setVisible(false);
              if (typeof setToastMessage === 'function') setToastMessage(null);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Countdown Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ease-linear ${progressBarBg}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
