import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { FullJoiningFormModal } from '../components/FullJoiningFormModal';
import { OfficialVerificationCertificateModal } from '../components/OfficialVerificationCertificateModal';
import { EmployeeProfileDossierModal } from '../components/EmployeeProfileDossierModal';
import { LivePhotoCaptureModal } from '../components/LivePhotoCaptureModal';
import { GameActionGuideHub } from '../components/GameActionGuideHub';
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
  Scan
} from 'lucide-react';

export const EmployeePortalView = () => {
  const { getActiveCandidate, updateCandidateVerification, showToast, setRoleView } = useApp();
  const candidate = getActiveCandidate();

  const [showAadhaarOtpModal, setShowAadhaarOtpModal] = useState(false);
  const [showMobileOtpModal, setShowMobileOtpModal] = useState(false);
  const [showLivePhotoModal, setShowLivePhotoModal] = useState(false);
  const [showDocDownloader, setShowDocDownloader] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showLaborDossierModal, setShowLaborDossierModal] = useState(false);
  const [showFullJoiningModal, setShowFullJoiningModal] = useState(false);

  const [aadhaarInputOtp, setAadhaarInputOtp] = useState('');
  const [mobileInputOtp, setMobileInputOtp] = useState('');

  const isAllComplete = candidate?.status === 'Verified';
  const [activeGuideStep, setActiveGuideStep] = useState(0);

  const candidateGuideSteps = [
    {
      id: 'aadhaar',
      title: 'Aadhaar UIDAI OTP Verification',
      shortTitle: '1. Aadhaar OTP',
      description: 'Verify your Aadhaar identity by entering the one-time password (OTP) sent by UIDAI to your registered mobile.',
      actionLabel: '👉 Verify Aadhaar',
      action: () => handleSendAadhaarOtp()
    },
    {
      id: 'mobile',
      title: 'Mobile Number SMS OTP Validation',
      shortTitle: '2. Mobile OTP',
      description: 'Authenticate your registered phone number via secure 6-digit carrier SMS OTP verification.',
      actionLabel: '👉 Send SMS OTP',
      action: () => handleSendMobileOtp()
    },
    {
      id: 'face',
      title: '3-Pose AI WebCam Face Liveness',
      shortTitle: '3. Face Match',
      description: 'Capture a quick 3-angle biometric camera scan (Straight, Left turn, Right turn) to confirm real-time identity liveness.',
      actionLabel: '👉 Open Camera',
      action: () => setShowLivePhotoModal(true)
    },
    {
      id: 'docs',
      title: 'Download Official Verified Certificate',
      shortTitle: '4. Download Docs',
      description: 'Once all verification gates are passed, instantly download your official JOY Corporate Verification Certificate and 360° Profile Dossier.',
      actionLabel: '👉 View Certificate',
      action: () => setShowCertModal(true)
    }
  ];

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

  const { verificationConfig = {}, verificationsCompleted = {} } = candidate;

  // ⚡ 1-Click Quick Mock Verification (Simulate Passing All 3 Steps in 1 second)
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

    updateCandidateVerification(candidate.token, 'aadhaar', true);
    updateCandidateVerification(candidate.token, 'mobile', true);
    updateCandidateVerification(candidate.token, 'face', true);
    updateCandidateVerification(candidate.token, 'faceImages', sampleSnaps);

    showToast('⚡ Quick Mock Verify Passed: Aadhaar OTP, Mobile OTP & Live Photo Matched (99.4%)!');
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
    showToast('📸 Employee Live Photo Captured & Face Biometrics Verified (99.4%)!');
    confetti({ particleCount: 80, spread: 70 });
  };

  const totalConfiguredSteps = (verificationConfig.requireAadhaar ? 1 : 0) + (verificationConfig.requireMobileOtp ? 1 : 0) + (verificationConfig.requireFaceMatch ? 1 : 0);
  const completedStepsCount = (verificationsCompleted.aadhaar ? 1 : 0) + (verificationsCompleted.mobile ? 1 : 0) + (verificationsCompleted.face ? 1 : 0);
  const progressPercentage = Math.round((completedStepsCount / (totalConfiguredSteps || 1)) * 100);

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
    updateCandidateVerification(candidate.token, 'aadhaar', true);
    setShowAadhaarOtpModal(false);
    showToast('Aadhaar OTP Verified successfully!');
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
    showToast('Mobile Number Verified!');
  };

  const currentCapturedPhoto = candidate.faceImages?.livePhoto || candidate.faceImages?.straight;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12 text-slate-900">
      
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 border-amber-200 bg-white relative overflow-hidden rounded-2xl shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Live Captured Photo Avatar or Initials */}
            {currentCapturedPhoto ? (
              <div className="relative">
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
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl border border-amber-300 shadow-sm shrink-0">
                {candidate.name?.charAt(0) || 'E'}
              </div>
            )}
            
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-amber text-[10px]">Secure Verification Portal</span>
                <span className="text-xs text-slate-500 font-bold">• Employee Onboarding</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">Welcome, {candidate.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {candidate.designation || 'Specialist'} • Department: <strong>{candidate.dept || 'Operations'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* ⚡ 1-Click Quick Mock Verification */}
            {!isAllComplete && (
              <button
                onClick={handleQuickMockVerifyAll}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all hover:scale-102"
                title="Simulate passing all 3 verification gates instantly"
              >
                <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-bounce" />
                <span>⚡ Quick Mock Verify (1-Click)</span>
              </button>
            )}

            <button
              onClick={() => setRoleView('hrexecutive')}
              className="btn btn-secondary text-xs py-1.5 px-3 font-bold"
            >
              Switch to HR View
            </button>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-amber-600" />
              <span>Identity & Biometric Verification Completion</span>
            </span>
            <span className="text-amber-700 font-extrabold">{completedStepsCount} of {totalConfiguredSteps} Checks ({progressPercentage}%)</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              style={{ width: `${progressPercentage}%` }} 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
            />
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Employer: <strong>Acme Global Technologies</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Token: <code className="text-slate-900 font-bold">{candidate.token}</code></span>
          </span>
        </div>
      </div>

      {/* 🎮 Game-Style Action Guide Hub */}
      <GameActionGuideHub
        roleKey="candidate"
        roleTitle="Candidate Verification"
        badgeColor="amber"
        steps={candidateGuideSteps}
        currentStepIndex={activeGuideStep}
        onStepChange={setActiveGuideStep}
        onActionClick={(step) => step.action()}
      />

      {/* Completion Banner with Dual-Document Downloads */}
      {isAllComplete && (
        <div className="glass-panel p-6 border-2 border-emerald-400 bg-emerald-50/80 text-center space-y-4 rounded-2xl shadow-lg animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Employee Profile & Identity Verified Successfully!</h3>
            <p className="text-xs text-emerald-950 max-w-lg mx-auto font-medium mt-1">
              Your identity details and live biometric portrait have been authenticated by <strong>JOY CORPORATE SOLUTIONS PRIVATE LIMITED</strong> via Government Repositories & Biometric Engines.
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-bold text-emerald-950 shadow-2xs">
              <span>📜 Official Certificate Validity: Active for 60 Days (Valid until 2026-10-18)</span>
            </div>
          </div>

          {/* Dual Document Download Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            
            {/* 1. Download Employee Profile Dossier */}
            <button 
              onClick={() => setShowLaborDossierModal(true)}
              className="btn btn-company text-xs py-2 px-4 flex items-center gap-2 font-black shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>1. Employee Profile Dossier (4-Page PDF)</span>
            </button>

            {/* 2. Download Official JOY Corporate Certificate */}
            <button 
              onClick={() => setShowCertModal(true)}
              className="btn btn-superadmin text-xs py-2 px-4 flex items-center gap-2 font-black shadow-md"
            >
              <Award className="w-4 h-4" />
              <span>2. JOY Corporate Certificate (PDF)</span>
            </button>

            {/* 3. All Documents Vault */}
            <button 
              onClick={() => setShowDocDownloader(true)}
              className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
            >
              <Download className="w-4 h-4" />
              <span>All Formats Hub</span>
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Joining Form Card Banner */}
      <div 
        data-tour-step="candidate-docs-gate"
        className="glass-panel p-5 border-indigo-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 font-bold shrink-0">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-900 text-base">Comprehensive Employee Joining Form</h4>
              <span className="badge badge-purple text-[10px]">7 Sections</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Review and submit Personal Demographics, Contact, KYC Proofs, Employment, Education, Bank Payroll & Nominee details.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFullJoiningModal(true)}
          className="btn btn-superadmin text-xs flex items-center gap-2 shrink-0 shadow-md font-bold"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Open Full Joining Form</span>
        </button>
      </div>

      {/* 3-Step Verification Checklist Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Required Verification Verification Steps</span>
          </h3>

          <span className="text-xs text-slate-500 font-bold">
            Status: <span className={isAllComplete ? 'text-emerald-700' : 'text-amber-700'}>{candidate.status}</span>
          </span>
        </div>

        {/* STEP 1: Aadhaar UIDAI OTP */}
        {verificationConfig.requireAadhaar && (
          <div 
            data-tour-step="candidate-aadhaar-gate"
            className={`glass-panel p-5 border transition-all bg-white rounded-2xl shadow-sm ${
              verificationsCompleted.aadhaar ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                  verificationsCompleted.aadhaar ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}>
                  1
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base">Aadhaar UIDAI OTP Check</h4>
                    <span className="badge badge-indigo text-[10px]">API SETU Gateway</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Aadhaar Number: <code className="text-slate-900 font-mono font-bold">{candidate.aadhaarNo || '5489 1234 9876'}</code>
                  </p>
                </div>
              </div>

              {verificationsCompleted.aadhaar ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aadhaar Verified ✓</span>
                </div>
              ) : (
                <button 
                  onClick={handleSendAadhaarOtp}
                  className="btn btn-superadmin text-xs flex items-center gap-1.5 font-bold shadow-md"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Verify Aadhaar OTP</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Mobile Number OTP */}
        {verificationConfig.requireMobileOtp && (
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
                  2
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base">Mobile Number SMS OTP</h4>
                    <span className="badge badge-cyan text-[10px]">Sandbox Gateway</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Registered Mobile: <strong className="text-slate-900 font-mono">{candidate.mobile}</strong>
                  </p>
                </div>
              </div>

              {verificationsCompleted.mobile ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mobile OTP Verified ✓</span>
                </div>
              ) : (
                <button 
                  onClick={handleSendMobileOtp}
                  className="btn btn-company text-xs flex items-center gap-1.5 font-bold shadow-md"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send Mobile OTP</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Live Employee Photo Capture & Biometric Face Verification */}
        {verificationConfig.requireFaceMatch && (
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
                  3
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base">Employee Live Photo & Face Verification</h4>
                    <span className="badge badge-amber text-[10px]">Biometric Camera Sensor</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Capture employee live face portrait via WebCam / Mobile Camera for biometric authentication.
                  </p>
                  
                  {/* If Photo is Captured, show small preview strip */}
                  {currentCapturedPhoto && (
                    <div className="mt-2 flex items-center gap-2.5">
                      <img 
                        src={currentCapturedPhoto} 
                        alt="Employee Portrait" 
                        className="w-10 h-10 rounded-xl object-cover border border-emerald-400 shadow-xs"
                      />
                      <div className="text-[11px]">
                        <span className="text-emerald-800 font-extrabold block">✓ Live Portrait Stored</span>
                        <span className="text-slate-500 font-mono text-[10px]">Confidence: 99.4% Match</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {verificationsCompleted.face ? (
                  <>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Live Photo Verified (99.4%) ✓</span>
                    </div>

                    <button 
                      onClick={() => setShowLivePhotoModal(true)}
                      className="btn btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 font-bold"
                      title="Retake Live Photo"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowLivePhotoModal(true)}
                    className="btn btn-employee text-xs flex items-center gap-1.5 font-bold shadow-md px-4 py-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>📸 Capture Live Photo</span>
                  </button>
                )}
              </div>
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

      {/* 📸 Dedicated Live Photo Capture Modal */}
      {showLivePhotoModal && (
        <LivePhotoCaptureModal
          isOpen={showLivePhotoModal}
          currentPhoto={currentCapturedPhoto}
          onClose={() => setShowLivePhotoModal(false)}
          onPhotoCaptured={handleLivePhotoCaptured}
        />
      )}

      {/* Full 7-Section Joining Form Modal */}
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

    </div>
  );
};
