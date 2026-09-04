import React, { useEffect, useState } from 'react';
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
  Receipt
} from 'lucide-react';

export const PaymentModal = ({ company, onClose }) => {
  const { payCompanyInvoice, companyPaymentLedger } = useApp();

  if (!company) return null;

  const currentLedger = companyPaymentLedger[company.id] || { status: 'PENDING ⏳' };
  const rawSubtotal = company.verifiedCountThisMonth * company.pricePerVerification;
  const gstAmount = Math.round(rawSubtotal * 0.18);
  const totalAmountDue = rawSubtotal + gstAmount;

  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
 // 'upi' | 'card' | 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(
    currentLedger.status === 'SETTLED ✅' ? currentLedger : null
  );

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const methodLabel = paymentMethod === 'upi' ? 'UPI QR (GPay / Razorpay)' : paymentMethod === 'card' ? 'Credit/Debit Card (Stripe)' : 'Net Banking Mandate';
      payCompanyInvoice(company.id, totalAmountDue, methodLabel);
      
      setPaymentSuccessData({
        status: 'SETTLED ✅',
        paymentId: `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        amount: totalAmountDue,
        method: methodLabel
      });
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="glass-panel w-full max-w-xl max-h-[92vh] flex flex-col border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl relative z-10 overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between shadow-2xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Online Invoice Payment & Settlement</h2>
              <p className="text-xs text-slate-500 font-medium">Direct billing payment settlement between Company Admin & Super Admin</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg p-1 hover:bg-slate-100 rounded-lg cursor-pointer">✕</button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

        {/* Invoice Summary Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-bold">Client Enterprise:</span>
            <span className="font-extrabold text-slate-900 text-sm">{company.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-bold">Subscription Plan:</span>
            <span className="badge badge-purple">{company.plan}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-bold">Verified Profiles This Month:</span>
            <span className="font-bold text-slate-900">{company.verifiedCountThisMonth} Profiles</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-extrabold">
            <span className="text-slate-700">Total Net Amount Due:</span>
            <span className="text-emerald-700 text-lg font-black">₹{totalAmountDue.toLocaleString()}.00</span>
          </div>
        </div>

        {/* IF ALREADY SETTLED */}
        {paymentSuccessData ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn text-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <div>
              <span className="badge badge-emerald text-xs py-1 px-3">INVOICE SETTLED & PAID ✅</span>
              <h3 className="text-lg font-black text-emerald-950 mt-1">Payment Completed Successfully!</h3>
              <p className="text-slate-600 font-medium">Reference Transaction ID: <code className="font-mono font-bold text-slate-900">{paymentSuccessData.paymentId}</code></p>
            </div>

            <div className="p-3 bg-white border border-emerald-200 rounded-xl text-left space-y-1 text-slate-700 font-medium">
              <div className="flex justify-between"><span>Settlement Date:</span> <strong>{paymentSuccessData.date}</strong></div>
              <div className="flex justify-between"><span>Payment Channel:</span> <strong>{paymentSuccessData.method}</strong></div>
              <div className="flex justify-between"><span>Paid Amount:</span> <strong className="text-emerald-700">₹{paymentSuccessData.amount?.toLocaleString()}.00</strong></div>
            </div>

            <button onClick={onClose} className="btn btn-hrexecutive text-xs py-2 px-4 font-bold w-full">
              Close Payment Window
            </button>
          </div>
        ) : (
          /* PAYMENT FORM */
          <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
            
            {/* Payment Method Selector */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Select Payment Channel *</label>
              <div className="grid grid-cols-3 gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'upi' ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <span>Instant UPI QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'netbanking' ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-sky-600" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* UPI QR CODE DISPLAY */}
            {paymentMethod === 'upi' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2 animate-fadeIn">
                <p className="font-bold text-slate-800">Scan QR Code with GPay / PhonePe / Paytm / BHIM</p>
                <div className="w-36 h-36 bg-white p-2 border border-slate-300 rounded-xl mx-auto flex items-center justify-center shadow-sm">
                  {/* Mock UPI QR */}
                  <div className="w-full h-full bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center p-2 font-mono text-[9px] text-center">
                    <QrCode className="w-16 h-16 text-emerald-400 mb-1" />
                    <span>UPI ID: joy@icici</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Merchant: <strong>JOY DATA VERIFICATION PLATFORM</strong></p>
              </div>
            )}

            {/* CARD INPUT FORM */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fadeIn">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Card Number *</label>
                  <input type="text" placeholder="4532 •••• •••• 8812" className="form-input text-xs font-mono" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Expiry MM/YY *</label>
                    <input type="text" placeholder="08/28" className="form-input text-xs font-mono" required />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">CVV Security Code *</label>
                    <input type="password" placeholder="•••" maxLength="4" className="form-input text-xs font-mono" required />
                  </div>
                </div>
              </div>
            )}

            {/* NET BANKING */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fadeIn">
                <label className="block text-slate-700 font-bold mb-1">Select Bank Mandate *</label>
                <select className="form-select text-xs font-bold">
                  <option>HDFC Bank Enterprise Banking</option>
                  <option>ICICI Corporate Banking</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Axis Bank Commercial</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Settlement</span>
              </span>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-hrexecutive text-xs py-2.5 px-5 font-bold shadow-md flex items-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Settlement...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pay Online ₹{totalAmountDue.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        </div>
      </div>
    </div>
    </div>
  );
};
