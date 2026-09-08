import React, { useState } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  HardHat, 
  Activity, 
  Lock, 
  Unlock, 
  RefreshCw,
  Zap,
  Clock,
  UserCheck
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const TEST_WORKERS = [
  {
    id: 'pass1',
    name: 'Suresh Kumar',
    role: 'Precision CNC Machinist (Tier 1)',
    company: 'Sterling Bharat Engine Plant',
    status: 'VERIFIED',
    valid: true,
    passId: 'QR-PASS-99824',
    codeTime: 'Expires in 8h 45m',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/80'
  },
  {
    id: 'pass2',
    name: 'Manish Rawat',
    role: 'Contract Assembly Lead',
    company: 'Apex Logistics Corp',
    status: 'UNVERIFIED / EXPIRED',
    valid: false,
    passId: 'QR-PASS-10243',
    codeTime: 'Statutory Form XVI Incomplete',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-950/80'
  }
];

const TurnstileGateSimulator = () => {
  const [selectedWorker, setSelectedWorker] = useState(TEST_WORKERS[0]);
  const [gateState, setGateState] = useState('idle'); // 'idle' | 'scanning' | 'granted' | 'denied'
  const [accessLogs, setAccessLogs] = useState([
    { time: '14:22:10', name: 'Rajesh P.', id: 'PASS-8912', status: 'ACCESS GRANTED', latency: '0.34s' },
    { time: '14:20:45', name: 'Kavita N.', id: 'PASS-7721', status: 'ACCESS GRANTED', latency: '0.38s' },
  ]);

  const handleSimulateScan = () => {
    if (gateState === 'scanning') return;

    soundEngine.playScan();
    setGateState('scanning');

    setTimeout(() => {
      if (selectedWorker.valid) {
        soundEngine.playUnlock();
        setGateState('granted');
        const newLog = {
          time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          name: selectedWorker.name,
          id: selectedWorker.passId,
          status: 'ACCESS GRANTED',
          latency: '0.38s'
        };
        setAccessLogs((prev) => [newLog, ...prev.slice(0, 4)]);
      } else {
        soundEngine.playClick();
        setGateState('denied');
      }

      // Reset after 3.5s
      setTimeout(() => {
        setGateState('idle');
      }, 3500);
    }, 600);
  };

  return (
    <div className="w-full dark-glass-card border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1">
            <HardHat className="w-3.5 h-3.5" />
            <span>INTELLIGENT ACCESS & TURNSTILE CONTROLLER</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
            Workforce Digital Turnstile Gate Simulator
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Experience sub-second biometric QR pass authentication directly integrated with facility turnstiles and plant security gates.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 p-1.5 rounded-2xl font-mono text-xs">
          {TEST_WORKERS.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedWorker(w);
                setGateState('idle');
              }}
              className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                selectedWorker.id === w.id
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {w.valid ? '✅ Valid Pass Profile' : '⚠️ Incomplete Pass Profile'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Digital QR Badge Preview (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="font-mono text-[10px] uppercase text-slate-500 font-bold">
                CANDIDATE PASS CREDENTIAL
              </span>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded border font-bold ${selectedWorker.badgeColor}`}>
                {selectedWorker.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 text-xl font-black font-outfit shadow-md">
                {selectedWorker.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 font-outfit">{selectedWorker.name}</h4>
                <p className="text-xs text-slate-600 font-semibold">{selectedWorker.role}</p>
                <p className="text-[11px] text-amber-700 font-mono mt-0.5">{selectedWorker.company}</p>
              </div>
            </div>

            {/* Simulated Interactive QR Code Card */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-center relative my-3 shadow-inner">
              <QrCode className="w-28 h-28 text-slate-900" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-md">
                  JOY
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2">
              <span>Pass ID: {selectedWorker.passId}</span>
              <span className="text-amber-700 font-bold">{selectedWorker.codeTime}</span>
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={gateState === 'scanning'}
              className="w-full mt-4 py-3.5 rounded-xl font-black font-mono text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{gateState === 'scanning' ? 'Authenticating Turnstile...' : 'Tap Digital QR Pass to Scan'}</span>
            </button>

          </div>
        </div>

        {/* Right Column: 3D Turnstile Gate Physical Simulation (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Turnstile Physical Representation */}
          <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[280px] shadow-inner relative overflow-hidden">
            
            {/* Status Beam Indicator at Top of Gate */}
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-xs text-slate-500 font-bold uppercase">Gate Status:</span>
              {gateState === 'idle' && (
                <span className="font-mono text-xs text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  READY TO SCAN
                </span>
              )}
              {gateState === 'scanning' && (
                <span className="font-mono text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-bold flex items-center gap-1.5 animate-pulse">
                  <Activity className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  AUTHENTICATING (0.38s)...
                </span>
              )}
              {gateState === 'granted' && (
                <span className="font-mono text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ACCESS GRANTED • TURNSTILE UNLOCKED
                </span>
              )}
              {gateState === 'denied' && (
                <span className="font-mono text-xs text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 font-bold flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  ACCESS DENIED • STATUTORY CLEARANCE REQUIRED
                </span>
              )}
            </div>

            {/* Turnstile Physical Barrier Graphic */}
            <div className="w-full max-w-sm flex items-center justify-between gap-4 py-4 px-6 rounded-2xl bg-white border border-slate-200 relative shadow-sm">
              {/* Left Turnstile Pillar */}
              <div className="w-12 h-28 rounded-xl bg-gradient-to-b from-slate-200 to-slate-300 border border-slate-300 flex flex-col items-center justify-between p-2 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                <span className="text-[8px] font-mono text-slate-600 font-bold">PIL-L</span>
              </div>

              {/* Center Barrier Arms (Open or Closed) */}
              <div className="flex-1 flex items-center justify-center relative h-28">
                {gateState === 'granted' ? (
                  <div className="flex items-center gap-6 transition-all duration-500">
                    <div className="w-16 h-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-[0_0_12px_#10b981] -rotate-45 origin-left transition-transform"></div>
                    <div className="w-16 h-2.5 bg-gradient-to-l from-emerald-500 to-teal-500 rounded-full shadow-[0_0_12px_#10b981] rotate-45 origin-right transition-transform"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 transition-all duration-300">
                    <div className={`w-20 h-3 rounded-full transition-colors ${gateState === 'denied' ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]' : 'bg-slate-300'}`}></div>
                    <div className={`w-20 h-3 rounded-full transition-colors ${gateState === 'denied' ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]' : 'bg-slate-300'}`}></div>
                  </div>
                )}
                
                {/* Center Lock Status Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {gateState === 'granted' ? (
                    <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-700 flex items-center justify-center">
                      <Unlock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Turnstile Pillar */}
              <div className="w-12 h-28 rounded-xl bg-gradient-to-b from-slate-200 to-slate-300 border border-slate-300 flex flex-col items-center justify-between p-2 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                <span className="text-[8px] font-mono text-slate-600 font-bold">PIL-R</span>
              </div>
            </div>

          </div>

          {/* Real-time Turnstile Muster Roll Log Feed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 font-mono text-xs shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold border-b border-slate-100 pb-2 mb-2">
              <span className="flex items-center gap-1.5 text-amber-800">
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                <span>LIVE MUSTER ROLL ACCESS STREAM</span>
              </span>
              <span className="text-emerald-700">TURNSTILE GATE 04 ONLINE</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {accessLogs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 py-1 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">[{log.time}]</span>
                    <span className="font-bold text-slate-900">{log.name}</span>
                    <span className="text-slate-500">({log.id})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">{log.status}</span>
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                      {log.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TurnstileGateSimulator;
