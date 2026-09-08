import React from 'react';
import { Ban, ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../utils/uiSoundEffects';

export const AccessRestrictedModal = ({ notice, onClose }) => {
  if (!notice || !notice.isOpen) return null;

  const handleClose = () => {
    try {
      soundEngine.playClick?.();
    } catch (e) {}
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-rose-200 overflow-hidden space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Warning Ribbon */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Access Restricted • Permission Denied
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-rose-100 border-2 border-rose-300 text-rose-600 flex items-center justify-center shrink-0 shadow-inner">
            <Ban className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-outfit font-black text-lg text-slate-900 leading-tight">
              {notice.featureName || 'Option Disabled'}
            </h3>
            <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>You do not have permission to access this option</span>
            </p>
          </div>
        </div>

        {/* Informative Explanation Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2 shadow-inner">
          <p className="font-medium text-slate-800">
            {notice.reason || 'This feature has been deactivated or restricted for your account or user role by your Administrator.'}
          </p>
          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Mouse Hover: <strong className="text-rose-600">🚫 Not Allowed</strong></span>
            <span>Policy Status: <strong className="text-slate-800">Disabled</strong></span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 px-5 rounded-2xl font-black text-xs text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all shadow-md shadow-rose-600/25 cursor-pointer border border-rose-500 flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Understood — Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
