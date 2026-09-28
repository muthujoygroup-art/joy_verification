import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  CheckCircle2, 
  QrCode, 
  Building2, 
  ShieldCheck, 
  Download, 
  X, 
  Sparkles, 
  Lock, 
  Receipt,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  AlertCircle,
  FileText,
  BadgeCheck,
  Building
} from 'lucide-react';

export const PaymentModal = ({ company, onClose }) => {
  const { 
    payCompanyInvoice, 
    companyPaymentLedger, 
    candidates, 
    vendors,
    calculateCompanyPostpaidBill,
    settlePostpaidInvoice,
    showToast 
  } = useApp();

  if (!company) return null;

  // Resolve accurate billing metrics
  const postpaidBill = typeof calculateCompanyPostpaidBill === 'function'
    ? calculateCompanyPostpaidBill(company, candidates, vendors)
    : null;

  const currentLedger = (companyPaymentLedger && companyPaymentLedger[company.id]) || { status: 'PENDING ⏳' };
  
  // Calculate verified count & amounts
  const verifiedCount = postpaidBill?.totalVerifiedProfiles || company.verifiedCountThisMonth || 0;
  const ratePerProfile = company.pricePerVerification || postpaidBill?.baseRate || 120;
  const rawSubtotal = postpaidBill?.subtotal || Math.max(verifiedCount * ratePerProfile, 1200);
  const gstAmount = postpaidBill?.gstAmount || Math.round(rawSubtotal * 0.18);
  const totalAmountDue = postpaidBill?.totalAmountDue || (rawSubtotal + gstAmount);

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'bank_transfer'
  const [selectedBank, setSelectedBank] = useState('HDFC Bank Enterprise Banking');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  
  const [cardDetails, setCardDetails] = useState({
    name: company.contactPerson || company.name || '',
    number: '',
    expiry: '',
    cvv: ''
  });

  const [paymentSuccessData, setPaymentSuccessData] = useState(
    currentLedger.status === 'SETTLED ✅' ? currentLedger : null
  );

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = (text, key) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (typeof showToast === 'function') {
        showToast(`Copied ${key.replace('_', ' ').toUpperCase()} to clipboard!`, 'success');
      }
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleProcessPayment = (e) => {
    e?.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      let methodLabel = 'Instant UPI QR (GPay / Razorpay)';
      if (paymentMethod === 'card') methodLabel = 'Credit/Debit Card (Stripe / Razorpay)';
      else if (paymentMethod === 'netbanking') methodLabel = `Net Banking (${selectedBank})`;
      else if (paymentMethod === 'bank_transfer') methodLabel = 'Direct Bank Transfer (NEFT/RTGS Mandate)';

      const txnId = `PAY-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      // Settle invoice in App state
      if (typeof payCompanyInvoice === 'function') {
        payCompanyInvoice(company.id, totalAmountDue, methodLabel);
      }
      if (typeof settlePostpaidInvoice === 'function') {
        settlePostpaidInvoice(company.id, {
          totalAmount: totalAmountDue,
          baseAmount: rawSubtotal,
          method: methodLabel,
          paymentId: txnId
        }, totalAmountDue);
      }

      setPaymentSuccessData({
        status: 'SETTLED ✅',
        paymentId: txnId,
        date: timestampStr,
        amount: totalAmountDue,
        subtotal: rawSubtotal,
        gst: gstAmount,
        method: methodLabel,
        companyName: company.name
      });

      if (typeof showToast === 'function') {
        showToast(`🎉 Monthly verification invoice ₹${totalAmountDue.toLocaleString()} settled successfully!`, 'success');
      }
    }, 1200);
  };

  return createPortal((
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-2xl max-h-[92vh] flex flex-col border border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl relative z-10 overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🌟 1. STICKY MODAL HEADER */}
        <div className="shrink-0 bg-white/95 backdrop-blur-sm px-5 py-4 border-b border-slate-100 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold shadow-2xs shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Online Invoice Payment & Settlement</h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Secure B2B Gateway
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Direct billing payment settlement between Company Admin & Super Admin</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 🌟 2. SCROLLABLE MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* 📄 INVOICE BILLING BREAKDOWN CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300">Client Enterprise</span>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-400" />
                  {company.name}
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-indigo-200 font-mono font-normal">
                    {company.code || 'COMP-JOY'}
                  </span>
                </h3>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300">Active Subscribed Plan</span>
                <div className="text-xs font-bold text-emerald-300 flex items-center sm:justify-end gap-1.5 mt-0.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  {company.plan || postpaidBill?.plan?.name || 'Tier 1 (< 50 Employees)'}
                </div>
              </div>
            </div>

            {/* Bill Line Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="text-indigo-200 text-[11px] block">Verified Profiles</span>
                <span className="font-extrabold text-white text-sm">{verifiedCount} Records</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="text-indigo-200 text-[11px] block">Rate per Verification</span>
                <span className="font-extrabold text-white text-sm">₹{ratePerProfile}/profile</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="text-indigo-200 text-[11px] block">Subtotal (Net)</span>
                <span className="font-extrabold text-white text-sm">₹{rawSubtotal.toLocaleString()}.00</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="text-indigo-200 text-[11px] block">GST (18%)</span>
                <span className="font-extrabold text-white text-sm">₹{gstAmount.toLocaleString()}.00</span>
              </div>
            </div>

            {/* Total Payable Row */}
            <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">Total Net Amount Due</span>
                <span className="text-[10px] text-emerald-400/80">Inclusive of 18% CGST + SGST statutory taxes</span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight">
                  ₹{totalAmountDue.toLocaleString()}.00
                </span>
              </div>
            </div>
          </div>

          {/* 🌟 3. PAYMENT STATUS BRANCH */}
          {paymentSuccessData ? (
            /* ✅ SUCCESS / SETTLED RECEIPT */
            <div className="p-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                  INVOICE SETTLED & PAID
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">Payment Settled Successfully!</h3>
                <p className="text-xs text-slate-600">Your account billing status is in good standing and all platform services remain active.</p>
              </div>

              <div className="bg-white border border-emerald-200 rounded-xl p-4 text-left text-xs space-y-2 text-slate-700 font-medium shadow-2xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transaction Reference ID:</span>
                  <span className="font-mono font-bold text-slate-900">{paymentSuccessData.paymentId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Settlement Date:</span>
                  <span className="font-bold text-slate-900">{paymentSuccessData.date}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Settlement Channel:</span>
                  <span className="font-bold text-slate-900">{paymentSuccessData.method}</span>
                </div>
                <div className="flex justify-between py-1 pt-2 text-sm font-extrabold">
                  <span className="text-slate-900">Total Amount Settled:</span>
                  <span className="text-emerald-700 font-mono text-base font-black">₹{paymentSuccessData.amount?.toLocaleString()}.00</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof showToast === 'function') {
                      showToast('📄 Official GST Tax Invoice Receipt downloaded!', 'success');
                    }
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Download GST Receipt (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          ) : (
            /* 💳 PAYMENT CHANNELS & FORM */
            <form onSubmit={handleProcessPayment} className="space-y-4">
              
              {/* Payment Method Selector Grid */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'upi' 
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold'
                    }`}
                  >
                    <QrCode className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-xs">Instant UPI QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card' 
                        ? 'border-indigo-500 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs ring-1 ring-indigo-500' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span className="text-xs">Debit / Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'netbanking' 
                        ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold shadow-xs ring-1 ring-sky-500' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 ${paymentMethod === 'netbanking' ? 'text-sky-600' : 'text-slate-500'}`} />
                    <span className="text-xs">Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'bank_transfer' 
                        ? 'border-purple-500 bg-purple-50/80 text-purple-950 font-bold shadow-xs ring-1 ring-purple-500' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold'
                    }`}
                  >
                    <Building className={`w-5 h-5 ${paymentMethod === 'bank_transfer' ? 'text-purple-600' : 'text-slate-500'}`} />
                    <span className="text-xs">Direct Transfer</span>
                  </button>
                </div>
              </div>

              {/* ⚡ TAB 1: INSTANT UPI QR */}
              {paymentMethod === 'upi' && (
                <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4 animate-fadeIn">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">Scan QR Code with Any UPI App</span>
                    <span className="text-[11px] text-slate-500 font-medium">Google Pay, PhonePe, Paytm, BHIM, Navi, Cred UPI</span>
                  </div>

                  {/* QR Code Container */}
                  <div className="w-48 h-48 bg-white p-3 border border-slate-200 rounded-2xl mx-auto flex flex-col items-center justify-center shadow-md relative group">
                    <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center p-3 text-white">
                      <QrCode className="w-24 h-24 text-emerald-400" />
                      <span className="font-mono text-[10px] font-bold text-emerald-300 mt-1">₹{totalAmountDue.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* UPI ID Copy Card */}
                  <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="text-left pl-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Official Merchant UPI ID</span>
                      <span className="text-xs font-mono font-bold text-slate-800 truncate block">joycorporatesolutions@icici</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('joycorporatesolutions@icici', 'upi_id')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                    >
                      {copiedKey === 'upi_id' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copy UPI ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium">
                    Verified Merchant: <strong className="text-slate-800 font-bold">JOY CORPORATE SOLUTIONS PRIVATE LIMITED</strong>
                  </p>
                </div>
              )}

              {/* 💳 TAB 2: CREDIT / DEBIT CARD */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 animate-fadeIn text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Cardholder Name *</label>
                    <input 
                      type="text" 
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      placeholder="e.g. Joy Man Power Service" 
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Card Number *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        maxLength={19}
                        value={cardDetails.number}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').substring(0, 16);
                          const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                          setCardDetails({ ...cardDetails, number: formatted });
                        }}
                        placeholder="4532 •••• •••• 8812" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold tracking-wider focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        required 
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Expiry MM/YY *</label>
                      <input 
                        type="text" 
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').substring(0, 4);
                          if (v.length >= 3) v = `${v.substring(0, 2)}/${v.substring(2)}`;
                          setCardDetails({ ...cardDetails, expiry: v });
                        }}
                        placeholder="MM/YY" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">CVV Security Code *</label>
                      <input 
                        type="password" 
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                        placeholder="•••" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 🏛️ TAB 3: NET BANKING */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 animate-fadeIn text-xs">
                  <label className="block text-slate-700 font-bold">Select Corporate Bank Mandate *</label>
                  
                  {/* Top Banks Quick Select */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'HDFC Bank Enterprise', code: 'HDFC' },
                      { name: 'ICICI Corporate Banking', code: 'ICICI' },
                      { name: 'State Bank of India', code: 'SBI' },
                      { name: 'Axis Bank Commercial', code: 'AXIS' }
                    ].map(bank => (
                      <button
                        key={bank.code}
                        type="button"
                        onClick={() => setSelectedBank(bank.name)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedBank === bank.name
                            ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold shadow-2xs ring-1 ring-sky-500'
                            : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold'
                        }`}
                      >
                        <span className="text-[11px] block">{bank.name}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Or choose other scheduled commercial bank:</label>
                    <select 
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    >
                      <option value="HDFC Bank Enterprise Banking">HDFC Bank Enterprise Banking</option>
                      <option value="ICICI Corporate Banking">ICICI Corporate Banking</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="Axis Bank Commercial">Axis Bank Commercial</option>
                      <option value="Kotak Mahindra Bank Corporate">Kotak Mahindra Bank Corporate</option>
                      <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                      <option value="Bank of Baroda Commercial">Bank of Baroda Commercial</option>
                      <option value="IndusInd Bank Corporate">IndusInd Bank Corporate</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 🏦 TAB 4: DIRECT BANK TRANSFER (NEFT / RTGS) */}
              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 animate-fadeIn text-xs">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">Official Platform Settlement Bank Account</span>
                    <span className="text-[11px] text-slate-500 font-medium">Initiate NEFT / RTGS / IMPS transfer from your corporate bank portal</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Beneficiary Name</span>
                        <span className="font-bold text-slate-900">JOY CORPORATE SOLUTIONS PRIVATE LIMITED</span>
                      </div>
                      <span className="badge badge-indigo text-[10px]">Verified Current A/C</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Number</span>
                        <span className="font-mono font-extrabold text-slate-900 text-sm">50200088991234</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('50200088991234', 'account_no')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedKey === 'account_no' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'account_no' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">IFSC Code</span>
                        <span className="font-mono font-extrabold text-slate-900 text-sm">HDFC0000128</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('HDFC0000128', 'ifsc')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedKey === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'ifsc' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>Bank & Branch:</span>
                      <span className="font-semibold text-slate-800">HDFC Bank, Anna Nagar Main Branch, Chennai</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 🛡️ TRUST & SECURITY BADGES */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Settlement</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  PCI-DSS Level 1 Regulated
                </span>
              </div>

              {/* 🌟 ACTION BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing Payment Settlement...</span>
                    </div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm & Pay Online ₹{totalAmountDue.toLocaleString()}.00</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  ), document.body);
};
