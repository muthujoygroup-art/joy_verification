import React, { useState, useEffect } from 'react';
import { 
  X, Server, KeyRound, Globe, Shield, Zap, Check, 
  AlertCircle, Eye, EyeOff, Copy, RefreshCw, Sparkles, CheckCircle2, Lock
} from 'lucide-react';
import { api } from '../services/api';

const PRESET_URLS = [
  { label: 'Neev API Production (81 APIs)', url: 'https://apis.coincircletrust.com/api/v1/apiProduct' },
  { label: 'Sandbox.co.in Production', url: 'https://api.sandbox.co.in/v2' },
  { label: 'API Setu Government Gateway', url: 'https://api.apisetu.gov.in/v2' }
];

export default function ApiGatewayConfigModal({ 
  isOpen, 
  onClose, 
  providerKey = 'server2_coincircle', 
  providerData = {}, 
  onSaveSuccess 
}) {
  const [formData, setFormData] = useState({
    display_name: '',
    endpoint_url: 'https://apis.coincircletrust.com/api/v1/apiProduct',
    api_key: '',
    webhook_url: 'https://verification.joycorporatesolutions.com/api/verification/webhook/callback',
    mode: 'Production (Live Mode)',
    rate_limit_per_min: 5000,
    monthly_quota: 50000,
    is_active: true,
    is_primary: true
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (providerData) {
      setFormData({
        display_name: providerData.name || providerData.display_name || 'Server 2: CoinCircleTrust Gateways (Neev 81 APIs)',
        endpoint_url: providerData.endpointUrl || providerData.endpoint_url || 'https://apis.coincircletrust.com/api/v1/apiProduct',
        api_key: providerData.apiKey || providerData.api_key || providerData.clientId || '',
        webhook_url: providerData.webhookUrl || providerData.webhook_url || 'https://verification.joycorporatesolutions.com/api/verification/webhook/callback',
        mode: providerData.mode || (providerData.sandbox_mode ? 'Sandbox / Staging' : 'Production (Live Mode)'),
        rate_limit_per_min: providerData.rateLimitPerMin || providerData.rate_limit_per_min || 5000,
        monthly_quota: providerData.monthlyQuota || providerData.monthly_quota || 50000,
        is_active: providerData.enabled !== false && providerData.is_active !== false,
        is_primary: providerData.isPrimary || providerData.is_primary || providerKey === 'server2_coincircle'
      });
      setTestStatus(null);
      setSaveSuccessMsg('');
    }
  }, [providerData, providerKey, isOpen]);

  if (!isOpen) return null;

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestConnection = async () => {
    if (!formData.api_key.trim()) {
      setTestStatus({
        success: false,
        message: 'Please enter your CoinCircle API Key before testing.',
        latency: 0
      });
      return;
    }
    setIsTesting(true);
    setTestStatus(null);
    try {
      // Validate the exact endpoint URL and API Key live against CoinCircle
      const res = await api.validateApiGatewayCredentials(formData.endpoint_url, formData.api_key);
      setTestStatus({
        success: res.success,
        message: res.message || (res.success ? 'Gateway API Key verified & active! (HTTP 200 OK)' : 'Authentication failed with CoinCircle'),
        latency: res.latency_ms || 85,
        details: res.raw_response
      });
    } catch (err) {
      setTestStatus({
        success: false,
        message: err.message || 'Connection test failed',
        latency: 0
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.endpoint_url.trim()) {
      alert('Please provide a valid Base Endpoint URL');
      return;
    }

    setIsSaving(true);
    setSaveSuccessMsg('');
    try {
      const payload = {
        display_name: formData.display_name.trim(),
        endpoint_url: formData.endpoint_url.trim(),
        api_key: formData.api_key.trim(),
        webhook_url: formData.webhook_url.trim(),
        sandbox_mode: formData.mode.includes('Sandbox'),
        rate_limit_per_min: parseInt(formData.rate_limit_per_min) || 5000,
        monthly_quota: parseInt(formData.monthly_quota) || 50000,
        is_active: formData.is_active,
        is_primary: formData.is_primary
      };

      const res = await api.updateApiConfig(providerKey, payload);
      setSaveSuccessMsg('API Gateway credentials and Base URL saved directly to PostgreSQL database!');
      
      if (onSaveSuccess) {
        onSaveSuccess(providerKey, payload, res);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      alert('Failed to save API Configuration: ' + (err.message || 'Server error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="glass-panel w-full max-w-2xl bg-slate-900 border-2 border-indigo-500/50 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900/90 via-slate-900 to-purple-900/80 border-b border-indigo-800/60 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
              <Server className="w-6 h-6 text-indigo-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-black uppercase font-mono">
                  {providerKey}
                </span>
                {formData.is_primary && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>PRIMARY ENGINE</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white truncate mt-0.5">
                Configure API Gateway Credentials & Base URLs
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 overflow-y-auto scrollbar-thin">
          
          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Provider Display Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Provider Display Name</span>
              <span className="text-[10px] text-slate-500 font-normal">Shown across verification portals</span>
            </label>
            <input
              type="text"
              required
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Server 2: CoinCircleTrust Gateways (Neev 81 APIs)"
            />
          </div>

          {/* Base Endpoint URL with 1-Click Presets */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Base Endpoint URL</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-bold">Appended with verification slugs</span>
            </label>
            
            <div className="relative">
              <input
                type="text"
                required
                value={formData.endpoint_url}
                onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs font-mono text-indigo-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-10"
                placeholder="https://apis.coincircletrust.com/api/v1/apiProduct"
              />
              <button
                type="button"
                onClick={() => handleCopy('url', formData.endpoint_url)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Copy URL"
              >
                {copiedField === 'url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Presets Quick Selector */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-400 font-bold">1-Click Presets:</span>
              {PRESET_URLS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, endpoint_url: p.url })}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    formData.endpoint_url === p.url
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-400'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary API Key (x-api-key) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>API Key / Header Key (x-api-key)</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Dispatched in HTTP Header</span>
            </label>
            
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                required
                value={formData.api_key}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs font-mono text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-amber-500 pr-20"
                placeholder="Enter your live Neev / CoinCircleTrust API Key"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  title={showApiKey ? "Hide Key" : "Show Key"}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy('api_key', formData.api_key)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  title="Copy API Key"
                >
                  {copiedField === 'api_key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Used automatically across all 81 candidate verification checks and SuperAdmin live diagnostic sandboxes.
            </p>
          </div>

          {/* Operational Controls: Mode, Rate Limit, Primary Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Gateway Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Production (Live Mode)">Production (Live Mode)</option>
                <option value="Sandbox / Staging">Sandbox / Staging</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Rate Limit (req/min)</label>
              <input
                type="number"
                value={formData.rate_limit_per_min}
                onChange={(e) => setFormData({ ...formData, rate_limit_per_min: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Monthly Quota</label>
              <input
                type="number"
                value={formData.monthly_quota}
                onChange={(e) => setFormData({ ...formData, monthly_quota: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

          </div>

          {/* Test Status Banner */}
          {testStatus && (
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
              testStatus.success 
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300' 
                : 'bg-amber-950/60 border-amber-500/80 text-amber-300'
            }`}>
              <div className="flex items-center gap-2">
                {testStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                <span>{testStatus.message}</span>
              </div>
              {testStatus.latency > 0 && (
                <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-900">
                  {testStatus.latency} ms
                </span>
              )}
            </div>
          )}

          {/* Modal Footer / Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !formData.endpoint_url}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing Gateway...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Connection Now</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-initial"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-superadmin px-6 py-2.5 text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-900/50 cursor-pointer flex-1 sm:flex-initial justify-center"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save & Sync Credentials</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
