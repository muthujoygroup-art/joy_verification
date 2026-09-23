import React from 'react';
import { AlertTriangle, RefreshCw, Home, LifeBuoy, ShieldAlert } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, errorId: null, showTechDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('REACT ERROR BOUNDARY CAUGHT:', error, errorInfo);
    this.setState({ errorInfo });

    // Generate unique error incident reference ID: ERR-YYYYMMDD-HEX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randHex = Math.random().toString(16).slice(2, 8).toUpperCase();
    const incidentId = `ERR-${dateStr}-${randHex}`;
    this.setState({ errorId: incidentId });

    // Automatically send incident telemetry to SuperAdmin error logging database in background
    try {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      let portalName = 'Public Web Portal';
      if (pathname.includes('/superadmin')) portalName = 'SuperAdmin Portal';
      else if (pathname.includes('/hr')) portalName = 'HR Executive Portal';
      else if (pathname.includes('/company')) portalName = 'Company Admin Portal';
      else if (pathname.includes('/verify') || pathname.includes('/candidate')) portalName = 'Employee Verification Link';

      const userRole = localStorage.getItem('joy_auth_role') || 'guest';
      const currentUser = localStorage.getItem('joy_auth_user');

      const payload = {
        section: 'React UI Runtime ErrorBoundary',
        error_code: 'ERR_REACT_COMPONENT_CRASH',
        message: error?.message || String(error) || 'Unhandled React component runtime exception',
        portal: portalName,
        function_name: errorInfo?.componentStack ? errorInfo.componentStack.split('\n').filter(Boolean)[0]?.trim().slice(0, 90) : 'React.render',
        stack_trace: `${error?.stack || ''}\n\nComponent Hierarchy:\n${errorInfo?.componentStack || ''}`,
        user_info: {
          incidentId,
          url: typeof window !== 'undefined' ? window.location.href : '',
          role: userRole,
          currentUser: currentUser ? JSON.parse(currentUser) : null,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
        },
        severity: 'Critical'
      };

      fetch('/api/superadmin/system/error-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Background error reporting notice:', err));
    } catch (e) {
      console.warn('Could not dispatch ErrorBoundary telemetry:', e);
    }
  }

  handleClearAndReload = async () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('joy_active_tour');
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    } catch (e) {
      console.warn('Error clearing storage/cache:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || this.state.error?.toString() || '';
      const isChunkError = errorMsg.includes('Failed to fetch dynamically imported module') ||
        errorMsg.includes('Loading chunk') ||
        errorMsg.includes('error loading dynamically imported module') ||
        this.state.error?.name === 'ChunkLoadError';

      const userRole = typeof localStorage !== 'undefined' ? localStorage.getItem('joy_auth_role') : null;
      const isSuperAdmin = userRole === 'superadmin' || (typeof window !== 'undefined' && window.location.pathname.includes('superadmin'));

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
            {/* Friendly Branded Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              {isChunkError ? <RefreshCw className="w-8 h-8 animate-spin" /> : <ShieldAlert className="w-8 h-8" />}
            </div>

            {/* Polite, Reassuring User-Facing Message */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isChunkError ? 'System Update Available' : 'Temporary Service Hiccup'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                {isChunkError
                  ? 'A fresh update of JOY TrueProfile was published. Please click below to refresh and load the latest version.'
                  : 'We are experiencing a momentary server synchronization delay. Please try again in a few moments.'}
              </p>
            </div>

            {/* Reference Tracking ID (Polite & Traceable) */}
            {this.state.errorId && (
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-slate-400">Incident Reference:</span>
                <span className="font-bold text-amber-400 tracking-wider">#{this.state.errorId}</span>
              </div>
            )}

            {/* SuperAdmin Diagnostic Expandable (Only for Admin Debugging) */}
            {isSuperAdmin && (
              <div className="text-left pt-1">
                <button
                  type="button"
                  onClick={() => this.setState(prev => ({ showTechDetails: !prev.showTechDetails }))}
                  className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  {this.state.showTechDetails ? 'Hide SuperAdmin Technical Trace ▲' : 'SuperAdmin Diagnostic Trace ▼'}
                </button>
                {this.state.showTechDetails && (
                  <div className="mt-2 p-3 bg-black/80 rounded-xl border border-rose-900/50 text-[10px] font-mono text-rose-300 overflow-x-auto max-h-40">
                    <p className="font-bold text-rose-400">{this.state.error?.toString()}</p>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-1 text-slate-500 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleClearAndReload}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isChunkError ? 'Refresh Workspace' : 'Try Again 🔄'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = '/login';
                }}
                className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-400" />
                <span>Return to Login</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <LifeBuoy className="w-3.5 h-3.5 text-slate-400" />
              <span>Need immediate assistance? Contact <strong className="text-slate-400">support@joycorporatesolutions.com</strong></span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
