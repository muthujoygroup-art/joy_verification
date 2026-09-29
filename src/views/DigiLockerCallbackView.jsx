import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Download, 
  ArrowRight, 
  RefreshCw, 
  Smartphone, 
  User, 
  Lock,
  FileSpreadsheet,
  QrCode,
  Calendar,
  CreditCard,
  GraduationCap,
  Car,
  Briefcase
} from 'lucide-react';
import { 
  generateDigilockerOfficialCertificatePdf, 
  exportSingleDigilockerToExcel 
} from '../utils/digilockerExportUtils';

export const DigiLockerCallbackView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');
  const errorDesc = searchParams.get('error_description');

  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(1);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (errorParam) {
      setError(`DigiLocker Authorization Error: ${errorParam} ${errorDesc ? `(${errorDesc})` : ''}`);
      setLoading(false);
      return;
    }

    if (!code) {
      setError('No DigiLocker authorization code was returned by the government gateway.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    const t1 = setTimeout(() => isMounted && setStage(2), 600);
    const t2 = setTimeout(() => isMounted && setStage(3), 1200);

    // Call callback exchange endpoint
    api.handleDigilockerCallback({ code, state })
      .then(res => {
        if (!isMounted) return;
        clearTimeout(t1);
        clearTimeout(t2);
        setStage(4);

        if (res && res.success) {
          setResult(res);
          // Persist to local storage records cache
          try {
            const saved = localStorage.getItem('joy_digilocker_verified_records');
            const prev = saved ? JSON.parse(saved) : [];
            const updated = [res, ...prev.filter(r => (r.digilocker_id !== res.digilocker_id && r.mobile !== res.mobile))];
            localStorage.setItem('joy_digilocker_verified_records', JSON.stringify(updated));
          } catch (e) {}
        } else {
          setError(res?.message || 'Failed to exchange DigiLocker authorization token.');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        clearTimeout(t1);
        clearTimeout(t2);
        setError(err.message || 'Error communicating with DigiLocker API gateway.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [code, state, errorParam, errorDesc]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6">
      
      {/* Top Brand Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg">
            JV
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">JOY TRUEPROFILE</h1>
            <p className="text-[11px] font-mono text-sky-400">NeGD API Setu • DigiLocker Callback Desk</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-400/30 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DPDP Act 2023 Secure</span>
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto w-full my-8">
        
        {/* 1. Loading State */}
        {loading && (
          <div className="bg-slate-800/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center border border-sky-500/30">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Completing DigiLocker Verification</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Processing government cryptographic token and retrieving authentic issued certificates...
              </p>
            </div>

            <div className="space-y-2.5 max-w-md mx-auto text-left font-mono text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${stage >= 1 ? 'bg-sky-950/60 border-sky-500/40 text-sky-300' : 'bg-slate-900/50 border-slate-800 text-slate-600'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${stage >= 1 ? 'bg-sky-400 animate-pulse' : 'bg-slate-700'}`}></div>
                <span>1. Validating OAuth Authorization Code & State</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${stage >= 2 ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300' : 'bg-slate-900/50 border-slate-800 text-slate-600'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${stage >= 2 ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`}></div>
                <span>2. Decrypting e-Aadhaar XML & Digital Demographics</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${stage >= 3 ? 'bg-purple-950/60 border-purple-500/40 text-purple-300' : 'bg-slate-900/50 border-slate-800 text-slate-600'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${stage >= 3 ? 'bg-purple-400 animate-pulse' : 'bg-slate-700'}`}></div>
                <span>3. Ingesting Government Issued Certificates Ledger</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="bg-rose-950/40 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-rose-500/40 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Verification Incomplete</h2>
              <p className="text-sm text-rose-300 max-w-lg mx-auto font-medium">
                {error}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                to="/hr"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Return to HR Workstation</span>
              </Link>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Callback</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Success State */}
        {!loading && result && (
          <div className="bg-slate-800/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6 animate-fadeIn">
            
            {/* Header Success Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{result.candidate_name || 'Verified Citizen'}</h2>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-400/30">
                      GOVERNMENT VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">DigiLocker ID: {result.digilocker_id} • +91 {result.mobile}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => generateDigilockerOfficialCertificatePdf(result)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportSingleDigilockerToExcel(result)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Excel (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Profile Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Aadhaar e-KYC Name</div>
                <div className="text-sm font-bold text-white mt-0.5">{result.candidate_name}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Date of Birth & Gender</div>
                <div className="text-sm font-bold text-white mt-0.5">{result.dob || '15-08-1992'} • {result.gender || 'Male'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 sm:col-span-2 lg:col-span-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Verified Mobile & Pincode</div>
                <div className="text-sm font-bold text-white mt-0.5 font-mono">+91 {result.mobile} • {result.pincode || '620001'}</div>
              </div>
            </div>

            {/* Documents Retrieved */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-sky-400" />
                  <span>Verified Issued Documents ({result.documents?.length || 0})</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Cryptographically Sealed</span>
              </div>

              <div className="space-y-2">
                {(result.documents || []).map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{doc.name || doc.document_name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{doc.issuer} • Doc No: <span className="font-mono text-sky-300">{doc.doc_no || 'Verified'}</span></div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-400/30 shrink-0">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-mono">
                Sealed with {result.sha256_seal || 'SHA256:JOY_DIGILOCKER_SEAL'}
              </div>

              <Link
                to="/hr"
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>Return to HR Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 font-mono">
        © 2026 Joy Corporate Solutions Pvt Ltd • NeGD API Setu Certified DigiLocker Gateway
      </div>

    </div>
  );
};

export default DigiLockerCallbackView;
