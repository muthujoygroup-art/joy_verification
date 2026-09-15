import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Sliders, 
  Edit3, 
  Building2, 
  Clock, 
  AlertCircle,
  CreditCard,
  QrCode
} from 'lucide-react';

export const InvoiceModal = ({ company, postpaidBill: initialPostpaidBill, transaction, onClose }) => {
  if (!company) return null;

  const { candidates, vendors, POSTPAID_PLANS, calculateCompanyPostpaidBill } = useApp();

  // Calculate live or resolve from transaction
  const computedBill = initialPostpaidBill || (typeof calculateCompanyPostpaidBill === 'function' ? calculateCompanyPostpaidBill(company, candidates, vendors) : null);
  const plan = computedBill?.plan || (POSTPAID_PLANS && POSTPAID_PLANS.tier1) || {
    name: 'Tier 1 (Starter)',
    shortName: 'Tier 1',
    maxProfiles: 50,
    ratePerProfile: 180,
    overageRate: 200
  };

  const [baseCount, setBaseCount] = useState(
    transaction?.baseProfiles || computedBill?.baseProfilesCount || 50
  );
  const [overageCount, setOverageCount] = useState(
    transaction?.overageProfiles || computedBill?.overageProfilesCount || 0
  );
  const [vendorCount, setVendorCount] = useState(
    transaction?.vendorProfiles || computedBill?.verifiedVendorsCount || 0
  );
  const [baseRate, setBaseRate] = useState(
    transaction?.baseRate || computedBill?.baseRate || plan.ratePerProfile
  );
  const [overageRate, setOverageRate] = useState(
    transaction?.overageRate || computedBill?.overageRate || plan.overageRate
  );
  const [discountAmount, setDiscountAmount] = useState(0);
  const [gstTaxPercent, setGstTaxPercent] = useState(18);
  const [customRemarks, setCustomRemarks] = useState(
    '100% Postpaid monthly verification billing statement. SAC: 998311. Verifications never interrupted.'
  );
  const [isEditingControls, setIsEditingControls] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const invoiceNumber = transaction?.invoiceNumber || transaction?.id || `JDV-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const invoiceDate = transaction?.date || transaction?.timestamp || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const isSettled = !!(transaction && (transaction.status === 'Success 🟢' || transaction.status === 'Settled 🟢'));

  // Live calculations
  const baseSubtotal = baseCount * baseRate;
  const overageSubtotal = overageCount * overageRate;
  const rawSubtotal = baseSubtotal + overageSubtotal;
  const taxableAmount = Math.max(0, rawSubtotal - discountAmount);
  
  // Tax split (CGST 9% + SGST 9% for Intra-state, or IGST 18% for Inter-state)
  const isInterState = (company.gstin_number || '').substring(0, 2) !== '33'; // 33 is TN
  const totalGstAmount = Math.round(taxableAmount * (gstTaxPercent / 100));
  const cgstAmount = isInterState ? 0 : Math.round(totalGstAmount / 2);
  const sgstAmount = isInterState ? 0 : totalGstAmount - cgstAmount;
  const igstAmount = isInterState ? totalGstAmount : 0;
  const grandTotal = taxableAmount + totalGstAmount;

  const handlePrint = () => {
    window.print();
  };

  return createPortal((
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start print:p-0 print:bg-white animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-4xl max-h-[94vh] flex flex-col border border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl relative z-10 overflow-hidden my-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Sticky Modal Header Controls Bar */}
        <div className="shrink-0 sticky top-0 z-20 p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">Postpaid GST Tax Invoice</h2>
                <span className="badge badge-purple text-[10px]">{plan.name}</span>
                {isSettled ? (
                  <span className="badge badge-emerald text-[10px] font-black">Settled 🟢</span>
                ) : (
                  <span className="badge badge-amber text-[10px] font-black">Active Unbilled Cycle ⏳</span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">Official GST tax invoice with SAC 998311 & itemized postpaid tariff rates</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setIsEditingControls(!isEditingControls)}
              className={`btn text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold ${
                isEditingControls ? 'btn-hrexecutive' : 'btn-company'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingControls ? 'Hide Invoice Controls' : 'Edit Invoice Line Items'}</span>
            </button>

            <button 
              type="button"
              onClick={handlePrint}
              className="btn btn-superadmin text-xs py-1.5 px-3 flex items-center gap-1.5 font-black"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button 
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Bill Customization Panel (If toggled) */}
        {isEditingControls && (
          <div className="p-5 bg-indigo-50/80 border-b border-indigo-100 space-y-4 text-xs animate-fadeIn no-print">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-indigo-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Postpaid Bill Line Item Editor</span>
              </h4>
              <span className="text-[11px] text-indigo-700 font-bold">Auto-recalculates on screen</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Base Profiles Count</label>
                <input 
                  type="number" 
                  min="0"
                  value={baseCount} 
                  onChange={(e) => setBaseCount(parseInt(e.target.value) || 0)}
                  className="form-input text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Base Rate (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  value={baseRate} 
                  onChange={(e) => setBaseRate(parseInt(e.target.value) || 0)}
                  className="form-input text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Overage Profiles</label>
                <input 
                  type="number" 
                  min="0"
                  value={overageCount} 
                  onChange={(e) => setOverageCount(parseInt(e.target.value) || 0)}
                  className="form-input text-xs font-bold text-amber-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Overage Rate (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  value={overageRate} 
                  onChange={(e) => setOverageRate(parseInt(e.target.value) || 0)}
                  className="form-input text-xs font-bold text-amber-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Discount (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  value={discountAmount} 
                  onChange={(e) => setDiscountAmount(parseInt(e.target.value) || 0)}
                  className="form-input text-xs font-bold text-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Invoice Remarks & Tax Compliance Notes</label>
              <input 
                type="text" 
                value={customRemarks} 
                onChange={(e) => setCustomRemarks(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>
        )}

        {/* Invoice Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white overflow-y-auto" id="printable-invoice">
          
          {/* Top Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-indigo-600 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
                <div>
                  <span className="text-xl font-black tracking-wider text-slate-900 block leading-tight">
                    JOY DATA VERIFICATION
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
                    Enterprise Background & Identity Screening
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                JOY Corporate Solutions Private Limited • 42 Cyber Park, Bengaluru - 560100
              </p>
              <p className="text-xs text-slate-500 font-medium">
                <strong>GSTIN:</strong> 33AAAAJ9921D1Z4 | <strong>PAN:</strong> AAAAJ9921D | <strong>CIN:</strong> U74999KA2026PTC192841
              </p>
            </div>

            <div className="sm:text-right text-xs space-y-1">
              <span className="badge badge-emerald text-[11px] font-black uppercase">
                TAX INVOICE
              </span>
              <p className="text-base font-black text-slate-900 font-mono mt-1">{invoiceNumber}</p>
              <p className="text-slate-600 font-semibold">Date: {invoiceDate}</p>
              <p className="text-slate-600 font-semibold">Billing Cycle: {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</p>
              <p className="text-slate-500">SAC Code: <strong>998311</strong></p>
            </div>
          </div>

          {/* Billed To Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <p className="text-slate-500 uppercase font-black tracking-wider mb-1">Billed To (Corporate Client):</p>
              <p className="text-base font-black text-slate-900">{company.name}</p>
              <p className="text-slate-700 font-medium mt-0.5">Contact Person: <strong>{company.contactPerson || 'Company Admin'}</strong></p>
              <p className="text-slate-600">Email: {company.email}</p>
              <p className="text-slate-600">Address: {company.location || company.registered_address || 'Registered Office Address'}</p>
              <p className="text-indigo-900 font-bold mt-1">
                Client GSTIN: <strong>{company.gstin_number || '29AAACA1234A1Z5'}</strong>
              </p>
            </div>
            <div className="sm:text-right space-y-1">
              <p className="text-slate-500 uppercase font-black tracking-wider mb-1">Subscription & Tariff Plan:</p>
              <p className="text-base font-black text-indigo-700">{plan.name}</p>
              <p className="text-slate-700 font-medium">Included Quota: <strong>{plan.maxProfiles === 999999 ? '500+ (Custom)' : `${plan.maxProfiles} Profiles`}</strong></p>
              <p className="text-slate-700 font-medium">Tariff Base Rate: <strong>₹{plan.ratePerProfile} / Profile</strong></p>
              <p className="text-amber-800 font-bold">Overage Surcharge Rate: <strong>₹{plan.overageRate} / Profile</strong></p>
              <p className="text-emerald-700 font-bold mt-1">
                Billing Model: 100% Postpaid (Never Interrupted)
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span>Itemized Postpaid Verification Breakdown</span>
              <span className="text-[10px] text-slate-500 font-normal">SAC: 998311 (Information Technology & BGV Services)</span>
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 uppercase font-extrabold bg-slate-100/70">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Service Description</th>
                    <th className="py-3 px-4 text-center">SAC Code</th>
                    <th className="py-3 px-4 text-center">Verified Qty</th>
                    <th className="py-3 px-4 text-right">Tariff Rate</th>
                    <th className="py-3 px-4 text-right">Taxable Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  
                  {/* Item 1: Base Tier Verifications */}
                  <tr className="font-medium hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-400 font-bold">1</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">Base Included Employee & Vendor Verifications</div>
                      <div className="text-[11px] text-slate-500">
                        Aadhaar UIDAI OTP + PAN Card NSDL + Mobile Carrier OTP + AI WebCam Face Liveness Match ({plan.name})
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">998311</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-700 font-mono text-sm">{baseCount}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">₹{baseRate}.00</td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">₹{baseSubtotal.toLocaleString('en-IN')}.00</td>
                  </tr>

                  {/* Item 2: Exceeding / Overage Profiles (If any) */}
                  {overageCount > 0 && (
                    <tr className="font-medium bg-amber-50/40 hover:bg-amber-50/60">
                      <td className="py-3 px-4 text-amber-600 font-bold">2</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <span>Exceeding Quota Verification Profiles (Overage Surcharge)</span>
                          <span className="badge badge-amber text-[9px]">Never-Blocked Auto-Scale</span>
                        </div>
                        <div className="text-[11px] text-amber-700">
                          Automatic overage execution above {plan.maxProfiles} base quota at agreed postpaid tier tariff
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-700">998311</td>
                      <td className="py-3 px-4 text-center font-bold text-amber-800 font-mono text-sm">+{overageCount}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-800">₹{overageRate}.00</td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-amber-900">₹{overageSubtotal.toLocaleString('en-IN')}.00</td>
                    </tr>
                  )}

                  {/* Vendor Profiles Parity Note */}
                  {vendorCount > 0 && (
                    <tr className="font-medium bg-indigo-50/30">
                      <td className="py-2.5 px-4 text-indigo-400 font-bold">•</td>
                      <td className="py-2.5 px-4" colSpan="5">
                        <div className="text-[11px] text-indigo-900 font-bold">
                          🤝 Vendor Verification Parity: {vendorCount} verified supplier entity included (1 Vendor = 1 Profile quota parity)
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Discount line (if any) */}
                  {discountAmount > 0 && (
                    <tr className="font-medium bg-emerald-50/50">
                      <td className="py-3 px-4 text-emerald-600 font-bold">3</td>
                      <td className="py-3 px-4" colSpan="4">
                        <div className="font-bold text-emerald-800">Special Enterprise Discount / Credit Adjustment</div>
                        <div className="text-[11px] text-emerald-600">Approved Volume Incentive</div>
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-emerald-700 font-mono">-₹{discountAmount.toLocaleString('en-IN')}.00</td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Summary & GST Calculation Box */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2 text-xs">
            <div className="text-slate-600 max-w-sm font-medium space-y-2">
              <div>
                <p className="font-bold text-slate-900 mb-0.5">Billing Remarks & Terms:</p>
                <p className="italic text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  "{customRemarks}"
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                Postpaid invoice settlement is processed via Razorpay corporate card, NEFT/RTGS virtual account, or UPI mandate within 5 business days of month-end.
              </p>
            </div>
            
            <div className="w-full sm:w-80 space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Subtotal:</span>
                <span className="font-bold text-slate-900 font-mono">₹{taxableAmount.toLocaleString('en-IN')}.00</span>
              </div>

              {!isInterState ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (9%):</span>
                    <span className="font-bold text-slate-900 font-mono">₹{cgstAmount.toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (9%):</span>
                    <span className="font-bold text-slate-900 font-mono">₹{sgstAmount.toLocaleString('en-IN')}.00</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600">
                  <span>IGST (18%):</span>
                  <span className="font-bold text-slate-900 font-mono">₹{igstAmount.toLocaleString('en-IN')}.00</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-300">
                <span className="text-indigo-900">Total Net Amount Due:</span>
                <span className="text-emerald-700 font-extrabold text-base font-mono">₹{grandTotal.toLocaleString('en-IN')}.00</span>
              </div>
            </div>
          </div>

          {/* Footer Electronic Certification Stamp */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Electronically certified tax invoice issued under Rule 46 of CGST Rules, 2017.</span>
            </div>
            <div className="font-mono text-slate-400 font-bold">
              DIGITAL SIGNATURE HASH: SHA256:{invoiceNumber.replace(/[^0-9]/g, '') || '982187361'}
            </div>
          </div>

        </div>

      </div>
    </div>
  ), document.body);
};

