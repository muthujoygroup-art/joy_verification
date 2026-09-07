import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('REACT ERROR BOUNDARY CAUGHT:', error, errorInfo);
    this.setState({ errorInfo });
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

      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-slate-800 border border-rose-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-black">
                  {isChunkError ? 'Application Update Available' : 'Application Runtime Error Encountered'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isChunkError
                    ? 'A newer version of JOY TrueProfile was published. Please reload to load fresh assets.'
                    : 'The application encountered an unexpected runtime component error.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto max-h-48">
              <p className="font-bold">{this.state.error?.toString()}</p>
              {this.state.errorInfo?.componentStack && (
                <pre className="mt-2 text-[10px] text-slate-500 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={this.handleClearAndReload}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/25"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isChunkError ? 'Update & Refresh Workspace' : 'Clear Session & Reload'}</span>
              </button>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = '/login';
                }}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
