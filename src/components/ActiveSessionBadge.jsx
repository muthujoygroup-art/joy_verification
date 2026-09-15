import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  RefreshCw, 
  LogOut, 
  Activity, 
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ActiveSessionBadge = ({ placement = 'auto' }) => {
  const { sessionData, sessionTtlSeconds = 600, refreshUserSession, logoutUser, activeRole = 'superadmin', currentUser } = useApp() || {};
  const [showPopover, setShowPopover] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);

  // Format MM:SS
  const formatTtl = (seconds) => {
    const s = typeof seconds === 'number' && !isNaN(seconds) && seconds >= 0 ? seconds : 600;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Click outside listener
  useEffect(() => {
    if (!showPopover) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showPopover]);

  const handleRefresh = async (e) => {
    if (e) e.stopPropagation();
    setIsRefreshing(true);
    if (typeof refreshUserSession === 'function') {
      await refreshUserSession();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const isLowTtl = (sessionTtlSeconds || 600) <= 60; // <= 1 min (60s) warning

  // Determine popover position class
  const getPopoverClasses = () => {
    if (placement === 'top') {
      return 'bottom-full mb-2 left-0 sm:left-0';
    }
    if (placement === 'top-right') {
      return 'bottom-full mb-2 right-0';
    }
    if (placement === 'bottom') {
      return 'top-full mt-2 right-0';
    }
    if (placement === 'bottom-left') {
      return 'top-full mt-2 left-0';
    }
    // Auto fallback
    return 'top-full mt-2 right-0';
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer ${
          isLowTtl 
            ? 'bg-rose-50 text-rose-900 border-rose-300 ring-2 ring-rose-400/40 animate-pulse' 
            : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400'
        }`}
        title={`Active Session: ${formatTtl(sessionTtlSeconds)} remaining (Click to add +10 Mins)`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${isLowTtl ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
        <Clock className={`w-3.5 h-3.5 shrink-0 ${isLowTtl ? 'text-rose-600' : 'text-emerald-600'}`} />
        <span className="font-mono font-black text-xs tracking-tight">{formatTtl(sessionTtlSeconds)}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${showPopover ? 'rotate-180 opacity-90' : 'opacity-60'}`} />
      </button>

      {showPopover && (
        <div 
          className={`absolute ${getPopoverClasses()} w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-slate-900 space-y-3 animate-fadeIn`}
          style={{ width: '320px', maxWidth: '90vw' }}
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2 font-black text-xs text-slate-900">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Live Session & Node</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-200">
              ACTIVE 🟢
            </span>
          </div>

          {/* Session Telemetry Grid */}
          <div className="space-y-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Active Role:</span>
              <strong className="text-slate-900 uppercase font-black tracking-wide">
                {activeRole || currentUser?.role || 'SUPERADMIN'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Session ID:</span>
              <span className="text-indigo-700 font-mono font-bold text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                {sessionData?.sessionId || 'sess_active_098'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Cluster Node:</span>
              <span className="text-cyan-800 font-mono font-bold text-[10px] bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">
                JOY-CLUSTER-NODE-01
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-600 font-bold">Time to Expiry:</span>
              <strong className={`font-mono font-black text-sm ${isLowTtl ? 'text-rose-600 animate-pulse' : 'text-emerald-700'}`}>
                {formatTtl(sessionTtlSeconds)}
              </strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer active:scale-95 disabled:opacity-50 whitespace-nowrap"
              title="Add 10 More Minutes to your Active Session"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-white shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-white font-black text-xs">⚡ +10 Mins (Reset)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowPopover(false);
                if (typeof logoutUser === 'function') logoutUser();
              }}
              className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer hover:border-rose-300 shrink-0 whitespace-nowrap"
              title="End Session and Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
