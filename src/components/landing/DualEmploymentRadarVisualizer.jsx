import React, { useState } from 'react';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw,
  Zap,
  Activity,
  FileSpreadsheet,
  Lock,
  Layers
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

export const DualEmploymentRadarVisualizer = () => {
  const [scenario, setScenario] = useState('violation'); // 'violation' | 'clean'
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  const handleToggleScenario = (mode) => {
    soundEngine.playClick();
    setScenario(mode);
    triggerScanAnimation();
  };

  const triggerScanAnimation = () => {
    soundEngine.playScan();
    setIsScanning(true);
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        soundEngine.playSuccess();
      }
    }, 35);
  };

  return (
    <div className="w-full dark-glass-card border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Top Header & Scenario Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>AI MOONLIGHTING & CONFLICT OF INTEREST SCANNER</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
            Detect Secondary Jobs Before You Hire
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
            See how JOY Verification spots overlapping employment and undeclared second jobs in real time to protect your company's intellectual property.
          </p>
        </div>

        {/* Interactive Scenario Toggle Buttons */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shrink-0 text-xs">
          <button
            onClick={() => handleToggleScenario('violation')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              scenario === 'violation'
                ? 'bg-rose-100 text-rose-800 border border-rose-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Simulate Moonlighting</span>
          </button>

          <button
            onClick={() => handleToggleScenario('clean')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              scenario === 'clean'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulate Clean Record</span>
          </button>
        </div>
      </div>

      {/* Main Split View: 7-Cols Timeline Radar + 5-Cols 3D AI Scanner Render */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Interactive Timeline Matrix */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 overflow-hidden shadow-md relative flex flex-col justify-between">
          
          {/* Scanning Laser Line */}
          {isScanning && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-orange-400 to-rose-500 shadow-[0_0_15px_#f59e0b] z-30 pointer-events-none transition-all duration-75"
              style={{ left: `${scanProgress}%` }}
            />
          )}

          <div>
            {/* Timeline Header (Years Axis) */}
            <div className="grid grid-cols-6 gap-2 text-center text-[11px] sm:text-xs text-slate-500 border-b border-slate-200 pb-3 mb-5 font-mono font-medium">
              <span>2021</span>
              <span>2022</span>
              <span>2023</span>
              <span>2024</span>
              <span>2025</span>
              <span className="text-amber-700 font-bold">2026 (NOW)</span>
            </div>

            {/* Company Stream 1: Primary Full-Time Job */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 font-outfit truncate">
                    Primary Employer: Global IT Solutions Ltd
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold shrink-0">
                  Active Primary Job
                </span>
              </div>

              <div className="w-full h-10 bg-slate-200/80 rounded-xl border border-slate-300/70 relative overflow-hidden p-1">
                <div className="h-full w-[88%] bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 rounded-lg flex items-center px-3 text-[11px] font-bold text-white shadow-md truncate">
                  <span>Jan 2021 – Present (Verified Primary Payroll Stream)</span>
                </div>
              </div>
            </div>

            {/* Company Stream 2: Secondary Overlapping or Past Job */}
            {scenario === 'violation' ? (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-rose-700">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="font-bold text-xs sm:text-sm text-rose-800 font-outfit truncate">
                      Second Job: Apex Web Systems
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold animate-pulse shrink-0">
                    OVERLAPPING JOB DETECTED
                  </span>
                </div>

                <div className="w-full h-10 bg-slate-200/80 rounded-xl border border-rose-300 relative overflow-hidden p-1">
                  <div className="h-full w-[52%] bg-gradient-to-r from-rose-600 to-orange-600 rounded-lg flex items-center px-3 text-[11px] font-bold text-white shadow-lg relative ml-[36%] truncate">
                    <span>Jul 2023 – Present (Overlap: 28 Months)</span>
                    <span className="absolute right-2 top-2.5 w-2 h-2 rounded-full bg-yellow-300 animate-ping"></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-bold text-xs sm:text-sm text-emerald-800 font-outfit truncate">
                      Past Employer: Sterling Infotech Ltd (Relieved)
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold shrink-0">
                    CLEAN EXIT CONFIRMED
                  </span>
                </div>

                <div className="w-full h-10 bg-slate-200/80 rounded-xl border border-emerald-300 relative overflow-hidden p-1">
                  <div className="h-full w-[35%] bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center px-3 text-[11px] font-bold text-white shadow-md truncate">
                    <span>Jan 2019 – Dec 2020 (Official Relieving Letter Verified)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Verdict Box */}
          <div
            className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
              scenario === 'violation'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  scenario === 'violation'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                }`}
              >
                {scenario === 'violation' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider block font-bold text-slate-500">
                  VERIFICATION AUDIT RESULT
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-outfit">
                  {scenario === 'violation'
                    ? '⚠️ Conflict Flag: Active Dual-Employment Found'
                    : '✅ Clean Record: Zero Overlapping Tenures Found'}
                </h4>
              </div>
            </div>

            <button
              onClick={triggerScanAnimation}
              disabled={isScanning}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-2xs self-start sm:self-auto"
            >
              <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-amber-600' : 'text-slate-600'}`} />
              <span>Re-Scan</span>
            </button>
          </div>

        </div>

        {/* Right Column: 3D Isometric AI Scanner & Passbook Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-md relative overflow-hidden group">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span className="font-mono text-[10px] text-slate-700 font-bold uppercase tracking-wider">
                AI DUAL-EMPLOYMENT SCANNER
              </span>
            </div>
            <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${
              scenario === 'violation' 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {scenario === 'violation' ? 'RISK: HIGH (94.2%)' : 'RISK: LOW (0.01%)'}
            </span>
          </div>

          {/* 3D Image Viewport */}
          <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-200 bg-slate-950 shadow-inner group-hover:scale-[1.01] transition-transform duration-500">
            <img
              src="/assets/3d/corporate_3d_bgv.jpg"
              alt="3D Dual-Employment Fraud Scanner & Passbook"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95"
              loading="lazy"
            />

            {/* Scanning Radar Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-amber-500/10 pointer-events-none animate-pulse flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-2 border-amber-400 animate-ping opacity-60"></div>
              </div>
            )}

            {/* Overlaid Badges */}
            <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-lg border border-amber-400/50 font-mono text-[9px] text-amber-300 font-bold flex items-center gap-1 shadow-md">
              <Activity className="w-3 h-3 text-amber-400" />
              <span>EPFO UAN Audit Engine</span>
            </div>

            <div className="absolute bottom-2 right-2 bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-lg border border-emerald-400/50 font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1 shadow-md">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Form 26AS Cryptographic Sync</span>
            </div>
          </div>

          {/* Micro Telemetry Details */}
          <div className="mt-3.5 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">UAN Record Match:</span>
              <span className="font-bold text-slate-800">1004XXXX7729 (Masked)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Parallel Monthly Contributions:</span>
              <span className={`font-bold ${scenario === 'violation' ? 'text-rose-700' : 'text-emerald-700'}`}>
                {scenario === 'violation' ? '2 Active PF Remittances Detected' : '1 Single Verified Remittance Stream'}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DualEmploymentRadarVisualizer;
