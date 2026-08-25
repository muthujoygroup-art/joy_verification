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

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-slate-800 border border-rose-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h2 className="text-lg font-black">Application Runtime Error Encountered</h2>
                <p className="text-xs text-slate-400">The application encountered a component error during render.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto">
              <p className="font-bold">{this.state.error?.toString()}</p>
              <pre className="mt-2 text-[10px] text-slate-500 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
            </div>

            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Clear Session & Reload</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
