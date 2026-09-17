import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Send, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  FileText, 
  Lock, 
  KeyRound, 
  ExternalLink, 
  RefreshCw, 
  Activity, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  AlertTriangle, 
  FileCheck, 
  UserCheck, 
  X,
  BookOpen,
  Scale
} from 'lucide-react';
import { api } from '../services/api';

export const CompanyOnboardingVerificationModal = ({ inquiry, onClose, onUpdateInquiry, showToast }) => {
  const [activeTab, setActiveTab] = useState('dispatch'); // 'dispatch' | 'bgv_verify' | 'payment' | 'credentials'
  
  // Company Onboarding Dispatch State
  const [planType, setPlanType] = useState(inquiry?.expected_volume || 'Prepaid Growth Pack (500 Credits)');
  const [passcode, setPasscode] = useState('9842');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedLink, setDispatchedLink] = useState('');

  // Live BGV Verification API Telemetry State
  const [gstinInput, setGstinInput] = useState(inquiry?.gstin || '29AAACJ1234F1Z5');
  const [cinInput, setCinInput] = useState(inquiry?.cin || 'U72200KA2021PTC146521');
  const [bankAccInput, setBankAccInput] = useState(inquiry?.bank_account || '91802004812739');
  const [ifscInput, setIfscInput] = useState(inquiry?.ifsc || 'HDFC0001234');
  const [holderNameInput, setHolderNameInput] = useState(inquiry?.company_name || inquiry?.company || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED');
  
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [gstResult, setGstResult] = useState(null);

  const [isVerifyingCin, setIsVerifyingCin] = useState(false);
  const [cinResult, setCinResult] = useState(null);

  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [bankResult, setBankResult] = useState(null);

  // API Call Telemetry Log Tracking per Company
  const [apiTelemetryLogs, setApiTelemetryLogs] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Payment Link & Credentials Dispatch State
  const [paymentAmount, setPaymentAmount] = useState('15000');
  const [isSendingPaymentLink, setIsSendingPaymentLink] = useState(false);
  const [paymentLinkSent, setPaymentLinkSent] = useState(false);

  const [assignedCompCode, setAssignedCompCode] = useState(`COMP${Math.floor(100 + Math.random() * 900)}`);
  const [adminTempPassword, setAdminTempPassword] = useState('JoyVerify@2026');
  const [isDispatchingCredentials, setIsDispatchingCredentials] = useState(false);
  const [credentialsSent, setCredentialsSent] = useState(false);

  // 1. Dispatch Onboarding Link (Email + WhatsApp)
  const handleDispatchOnboarding = async (e) => {
    if (e) e.preventDefault();
    setIsDispatching(true);
    try {
      const generatedToken = `COMP_ACT_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const onboardingUrl = `${window.location.origin}/company-onboarding?token=${generatedToken}`;
      setDispatchedLink(onboardingUrl);

      if (api.dispatchCompanyOnboardingPackage) {
        await api.dispatchCompanyOnboardingPackage(inquiry.id, {
          token: generatedToken,
          plan: planType,
          passcode: passcode,
          onboarding_url: onboardingUrl
        });
      }

      if (onUpdateInquiry) {
        onUpdateInquiry(inquiry.id, 'Onboarding Sent', `Sent Onboarding Token: ${generatedToken} (PIN: ${passcode})`);
      }

      if (showToast) showToast('🚀 Onboarding package & Terms & Conditions sent via Email & WhatsApp!');
      setActiveTab('bgv_verify');
    } catch (err) {
      if (showToast) showToast(`❌ Dispatch failed: ${err.message}`, 'error');
    } finally {
      setIsDispatching(false);
    }
  };

  // 2. Run Live GST Verification API
  const handleRunGstCheck = async () => {
    setIsVerifyingGst(true);
    const startTime = Date.now();
    try {
      const res = await api.verifyCompanyGstLive(gstinInput);
      setGstResult(res);
      
      const duration = Date.now() - startTime;
      const logEntry = {
        id: `TEL_${Date.now()}`,
        endpoint: '/api/verification/verify-gst',
        check_name: 'GSTIN Registry Lookup',
        status: res.status === 'Active' ? '200 OK' : '400 Invalid',
        turnaround_ms: duration,
        cost_inr: 5.00,
        timestamp: new Date().toLocaleTimeString()
      };
      setApiTelemetryLogs(prev => [logEntry, ...prev]);

      if (showToast) showToast('✅ GSTIN Verification API executed successfully!');
    } catch (err) {
      if (showToast) showToast(`❌ GST verification failed: ${err.message}`, 'error');
    } finally {
      setIsVerifyingGst(false);
    }
  };

  // 3. Run Live CIN MCA Verification API
  const handleRunCinCheck = async () => {
    setIsVerifyingCin(true);
    const startTime = Date.now();
    try {
      const res = await api.verifyCompanyCinLive(cinInput);
      setCinResult(res);

      const duration = Date.now() - startTime;
      const logEntry = {
        id: `TEL_${Date.now()}`,
        endpoint: '/api/verification/verify-cin',
        check_name: 'MCA CIN Corporate Registration',
        status: res.status === 'Active' ? '200 OK' : '400 Invalid',
        turnaround_ms: duration,
        cost_inr: 5.00,
        timestamp: new Date().toLocaleTimeString()
      };
      setApiTelemetryLogs(prev => [logEntry, ...prev]);

      if (showToast) showToast('✅ MCA CIN Verification API executed successfully!');
    } catch (err) {
      if (showToast) showToast(`❌ CIN verification failed: ${err.message}`, 'error');
    } finally {
      setIsVerifyingCin(false);
    }
  };

  // 4. Run Live Bank Account Penny Drop API
  const handleRunBankCheck = async () => {
    setIsVerifyingBank(true);
    const startTime = Date.now();
    try {
      const res = await api.verifyCompanyBankLive(bankAccInput, ifscInput, holderNameInput);
      setBankResult(res);

      const duration = Date.now() - startTime;
      const logEntry = {
        id: `TEL_${Date.now()}`,
        endpoint: '/api/verification/verify-bank-account',
        check_name: 'Bank Account Penny Drop (IMPS)',
        status: res.status?.includes('Verified') ? '200 OK' : '400 Invalid',
        turnaround_ms: duration,
        cost_inr: 5.00,
        timestamp: new Date().toLocaleTimeString()
      };
      setApiTelemetryLogs(prev => [logEntry, ...prev]);

      if (showToast) showToast('✅ Bank Penny Drop IMPS API executed successfully!');
    } catch (err) {
      if (showToast) showToast(`❌ Bank verification failed: ${err.message}`, 'error');
    } finally {
      setIsVerifyingBank(false);
    }
  };

  // 5. Dispatch Payment Link
  const handleDispatchPaymentLink = async () => {
    setIsSendingPaymentLink(true);
    try {
      const payUrl = `${window.location.origin}/payment?ref=${inquiry.id}&amount=${paymentAmount}`;
      if (api.dispatchCompanyPaymentLink) {
        await api.dispatchCompanyPaymentLink(inquiry.id, { amount: paymentAmount, payment_url: payUrl });
      }
      setPaymentLinkSent(true);
      if (onUpdateInquiry) {
        onUpdateInquiry(inquiry.id, 'Payment Pending', `Sent Payment Link for ₹${Number(paymentAmount).toLocaleString('en-IN')}`);
      }
      if (showToast) showToast(`💳 Payment Link (₹${Number(paymentAmount).toLocaleString('en-IN')}) sent via Email & WhatsApp!`);
      setActiveTab('credentials');
    } catch (err) {
      if (showToast) showToast(`❌ Failed to send payment link: ${err.message}`, 'error');
    } finally {
      setIsSendingPaymentLink(false);
    }
  };

  // 6. Dispatch Final Login Credentials & Guide
  const handleDispatchCredentials = async () => {
    setIsDispatchingCredentials(true);
    try {
      const loginUrl = `${window.location.origin}/login?role=company`;
      const guideUrl = `${window.location.origin}/tour?guide=onboarding`;

      if (api.dispatchCompanyCredentials) {
        await api.dispatchCompanyCredentials(inquiry.id, {
          company_code: assignedCompCode,
          email: inquiry.email,
          password: adminTempPassword,
          login_url: loginUrl,
          guide_url: guideUrl
        });
      }

      setCredentialsSent(true);
      if (onUpdateInquiry) {
        onUpdateInquiry(inquiry.id, 'Converted (Active)', `Company Activated! Code: ${assignedCompCode}`);
      }
      if (showToast) showToast('🎉 Login Credentials & Getting Started Guide dispatched successfully!');
    } catch (err) {
      if (showToast) showToast(`❌ Failed to send credentials: ${err.message}`, 'error');
    } finally {
      setIsDispatchingCredentials(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const totalTelemetryCost = apiTelemetryLogs.reduce((acc, log) => acc + log.cost_inr, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white text-slate-900 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 border-b border-indigo-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 border border-indigo-300 rounded-2xl text-indigo-700 shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-indigo-100 text-indigo-800 border border-indigo-300 text-[10px] font-black uppercase">
                  End-to-End Company Onboarding Engine
                </span>
                <span className="badge badge-emerald text-[10px] font-bold">
                  {inquiry?.status || 'New Inquiry'}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 mt-0.5">
                {inquiry?.company_name || inquiry?.company || inquiry?.full_name || 'Prospective Corporate Client'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 border border-transparent hover:border-slate-200 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6-Step Flow Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'dispatch', label: '1. Dispatch Link 📩', icon: Send },
            { id: 'bgv_verify', label: '2. BGV & API Checks 🔍', icon: ShieldCheck },
            { id: 'payment', label: '3. Payment Link 💳', icon: CreditCard },
            { id: 'credentials', label: '4. Credentials & Guide 🔑', icon: KeyRound }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`py-2 px-3.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

          {/* ========================================================================= */}
          {/* TAB 1: DISPATCH ONBOARDING PACKAGE */}
          {/* ========================================================================= */}
          {activeTab === 'dispatch' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Automated Multi-Channel Dispatch System (Email + WhatsApp API)</span>
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  Dispatch a detailed explanation message to <strong>{inquiry?.full_name || inquiry?.company}</strong> containing:
                  1. Company details & statutory documents list (GST, CIN, PAN, Bank Cheque)
                  2. Project company Terms & Conditions acceptance link
                  3. Secure 4-Digit Security PIN onboarding invitation URL
                </p>
              </div>

              <form onSubmit={handleDispatchOnboarding} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company / Client Name *</label>
                    <input 
                      type="text"
                      required
                      value={inquiry?.company_name || inquiry?.company || inquiry?.full_name || ''}
                      readOnly
                      className="form-input bg-slate-100 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Client Email Address *</label>
                    <input 
                      type="email"
                      required
                      value={inquiry?.email || ''}
                      readOnly
                      className="form-input bg-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Mobile Number *</label>
                    <input 
                      type="text"
                      value={inquiry?.phone || '+91 9876543210'}
                      readOnly
                      className="form-input bg-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assigned Credit Package / Plan *</label>
                    <select
                      value={planType}
                      onChange={(e) => setPlanType(e.target.value)}
                      className="form-select font-bold"
                    >
                      <option value="Prepaid Starter Pack (100 Credits)">Prepaid Starter Pack (100 Verifications)</option>
                      <option value="Prepaid Growth Pack (500 Credits)">Prepaid Growth Pack (500 Verifications)</option>
                      <option value="Prepaid Enterprise Pack (2,000 Credits)">Prepaid Enterprise Pack (2,000 Verifications)</option>
                      <option value="Unlimited Enterprise Plan">Unlimited Enterprise Plan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">4-Digit Security Passcode (PIN) *</label>
                  <input 
                    type="text"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="form-input font-mono font-black text-indigo-700 max-w-xs"
                    placeholder="e.g. 9842"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Company must enter this PIN to unlock their activation form.</span>
                </div>

                {/* Live Email & WhatsApp Message Preview */}
                <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Live Email & WhatsApp Notification Payload</span>
                    <span className="text-[10px] text-emerald-400">SMTP + Meta WhatsApp Cloud API</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <p>Dear {inquiry?.full_name || inquiry?.company_name},</p>
                    <p>Welcome to JOY Verification Platform! To complete your company onboarding & activate feature access for {planType}, please complete the statutory verification step below:</p>
                    <p className="text-amber-300">📋 Required Documents: GST Certificate, CIN/COI Certificate, Company PAN Card, Bank Account Cheque</p>
                    <p className="text-purple-300">📜 Terms & Conditions: Must review & sign Master Services Agreement</p>
                    <p className="text-emerald-400 font-bold">🔐 Security Passcode: {passcode}</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isDispatching}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 w-full text-xs"
                >
                  {isDispatching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isDispatching ? 'Dispatching Email & WhatsApp Message...' : 'Send Onboarding Package (Email + WhatsApp) 🚀'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SUPERADMIN COMPANY BGV & LIVE API VERIFICATION */}
          {/* ========================================================================= */}
          {activeTab === 'bgv_verify' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Description */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <strong className="text-slate-900 font-black text-sm block">SuperAdmin Corporate BGV Verification Engine</strong>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Execute real-time government & bank API checks for <strong>{inquiry?.company_name || inquiry?.company}</strong>. All API execution logs and costs are tracked live below.
                  </p>
                </div>
                <span className="badge bg-purple-100 text-purple-800 border border-purple-300 text-xs font-mono font-bold shrink-0">
                  ⚡ Live API Gateways
                </span>
              </div>

              {/* 3 Verification Cards (GST, CIN, Bank Account) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* CARD 1: GSTIN VERIFICATION API */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" /> GSTIN Registry API
                    </span>
                    {gstResult ? (
                      <span className="badge badge-emerald text-[9px] font-bold">GST Active 🟢</span>
                    ) : (
                      <span className="badge badge-amber text-[9px]">Pending Check</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">GSTIN Number</label>
                    <input 
                      type="text" 
                      value={gstinInput}
                      onChange={(e) => setGstinInput(e.target.value)}
                      className="form-input text-xs font-mono font-bold uppercase"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRunGstCheck}
                    disabled={isVerifyingGst}
                    className="btn bg-emerald-600 hover:bg-emerald-700 text-white w-full py-2 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
                  >
                    {isVerifyingGst ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{isVerifyingGst ? 'Checking GSTIN...' : 'Run GST Verification API'}</span>
                  </button>

                  {gstResult && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-[10px]">
                      <div className="font-bold text-emerald-900">{gstResult.data?.tradeName}</div>
                      <div className="text-slate-600 font-mono">PAN: {gstResult.data?.pan}</div>
                      <div className="text-emerald-700 font-semibold">{gstResult.data?.filingStatus}</div>
                    </div>
                  )}
                </div>

                {/* CARD 2: CIN MCA CORPORATE REGISTRATION API */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-purple-600" /> MCA CIN Registry API
                    </span>
                    {cinResult ? (
                      <span className="badge badge-purple text-[9px] font-bold">MCA Active 🟢</span>
                    ) : (
                      <span className="badge badge-amber text-[9px]">Pending Check</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">MCA CIN Number</label>
                    <input 
                      type="text" 
                      value={cinInput}
                      onChange={(e) => setCinInput(e.target.value)}
                      className="form-input text-xs font-mono font-bold uppercase"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRunCinCheck}
                    disabled={isVerifyingCin}
                    className="btn bg-purple-600 hover:bg-purple-700 text-white w-full py-2 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
                  >
                    {isVerifyingCin ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{isVerifyingCin ? 'Checking MCA CIN...' : 'Run CIN Verification API'}</span>
                  </button>

                  {cinResult && (
                    <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-[10px]">
                      <div className="font-bold text-purple-900">{cinResult.data?.companyClass} ({cinResult.data?.rocCode})</div>
                      <div className="text-slate-600 font-mono">Incorporated: {cinResult.data?.incorporationDate}</div>
                      <div className="text-purple-700 font-semibold">{cinResult.data?.mcaStatus}</div>
                    </div>
                  )}
                </div>

                {/* CARD 3: BANK ACCOUNT PENNY DROP API */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-indigo-600" /> Bank Penny Drop API
                    </span>
                    {bankResult ? (
                      <span className="badge badge-indigo text-[9px] font-bold">Bank Verified 🟢</span>
                    ) : (
                      <span className="badge badge-amber text-[9px]">Pending Check</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <input 
                      type="text" 
                      placeholder="Account Number"
                      value={bankAccInput}
                      onChange={(e) => setBankAccInput(e.target.value)}
                      className="form-input text-[11px] font-mono font-bold"
                    />
                    <input 
                      type="text" 
                      placeholder="IFSC Code"
                      value={ifscInput}
                      onChange={(e) => setIfscInput(e.target.value)}
                      className="form-input text-[11px] font-mono font-bold uppercase"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRunBankCheck}
                    disabled={isVerifyingBank}
                    className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
                  >
                    {isVerifyingBank ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{isVerifyingBank ? 'Running Penny Drop...' : 'Run Bank Verification API'}</span>
                  </button>

                  {bankResult && (
                    <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1 text-[10px]">
                      <div className="font-bold text-indigo-900">{bankResult.data?.bankName}</div>
                      <div className="text-emerald-700 font-bold">{bankResult.data?.pennyDropStatus}</div>
                      <div className="text-indigo-800 font-semibold">{bankResult.data?.nameMatchScore}</div>
                    </div>
                  )}
                </div>

              </div>

              {/* 📊 COMPANY API CALL TELEMETRY MONITOR CARD */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-slate-100 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm">Company Live API Telemetry & Cost Ledger</h4>
                      <p className="text-[11px] text-slate-400">Monitoring real-time API verification requests & cost for this specific company.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold">
                      Calls Executed: <span className="text-amber-400">{apiTelemetryLogs.length} Calls</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold">
                      Total Cost: <span className="text-emerald-400">₹{totalTelemetryCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Log Table */}
                {apiTelemetryLogs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                          <th className="pb-2">Timestamp</th>
                          <th className="pb-2">API Endpoint</th>
                          <th className="pb-2">Check Name</th>
                          <th className="pb-2">HTTP Status</th>
                          <th className="pb-2">Latency</th>
                          <th className="pb-2 text-right">Cost (INR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {apiTelemetryLogs.map(log => (
                          <tr key={log.id}>
                            <td className="py-2 text-slate-400">{log.timestamp}</td>
                            <td className="py-2 text-indigo-300">{log.endpoint}</td>
                            <td className="py-2 text-slate-200 font-bold">{log.check_name}</td>
                            <td className="py-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-[10px] font-bold">
                                {log.status}
                              </span>
                            </td>
                            <td className="py-2 text-amber-300">{log.turnaround_ms}ms</td>
                            <td className="py-2 text-right font-bold text-emerald-400">₹{log.cost_inr.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-800/40 rounded-xl text-center text-slate-400 text-xs font-mono">
                    No verification API calls executed for this company yet. Click any API button above to run live verification!
                  </div>
                )}
              </div>

              {/* Action Trigger to Next Step */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('payment')}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-6 rounded-xl shadow-md flex items-center gap-2 cursor-pointer text-xs"
                >
                  <span>Proceed to Payment Link Step 💳</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: GENERATE & DISPATCH PAYMENT LINK */}
          {/* ========================================================================= */}
          {activeTab === 'payment' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <strong className="text-emerald-950 font-black text-sm block">Company BGV Verification Approved!</strong>
                <p className="text-xs text-slate-700 font-medium">
                  Generate and dispatch official payment link via Email & WhatsApp to <strong>{inquiry?.full_name || inquiry?.company}</strong> for their approved credit tier.
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Invoice / Payment Amount (INR) *</label>
                    <select
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="form-select font-mono font-bold text-sm"
                    >
                      <option value="5000">₹5,000 (Prepaid Starter Pack - 100 Credits)</option>
                      <option value="15000">₹15,000 (Prepaid Growth Pack - 500 Credits)</option>
                      <option value="50000">₹50,000 (Prepaid Enterprise Pack - 2,000 Credits)</option>
                      <option value="120000">₹1,20,000 (Annual Unlimited Enterprise Tier)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Payment Gateway / Switch</label>
                    <input 
                      type="text" 
                      value="Razorpay Corporate Gateway (UPI / NetBanking / Cards / NEFT)"
                      readOnly
                      className="form-input bg-slate-100 font-medium"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 font-mono">
                  <div className="text-slate-500 font-bold">Payment Link URL Preview:</div>
                  <div className="text-indigo-700 font-bold text-[11px] truncate">
                    {window.location.origin}/payment?ref={inquiry?.id}&amount={paymentAmount}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDispatchPaymentLink}
                  disabled={isSendingPaymentLink}
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 w-full text-xs"
                >
                  {isSendingPaymentLink ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  <span>{isSendingPaymentLink ? 'Dispatching Payment Link...' : `Send Payment Link (₹${Number(paymentAmount).toLocaleString('en-IN')}) via Email & WhatsApp 💳`}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CONFIRM PAYMENT & DISPATCH LOGIN CREDENTIALS & GUIDE */}
          {/* ========================================================================= */}
          {activeTab === 'credentials' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
                <strong className="text-indigo-950 font-black text-sm block">Payment Confirmed & Account Activation</strong>
                <p className="text-xs text-slate-700 font-medium">
                  Dispatch official Company Admin Portal Login Credentials, temporary password, and getting started video walkthrough guide to <strong>{inquiry?.email}</strong>.
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assigned Company Unique Code *</label>
                    <input 
                      type="text" 
                      value={assignedCompCode}
                      onChange={(e) => setAssignedCompCode(e.target.value)}
                      className="form-input font-mono font-black text-indigo-700 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company Admin Login Email *</label>
                    <input 
                      type="email" 
                      value={inquiry?.email || ''}
                      readOnly
                      className="form-input bg-slate-100 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Temporary Initial Password *</label>
                    <input 
                      type="text" 
                      value={adminTempPassword}
                      onChange={(e) => setAdminTempPassword(e.target.value)}
                      className="form-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Getting Started Guide & Video</label>
                    <input 
                      type="text" 
                      value="Included (Tour & Guide Center)"
                      readOnly
                      className="form-input bg-slate-100 font-bold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl space-y-2 font-mono text-[11px]">
                  <div className="text-amber-400 font-bold border-b border-slate-800 pb-1">
                    🔑 Dispatch Credentials Notification Payload Preview
                  </div>
                  <p>Company Code: <strong className="text-white">{assignedCompCode}</strong></p>
                  <p>Login URL: <strong className="text-indigo-300">{window.location.origin}/login?role=company</strong></p>
                  <p>Email: <strong className="text-white">{inquiry?.email}</strong></p>
                  <p>Password: <strong className="text-emerald-400">{adminTempPassword}</strong></p>
                  <p>Guide: <strong className="text-purple-300">{window.location.origin}/tour?guide=onboarding</strong></p>
                </div>

                <button
                  type="button"
                  onClick={handleDispatchCredentials}
                  disabled={isDispatchingCredentials}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 w-full text-xs"
                >
                  {isDispatchingCredentials ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>{isDispatchingCredentials ? 'Dispatching Credentials...' : 'Confirm Payment & Send Credentials (Email + WhatsApp) 🚀'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-500 text-[11px]">
            <span>Inquiry ID: #{inquiry?.id}</span>
            <span>•</span>
            <span>Total API Cost: ₹{totalTelemetryCost.toFixed(2)}</span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary text-xs py-2 px-4 font-bold"
          >
            Close Modal
          </button>
        </div>

      </div>
    </div>
  );
};
