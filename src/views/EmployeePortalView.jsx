import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { FullJoiningFormModal } from '../components/FullJoiningFormModal';
import { OfficialVerificationCertificateModal } from '../components/OfficialVerificationCertificateModal';
import { EmployeeProfileDossierModal } from '../components/EmployeeProfileDossierModal';
import { LivePhotoCaptureModal } from '../components/LivePhotoCaptureModal';
import { AiFaceMatchModal } from '../components/AiFaceMatchModal';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  Lock, 
  Download, 
  BarChart2, 
  FileEdit, 
  FileCheck2, 
  RefreshCw, 
  Zap, 
  Award, 
  FileText,
  UserCheck,
  Scan,
  Scale,
  Mail,
  Database,
  Loader2,
  Check,
  Cpu
} from 'lucide-react';

export const EmployeePortalView = () => {
  const { 
    candidates, 
    selectedCandidateToken, 
    setSelectedCandidateToken, 
    getActiveCandidate, 
    updateCandidateVerification, 
    showToast, 
    setRoleView 
  } = useApp();
  const candidate = getActiveCandidate();

  const [showAadhaarOtpModal, setShowAadhaarOtpModal] = useState(false);
  const [showMobileOtpModal, setShowMobileOtpModal] = useState(false);
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [showLivePhotoModal, setShowLivePhotoModal] = useState(false);
  const [showAiFaceMatchModal, setShowAiFaceMatchModal] = useState(false);
  const [aiFaceMatchData, setAiFaceMatchData] = useState(null);
  const [showDocDownloader, setShowDocDownloader] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showLaborDossierModal, setShowLaborDossierModal] = useState(false);
  const [showFullJoiningModal, setShowFullJoiningModal] = useState(false);

  // Aadhaar Live Data Fetching & e-KYC telemetry states
  const [isFetchingAadhaarData, setIsFetchingAadhaarData] = useState(false);
  const [aadhaarFetchProgress, setAadhaarFetchProgress] = useState(0);
  const [aadhaarFetchStep, setAadhaarFetchStep] = useState(0);
  const [fetchedAadhaarProfile, setFetchedAadhaarProfile] = useState(null);
  const [showAadhaarSuccessCard, setShowAadhaarSuccessCard] = useState(false);

  const [aadhaarInputOtp, setAadhaarInputOtp] = useState('');
  const [mobileInputOtp, setMobileInputOtp] = useState('');
  const [emailInputOtp, setEmailInputOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(candidate?.verificationsCompleted?.email || false);
  const [candidateConsentAgreed, setCandidateConsentAgreed] = useState(true);
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);

  // 🔒 Security Passcode & 15-Minute Link Expiry States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeDigits, setPasscodeDigits] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 minutes = 900s

  const isAllComplete = candidate?.status === 'Verified';

  // 15-Minute Active Countdown Timer
  useEffect(() => {
    if (!isUnlocked) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isUnlocked]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleUnlockSubmit = (e) => {
    if (e) e.preventDefault();
    if (passcodeDigits.length < 4) {
      setPasscodeError('Please enter a 4-digit passcode / PIN.');
      return;
    }
    setPasscodeError('');
    setIsUnlocked(true);
    showToast(`🔓 Welcome ${candidate?.name || 'Candidate'}! 15-Minute e-KYC Session Authenticated.`);
  };

  const handleInstantDemoUnlock = () => {
    setPasscodeDigits('1234');
    setPasscodeError('');
    setIsUnlocked(true);
    showToast(`🔓 Welcome ${candidate?.name || 'Candidate'}! 15-Minute Session Authenticated.`);
  };

  useEffect(() => {
    if (isAllComplete) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, [isAllComplete]);

  if (!candidate) {
    return (
      <div className="glass-panel p-8 text-center max-w-lg mx-auto my-12 space-y-4 bg-white border-slate-200 shadow-xl rounded-2xl">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
        <h3 className="text-xl font-bold text-slate-900">Invalid or Expired Verification Link</h3>
        <p className="text-xs text-slate-500 font-medium">Please request your HR executive to resend the magic verification token.</p>
        <button onClick={() => setRoleView('hrexecutive')} className="btn btn-hrexecutive text-xs font-bold">Return to HR Workstation</button>
      </div>
    );
  }

  // 🔒 1. CANDIDATE SECURITY PASSCODE GATEWAY (DPDP Act 2023 Access Control)
  if (!isUnlocked) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border-2 border-indigo-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 animate-modal-spring relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />
          
          <div className="text-center space-y-2">
            <img src="/joy_logo.png" alt="JOY Logo" className="w-14 h-14 object-contain mx-auto" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Secure Gateway</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Welcome, {candidate.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Employer: <strong className="text-slate-900">{candidate.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}</strong>
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1">
            <span className="font-bold block">🔒 Security Passcode Required</span>
            <p className="text-[11px] leading-relaxed">
              Please enter your 4-digit security PIN sent in your onboarding SMS/WhatsApp to unlock your 15-minute verification session.
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter 4-Digit Security Passcode / PIN</label>
              <input 
                type="password" 
                maxLength={6} 
                autoFocus
                placeholder="• • • •" 
                value={passcodeDigits}
                onChange={(e) => setPasscodeDigits(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none font-bold"
              />
              {passcodeError && (
                <p className="text-[11px] text-rose-600 font-bold mt-1.5">{passcodeError}</p>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer btn-interactive flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Onboarding Portal</span>
            </button>

            <button
              type="button"
              onClick={handleInstantDemoUnlock}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all cursor-pointer btn-interactive flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>⚡ Quick Unlock for Testing (Demo: 1234)</span>
            </button>
          </form>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Session: 15-Min TTL</span>
            <span className="text-emerald-700 font-bold">256-Bit Encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  // ⏳ 2. 15-MINUTE LINK EXPIRED SCREEN
  if (secondsRemaining <= 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border-2 border-rose-300 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-center text-slate-900 animate-modal-spring">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">15-Minute Link Window Expired</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              For candidate data security under Section 7(a) of the DPDP Act 2023, verification links are restricted to a 15-minute lifecycle.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSecondsRemaining(900);
              showToast('🔄 15-Minute Session Re-Activated!');
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs shadow-md transition-all cursor-pointer btn-interactive flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>🔄 Re-Activate 15-Minute Session</span>
          </button>
        </div>
      </div>
    );
  }

  const { verificationConfig = {}, verificationsCompleted = {} } = candidate;

  const isAadhaarReq = verificationConfig.aadhaar ?? verificationConfig.requireAadhaar ?? true;
  const isMobileReq = verificationConfig.mobileOtp ?? verificationConfig.requireMobileOtp ?? true;
  const isFaceReq = verificationConfig.faceCapture ?? verificationConfig.requireFaceMatch ?? true;
  const isPanReq = verificationConfig.pan ?? verificationConfig.requirePAN ?? false;
  const isBankReq = verificationConfig.bankCheck ?? verificationConfig.requireBankCheck ?? false;
  const isDlReq = verificationConfig.drivingLicense ?? verificationConfig.requireDL ?? false;
  const isPassportReq = verificationConfig.passport ?? false;
  const isUanReq = verificationConfig.uan ?? false;

  const requiredStepKeys = [
    isAadhaarReq && 'aadhaar',
    isMobileReq && 'mobile',
    isFaceReq && 'face',
    isPanReq && 'pan',
    isBankReq && 'bankCheck',
    isDlReq && 'drivingLicense',
    isPassportReq && 'passport',
    isUanReq && 'uan'
  ].filter(Boolean);

  const totalConfiguredSteps = requiredStepKeys.length || 3;
  const completedStepsCount = requiredStepKeys.filter(k => !!verificationsCompleted[k]).length;
  const progressPercentage = Math.round((completedStepsCount / totalConfiguredSteps) * 100);

  // ⚡ 1-Click Quick Mock Verification (Simulate Passing All HR-Configured Steps)
  const handleQuickMockVerifyAll = () => {
    const samplePortrait = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
    const sampleSnaps = {
      straight: samplePortrait,
      livePhoto: samplePortrait,
      left: samplePortrait,
      right: samplePortrait,
      confidence: 99.4,
      capturedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    requiredStepKeys.forEach(k => {
      updateCandidateVerification(candidate.token, k, true);
    });
    updateCandidateVerification(candidate.token, 'faceImages', sampleSnaps);

    showToast('⚡ Quick Mock Verify Passed: All HR-configured verification steps completed with live server signatures!');
    confetti({ particleCount: 100, spread: 80 });
  };

  const handleLivePhotoCaptured = (photoUrl, metadata) => {
    updateCandidateVerification(candidate.token, 'face', true);
    updateCandidateVerification(candidate.token, 'faceImages', {
      straight: photoUrl,
      livePhoto: photoUrl,
      left: photoUrl,
      right: photoUrl,
      confidence: metadata?.confidence || 99.4,
      capturedAt: metadata?.capturedAt || new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
    showToast('📸 Live Selfie Captured! Launching AI Face Biometric Match with Aadhaar...');
    setShowAiFaceMatchModal(true);
  };

  const handleSendAadhaarOtp = () => {
    setShowAadhaarOtpModal(true);
    setAadhaarInputOtp('');
  };

  const handleVerifyAadhaarOtpSubmit = (e) => {
    e.preventDefault();
    if (aadhaarInputOtp.length < 4) {
      alert('Please enter 6-digit OTP code.');
      return;
    }
    setShowAadhaarOtpModal(false);
    setIsFetchingAadhaarData(true);
    setAadhaarFetchProgress(15);
    setAadhaarFetchStep(0); // Connecting to CIDR

    // Step 1: Connecting to CIDR
    setTimeout(() => {
      setAadhaarFetchProgress(45);
      setAadhaarFetchStep(1); // Validating 256-bit XML signature & OTP
    }, 700);

    // Step 2: Extracting e-KYC record
    setTimeout(() => {
      setAadhaarFetchProgress(80);
      setAadhaarFetchStep(2); // Fetching official demographic e-KYC record & high-res portrait
    }, 1400);

    // Step 3: Populating master profile
    setTimeout(() => {
      setAadhaarFetchProgress(100);
      setAadhaarFetchStep(3);

      const fetchedData = {
        name: candidate.name || 'Rajesh Suresh Kumar',
        fatherName: 'Suresh Kumar',
        dob: '1996-05-15',
        gender: 'Male',
        maskedAadhaar: candidate.aadhaarNo ? `XXXX XXXX ${candidate.aadhaarNo.slice(-4)}` : 'XXXX XXXX 9876',
        address: '124, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        pincode: '560103',
        uidaiTxnId: `UIDAI-TXN-${Date.now().toString().slice(-8)}`,
        verifiedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
        xmlSignature: 'VALID_SHA256_RSA_2048'
      };

      setFetchedAadhaarProfile(fetchedData);
      setIsFetchingAadhaarData(false);
      setShowAadhaarSuccessCard(true);
      updateCandidateVerification(candidate.token, 'aadhaar', true);
      showToast('🎉 UIDAI e-KYC Data Fetched & Verified Successfully! Profile updated with official government records.');
      confetti({ particleCount: 90, spread: 70 });
    }, 2200);
  };

  const handleSendMobileOtp = () => {
    setShowMobileOtpModal(true);
    setMobileInputOtp('');
  };

  const handleVerifyMobileOtpSubmit = (e) => {
    e.preventDefault();
    if (mobileInputOtp.length < 4) {
      alert('Please enter valid 6-digit Mobile OTP.');
      return;
    }
    updateCandidateVerification(candidate.token, 'mobile', true);
    setShowMobileOtpModal(false);
    showToast('📱 Mobile Number SMS OTP Verified Successfully!');
  };

  const handleSendEmailOtp = () => {
    setShowEmailOtpModal(true);
    setEmailInputOtp('');
  };

  const handleVerifyEmailOtpSubmit = (e) => {
    e.preventDefault();
    if (emailInputOtp.length < 4) {
      alert('Please enter valid 6-digit Email OTP.');
      return;
    }
    setIsEmailVerified(true);
    updateCandidateVerification(candidate.token, 'email', true);
    setShowEmailOtpModal(false);
    showToast('📧 Official Email Verified via OTP Code!');
    confetti({ particleCount: 70, spread: 60 });
  };

  const currentCapturedPhoto = candidate.faceImages?.livePhoto || candidate.faceImages?.straight;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16 text-slate-900">
      
      {/* 🔄 INTERACTIVE DEMO CANDIDATE SELECTOR BAR */}
      <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Switch Candidate Scenario:</span>
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {candidates.map(c => {
            const isSelected = candidate?.token === c.token;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCandidateToken(c.token)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white ring-2 ring-indigo-400 shadow-sm scale-102'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                  c.status === 'Submitted - Pending HR Review' ? 'bg-amber-400 text-amber-950 animate-pulse' :
                  c.status === 'Corrections Requested' ? 'bg-rose-400 text-rose-950' :
                  c.status === 'Verified' ? 'bg-emerald-400 text-emerald-950' : 'bg-slate-600 text-white'
                }`}>
                  {c.status === 'Submitted - Pending HR Review' ? 'Pending HR Review' : c.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🏢 SECTION 1: EMPLOYER VERIFICATION INVITATION HEADER */}
      <div className="glass-panel p-6 sm:p-7 border-2 border-slate-200/90 bg-white relative overflow-hidden rounded-3xl shadow-sm space-y-5">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            {/* Live Captured Photo Avatar or Initials */}
            {currentCapturedPhoto ? (
              <div className="relative shrink-0">
                <img 
                  src={currentCapturedPhoto} 
                  alt={candidate.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-2xl border-2 border-indigo-200 shadow-sm shrink-0">
                {candidate.name?.charAt(0) || 'E'}
              </div>
            )}
            
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-indigo text-[10px] font-black">CANDIDATE ONBOARDING</span>
                <span className="text-xs text-slate-500 font-bold">• Official Employment Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{candidate.name}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Role: <strong className="text-slate-800">{candidate.designation || 'Specialist'}</strong> • Dept: <strong className="text-slate-800">{candidate.dept || 'Engineering'}</strong> • ID: <code className="text-slate-700 font-bold font-mono">{candidate.empId || 'EMP-2026-88'}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* ⏳ 15-Minute Session Countdown Indicator */}
            <div className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black flex items-center gap-1.5 border shadow-xs ${
              secondsRemaining < 180 
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Expires: {formatTimer(secondsRemaining)}</span>
            </div>

            {/* ⚡ 1-Click Quick Mock Verification */}
            {!isAllComplete && (
              <button
                onClick={handleQuickMockVerifyAll}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all hover:scale-102 cursor-pointer btn-interactive"
                title="Simulate passing all verification gates instantly"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
                <span>⚡ Auto Verify</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsUnlocked(false);
                setRoleView('login');
              }}
              className="btn btn-secondary text-xs py-1.5 px-3 font-bold cursor-pointer btn-interactive text-rose-700 hover:bg-rose-50 hover:border-rose-300"
              title="Lock and Exit Verification Session"
            >
              🚪 Exit Session
            </button>
          </div>
        </div>

        {/* 💬 ALWAYS-VISIBLE TOP HR MESSAGE & INSTRUCTIONS BANNER */}
        <div className="p-4 bg-indigo-50/95 border-2 border-indigo-200 rounded-2xl text-xs text-indigo-950 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between font-extrabold text-indigo-900">
            <div className="flex items-center gap-2">
              <span className="text-base">💬</span>
              <span className="text-xs uppercase tracking-wider">Instructions from HR Department ({candidate.hrName || 'PRAVEEN B'}):</span>
            </div>
            <span className="badge badge-indigo text-[9px]">HR Direct Message</span>
          </div>
          <p className="text-indigo-950 font-semibold pl-6 leading-relaxed text-[12px]">
            "{candidate.hrCustomMessage || 'Welcome to JOY CORPORATE SOLUTIONS PRIVATE LIMITED! Please review your onboarding particulars, upload your original KYC and academic certificates, and complete verification by this week.'}"
          </p>
        </div>

        {/* ⚠️ URGENT CORRECTION REQUEST BANNER (IF HR RESENT WITH REMARKS) */}
        {candidate.status === 'Corrections Requested' && (
          <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl text-xs text-rose-950 space-y-2.5 shadow-xs animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-rose-900">
                <span className="text-lg">⚠️</span>
                <span className="text-sm">Action Required: HR Requested Corrections</span>
              </div>
              <span className="badge badge-rose text-[9px]">Corrections Pending</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-rose-200 text-rose-900 font-medium">
              <strong className="block text-[11px] text-rose-950 mb-0.5">HR Remarks & Instructions:</strong>
              {candidate.hrCorrectionRemarks || "Please re-upload a clearer PAN card image and verify your residential address details."}
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-rose-700 font-medium">
                Please update the highlighted sections in the joining form and re-submit.
              </p>
              <button
                type="button"
                onClick={() => setShowFullJoiningModal(true)}
                className="btn btn-rose text-xs py-1.5 px-3.5 font-black shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Fix & Update Joining Form</span>
              </button>
            </div>
          </div>
        )}

        {/* ⏳ SUBMITTED - PENDING HR REVIEW BANNER */}
        {candidate.status === 'Submitted - Pending HR Review' && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs text-amber-950 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-amber-900">
                <span className="text-base">⏳</span>
                <span>Onboarding Form & Documents Submitted — Under HR Review</span>
              </div>
              <span className="badge badge-amber text-[9px]">Under HR Review</span>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
              Your onboarding particulars, uploaded original documents, and statutory compliance declarations were successfully transmitted to HR on <strong className="font-mono">{candidate.lastSubmittedAt || 'today'}</strong>. HR is currently reviewing your submission. You will receive an SMS/WhatsApp once verified.
            </p>
          </div>
        )}

        {/* ⚡ ATTENTION & CANDIDATE GUIDELINES BANNER */}
        <div className="p-4 bg-slate-950 text-white rounded-2xl space-y-2.5 shadow-md border border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-black text-xs uppercase tracking-wider text-amber-300">Important Candidate Attention & Guidelines</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-200">
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-white block font-bold">1. Legal Identity Match</strong>
              <p className="text-slate-300 leading-snug">Ensure Full Legal Name, Father's Name, and DOB match your Government Aadhaar & PAN Card exactly.</p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-white block font-bold">2. Clear Original Document Scans</strong>
              <p className="text-slate-300 leading-snug">Upload high-resolution color scans or sharp phone photos of original documents (not photocopies).</p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-white block font-bold">3. Review Statutory Declarations</strong>
              <p className="text-slate-300 leading-snug">Check your Form 16A TDS, Form 11 EPFO, and Form F Gratuity nominations before digital sign-off.</p>
            </div>
          </div>
        </div>

        {/* 📝 HERO CALL-TO-ACTION: FILL FULL JOINING FORM & UPLOAD DOCUMENTS */}
        <div className="p-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-400/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Step 1 of 2: Master Profile
              </span>
              <span className="text-indigo-200 text-xs font-bold">• 9 Comprehensive Sections</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Candidate Onboarding Joining Form & Document Vault
            </h3>
            <p className="text-xs text-indigo-100 font-medium">
              Fill Personal Details, Address, Govt Proofs, Education, Bank Payroll, Upload Original Files with Live Previews & Sign Form 16A/11/F/NDA.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFullJoiningModal(true)}
            className="btn bg-white text-indigo-900 hover:bg-indigo-50 border-0 text-xs font-black py-3 px-5 flex items-center gap-2 shrink-0 shadow-md cursor-pointer rounded-xl transition-all hover:scale-103"
          >
            <FileEdit className="w-4 h-4 text-indigo-700" />
            <span>📝 Fill Full Joining Form</span>
          </button>
        </div>

        {/* Employer Verification Notice Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Requesting Organization</span>
            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{candidate.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Verification Infrastructure</span>
            <div className="font-extrabold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>JOY Corporate Solutions 256-Bit</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Encrypted Magic Token</span>
            <div className="font-mono font-bold text-slate-900 truncate">
              {candidate.token}
            </div>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>Identity & Document Verification Progress</span>
            </span>
            <span className="text-indigo-700 font-black">{completedStepsCount} of {totalConfiguredSteps} Checks Completed ({progressPercentage}%)</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              style={{ width: `${progressPercentage}%` }} 
              className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* 📜 SECTION 2: TRANSPARENT DATA DISCLOSURE & DPDP ACT 2023 CANDIDATE CONSENT GATE */}
      <div className="p-6 border-2 border-indigo-500/50 bg-slate-950 text-white rounded-3xl shadow-xl space-y-4">
        
        {/* Header & Policy Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  DPDP Act 2023 Statutory Privacy Disclosure
                </span>
                <span className="text-[11px] text-slate-300 font-mono hidden sm:inline">• Section 6(1) Notice</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Employer Data Authorization & Purpose Notice
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowLegalHandbook(true)}
            className="btn bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/40 text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold self-start sm:self-auto cursor-pointer btn-interactive"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Read Privacy Handbook 📖</span>
          </button>
        </div>

        {/* Transparency Explanation Cards */}
        <div className="text-xs text-slate-200 space-y-3 leading-relaxed">
          <p className="text-slate-300">
            Your prospective employer (<strong className="text-white">{candidate.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}</strong>) has requested your authorization to verify your submitted identity and employment credentials for payroll onboarding, EPFO compliance, and background security checks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] font-medium text-slate-200 pt-1">
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <strong className="text-indigo-300 font-bold block">🔒 Irreversible Masking</strong>
              <span className="text-slate-300">Aadhaar numbers are processed in UIDAI-compliant masked format (<code>XXXX-XXXX-9876</code>).</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <strong className="text-sky-300 font-bold block">⏱️ 60-Day Purge Policy</strong>
              <span className="text-slate-300">Verification records automatically expire after 60 days in compliance with ISO 27001 standards.</span>
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
              <strong className="text-emerald-300 font-bold block">🛡️ Verified Sources Only</strong>
              <span className="text-slate-300">Queries official databases (UIDAI, NSDL Income Tax, EPFO, MoRTH, NPCI Bank Gateway).</span>
            </div>
          </div>
        </div>

        {/* Affirmative Consent Checkbox */}
        <label className="flex items-start gap-3 p-3.5 bg-slate-900 rounded-2xl border border-slate-800 cursor-pointer text-xs font-bold text-white hover:bg-slate-850 transition-all">
          <input 
            type="checkbox"
            checked={candidateConsentAgreed}
            onChange={(e) => setCandidateConsentAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/40 bg-slate-800 accent-indigo-500 shrink-0" 
          />
          <span className="leading-snug text-slate-200">
            I understand the verification purpose and grant voluntary affirmative consent to authenticate my records with government repositories and institutional verification servers.
          </span>
        </label>
      </div>

      {/* 📄 SECTION 3: COMPREHENSIVE ONBOARDING FORM GATE */}
      <div 
        data-tour-step="candidate-docs-gate"
        className="glass-panel p-5 sm:p-6 border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl shadow-sm"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 font-bold shrink-0 border border-indigo-100">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-900 text-base">Comprehensive Employee Joining Form</h4>
              <span className="badge badge-purple text-[10px]">9 Sections • Document Vault • Form 16A/11/F/NDA</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Fill and review Personal Demographics, Contact, KYC Proofs, Employment, Education, Bank Payroll, Nominee details, Upload Original Evidence & Execute Statutory Agreements.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFullJoiningModal(true)}
          className="btn btn-superadmin text-xs flex items-center gap-2 shrink-0 shadow-md font-black py-2.5 px-4 cursor-pointer"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Open Full Joining Form (9 Sections)</span>
        </button>
      </div>

      {/* HR Configured Document Verification Checklist Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Required Identity & Document Verification Steps ({completedStepsCount}/{totalConfiguredSteps})</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Verification requests selected specifically by your HR manager</p>
          </div>

          <span className="text-xs text-slate-500 font-bold">
            Status: <span className={isAllComplete ? 'text-emerald-700' : 'text-amber-700'}>{candidate.status}</span>
          </span>
        </div>

        {/* 🔑 OTP VS AUTOMATED API NOTICE STRIP */}
        <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-600 text-white font-black text-[10px]">OTP GATES</span>
            <span className="font-bold text-slate-800">Only 3 Items Require OTP: Aadhaar UIDAI, Mobile Number & Official Email</span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded border">
            All other checks are verified via automated government database lookups
          </span>
        </div>

        {/* STEP 1: Aadhaar UIDAI OTP & Live Data Fetching */}
        {isAadhaarReq && (
          <div 
            data-tour-step="candidate-aadhaar-gate"
            className={`glass-panel p-5 border transition-all bg-white rounded-2xl shadow-sm space-y-3 ${
              verificationsCompleted.aadhaar ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  verificationsCompleted.aadhaar ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}>
                  🆔
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-slate-900 text-base">1. Aadhaar UIDAI OTP & Live e-KYC Fetching</h4>
                    <span className="badge badge-indigo text-[10px]">Requires 6-Digit UIDAI OTP</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Aadhaar Number: <code className="text-slate-900 font-mono font-bold">{candidate.aadhaarNo || '5489 1234 9876'}</code> • Fetches Official Govt Demographic Profile
                  </p>
                </div>
              </div>

              {verificationsCompleted.aadhaar ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aadhaar e-KYC Verified ✓</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendAadhaarOtp}
                    className="btn btn-secondary text-[11px] py-1 px-2.5 font-bold cursor-pointer"
                    title="Re-fetch Aadhaar e-KYC Data"
                  >
                    Re-Fetch
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSendAadhaarOtp}
                  className="btn btn-superadmin text-xs flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Verify Aadhaar OTP & Fetch Data</span>
                </button>
              )}
            </div>

            {/* 📋 AUTHORITATIVE UIDAI e-KYC FETCHED PROFILE CONFIRMATION CARD */}
            {(verificationsCompleted.aadhaar || showAadhaarSuccessCard) && (
              <div className="p-4 bg-white rounded-xl border-2 border-emerald-300 shadow-2xs space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <strong className="text-xs text-emerald-950 font-black uppercase tracking-wider">
                      Authoritative UIDAI e-KYC Data Fetched & Sealed into Master Profile
                    </strong>
                  </div>
                  <span className="badge badge-emerald text-[9px]">100% Demographic Match</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-bold">Fetched Full Name</span>
                    <strong className="text-slate-900 font-bold">{fetchedAadhaarProfile?.name || candidate.name}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-bold">Fetched Father's Name</span>
                    <strong className="text-slate-900 font-bold">{fetchedAadhaarProfile?.fatherName || 'Suresh Kumar'}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-bold">Date of Birth & Gender</span>
                    <strong className="text-slate-900 font-bold">{fetchedAadhaarProfile?.dob || '1996-05-15'} ({fetchedAadhaarProfile?.gender || 'Male'})</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="text-[10px] text-slate-500 block font-bold">Verified UIDAI Registered Address</span>
                  <p className="text-slate-900 font-medium mt-0.5">
                    {fetchedAadhaarProfile?.address || '124, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-2">
                  <span>Txn ID: {fetchedAadhaarProfile?.uidaiTxnId || 'UIDAI-TXN-88129014'}</span>
                  <span className="text-emerald-700 font-bold">Auto-Populated into Joining Form ✓</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Mobile Number SMS OTP */}
        {isMobileReq && (
          <div 
            data-tour-step="candidate-mobile-gate"
            className={`glass-panel p-5 border transition-all bg-white rounded-2xl shadow-sm ${
              verificationsCompleted.mobile ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  verificationsCompleted.mobile ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-sky-100 text-sky-800 border border-sky-200'
                }`}>
                  📱
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-slate-900 text-base">2. Mobile Number SMS OTP Verification</h4>
                    <span className="badge badge-cyan text-[10px]">Requires 6-Digit SMS OTP</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Registered Mobile: <strong className="text-slate-900 font-mono">{candidate.mobile}</strong> • Telemetry Gateway
                  </p>
                </div>
              </div>

              {verificationsCompleted.mobile ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mobile SMS OTP Verified ✓</span>
                </div>
              ) : (
                <button 
                  onClick={handleSendMobileOtp}
                  className="btn btn-company text-xs flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send Mobile OTP</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Official Email Address OTP Verification */}
        <div 
          className={`glass-panel p-5 border transition-all bg-white rounded-2xl shadow-sm ${
            (verificationsCompleted.email || isEmailVerified) ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                (verificationsCompleted.email || isEmailVerified) ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-purple-100 text-purple-800 border border-purple-200'
              }`}>
                ✉️
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 text-base">3. Official Email Address OTP Verification</h4>
                  <span className="badge badge-purple text-[10px]">Requires 6-Digit Email OTP</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Email Address: <strong className="text-slate-900 font-mono">{candidate.email}</strong> • SMTP Inbox Dispatch
                </p>
              </div>
            </div>

            {(verificationsCompleted.email || isEmailVerified) ? (
              <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Email OTP Verified ✓</span>
              </div>
            ) : (
              <button 
                onClick={handleSendEmailOtp}
                className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold shadow-md bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-purple-700" />
                <span>Verify Email OTP</span>
              </button>
            )}
          </div>
        </div>

        {/* STEP 3: Live Photo & Biometric Face Verification */}
        {isFaceReq && (
          <div 
            data-tour-step="candidate-face-gate"
            className={`glass-panel p-5 border transition-all bg-white rounded-2xl shadow-sm ${
              verificationsCompleted.face ? 'border-emerald-300 bg-emerald-50/50' : 'border-amber-300 bg-amber-50/20'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  verificationsCompleted.face ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  📸
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-slate-900 text-base">4. 3D AI Live Photo & Face Biometrics</h4>
                    <span className="badge badge-purple text-[10px]">AI FaceNet + ArcFace 512D</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Capture employee live face portrait & perform age-compensated biometric matching with Aadhaar e-KYC photo.
                  </p>
                  
                  {currentCapturedPhoto && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={currentCapturedPhoto} 
                          alt="Employee Portrait" 
                          className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-400 shadow-xs"
                        />
                        <div className="text-[11px]">
                          <span className="text-emerald-800 font-black block flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>97.6% AI Biometric Match with Aadhaar</span>
                          </span>
                          <span className="text-slate-500 font-mono text-[10px]">
                            Age-Progression Calibrated (Δ 7 Yrs) • Anti-Spoof: 99.4%
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAiFaceMatchModal(true)}
                        className="btn btn-secondary text-[11px] py-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200 font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                        <span>View AI Face Analysis</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {verificationsCompleted.face ? (
                  <>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Live Photo Verified ✓</span>
                    </div>

                    <button 
                      onClick={() => setShowLivePhotoModal(true)}
                      className="btn btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 font-bold cursor-pointer"
                      title="Retake Live Photo"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowLivePhotoModal(true)}
                    className="btn btn-employee text-xs flex items-center gap-1.5 font-bold shadow-md px-4 py-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>📸 Capture Live Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PAN Card NSDL Verification & Aadhaar Link */}
        {isPanReq && (
          <div className={`glass-panel p-5 border transition-all bg-white rounded-2xl shadow-sm ${
            verificationsCompleted.pan ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  verificationsCompleted.pan ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}>
                  💳
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base">PAN Card Tax Identity & Aadhaar Link</h4>
                    <span className="badge badge-indigo text-[10px]">Server 1 / Server 2</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    PAN Number: <strong className="text-slate-900 font-mono">{candidate.panNo || 'ABCDE1234F'}</strong> • NSDL Status & Name Match
                  </p>
                </div>
              </div>

              {verificationsCompleted.pan ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PAN & Link Verified ✓</span>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    updateCandidateVerification(candidate.token, 'pan', true);
                    showToast('💳 PAN Card Verified via NSDL Database & Linked with Aadhaar!');
                  }}
                  className="btn btn-superadmin text-xs flex items-center gap-1.5 font-bold shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify PAN Identity</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Bank Account Penny Drop IMPS */}
        {isBankReq && (
          <div className={`glass-panel p-5 border transition-all bg-white rounded-2xl shadow-sm ${
            verificationsCompleted.bankCheck ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  verificationsCompleted.bankCheck ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  🏦
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base">Bank Account Verification (Penny Drop ₹1)</h4>
                    <span className="badge badge-emerald text-[10px]">Server 1 / Server 2</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Account: <code className="text-slate-900 font-mono font-bold">{candidate.bankAccountNo || '50100234129845'}</code> ({candidate.bankName || 'HDFC Bank'})
                  </p>
                </div>
              </div>

              {verificationsCompleted.bankCheck ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bank Account Verified ✓</span>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    updateCandidateVerification(candidate.token, 'bankCheck', true);
                    showToast('🏦 Bank Account Verified via IMPS Penny Drop (Account Holder Matched)!');
                  }}
                  className="btn btn-company text-xs flex items-center gap-1.5 font-bold shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Bank Account</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Passport MEA Verification (Server 2 Exclusive) */}
        {isPassportReq && (
          <div className={`glass-panel p-5 border transition-all bg-white rounded-2xl shadow-sm ${
            verificationsCompleted.passport ? 'border-purple-300 bg-purple-50/40' : 'border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  verificationsCompleted.passport ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}>
                  🛂
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base">Passport Verification (MEA Direct)</h4>
                    <span className="badge badge-purple text-[10px]">Server 2 (CoinCircleTrust ⚡)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Passport File Number: <strong className="text-slate-900 font-mono">{candidate.passportNo || 'J8912401'}</strong> • Ministry of External Affairs Verified
                  </p>
                </div>
              </div>

              {verificationsCompleted.passport ? (
                <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-xs bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passport MEA Verified ✓</span>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    updateCandidateVerification(candidate.token, 'passport', true);
                    showToast('🛂 Passport Number Authenticated via MEA Direct Database (Server 2)!');
                  }}
                  className="btn btn-superadmin text-xs flex items-center gap-1.5 font-bold shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Passport (Server 2)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 7: EPFO UAN Dual Employment History (Server 2 Exclusive) */}
        {isUanReq && (
          <div className={`glass-panel p-5 border transition-all bg-white rounded-2xl shadow-sm ${
            verificationsCompleted.uan ? 'border-purple-300 bg-purple-50/40' : 'border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  verificationsCompleted.uan ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}>
                  🏢
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base">EPFO UAN Dual Employment & Moonlighting Check</h4>
                    <span className="badge badge-purple text-[10px]">Server 2 (CoinCircleTrust ⚡)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    UAN Number: <strong className="text-slate-900 font-mono">{candidate.uanEpf || '100982341209'}</strong> • Past Service Passbook History & Overlap Detection
                  </p>
                </div>
              </div>

              {verificationsCompleted.uan ? (
                <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-xs bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>EPFO UAN Verified (Zero Moonlighting) ✓</span>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    updateCandidateVerification(candidate.token, 'uan', true);
                    showToast('🏢 EPFO Employment Service History & Moonlighting Audit Completed (Server 2)!');
                  }}
                  className="btn btn-superadmin text-xs flex items-center gap-1.5 font-bold shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify EPFO History (Server 2)</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Aadhaar OTP Modal */}
      {showAadhaarOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                <span>Aadhaar UIDAI OTP Verification</span>
              </h3>
              <button onClick={() => setShowAadhaarOtpModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              A 6-digit OTP code was sent to registered Aadhaar mobile for <strong className="text-slate-900 font-mono">{candidate.aadhaarNo}</strong>.
            </p>

            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-center text-xs text-indigo-900 font-medium">
              <span>💡 Test Sandbox OTP: </span>
              <strong className="text-indigo-900 font-mono text-sm tracking-wider font-bold">123456</strong>
            </div>

            <form onSubmit={handleVerifyAadhaarOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit OTP *</label>
                <input 
                  type="text" 
                  maxLength="6"
                  required
                  autoFocus
                  placeholder="123456"
                  value={aadhaarInputOtp}
                  onChange={(e) => setAadhaarInputOtp(e.target.value)}
                  className="form-input text-center text-lg font-mono tracking-widest font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAadhaarOtpModal(false)} className="btn btn-secondary text-xs">Cancel</button>
                <button type="submit" className="btn btn-superadmin text-xs font-bold shadow-md">Verify Aadhaar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile OTP Modal */}
      {showMobileOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-600" />
                <span>Mobile Number SMS OTP Verification</span>
              </h3>
              <button onClick={() => setShowMobileOtpModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              SMS verification code dispatched to mobile <strong className="text-slate-900 font-mono">{candidate.mobile}</strong>.
            </p>

            <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-center text-xs text-sky-900 font-medium">
              <span>💡 Test Sandbox OTP: </span>
              <strong className="text-sky-900 font-mono text-sm tracking-wider font-bold">123456</strong>
            </div>

            <form onSubmit={handleVerifyMobileOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit SMS Code *</label>
                <input 
                  type="text" 
                  maxLength="6"
                  required
                  autoFocus
                  placeholder="123456"
                  value={mobileInputOtp}
                  onChange={(e) => setMobileInputOtp(e.target.value)}
                  className="form-input text-center text-lg font-mono tracking-widest font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowMobileOtpModal(false)} className="btn btn-secondary text-xs">Cancel</button>
                <button type="submit" className="btn btn-company text-xs font-bold shadow-md">Verify Mobile OTP</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✉️ EMAIL OTP VERIFICATION MODAL */}
      {showEmailOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" />
                <span>Official Email Address OTP Check</span>
              </h3>
              <button onClick={() => setShowEmailOtpModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              A 6-digit confirmation code was sent to your registered inbox at <strong className="text-slate-900 font-mono">{candidate.email}</strong>.
            </p>

            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center text-xs text-purple-900 font-medium">
              <span>💡 Test Sandbox Email OTP: </span>
              <strong className="text-purple-900 font-mono text-sm tracking-wider font-bold">839102</strong>
            </div>

            <form onSubmit={handleVerifyEmailOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit Email OTP *</label>
                <input 
                  type="text" 
                  maxLength="6"
                  required
                  autoFocus
                  placeholder="839102"
                  value={emailInputOtp}
                  onChange={(e) => setEmailInputOtp(e.target.value)}
                  className="form-input text-center text-lg font-mono tracking-widest font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEmailOtpModal(false)} className="btn btn-secondary text-xs cursor-pointer">Cancel</button>
                <button type="submit" className="btn btn-secondary text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-md cursor-pointer">Verify Email OTP</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📡 ENGAGING REAL-TIME UIDAI e-KYC DATA FETCHING RADAR MODAL */}
      {isFetchingAadhaarData && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <div className="bg-slate-950 text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/40 shadow-2xl space-y-6 relative overflow-hidden text-center animate-scaleIn">
            
            {/* Ambient Background Glow & Radar Pulse */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />

            {/* High-Tech Animated Radar Scanner */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-indigo-400/50 animate-pulse" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Database className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>

            {/* Title & Live Percentage */}
            <div className="space-y-1">
              <span className="badge badge-indigo text-[10px] uppercase font-mono tracking-widest">
                UIDAI CIDR GATEWAY 256-BIT e-KYC
              </span>
              <h3 className="text-xl font-black text-white">Fetching Official Aadhaar Data...</h3>
              <p className="text-xs text-slate-400 font-mono">
                Demographic XML Decryption • {aadhaarFetchProgress}% Complete
              </p>
            </div>

            {/* Glowing Active Progress Meter */}
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div 
                style={{ width: `${aadhaarFetchProgress}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500"
              />
            </div>

            {/* Engaging Telemetry Steps */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 text-left space-y-2.5 text-xs font-mono">
              {[
                { title: 'Connecting to UIDAI Central Data Repository (CIDR)', done: aadhaarFetchStep >= 1, active: aadhaarFetchStep === 0 },
                { title: 'Validating 256-Bit e-KYC Session & OTP Signature', done: aadhaarFetchStep >= 2, active: aadhaarFetchStep === 1 },
                { title: 'Extracting Demographic XML (Name, Father, DOB, Address)', done: aadhaarFetchStep >= 3, active: aadhaarFetchStep === 2 },
                { title: 'Populating Employee Master Profile & Digital Seal', done: aadhaarFetchStep >= 3, active: aadhaarFetchStep === 3 }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {step.done ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
                    ) : step.active ? (
                      <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700 block" />
                    )}
                    <span className={step.done ? 'text-emerald-300 font-bold' : step.active ? 'text-white font-bold' : 'text-slate-500'}>
                      {step.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {step.done ? 'DONE' : step.active ? 'LIVE' : 'WAIT'}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400">
              🔒 Encrypted under Section 29 of Aadhaar Act 2016
            </div>

          </div>
        </div>
      )}

      {/* 📸 Dedicated Live Photo Capture Modal */}
      {showLivePhotoModal && (
        <LivePhotoCaptureModal
          isOpen={showLivePhotoModal}
          currentPhoto={currentCapturedPhoto}
          onClose={() => setShowLivePhotoModal(false)}
          onPhotoCaptured={handleLivePhotoCaptured}
        />
      )}

      {/* 🤖 AI Face Match & Age Progression Verification Modal */}
      {showAiFaceMatchModal && (
        <AiFaceMatchModal
          isOpen={showAiFaceMatchModal}
          onClose={() => setShowAiFaceMatchModal(false)}
          livePhotoUrl={currentCapturedPhoto}
          liveCaptureTimestamp={candidate.faceImages?.capturedAt}
          aadhaarPhotoUrl={fetchedAadhaarProfile?.photo || candidate.faceImages?.aadhaarRef || null}
          aadhaarUpdateDate={fetchedAadhaarProfile?.lastUpdated || "2019-03-12"}
          candidateDob={fetchedAadhaarProfile?.dob || candidate.dob || "1996-05-15"}
          candidateName={candidate.name}
          onConfirmMatch={(matchResult) => {
            setAiFaceMatchData(matchResult);
            if (matchResult.isPassed) {
              showToast(`✅ AI Biometric Face Match Verified (${matchResult.matchScore}% Concordance)!`);
            } else {
              showToast(`⚠️ Face Biometric Mismatch (${matchResult.matchScore}%): Live selfie does not match Aadhaar Photo!`);
            }
          }}
        />
      )}

      {/* Full 9-Section Joining Form Modal */}
      {showFullJoiningModal && (
        <FullJoiningFormModal 
          candidate={candidate}
          isHrMode={false}
          onClose={() => setShowFullJoiningModal(false)}
          onSubmitComplete={() => {
            setShowFullJoiningModal(false);
            showToast('Comprehensive Joining Form Submitted!');
          }}
        />
      )}

      {/* General Document Downloader Modal */}
      {showDocDownloader && (
        <DocumentDownloader 
          candidate={candidate} 
          onClose={() => setShowDocDownloader(false)} 
        />
      )}

      {/* Official JOY Corporate Certificate Preview Modal */}
      {showCertModal && (
        <OfficialVerificationCertificateModal
          candidate={candidate}
          onClose={() => setShowCertModal(false)}
        />
      )}

      {/* Official Employee Profile Dossier Modal */}
      {showLaborDossierModal && (
        <EmployeeProfileDossierModal
          candidate={candidate}
          onClose={() => setShowLaborDossierModal(false)}
        />
      )}

      {/* Statutory Legal & DPDP Compliance Handbook Modal */}
      <LegalComplianceHandbookModal
        isOpen={showLegalHandbook}
        onClose={() => setShowLegalHandbook(false)}
      />

    </div>
  );
};
