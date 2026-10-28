import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  PROFILE_VOLUME_PRESETS,
  EMPLOYEE_VERIFICATION_CHECKS,
  VENDOR_VERIFICATION_CHECKS,
  COMMUNICATION_GATEWAYS,
  calculateDynamicPlanBill
} from '../config/planPricingConfig';
import {
  Check,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  Smartphone,
  Mail,
  Receipt,
  ArrowRight,
  X,
  Sparkles,
  HelpCircle,
  FileCheck,
  ChevronRight,
  Info,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  Lock,
  Download,
  Printer,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DynamicPlanBuilderModal = ({
  isOpen,
  onClose,
  targetCompanyId = null,
  onSuccess = null,
  initialVolumePreset = 'vol_300',
  initialCustomProfileCount = 1000,
  initialEmpChecks = null,
  initialVendorChecks = null,
  initialGateways = null,
  initialActiveTab = 'employee'
}) => {
  const {
    companies,
    currentUser,
    platformLogoEmblem,
    showToast,
    refreshUserData,
    systemSettings
  } = useApp();

  const minPlanOrderAmount = Number(systemSettings?.superadmin?.minPlanOrderAmount) || 2000;

  // Determine active company
  const company = useMemo(() => {
    if (targetCompanyId) {
      return (companies || []).find(c => c.id === targetCompanyId) || null;
    }
    if (currentUser?.companyId) {
      return (companies || []).find(c => c.id === currentUser.companyId) || null;
    }
    return (companies && companies[0]) || null;
  }, [companies, targetCompanyId, currentUser]);

  // Volume Selection State
  const [selectedVolumePreset, setSelectedVolumePreset] = useState(initialVolumePreset || 'vol_300');
  const [customProfileCount, setCustomProfileCount] = useState(initialCustomProfileCount || 1000);

  // Active Category Tab
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'employee'); // 'employee' | 'vendor' | 'gateways'

  // Selected Check IDs (Default: Empty Selection)
  const [selectedEmpChecks, setSelectedEmpChecks] = useState(() => {
    if (initialEmpChecks && Array.isArray(initialEmpChecks)) return initialEmpChecks;
    return [];
  });

  const [selectedVendorChecks, setSelectedVendorChecks] = useState(() => {
    if (initialVendorChecks && Array.isArray(initialVendorChecks)) return initialVendorChecks;
    return [];
  });

  const [selectedGateways, setSelectedGateways] = useState(() => {
    if (initialGateways && Array.isArray(initialGateways)) return initialGateways;
    return ['gw_email'];
  });

  // Synchronize state when modal is opened with new props
  useEffect(() => {
    if (isOpen) {
      if (initialVolumePreset) setSelectedVolumePreset(initialVolumePreset);
      if (initialCustomProfileCount) setCustomProfileCount(initialCustomProfileCount);
      if (initialEmpChecks && Array.isArray(initialEmpChecks)) setSelectedEmpChecks(initialEmpChecks);
      if (initialVendorChecks && Array.isArray(initialVendorChecks)) setSelectedVendorChecks(initialVendorChecks);
      if (initialGateways && Array.isArray(initialGateways)) setSelectedGateways(initialGateways);
      if (initialActiveTab) setActiveTab(initialActiveTab);
    }
  }, [isOpen, initialVolumePreset, initialCustomProfileCount, initialEmpChecks, initialVendorChecks, initialGateways, initialActiveTab]);

  // Payment Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  // Key Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && typeof onClose === 'function') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Active profile count
  const activeProfileCount = useMemo(() => {
    if (selectedVolumePreset === 'vol_custom') {
      return Math.max(10, Number(customProfileCount) || 100);
    }
    const preset = PROFILE_VOLUME_PRESETS.find(p => p.id === selectedVolumePreset);
    return preset ? preset.count : 300;
  }, [selectedVolumePreset, customProfileCount]);

  // Computed Dynamic Plan Bill
  const bill = useMemo(() => {
    return calculateDynamicPlanBill({
      profileCount: activeProfileCount,
      selectedEmployeeCheckIds: selectedEmpChecks,
      selectedVendorCheckIds: selectedVendorChecks,
      selectedGatewayIds: selectedGateways
    });
  }, [activeProfileCount, selectedEmpChecks, selectedVendorChecks, selectedGateways]);

  // Handle Employee Check Toggle (with mutually exclusive pairing for basic/detailed)
  const toggleEmployeeCheck = (item) => {
    setSelectedEmpChecks(prev => {
      const exists = prev.includes(item.id);
      if (exists) {
        return prev.filter(id => id !== item.id);
      } else {
        let updated = [...prev, item.id];
        // If this item belongs to a mutually exclusive group, uncheck the opposing tier
        if (item.group) {
          if (item.id.endsWith('_basic')) {
            const detailedId = item.id.replace('_basic', '_detailed');
            updated = updated.filter(id => id !== detailedId);
          } else if (item.id.endsWith('_detailed')) {
            const basicId = item.id.replace('_detailed', '_basic');
            updated = updated.filter(id => id !== basicId);
          }
        }
        return updated;
      }
    });
  };

  // Handle Vendor Check Toggle
  const toggleVendorCheck = (item) => {
    setSelectedVendorChecks(prev => {
      return prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id];
    });
  };

  // Handle Gateway Toggle
  const toggleGateway = (item) => {
    if (item.isFixed) return; // Email is included by default
    setSelectedGateways(prev => {
      return prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id];
    });
  };

  // Quick Select Presets
  const handleSelectAllEmployee = () => {
    // Select all detailed checks (full compliance)
    const allDetailed = [];
    EMPLOYEE_VERIFICATION_CHECKS.forEach(cat => {
      cat.items.forEach(it => {
        if (!it.id.endsWith('_basic')) {
          allDetailed.push(it.id);
        }
      });
    });
    setSelectedEmpChecks(allDetailed);
  };

  const handleSelectAllVendor = () => {
    const all = [];
    VENDOR_VERIFICATION_CHECKS.forEach(cat => {
      cat.items.forEach(it => all.push(it.id));
    });
    setSelectedVendorChecks(all);
  };

  // ⚡ Execute Razorpay Payment & Single Plan Settlement
  const handleExecutePurchase = async () => {
    if (!company?.id) {
      showToast('Please select an active company to purchase verification credits.', 'error');
      return;
    }

    if (bill.totalAmount < minPlanOrderAmount) {
      showToast(`Minimum Order Requirement: In accordance with statutory processing tariffs, single plan purchases require a minimum order commitment of ₹${minPlanOrderAmount.toLocaleString('en-IN')}. Please increase your profile quota or select additional verification checks to proceed.`, 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Fetch Razorpay Public Config from Backend
      const configRes = await api.getRazorpayConfig().catch(() => ({
        key_id: 'rzp_test_1DP5mmOlF5G5ag',
        is_configured: false
      }));

      const activeKeyId = configRes?.key_id || 'rzp_test_1DP5mmOlF5G5ag';

      // 2. Create Official Razorpay Order via Backend
      const orderPayload = {
        amount: bill.totalAmount,
        currency: 'INR',
        receipt: `rcpt_plan_${company.code || 'JOY'}_${Date.now().toString().slice(-6)}`,
        notes: {
          company_id: company.id,
          company_name: company.name,
          profile_count: bill.profileCount,
          total_rate_per_profile: bill.totalRatePerProfile
        }
      };

      let orderData;
      try {
        orderData = await api.createRazorpayOrder(orderPayload);
      } catch (err) {
        console.warn('Backend order generation fallback:', err);
        orderData = {
          id: `order_sim_${Date.now()}`,
          amount: bill.totalAmount * 100,
          currency: 'INR',
          key_id: activeKeyId
        };
      }

      // Plan metadata payload for verification endpoint
      const planPayload = {
        profileCount: bill.profileCount,
        subtotal: bill.subtotal,
        gstRate: bill.gstRate,
        gstAmount: bill.gstAmount,
        totalAmount: bill.totalAmount,
        totalRatePerProfile: bill.totalRatePerProfile,
        selectedEmployeeCheckIds: selectedEmpChecks,
        selectedVendorCheckIds: selectedVendorChecks,
        selectedGatewayIds: selectedGateways
      };

      // 3. Trigger Razorpay Checkout Popup if script is loaded
      if (window.Razorpay) {
        const options = {
          key: activeKeyId,
          amount: orderData.amount || (bill.totalAmount * 100),
          currency: orderData.currency || 'INR',
          name: 'JOY CORPORATE SOLUTIONS PVT LTD',
          description: `Single Plan (${bill.profileCount} Profiles BGV Checklist Quota)`,
          image: platformLogoEmblem || '/assets/logos/joy_true_profile_shield_emblem.png',
          order_id: orderData.id && !orderData.id.startsWith('order_sim_') ? orderData.id : undefined,
          prefill: {
            name: company.contact_person || company.contactPerson || 'Company Administrator',
            email: company.email || 'admin@joycorporatesolutions.com',
            contact: company.phone || '+919876543210'
          },
          theme: {
            color: '#4f46e5'
          },
          handler: async function (response) {
            try {
              // 4. Verify Cryptographic Signature on Backend & Settle Plan
              const verifyRes = await api.verifyRazorpayPayment({
                company_id: company.id,
                razorpay_order_id: response.razorpay_order_id || orderData.id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || `sig_sim_${Date.now()}`,
                plan_data: planPayload
              });

              setIsProcessing(false);
              setPaymentSuccessData(verifyRes);
              confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
              showToast(`🎉 ₹${bill.totalAmount.toLocaleString('en-IN')} Plan purchased! ${bill.profileCount} verification profiles added.`);
              if (typeof refreshUserData === 'function') refreshUserData();
              if (typeof onSuccess === 'function') onSuccess(verifyRes);
            } catch (verErr) {
              setIsProcessing(false);
              showToast(`Payment settlement error: ${verErr.message}`, 'error');
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setIsProcessing(false);
          showToast(`Payment failed: ${resp.error.description || 'Transaction declined'}`, 'error');
        });
        rzp.open();
      } else {
        // Fallback / Instant Sandbox Mode
        simulateDirectSettlement(orderData, planPayload);
      }
    } catch (e) {
      setIsProcessing(false);
      showToast(`Order initialization error: ${e.message}`, 'error');
    }
  };

  // Sandbox simulation fallback
  const simulateDirectSettlement = async (orderData, planPayload) => {
    setTimeout(async () => {
      try {
        const simPaymentId = `pay_sim_${Date.now()}`;
        const verifyRes = await api.verifyRazorpayPayment({
          company_id: company.id,
          razorpay_order_id: orderData.id,
          razorpay_payment_id: simPaymentId,
          razorpay_signature: `sig_sim_${Date.now()}`,
          plan_data: planPayload
        });

        setIsProcessing(false);
        setPaymentSuccessData(verifyRes);
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
        showToast(`⚡ ₹${bill.totalAmount.toLocaleString('en-IN')} Plan purchased! ${bill.profileCount} profiles activated.`);
        if (typeof refreshUserData === 'function') refreshUserData();
        if (typeof onSuccess === 'function') onSuccess(verifyRes);
      } catch (err) {
        setIsProcessing(false);
        showToast(`Simulation failed: ${err.message}`, 'error');
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-slate-900 relative z-10 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <img
                src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"}
                alt="JOY Emblem"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white tracking-tight font-outfit">
                  Single Plan Checklist & Pricing Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[10px] font-black uppercase tracking-wider">
                  Itemized Rate Card
                </span>
              </div>
              <p className="text-[11px] text-indigo-200/80 font-medium">
                {company ? `${company.name} (${company.code || 'JOY'})` : 'JOY TrueProfile Platform'} • Select only what you need, pay only for what you verify
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {paymentSuccessData ? (
            /* ========================================================= */
            /* 🟢 PAYMENT COMPLETED SUCCESS STATE                         */
            /* ========================================================= */
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/70 border-2 border-emerald-300 text-center space-y-5 animate-scaleUp">
              <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PLAN ACTIVATED SUCCESSFULLY
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-outfit">
                  ₹{paymentSuccessData.total_amount?.toLocaleString('en-IN')} Paid via Razorpay!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  <strong>{paymentSuccessData.profile_count_added} Profiles</strong> added to{' '}
                  <strong className="text-emerald-700">{paymentSuccessData.company_name}</strong>. New verified candidate quota is{' '}
                  <strong>{paymentSuccessData.new_max_limit} Profiles</strong>.
                </p>
              </div>

              {/* Tax Invoice Breakdown Receipt */}
              <div className="max-w-lg mx-auto bg-white p-5 rounded-2xl border border-emerald-200 text-left text-xs space-y-2 text-slate-700 shadow-sm font-mono">
                <div className="flex justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">GST Tax Invoice No:</span>
                  <span className="font-bold text-slate-900">{paymentSuccessData.invoice_id}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Razorpay Payment ID:</span>
                  <span className="font-bold text-indigo-700">{paymentSuccessData.razorpay_payment_id}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Profiles Added:</span>
                  <span className="font-bold text-slate-900">+{paymentSuccessData.profile_count_added} Profiles</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">Subtotal:</span>
                  <span className="font-bold text-slate-900">₹{paymentSuccessData.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-bold">18% GST (SAC 998311):</span>
                  <span className="font-bold text-slate-900">₹{paymentSuccessData.gst_amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 pt-1 text-sm">
                  <span>Total Amount Settled:</span>
                  <span>₹{paymentSuccessData.total_amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice</span>
                </button>
                <button
                  onClick={() => {
                    setPaymentSuccessData(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>Return to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* 📋 STEP 1: VOLUME QUOTA + STEP 2: CHECKLIST SELECTION     */
            /* ========================================================= */
            <>
              {/* 1. Profile Volume Preset Selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Choose Profile Verification Volume
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    Current Limit: <strong className="text-slate-900">{company?.max_limit || 500} Profiles</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROFILE_VOLUME_PRESETS.map((preset) => {
                    const isSelected = selectedVolumePreset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedVolumePreset(preset.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-600/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {preset.badge && (
                          <span
                            className={`absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-black ${
                              preset.isPopular
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {preset.badge}
                          </span>
                        )}
                        <div>
                          <span className="text-base font-black text-slate-900 block font-outfit">
                            {preset.label}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium block mt-0.5 leading-snug">
                            {preset.desc}
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-700">
                            {preset.isCustom ? 'Custom Quota' : `${preset.count} Credits`}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Input Field when Custom is selected */}
                {selectedVolumePreset === 'vol_custom' && (
                  <div className="mt-3 p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-200 flex items-center gap-3 animate-fadeIn">
                    <span className="text-xs font-bold text-indigo-950 shrink-0">
                      Enter Custom Profile Quota:
                    </span>
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="number"
                        min="10"
                        step="10"
                        value={customProfileCount}
                        onChange={(e) => setCustomProfileCount(Math.max(1, Number(e.target.value)))}
                        className="w-full pl-3 pr-16 py-1.5 text-xs font-black bg-white border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 1000"
                      />
                      <span className="absolute right-3 top-2 text-[10px] font-black text-slate-400 uppercase">
                        Profiles
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      (Minimum 10 profiles, volume pricing applies)
                    </span>
                  </div>
                )}
              </div>

              {/* 2. Checklist Category Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Configure Verification Checklist Options
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTab === 'employee' && (
                      <button
                        onClick={handleSelectAllEmployee}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                      >
                        Select All Detailed (Recommended)
                      </button>
                    )}
                    {activeTab === 'vendor' && (
                      <button
                        onClick={handleSelectAllVendor}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                      >
                        Select All Vendor Checks
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-tab navigation */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setActiveTab('employee')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'employee'
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Employee Background Checks ({selectedEmpChecks.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('vendor')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'vendor'
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Vendor Due Diligence ({selectedVendorChecks.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gateways')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'gateways'
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Gateways & Comms ({selectedGateways.length})</span>
                  </button>
                </div>

                {/* TAB 1: EMPLOYEE BACKGROUND CHECKS */}
                {activeTab === 'employee' && (
                  <div className="space-y-4 pt-1">
                    {EMPLOYEE_VERIFICATION_CHECKS.map((category, catIdx) => (
                      <div key={catIdx} className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                          {category.category}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {category.items.map((item) => {
                            const isChecked = selectedEmpChecks.includes(item.id);
                            const isDetailed = item.id.endsWith('_detailed');
                            return (
                              <div
                                key={item.id}
                                onClick={() => toggleEmployeeCheck(item)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                                  isChecked
                                    ? 'bg-white border-indigo-400 shadow-xs ring-1 ring-indigo-200'
                                    : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isChecked
                                      ? 'bg-indigo-600 text-white'
                                      : 'border border-slate-300 bg-white'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                                      {isChecked ? 'Included' : 'Optional'}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span
                                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                                        isDetailed
                                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                                      }`}
                                    >
                                      {item.subType}
                                    </span>
                                  </div>

                                  <p className="text-[10px] text-slate-500 font-medium mt-1 leading-snug line-clamp-2">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 2: VENDOR DUE DILIGENCE CHECKS */}
                {activeTab === 'vendor' && (
                  <div className="space-y-4 pt-1">
                    {VENDOR_VERIFICATION_CHECKS.map((category, catIdx) => (
                      <div key={catIdx} className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                          {category.category}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {category.items.map((item) => {
                            const isChecked = selectedVendorChecks.includes(item.id);
                            return (
                              <div
                                key={item.id}
                                onClick={() => toggleVendorCheck(item)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                                  isChecked
                                    ? 'bg-white border-indigo-400 shadow-xs ring-1 ring-indigo-200'
                                    : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isChecked
                                      ? 'bg-indigo-600 text-white'
                                      : 'border border-slate-300 bg-white'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 shrink-0">
                                      {isChecked ? 'Included' : 'Optional'}
                                    </span>
                                  </div>

                                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 inline-block mt-0.5">
                                    {item.subType}
                                  </span>

                                  <p className="text-[10px] text-slate-500 font-medium mt-1 leading-snug line-clamp-2">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: GATEWAYS & CHANNELS */}
                {activeTab === 'gateways' && (
                  <div className="space-y-3 pt-1">
                    <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                        Communication & Dispatch Infrastructure
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {COMMUNICATION_GATEWAYS.map((item) => {
                          const isChecked = selectedGateways.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleGateway(item)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                isChecked
                                  ? 'bg-white border-indigo-400 shadow-xs ring-1 ring-indigo-200'
                                  : 'bg-white/60 border-slate-200 hover:border-slate-300'
                              } ${item.isFixed ? 'opacity-90 cursor-not-allowed' : ''}`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isChecked
                                      ? 'bg-indigo-600 text-white'
                                      : 'border border-slate-300 bg-white'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-900">
                                      {item.name}
                                    </span>
                                    {item.isFixed ? (
                                      <span className="badge badge-emerald text-[8px] font-black uppercase">
                                        Included Free
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        {isChecked ? 'Active' : 'Optional'}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-500 block mt-0.5">
                                    {item.subType}
                                  </span>
                                  <p className="text-[10px] text-slate-500 font-medium mt-1 leading-snug">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Sticky Real-Time Bill Breakdown Card */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 sm:p-5 rounded-2xl text-white shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-800/60">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-indigo-300 block">
                      Single Plan Dynamic Bill Summary
                    </span>
                    <span className="text-sm sm:text-base font-black text-white font-outfit mt-0.5 block">
                      {bill.profileCount} Candidate Profiles • {bill.totalSelectedChecksCount} Verification Checks Selected
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-indigo-300 block">Rate Per Profile</span>
                      <span className="text-lg font-black text-white font-outfit">
                        ₹{bill.totalRatePerProfile.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-300 block">Subtotal</span>
                    <span className="font-extrabold text-white">
                      ₹{bill.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-300 block">18% GST (SAC 998311)</span>
                    <span className="font-extrabold text-white">
                      ₹{bill.gstAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-[10px] font-bold text-indigo-300 block">Net Total Payable</span>
                    <span className="text-2xl font-black text-yellow-300 font-outfit">
                      ₹{bill.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Minimum Order Warning Banner if below threshold */}
                {bill.totalAmount < minPlanOrderAmount && (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Enterprise Minimum Order Policy: <strong>₹{minPlanOrderAmount.toLocaleString('en-IN')}</strong> required (Current: ₹{bill.totalAmount.toLocaleString('en-IN')}). Please add ₹{(minPlanOrderAmount - bill.totalAmount).toLocaleString('en-IN')} in checks or profiles to proceed.
                    </span>
                  </div>
                )}

                {/* Purchase Button */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-indigo-200/80">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant activation via Razorpay • UPI / NetBanking / Cards</span>
                  </div>

                  <button
                    onClick={handleExecutePurchase}
                    disabled={isProcessing || bill.totalAmount < minPlanOrderAmount}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                      bill.totalAmount < minPlanOrderAmount
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-80'
                        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-amber-500/30'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>
                      {isProcessing
                        ? 'Opening Razorpay Gateway...'
                        : bill.totalAmount < minPlanOrderAmount
                          ? `Minimum Order ₹${minPlanOrderAmount.toLocaleString('en-IN')} Required`
                          : `Pay ₹${bill.totalAmount.toLocaleString('en-IN')} & Activate Plan`}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>DPDP Act 2023 Compliant • Official Indian Statutory Gateways</span>
          </div>
          <span className="font-bold text-slate-700">JOY TrueProfile Verification Platform</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
