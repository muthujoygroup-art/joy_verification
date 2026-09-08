import React, { useState, useEffect } from 'react';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Calendar, 
  Building2, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const DualEmploymentRadarVisualizer = () => {
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
    <div className="w-full dark-glass-card border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Top Header & Scenario Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>INTELLIGENT DUAL-EMPLOYMENT RADAR</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Moonlighting & Conflict Matrix Visualizer
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Simulate how JOY TrueProfile extracts employment tenures and spots concurrent overlapping contributions in real time.
          </p>
        </div>

        {/* Interactive Scenario Toggle Buttons */}
        <div className="flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/15 shrink-0 font-mono text-xs">
          <button
            onClick={() => handleToggleScenario('violation')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              scenario === 'violation'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Overlap Violation</span>
          </button>

          <button
            onClick={() => handleToggleScenario('clean')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              scenario === 'clean'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulate Clean Career</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Timeline Matrix Area */}
      <div className="relative bg-[#050811]/90 border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-inner">
        
        {/* Scanning Laser Line */}
        {isScanning && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-indigo-400 to-purple-500 shadow-[0_0_15px_#818cf8] z-30 pointer-events-none transition-all duration-75"
            style={{ left: `${scanProgress}%` }}
          ></div>
        )}

        {/* Timeline Header (Years Axis) */}
        <div className="grid grid-cols-6 gap-2 text-center font-mono text-xs text-slate-400 border-b border-white/10 pb-3 mb-6">
          <span>2021</span>
          <span>2022</span>
          <span>2023</span>
          <span>2024</span>
          <span>2025</span>
          <span className="text-cyan-400 font-bold">2026 (CURRENT)</span>
        </div>

        {/* Company Stream 1: Primary Full-Time Job */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-sm text-white font-outfit">Primary Employer: Global IT Solutions Ltd</span>
            </div>
            <span className="font-mono text-[11px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
              Full-Time • Active
            </span>
          </div>

          <div className="w-full h-10 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden p-1">
            <div className="h-full w-[85%] bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-lg flex items-center px-3 text-xs font-mono font-bold text-white shadow-md">
              <span>Jan 2021 – Present (62 Months Verified Service)</span>
            </div>
          </div>
        </div>

        {/* Company Stream 2: Secondary Overlapping or Past Job */}
        {scenario === 'violation' ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-bold text-sm text-rose-300 font-outfit">
                  Undeclared Secondary Stream: Apex Web Systems
                </span>
              </div>
              <span className="font-mono text-[11px] text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40 font-bold animate-pulse">
                CONCURRENT OVERLAP DETECTED
              </span>
            </div>

            {/* Overlapping bar starting from 2023 to 2026 */}
            <div className="w-full h-10 bg-white/5 rounded-xl border border-rose-500/40 relative overflow-hidden p-1">
              <div
                className="h-full w-[50%] bg-gradient-to-r from-rose-600 to-amber-600 rounded-lg flex items-center px-3 text-xs font-mono font-bold text-white shadow-lg relative ml-[35%]"
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
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-bold text-sm text-emerald-300 font-outfit">
                  Prior Employer: Sterling Infotech Ltd (Past Verified)
                </span>
              </div>
              <span className="font-mono text-[11px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                PROPERLY RELIEVED • 0 OVERLAPS
              </span>
            </div>

            {/* Clean past bar 2021 to 2022 */}
            <div className="w-full h-10 bg-white/5 rounded-xl border border-emerald-500/30 relative overflow-hidden p-1">
              <div className="h-full w-[30%] bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center px-3 text-xs font-mono font-bold text-white shadow-md">
                <span>Jan 2019 – Dec 2020 (Relieved)</span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Radar Verdict Box */}
        <div
          className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono transition-all ${
            scenario === 'violation'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                scenario === 'violation'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              }`}
            >
              {scenario === 'violation' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider block font-bold text-slate-300">
                RADAR INTEGRITY VERDICT
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white font-outfit">
                {scenario === 'violation'
                  ? '⚠️ High Integrity Risk: 1 Concurrent Moonlighting Stream Identified'
                  : '✅ 100% Clean Career Path: Zero Overlapping Tenures Detected'}
              </h4>
            </div>
          </div>

          <button
            onClick={triggerScanAnimation}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Re-Scan Timeline</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default DualEmploymentRadarVisualizer;
