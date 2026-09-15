import React from 'react';
import { createPortal } from 'react-dom';
import { Clock, RefreshCw, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SessionInactivityModal = (props) => {
  const app = useApp() || {};
  const isOpen = props.isOpen !== undefined ? props.isOpen : app.showInactivityWarning;
  const remainingSeconds = props.remainingSeconds !== undefined 
    ? props.remainingSeconds 
    : (typeof app.sessionTtlSeconds === 'number' && app.sessionTtlSeconds > 0 ? app.sessionTtlSeconds : (app.inactivityCountdown || 60));
  const onExtend = props.onExtend || app.refreshUserSession;
  const onLogout = props.onLogout || app.logoutUser;

  if (!isOpen) return null;

  const validSecs = typeof remainingSeconds === 'number' && !isNaN(remainingSeconds) ? Math.max(0, remainingSeconds) : 60;
  const mins = Math.floor(validSecs / 60);
  const secs = validSecs % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return createPortal((
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 space-y-5 border-amber-300 bg-white text-slate-900 shadow-2xl rounded-2xl text-center my-auto">
        
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border-2 border-amber-300 animate-bounce">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900">Session Expiry Warning ⏳</h3>
          <p className="text-xs text-slate-600 font-medium">
            Your secure portal session is reaching 1 minute to expiry. Would you like to add another 10 minutes to continue your work?
          </p>
        </div>

        {/* Big Countdown Timer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <span className="text-[11px] text-amber-800 font-bold uppercase tracking-wider block">Session Expires In</span>
          <span className="text-4xl font-black text-amber-900 font-mono tracking-widest">{timeFormatted}</span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="btn btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Log Out</span>
          </button>

          <button
            type="button"
            onClick={onExtend}
            className="btn btn-superadmin text-xs py-2.5 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <RefreshCw className="w-4 h-4" />
            <span>⚡ Add +10 Minutes (Keep Session)</span>
          </button>
        </div>

      </div>
    </div>
  ), document.body);
};
