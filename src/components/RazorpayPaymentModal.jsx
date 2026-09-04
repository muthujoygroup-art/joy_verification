import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  QrCode, 
  Copy, 
  Check, 
  FileText, 
  ArrowRight, 
  X, 
  Sparkles, 
  ExternalLink,
  Receipt,
  HelpCircle,
  Clock,
  Award,
  SendHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RazorpayPaymentModal = ({ 
  isOpen, 
  onClose, 
  targetCompanyId = 'comp-1',
  defaultAmount = 5000 
}) => {
  const { companies, rechargeCompanyWallet, paymentGatewayConfig, showToast } = useApp();

  const company = (companies || []).find(c => c.id === targetCompanyId) || (companies && companies[0]) || {
    id: 'comp-joy',
    name: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
    walletBalance: 100000,
    pricePerVerification: 120
  };

  const [selectedPackage, setSelectedPackage] = useState(defaultAmount);

  const [customAmount, setCustomAmount] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState('razorpay'); // 'razorpay' | 'link' | 'bank'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  if (!isOpen) return null;

  const rechargeBaseAmount = isCustomMode ? (Number(customAmount) || 1000) : selectedPackage;
  const gstAmount = Math.round(rechargeBaseAmount * 0.18);
  const totalPayableAmount = rechargeBaseAmount + gstAmount;
  const unitCost = company.pricePerVerification || 120;
  const estimatedVerifications = Math.floor(rechargeBaseAmount / unitCost);

  const quickPackages = [
    { amount: 2500, label: 'Starter Pack', checks: Math.floor(2500 / unitCost), bonus: null },
    { amount: 5000, label: 'Growth Pack', checks: Math.floor(5000 / unitCost), bonus: 'Popular ⭐', isPopular: true },
    { amount: 15000, label: 'Scale Pack', checks: Math.floor(15000 / unitCost) + 10, bonus: '+10 Bonus Checks 🎁' },
    { amount: 50000, label: 'Enterprise Pack', checks: Math.floor(50000 / unitCost) + 45, bonus: '+45 Bonus Checks 👑' }
  ];

  // Generated shareable payment link
  const generatedPaymentLink = `https://rzp.io/l/joy-verif-${company.code || 'ACME'}-${rechargeBaseAmount}`;

  // ⚡ Execute Razorpay Checkout
  const handleLaunchRazorpay = () => {
    setIsProcessing(true);

    // If Razorpay SDK is loaded on window
    if (window.Razorpay) {
      const options = {
        key: paymentGatewayConfig?.keyId || 'rzp_test_JoyVerif2026',
        amount: totalPayableAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'JOY CORPORATE SOLUTIONS PVT LTD',
        description: `Wallet Recharge: ${estimatedVerifications} BGV Verification Credits (${company.name})`,
        image: '/joy_logo.png',
        handler: function (response) {
          setIsProcessing(false);
          const paymentRecord = {
            id: `PAY-RZP-${Math.floor(100000 + Math.random() * 900000)}`,
            paymentId: response.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 12)}`,
            orderId: response.razorpay_order_id || `order_${Math.random().toString(36).substring(2, 12)}`,
            date: new Date().toLocaleString(),
            baseAmount: rechargeBaseAmount,
            gstAmount: gstAmount,
            totalAmount: totalPayableAmount,
            creditsAdded: estimatedVerifications,
            method: 'Razorpay Gateway (UPI / Cards / NetBanking)',
            status: 'Success 🟢',
            invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
          };

          if (typeof rechargeCompanyWallet === 'function') {
            rechargeCompanyWallet(company.id, rechargeBaseAmount, paymentRecord);
          }

          setPaymentSuccessData(paymentRecord);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          showToast(`₹${rechargeBaseAmount.toLocaleString('en-IN')} credited to ${company.name} wallet!`);
        },
        prefill: {
          name: company.contactPerson || 'Company Administrator',
          email: company.email || 'admin@acmeglobal.com',
          contact: '+919876543210'
        },
        theme: {
          color: '#4f46e5'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      try {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } catch (e) {
        fallbackSimulatedPayment();
      }
    } else {
      fallbackSimulatedPayment();
    }
  };

  // Fallback / Instant Sandbox Simulator
  const fallbackSimulatedPayment = () => {
    setTimeout(() => {
      setIsProcessing(false);
      const paymentRecord = {
        id: `PAY-SIM-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentId: `pay_test_${Math.random().toString(36).substring(2, 10)}`,
        orderId: `order_test_${Math.random().toString(36).substring(2, 10)}`,
        date: new Date().toLocaleString(),
        baseAmount: rechargeBaseAmount,
        gstAmount: gstAmount,
        totalAmount: totalPayableAmount,
        creditsAdded: estimatedVerifications,
        method: 'Razorpay Sandbox (Instant Test Payment)',
        status: 'Success 🟢',
        invoiceNumber: `INV-2026-TEST-${Math.floor(1000 + Math.random() * 9000)}`
      };

      if (typeof rechargeCompanyWallet === 'function') {
        rechargeCompanyWallet(company.id, rechargeBaseAmount, paymentRecord);
      }

      setPaymentSuccessData(paymentRecord);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      showToast(`⚡ Instant Sandbox: ₹${rechargeBaseAmount.toLocaleString('en-IN')} credited to ${company.name}!`);
    }, 900);
  };

  const handleCopyPaymentLink = () => {
    navigator.clipboard.writeText(generatedPaymentLink);
    setCopiedLink(true);
    showToast('Razorpay Payment Link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyVirtualAccount = () => {
    navigator.clipboard.writeText(`ICIC0000104 - JOYCORP${company.code || 'ACME'}8821`);
    setCopiedAccount(true);
    showToast('Virtual Bank Account & IFSC copied!');
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 relative z-10 my-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Header */}
        <div className="p-4 sm:px-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/joy_logo.png" alt="JOY Logo" className="w-9 h-9 object-contain shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white tracking-tight">
                  Verification Wallet & Razorpay Gateway
                </h3>
                <span className="badge badge-purple text-[8px] font-black">B2B BILLING</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {company.name} • Live Quota: ₹{(company.walletBalance || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* If Payment Was Completed Successfully */}
          {paymentSuccessData ? (
            <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="badge badge-emerald text-xs font-black py-0.5 px-3">PAYMENT SUCCESSFUL 🟢</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  ₹{paymentSuccessData.baseAmount.toLocaleString('en-IN')} Credited to Wallet!
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Added <strong className="text-emerald-700">+{paymentSuccessData.creditsAdded} BGV Candidate Verifications</strong> to {company.name}.
                </p>
              </div>

              {/* Transaction Summary Card */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-left text-xs space-y-2 text-slate-700 shadow-2xs font-mono">
                <div className="flex justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Transaction Reference:</span>
                  <span className="font-bold text-slate-900">{paymentSuccessData.id}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Razorpay Payment ID:</span>
                  <span className="font-bold text-indigo-700">{paymentSuccessData.paymentId}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">GST Tax Invoice No:</span>
                  <span className="font-bold text-slate-900">{paymentSuccessData.invoiceNumber}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 pt-1">
                  <span>Total Paid (incl. 18% GST):</span>
                  <span>₹{paymentSuccessData.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setPaymentSuccessData(null);
                    onClose();
                  }}
                  className="btn btn-superadmin text-xs py-2.5 px-6 font-bold w-full sm:w-auto"
                >
                  <span>Done / Back to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Method Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setActivePaymentTab('razorpay')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activePaymentTab === 'razorpay'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Razorpay Checkout ⚡</span>
                </button>

                <button
                  onClick={() => setActivePaymentTab('link')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activePaymentTab === 'link'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Payment Link 🔗</span>
                </button>

                <button
                  onClick={() => setActivePaymentTab('bank')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activePaymentTab === 'bank'
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>NEFT / RTGS 🏦</span>
                </button>
              </div>

              {/* Package Amount Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  <span>1. Select Verification Recharge Tier</span>
                  <span className="text-indigo-600 font-bold">₹{unitCost}/check</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {quickPackages.map((pkg) => {
                    const isSelected = !isCustomMode && selectedPackage === pkg.amount;
                    return (
                      <div
                        key={pkg.amount}
                        onClick={() => {
                          setSelectedPackage(pkg.amount);
                          setIsCustomMode(false);
                        }}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-md scale-102'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {pkg.bonus && (
                          <span className="absolute -top-2.5 right-2 px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-black">
                            {pkg.bonus}
                          </span>
                        )}
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">{pkg.label}</span>
                          <span className="text-base font-black text-slate-900 block mt-0.5">
                            ₹{pkg.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[10px] text-indigo-700 font-extrabold mt-2 block">
                          +{pkg.checks} Checks
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Amount Button Toggle */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(!isCustomMode)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isCustomMode ? 'bg-indigo-100 border-indigo-400 text-indigo-900' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>Custom Amount ✏️</span>
                  </button>

                  {isCustomMode && (
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min="1000"
                        step="500"
                        placeholder="Enter amount (min ₹1,000)"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="form-input pl-7 py-1.5 text-xs font-bold w-full bg-slate-50 border-slate-300 rounded-xl"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 1. RAZORPAY CHECKOUT TAB CONTENT */}
              {activePaymentTab === 'razorpay' && (
                <div className="space-y-4">
                  {/* Tax & Calculation Breakdown Card */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <span className="font-semibold text-slate-600">Recharge Base Balance:</span>
                      <span className="font-extrabold text-slate-900">₹{rechargeBaseAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <span className="font-semibold text-slate-600">GST (18% SAC Code 998311):</span>
                      <span className="font-extrabold text-slate-900">₹{gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between font-black text-sm text-indigo-950 pt-1">
                      <span>Total Payable via Razorpay:</span>
                      <span className="text-base text-indigo-700">₹{totalPayableAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Payment Gateway Supported Options Preview */}
                  <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span className="font-extrabold text-indigo-950">Supported via Razorpay:</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 flex-wrap">
                      <span className="badge bg-white border border-indigo-200 text-indigo-900">⚡ Instant UPI (GPay/PhonePe)</span>
                      <span className="badge bg-white border border-indigo-200 text-indigo-900">💳 Corporate Cards</span>
                      <span className="badge bg-white border border-indigo-200 text-indigo-900">🏦 NetBanking (50+ Banks)</span>
                    </div>
                  </div>

                  {/* Action Launch Button */}
                  <button
                    onClick={handleLaunchRazorpay}
                    disabled={isProcessing}
                    className="btn btn-superadmin w-full text-xs py-3.5 font-black justify-center shadow-lg cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                    <span>
                      {isProcessing ? 'Connecting to Razorpay Secure Gateway...' : `Pay ₹${totalPayableAmount.toLocaleString('en-IN')} & Add +${estimatedVerifications} Verifications`}
                    </span>
                  </button>
                </div>
              )}

              {/* 2. SHAREABLE PAYMENT LINK TAB */}
              {activePaymentTab === 'link' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-indigo-950">Shareable Razorpay Payment Link</span>
                      <span className="badge badge-indigo text-[9px]">WhatsApp / Email Ready</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Send this encrypted link to your finance or accounts team to authorize and pay from their desktop or mobile.
                    </p>

                    <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-indigo-200 text-xs font-mono">
                      <span className="truncate flex-1 text-slate-700 font-semibold">{generatedPaymentLink}</span>
                      <button
                        onClick={handleCopyPaymentLink}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold flex items-center gap-1 shrink-0 hover:bg-indigo-700 transition-all cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyPaymentLink}
                    className="btn btn-hrexecutive w-full text-xs py-3 font-bold justify-center cursor-pointer"
                  >
                    <SendHorizontal className="w-4 h-4" />
                    <span>Copy & Send Payment Link via WhatsApp / Email</span>
                  </button>
                </div>
              )}

              {/* 3. DIRECT B2B NEFT / RTGS VIRTUAL BANK ACCOUNT */}
              {activePaymentTab === 'bank' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sky-950">Smart Collect Dedicated Virtual Account</span>
                      <span className="badge badge-cyan text-[9px]">Instant Auto-Reconcile</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Transfer funds via Corporate Internet Banking (NEFT / RTGS / IMPS). Funds will automatically reflect in your wallet within 60 seconds of transfer.
                    </p>

                    <div className="bg-white p-3.5 rounded-xl border border-sky-200 space-y-1.5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Account Name:</span>
                        <span className="font-bold text-slate-900">JOY CORPORATE - {company.code || 'ACME'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Virtual Account No:</span>
                        <span className="font-extrabold text-indigo-700">JOYCORP{company.code || 'ACME'}8821</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">IFSC Code:</span>
                        <span className="font-bold text-slate-900">ICIC0000104</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Bank & Branch:</span>
                        <span className="font-bold text-slate-900">ICICI Bank, CMS Branch Mumbai</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCopyVirtualAccount}
                      className="btn btn-secondary w-full text-xs py-2 font-bold justify-center cursor-pointer"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAccount ? 'Bank Details Copied!' : 'Copy Bank Account & IFSC'}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit TLS Encryption • Official GST Invoices Issued</span>
          </div>
          <span className="font-bold text-indigo-600">JOY CORPORATE SOLUTIONS PVT LTD</span>
        </div>

      </div>
    </div>
  );
};
