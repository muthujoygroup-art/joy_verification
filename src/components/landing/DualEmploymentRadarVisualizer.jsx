import React, { useState } from 'react';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw,
  Zap
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
            <span>MOONLIGHTING & CONFLICT DETECTION</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
            Detect Secondary Jobs Before You Hire
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
            See how JOY Verification spots overlapping employment and undeclared second jobs in real time to protect your company.
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

      {/* Main Interactive Timeline Matrix Area */}
      <div className="relative bg-slate-50/90 border border-slate-200 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-inner">
        
        {/* Scanning Laser Line (Warm Amber) */}
        {isScanning && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-orange-400 to-rose-500 shadow-[0_0_15px_#f59e0b] z-30 pointer-events-none transition-all duration-75"
            style={{ left: `${scanProgress}%` }}
          />
        )}

        {/* Timeline Header (Years Axis) */}
        <div className="grid grid-cols-6 gap-2 text-center text-xs text-slate-500 border-b border-slate-200 pb-3 mb-6 font-medium">
          <span>2021</span>
          <span>2022</span>
          <span>2023</span>
          <span>2024</span>
          <span>2025</span>
          <span className="text-amber-700 font-bold">2026 (CURRENT)</span>
        </div>

        {/* Company Stream 1: Primary Full-Time Job */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-sm text-slate-900 font-outfit">Primary Employer: Global IT Solutions Ltd</span>
            </div>
            <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-bold">
              Full-Time • Active Job
            </span>
          </div>

          <div className="w-full h-10 bg-slate-200/80 rounded-xl border border-slate-300/70 relative overflow-hidden p-1">
            <div className="h-full w-[85%] bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 rounded-lg flex items-center px-3 text-xs font-bold text-slate-950 shadow-md">
              <span>Jan 2021 – Present (Verified Full-Time Employment)</span>
            </div>
          </div>
        </div>

        {/* Company Stream 2: Secondary Overlapping or Past Job */}
        {scenario === 'violation' ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-rose-700">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-bold text-sm text-rose-800 font-outfit">
                  Second Concurrent Job: Apex Web Systems
                </span>
              </div>
              <span className="text-[11px] text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 font-bold animate-pulse">
                OVERLAPPING EMPLOYMENT DETECTED
              </span>
            </div>

            {/* Overlapping bar starting from 2023 to 2026 */}
            <div className="w-full h-10 bg-slate-200/80 rounded-xl border border-rose-300 relative overflow-hidden p-1">
              <div
                className="h-full w-[50%] bg-gradient-to-r from-rose-600 to-orange-600 rounded-lg flex items-center px-3 text-xs font-bold text-white shadow-lg relative ml-[35%]"
              >
                <span>Jul 2023 – Present (Overlap: 28 Months)</span>
                {/* Flashing Warning Strip */}
                <span className="absolute right-2 top-1.5 w-2 h-2 rounded-full bg-yellow-300 animate-ping"></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-bold text-sm text-emerald-800 font-outfit">
                  Previous Employer: Sterling Infotech Ltd (Past Job)
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                PROPERLY RELIEVED • CLEAN TRANSITION
              </span>
            </div>

            {/* Clean past bar 2021 to 2022 */}
            <div className="w-full h-10 bg-slate-200/80 rounded-xl border border-emerald-300 relative overflow-hidden p-1">
              <div className="h-full w-[30%] bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center px-3 text-xs font-bold text-white shadow-md">
                <span>Jan 2019 – Dec 2020 (Official Exit Confirmed)</span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Verdict Box */}
        <div
          className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
            scenario === 'violation'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                scenario === 'violation'
                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              }`}
            >
              {scenario === 'violation' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider block font-bold text-slate-500">
                VERIFICATION OUTCOME
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 font-outfit">
                {scenario === 'violation'
                  ? '⚠️ Conflict of Interest: Active Overlapping Second Job Found'
                  : '✅ Clean Employment Record: Zero Overlapping Jobs Found'}
              </h4>
            </div>
          </div>

          <button
            onClick={triggerScanAnimation}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Re-Check Timeline</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default DualEmploymentRadarVisualizer;
