import React, { useState } from 'react';
import { 
  Clock, 
  RefreshCw, 
  LogOut, 
  Activity, 
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ActiveSessionBadge = () => {
  const { sessionData, sessionTtlSeconds = 1800, refreshUserSession, logoutUser, activeRole = 'superadmin' } = useApp() || {};
  const [showPopover, setShowPopover] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatTtl = (seconds) => {
    const s = typeof seconds === 'number' && !isNaN(seconds) ? Math.max(0, seconds) : 1800;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (typeof refreshUserSession === 'function') {
      await refreshUserSession();
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const isLowTtl = (sessionTtlSeconds || 1800) < 300; // < 5 mins

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        className={`flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border shadow-sm ${
          isLowTtl 
            ? 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
        }`}
        title="Active Session Status & Telemetry"
      >
        <span className={`w-2 h-2 rounded-full ${isLowTtl ? 'bg-rose-500' : 'bg-emerald-500 animate-ping'}`} />
        <Clock className="w-3.5 h-3.5" />
        <span className="font-mono font-extrabold">{formatTtl(sessionTtlSeconds)}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {showPopover && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-slate-900 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Live Session & Load Balancer</span>
            </div>
            <span className="badge badge-emerald text-[9px]">Active 🟢</span>
          </div>

          <div className="space-y-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Active Role:</span>
              <strong className="text-slate-900 uppercase font-bold">{activeRole || 'SUPERADMIN'}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Session ID:</span>
              <strong className="text-indigo-700 font-mono text-[10px]">{sessionData?.sessionId || 'sess_active_098'}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Cluster Node:</span>
              <span className="badge badge-cyan text-[9px]">joy-cluster-node-01</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Time to Expiry:</span>
              <strong className="font-mono text-emerald-800 font-bold">{formatTtl(sessionTtlSeconds)}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn btn-secondary text-xs flex-1 py-1.5 flex items-center justify-center gap-1 font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>+30 Mins</span>
            </button>

            <button
              onClick={() => {
                setShowPopover(false);
                if (typeof logoutUser === 'function') logoutUser();
              }}
              className="btn btn-rose text-xs py-1.5 px-3 flex items-center gap-1 font-bold"
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
