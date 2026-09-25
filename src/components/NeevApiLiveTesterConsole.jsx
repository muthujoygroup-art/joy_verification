import React, { useState, useEffect } from 'react';
import { 
  Play, Check, AlertCircle, Clock, Server, Search, Filter, 
  Copy, RefreshCw, ChevronRight, Terminal, Zap, ShieldCheck, Database
} from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_CATEGORIES = [
  'All Endpoints',
  'Identity Verification',
  'Financial & Credit',
  'Banking & UPI',
  'Business & Compliance',
  'Vehicle & RC',
  'Employment & UAN',
  'Court & Criminal'
];

export default function NeevApiLiveTesterConsole({ activeProvider }) {
  const [catalogue, setCatalogue] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Endpoints');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [payloadInput, setPayloadInput] = useState('{}');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    loadCatalogue();
  }, []);

  const loadCatalogue = async () => {
    try {
      const res = await api.getApiGatewayCatalogue();
      if (res && res.endpoints) {
        setCatalogue(res.endpoints);
        if (res.endpoints.length > 0) {
          selectEndpoint(res.endpoints[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch dynamic catalogue, using built-in endpoints:', err);
    }
  };

  const selectEndpoint = (ep) => {
    setSelectedEndpoint(ep);
    setPayloadInput(JSON.stringify(ep.sample || {}, null, 2));
    setTestResult(null);
  };

  const filteredEndpoints = catalogue.filter((ep) => {
    const matchesCategory = selectedCategory === 'All Endpoints' || 
      (ep.category && ep.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0]));
    const matchesSearch = searchQuery === '' || 
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ep.desc && ep.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleExecuteTest = async () => {
    if (!selectedEndpoint) return;
    setIsLoading(true);
    setTestResult(null);
    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(payloadInput || '{}');
    } catch (e) {
      alert('Invalid JSON in Request Payload box: ' + e.message);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.testApiGatewayEndpoint(selectedEndpoint.path, parsedPayload);
      setTestResult(res);
    } catch (err) {
      setTestResult({
        success: false,
        error_message: err.message || 'Network request failed',
        http_ok: false,
        latency_ms: 0,
        response_data: { error: err.message }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 border-2 border-purple-200 bg-white text-slate-900 rounded-3xl shadow-xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-[11px] font-black uppercase tracking-wider">
              Neev API Gateway v1.0 • 81 Active Endpoints
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
              Base URL: https://apis.coincircletrust.com/api/v1/apiProduct
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-purple-600" />
            <span>Interactive Live API Testing Console</span>
          </h3>
          <p className="text-xs text-slate-600 max-w-3xl">
            Test any of the 81 institutional verification endpoints in real-time with your SuperAdmin API Key. Inspect live HTTP responses, verify JSON payload mappings, and monitor gateway latencies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadCatalogue}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Catalogue ({catalogue.length})</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {DEFAULT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 81 endpoints (e.g. pan, aadhaar, uan, rc)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Endpoint List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-2 max-h-[560px] overflow-y-auto">
          <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Available Endpoints ({filteredEndpoints.length})</span>
            <span className="text-[10px] text-purple-700 font-bold">POST Flat JSON</span>
          </div>

          <div className="space-y-1.5">
            {filteredEndpoints.map((ep) => {
              const isSelected = selectedEndpoint?.path === ep.path;
              return (
                <button
                  key={ep.path + ep.id}
                  type="button"
                  onClick={() => selectEndpoint(ep)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                    isSelected
                      ? 'bg-purple-50 border-purple-500 text-purple-950 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
                        POST
                      </span>
                      <span className="text-xs font-bold truncate">{ep.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 block truncate mt-0.5">
                      {ep.path}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-purple-600 translate-x-0.5' : 'text-slate-400'}`} />
                </button>
              );
            })}

            {filteredEndpoints.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs font-medium">
                No matching endpoints found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right: Request & Response Inspector (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {selectedEndpoint ? (
            <div className="space-y-4">
              
              {/* Endpoint Meta Banner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black font-mono">
                        HTTP POST
                      </span>
                      <span className="text-sm font-black text-slate-900">{selectedEndpoint.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                        {selectedEndpoint.category}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-purple-700 block break-all font-semibold">
                      https://apis.coincircletrust.com/api/v1/apiProduct{selectedEndpoint.path}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteTest}
                    disabled={isLoading}
                    className="btn btn-superadmin text-xs py-2.5 px-5 font-black shrink-0 cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Execute Live Call</span>
                      </>
                    )}
                  </button>
                </div>

                {selectedEndpoint.desc && (
                  <p className="text-xs text-slate-600 pt-1 border-t border-slate-200">
                    {selectedEndpoint.desc}
                  </p>
                )}
              </div>

              {/* Request Payload Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-700 px-1 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-purple-600" />
                    <span>Request Body (Flat JSON)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPayloadInput(JSON.stringify(selectedEndpoint.sample || {}, null, 2))}
                    className="text-[11px] text-purple-700 hover:text-purple-900 font-bold cursor-pointer"
                  >
                    Reset to Sample
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={payloadInput}
                  onChange={(e) => setPayloadInput(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 border border-slate-700 rounded-2xl text-emerald-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder='{"aadhaar_number": "555555555555"}'
                />
              </div>

              {/* Live Test Results Output Inspector */}
              {testResult && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        testResult.success || testResult.http_ok
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {testResult.success ? 'HTTP 200 OK • SUCCESS' : 'LIVE GATEWAY RESPONSE'}
                      </span>
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>Latency: <strong>{testResult.latency_ms || 45} ms</strong></span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(testResult.response_data)}
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-bold"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied!' : 'Copy JSON'}</span>
                    </button>
                  </div>

                  {testResult.error_message && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{testResult.error_message}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">
                      Upstream Payload Tree
                    </span>
                    <pre className="p-3 bg-slate-900 rounded-xl border border-slate-700 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[260px] scrollbar-thin">
                      {JSON.stringify(testResult.response_data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-medium">
              Select an endpoint from the left to view request parameters and execute live tests.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
