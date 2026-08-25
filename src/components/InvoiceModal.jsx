import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText, Sliders, Edit3, Save } from 'lucide-react';

export const InvoiceModal = ({ company, onClose }) => {
  if (!company) return null;

  const [billedCount, setBilledCount] = useState(company.verifiedCountThisMonth || 100);
  const [ratePerUnit, setRatePerUnit] = useState(company.pricePerVerification || 120);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [gstTaxPercent, setGstTaxPercent] = useState(18);
  const [customRemarks, setCustomRemarks] = useState('Standard monthly metered verification billing statement.');
  const [isEditingControls, setIsEditingControls] = useState(false);

  const invoiceNumber = `JDV-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Live calculations
  const rawSubtotal = billedCount * ratePerUnit;
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const gstAmount = Math.round(subtotal * (gstTaxPercent / 100));
  const grandTotal = subtotal + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl max-h-[95vh] overflow-y-auto border border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl my-auto">
        
        {/* Modal Header Controls Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">Editable Bill & Invoice Generator</h2>
                <span className="badge badge-purple text-[10px]">Super Admin Options</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Edit verification rates, counts, discounts & GST tax rates</p>
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
              <span>{isEditingControls ? 'Hide Invoice Controls' : 'Edit Bill Line Items'}</span>
            </button>

            <button 
              type="button"
              onClick={handlePrint}
              className="btn btn-superadmin text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>

            <button 
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Super Admin Live Editing Panel (If toggled or active) */}
        {isEditingControls && (
          <div className="p-5 bg-indigo-50/70 border-b border-indigo-100 space-y-4 text-xs animate-fadeIn no-print">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-indigo-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Super Admin Bill Customization Panel</span>
              </h4>
              <span className="text-[11px] text-indigo-700 font-bold">Changes recalculate instantly on screen</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Verification Count Override</label>
                <input 
                  type="number" 
                  min="1"
                  value={billedCount} 
                  onChange={(e) => setBilledCount(parseInt(e.target.value) || 0)}
                  className="form-input text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tariff Rate / Unit (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  value={ratePerUnit} 
                  onChange={(e) => setRatePerUnit(parseInt(e.target.value) || 0)}
                  className="form-input text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Discount / Credit Adj. (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  value={discountAmount} 
                  onChange={(e) => setDiscountAmount(parseInt(e.target.value) || 0)}
                  className="form-input text-xs font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">GST Tax Rate %</label>
                <select
                  value={gstTaxPercent}
                  onChange={(e) => setGstTaxPercent(parseInt(e.target.value) || 0)}
                  className="form-select text-xs font-bold"
                >
                  <option value={18}>18% GST (Standard)</option>
                  <option value={12}>12% Reduced GST</option>
                  <option value={5}>5% Special GST</option>
                  <option value={0}>0% Tax Exempt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Custom Invoice Remarks & Billing Notes</label>
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
        <div className="p-6 sm:p-8 space-y-6 bg-white" id="printable-invoice">
          
          {/* Top Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
                <span className="text-xl font-black tracking-wider text-slate-900">
                  JOY DATA VERIFICATION
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Enterprise Profile & Identity Verification System</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold">GSTIN: 33AAAAJ9921D1Z4 | Govt API SETU Licensed Partner</p>
            </div>

            <div className="sm:text-right text-xs space-y-1">
              <span className="badge badge-emerald">Official Tax Invoice</span>
              <p className="text-sm font-extrabold text-slate-900 font-mono mt-1">{invoiceNumber}</p>
              <p className="text-slate-500 font-medium">Billing Cycle: August 2026</p>
              <p className="text-slate-500 font-medium">Date: August 20, 2026</p>
            </div>
          </div>

          {/* Billed To Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-slate-500 uppercase font-bold mb-1">Billed To (Company):</p>
              <p className="text-base font-black text-slate-900">{company.name}</p>
              <p className="text-slate-700 font-medium mt-1">Contact: {company.contactPerson}</p>
              <p className="text-slate-600">Email: {company.email}</p>
              <p className="text-slate-500">Account Code: #{company.code}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-slate-500 uppercase font-bold mb-1">Subscription & Tariff Level:</p>
              <p className="text-base font-black text-indigo-700">{company.plan}</p>
              <p className="text-slate-700 font-medium mt-1">Verification Quota Limit: {company.maxLimit} Profiles</p>
              <p className="text-emerald-700 font-bold mt-1">Status: Active Account 🟢</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-600 mb-3">Line Item Verification Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold">
                    <th className="py-3 px-4">Service Description</th>
                    <th className="py-3 px-4 text-center">API Gateways</th>
                    <th className="py-3 px-4 text-center">Billed Verifications</th>
                    <th className="py-3 px-4 text-right">Tariff Rate</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr className="font-medium">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">Employee Profile Verifications</div>
                      <div className="text-[11px] text-slate-500">Includes Govt Aadhaar OTP, Mobile OTP & AI WebCam Face Liveness match</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="badge badge-purple text-[10px]">Govt API SETU + Sandbox</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{billedCount}</td>
                    <td className="py-3 px-4 text-right font-bold">₹{ratePerUnit}.00</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">₹{rawSubtotal.toLocaleString()}.00</td>
                  </tr>

                  {discountAmount > 0 && (
                    <tr className="font-medium bg-emerald-50/50">
                      <td className="py-3 px-4" colSpan="4">
                        <div className="font-bold text-emerald-800">Special Promo / Credit Adjustment Discount</div>
                        <div className="text-[11px] text-emerald-600">Applied by Super Admin</div>
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-emerald-700">-₹{discountAmount.toLocaleString()}.00</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Summary Box */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 pt-4 border-t border-slate-200 text-xs">
            <div className="text-slate-600 max-w-sm font-medium">
              <p className="font-bold text-slate-900 mb-1">Billing Remarks & Instructions:</p>
              <p className="italic text-slate-700">"{customRemarks}"</p>
              <p className="text-[11px] text-slate-500 mt-2">Payment is processed via registered company mandate within 5 business days.</p>
            </div>
            
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}.00</span>
              </div>
              
              <div className="flex justify-between text-slate-600">
                <span>GST Tax ({gstTaxPercent}%):</span>
                <span className="font-bold text-slate-900">₹{gstAmount.toLocaleString()}.00</span>
              </div>
              
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span className="text-indigo-700">Net Payable Balance:</span>
                <span className="text-emerald-700 font-extrabold text-base">₹{grandTotal.toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>This is an official electronically certified invoice generated by JOY DATA VERIFICATION Platform.</span>
          </div>

        </div>

      </div>
    </div>
  );
};
