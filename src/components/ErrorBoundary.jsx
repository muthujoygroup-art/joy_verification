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

      // Auto-reload once silently on chunk load error
      if (isChunkError && typeof window !== 'undefined') {
        const lastReload = sessionStorage.getItem('joy_auto_chunk_reload');
        if (!lastReload) {
          sessionStorage.setItem('joy_auto_chunk_reload', 'true');
          window.location.reload();
          return null;
        }
      }

      // If fallback provided by parent component, render that
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Non-intrusive recovery banner instead of blocking full-screen takeover
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Application Refreshing</h3>
              <p className="text-xs text-slate-300 mt-1">
                A component update occurred. Click below to continue smoothly.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleClearAndReload}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
