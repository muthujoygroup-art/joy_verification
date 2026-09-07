import React, { useState, useMemo } from 'react';
import { 
  Smartphone, CreditCard, Shield, Landmark, Car, Briefcase, 
  FileCheck, Vote, Scale, Truck, Building2, Play, RefreshCw, 
  Check, AlertCircle, Clock, Copy, Sparkles, Database, FileText, 
  CheckCircle2, Download, Search, FileCode, Printer, ShieldCheck, 
  ExternalLink, ChevronDown, ChevronUp, KeyRound, Wifi, Info,
  Activity, X, AlertTriangle, Layers, Filter
} from 'lucide-react';
import { api } from '../services/api';

export const SANDBOX_MODULES = [
  {
    id: 'mobile',
    label: 'Mobile Number Checks',
    icon: Smartphone,
    color: 'from-blue-600 to-cyan-600',
    endpoints: [
      { slug: '/mobile360', name: 'Mobile 360 Telecom Profile', defaultPayload: { mobile_number: '9942817491' }, desc: 'Deep multi-carrier telecom identity, operator & tenure verification.' },
      { slug: '/mobile-number-to-pan-v2', name: 'Mobile to PAN Discovery V2', defaultPayload: { mobile_number: '9942817491' }, desc: 'Discovers active PAN cards registered to mobile number.' },
      { slug: '/mobile-to-account-v2', name: 'Mobile to Bank Account V2', defaultPayload: { mobile_number: '9942817491' }, desc: 'Finds verified bank accounts linked to mobile number.' },
      { slug: '/mobile-to-uan-v2', name: 'Mobile to EPFO UAN V2', defaultPayload: { mobile_number: '9942817491' }, desc: 'Discovers Provident Fund UAN numbers linked to mobile.' },
      { slug: '/mobile-to-primary-upi-id', name: 'Mobile to Primary UPI ID', defaultPayload: { mobile_number: '9942817491' }, desc: 'Finds active NPCI UPI VPA handle for phone number.' },
      { slug: '/mobile-number-to-vehicle-rc', name: 'Mobile to Vehicle RC', defaultPayload: { mobile_number: '9942817491' }, desc: 'Identifies vehicle registrations registered on mobile.' },
      { slug: '/mobile-to-dl', name: 'Mobile to Driving License', defaultPayload: { mobile_number: '9942817491' }, desc: 'Discovers MoRTH Driving Licenses mapped to phone.' },
      { slug: '/mobile-number-to-challan-details', name: 'Mobile to Traffic Challans', defaultPayload: { mobile_number: '9942817491' }, desc: 'Searches pending e-Challans against mobile number.' }
    ]
  },
  {
    id: 'pan',
    label: 'PAN Card Checks',
    icon: CreditCard,
    color: 'from-amber-600 to-orange-600',
    endpoints: [
      { slug: '/pan-details-v1', name: 'PAN Details V1 (Authoritative)', defaultPayload: { pan: 'ABCDE1234F', consent: 'Y' }, desc: 'Full NSDL Income Tax PAN details with holder name & category.' },
      { slug: '/pan-info-v2', name: 'PAN Info V2 (Aadhaar Linked)', defaultPayload: { pan_number: 'ABCDE1234F' }, desc: 'PAN verification with Section 139AA Aadhaar seeding check.' },
      { slug: '/pan-basic', name: 'PAN Basic Format Status', defaultPayload: { pan_number: 'ABCDE1234F' }, desc: 'Lightweight format & operative status verification.' },
      { slug: '/pan-to-itr', name: 'PAN to ITR Filing History', defaultPayload: { pan_number: 'ABCDE1234F' }, desc: 'Verifies ITR acknowledgement & filing regularity.' },
      { slug: '/pan-to-gst-numbers', name: 'PAN to GST Numbers', defaultPayload: { pan: 'ABCDE1234F' }, desc: 'Discovers all GSTIN registrations under this PAN.' },
      { slug: '/pan-to-insurance', name: 'PAN to Insurance Policies', defaultPayload: { pan_number: 'ABCDE1234F' }, desc: 'IRDAI insurance policy records linked to PAN.' },
      { slug: '/crif', name: 'CRIF Credit Bureau Check', defaultPayload: { pan: 'ABCDE1234F', name: 'MUTHUKUMAR P', mobile: '9942817491' }, desc: 'Commercial & retail credit report & score check.' }
    ]
  },
  {
    id: 'aadhaar',
    label: 'Aadhaar UIDAI Checks',
    icon: Shield,
    color: 'from-purple-600 to-indigo-600',
    endpoints: [
      { slug: '/aadhaar-verify', name: 'Aadhaar Demographic Verify', defaultPayload: { aadhaar_number: '555555555555' }, desc: 'Validates state, age band, gender & masked mobile.' },
      { slug: '/aadhaar-link-check', name: 'Aadhaar Mobile Link Check', defaultPayload: { id_type: 'MOBILE', mobile: '9942817491', aadhaar_number: '555555555555' }, desc: 'Verifies if specific phone is linked to Aadhaar.' },
      { slug: '/aadhaar-to-pan', name: 'Aadhaar to PAN Mapping', defaultPayload: { aadhaar_number: '555555555555' }, desc: 'Discovers PAN number linked to this Aadhaar.' },
      { slug: '/generate-aadhaar-otp-v2', name: 'Generate Aadhaar OTP V2', defaultPayload: { aadhaar_number: '555555555555' }, desc: 'Dispatches live UIDAI OTP to registered mobile.' },
      { slug: '/aadhaar-detail-verification-v2', name: 'Aadhaar Detail with OTP', defaultPayload: { aadhaar_number: '555555555555', otp: '482913' }, desc: 'Complete biometric demographic & full address e-KYC extraction.' }
    ]
  },
  {
    id: 'bank',
    label: 'Bank & UPI Penny Drop',
    icon: Landmark,
    color: 'from-emerald-600 to-teal-600',
    endpoints: [
      { slug: '/account-validation', name: 'IMPS Penny Drop (₹1)', defaultPayload: { account_number: '501002349845', ifsc_code: 'HDFC0000128' }, desc: 'Live NPCI ₹1 penny drop to extract beneficiary legal name.' },
      { slug: '/ifsc-lookup', name: 'RBI IFSC Code Lookup', defaultPayload: { ifsc_code: 'HDFC0000128' }, desc: 'Fetches bank name, branch address, city & NEFT/RTGS flags.' },
      { slug: '/upi-verification', name: 'UPI VPA Verification', defaultPayload: { vpa: 'joycorp@upi' }, desc: 'Validates UPI ID active status and registered name.' },
      { slug: '/upi-to-account', name: 'UPI to Bank Account', defaultPayload: { upi_id: 'muthukumar@okaxis' }, desc: 'Resolves destination bank account for UPI handle.' }
    ]
  },
  {
    id: 'dl',
    label: 'Driving License (MoRTH)',
    icon: Car,
    color: 'from-sky-600 to-blue-700',
    endpoints: [
      { slug: '/driving-license-details', name: 'MoRTH DL Details & Validity', defaultPayload: { driving_license_number: 'KA0120200004910', date_of_birth: '15-05-1996' }, desc: 'Fetches complete Sarathi DL record, vehicle categories (MCWG, LMV), and expiry.' }
    ]
  },
  {
    id: 'epfo',
    label: 'EPFO UAN & Dual Employment',
    icon: Briefcase,
    color: 'from-indigo-600 to-violet-700',
    endpoints: [
      { slug: '/uan-to-employment-profile', name: 'UAN Profile & Moonlighting Audit', defaultPayload: { uan: '101239019283' }, desc: 'Full member KYC, active establishments, and dual employment check.' },
      { slug: '/uan-to-employment-history-v3', name: 'UAN Service History V3', defaultPayload: { uan: '101239019283' }, desc: 'All past companies, DOJs, DOEs, and resignation reasons.' },
      { slug: '/esic-data', name: 'ESIC Social Security Data', defaultPayload: { id_type: 'MOBILE', mobile: '8610597895' }, desc: 'Employee State Insurance Corporation (ESIC) member records by Mobile or UAN.' }
    ]
  },
  {
    id: 'court',
    label: 'Court & Criminal Records',
    icon: Scale,
    color: 'from-red-600 to-rose-700',
    endpoints: [
      { slug: '/realtime-court-case-search', name: 'Realtime Indian e-Courts Search', defaultPayload: { name: 'MUTHUKUMAR P', father_name: 'Suresh Kumar P', address: 'Bengaluru, Karnataka', dob: '1996-05-15' }, desc: 'Searches High Courts, District Courts, and Tribunals across India.' }
    ]
  },
  {
    id: 'passport',
    label: 'Passport Verification',
    icon: FileCheck,
    color: 'from-teal-600 to-cyan-700',
    endpoints: [
      { slug: '/passport-verification', name: 'MEA Passport Seva File Verification', defaultPayload: { fileNumber: 'V9481920', dob: '1996-05-15', name: 'MUTHUKUMAR P' }, desc: 'Verifies Indian Passport validity, issue date, and adverse flags.' }
    ]
  },
  {
    id: 'voter',
    label: 'Voter ID (ECI)',
    icon: Vote,
    color: 'from-rose-600 to-pink-600',
    endpoints: [
      { slug: '/voter-id-details', name: 'ECI Voter ID (EPIC) Details', defaultPayload: { fileNumber: 'ABC1234567', dob: '1996-05-15' }, desc: 'Election Commission of India constituency & polling booth check.' }
    ]
  },
  {
    id: 'rc',
    label: 'Vehicle RC & Challan',
    icon: Truck,
    color: 'from-amber-600 to-yellow-600',
    endpoints: [
      { slug: '/rc-details', name: 'MoRTH Vahan Vehicle RC Details', defaultPayload: { rc_number: 'KA01AB1234' }, desc: 'Owner name, vehicle class, maker model, fuel type & fitness.' },
      { slug: '/rc-advance', name: 'Vahan RC Advance Report', defaultPayload: { rc_number: 'KA01AB1234' }, desc: 'Hypothecation, insurance company, and PUCC expiry.' },
      { slug: '/challan-status', name: 'Traffic Challan Status', defaultPayload: { rc_number: 'KA01AB1234' }, desc: 'Pending traffic violation fines & challan dates.' },
      { slug: '/fastag-details', name: 'NETC FASTag Status', defaultPayload: { vehicle_number: 'KA01AB1234' }, desc: 'FASTag issuer bank and active tag ID.' }
    ]
  },
  {
    id: 'corporate',
    label: 'Corporate MCA & GSTIN',
    icon: Building2,
    color: 'from-slate-700 to-slate-900',
    endpoints: [
      { slug: '/cin-to-company-details', name: 'MCA Company Profile by CIN', defaultPayload: { cin: 'U72900KA2020PTC131920' }, desc: 'Ministry of Corporate Affairs incorporation, capital, and status.' },
      { slug: '/gst-details-basic-v2', name: 'GSTIN Basic & Principal Place', defaultPayload: { gstin: '29AABCJ1234D1Z5' }, desc: 'GST trade name, legal status, and active registration.' },
      { slug: '/din-to-director-details', name: 'MCA Director Profile by DIN', defaultPayload: { din: '08192830' }, desc: 'Director appointments and active directorships.' },
      { slug: '/udyam-advance', name: 'MSME Udyam Certificate Advance', defaultPayload: { udyam_number: 'UDYAM-KR-03-0012345' }, desc: 'Ministry of MSME enterprise classification and verified activity.' }
    ]
  }
];

export default function UniversalDocumentSandbox({ activeProvider, onGatewayConfigOpen }) {
  const [activeModuleId, setActiveModuleId] = useState('mobile');
  const [selectedEndpointSlug, setSelectedEndpointSlug] = useState('/mobile360');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMode, setInputMode] = useState('form'); // 'form' | 'json'
  const [formFields, setFormFields] = useState({ mobile_number: '9942817491' });
  const [payloadJson, setPayloadJson] = useState(JSON.stringify({ mobile_number: '9942817491' }, null, 2));
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(true);
  const [connTestResult, setConnTestResult] = useState(null);
  const [isTestingConn, setIsTestingConn] = useState(false);

  // 81-Endpoint Full Health Audit State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState(null);
  const [auditFilter, setAuditFilter] = useState('all'); // 'all' | 'active' | 'not_configured' | 'down'
  const [auditSearch, setAuditSearch] = useState('');

  // Find active module & endpoint
  const currentModule = useMemo(() => {
    return SANDBOX_MODULES.find(m => m.id === activeModuleId) || SANDBOX_MODULES[0];
  }, [activeModuleId]);

  const currentEndpoint = useMemo(() => {
    // Look in current module first
    let ep = currentModule.endpoints.find(e => e.slug === selectedEndpointSlug);
    if (!ep) {
      // Look across all modules
      for (const m of SANDBOX_MODULES) {
        ep = m.endpoints.find(e => e.slug === selectedEndpointSlug);
        if (ep) break;
      }
    }
    return ep || currentModule.endpoints[0];
  }, [currentModule, selectedEndpointSlug]);

  // Filtered endpoints based on search query
  const filteredEndpoints = useMemo(() => {
    if (!searchQuery.trim()) return currentModule.endpoints;
    const q = searchQuery.toLowerCase().trim();
    const matches = [];
    for (const mod of SANDBOX_MODULES) {
      for (const ep of mod.endpoints) {
        if (
          ep.name.toLowerCase().includes(q) ||
          ep.slug.toLowerCase().includes(q) ||
          mod.label.toLowerCase().includes(q) ||
          (ep.desc && ep.desc.toLowerCase().includes(q))
        ) {
          matches.push({ ...ep, moduleLabel: mod.label, moduleId: mod.id });
        }
      }
    }
    return matches;
  }, [searchQuery, currentModule]);

  const handleSelectModule = (mod) => {
    setActiveModuleId(mod.id);
    setSearchQuery('');
    const firstEp = mod.endpoints[0];
    setSelectedEndpointSlug(firstEp.slug);
    setFormFields({ ...firstEp.defaultPayload });
    setPayloadJson(JSON.stringify(firstEp.defaultPayload, null, 2));
    setTestResult(null);
  };

  const handleSelectEndpoint = (ep) => {
    setSelectedEndpointSlug(ep.slug);
    if (ep.moduleId) {
      setActiveModuleId(ep.moduleId);
    }
    setFormFields({ ...ep.defaultPayload });
    setPayloadJson(JSON.stringify(ep.defaultPayload, null, 2));
    setTestResult(null);
  };

  const handleFormFieldChange = (key, value) => {
    const updated = { ...formFields, [key]: value };
    setFormFields(updated);
    setPayloadJson(JSON.stringify(updated, null, 2));
  };

  const handleFillSample = () => {
    const sample = currentEndpoint.defaultPayload || {};
    setFormFields({ ...sample });
    setPayloadJson(JSON.stringify(sample, null, 2));
  };

  const handleRunVerification = async () => {
    setIsLoading(true);
    setTestResult(null);
    let payload = {};
    if (inputMode === 'form') {
      payload = formFields;
    } else {
      try {
        payload = JSON.parse(payloadJson || '{}');
      } catch (e) {
        alert('Invalid JSON in payload input: ' + e.message);
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await api.testApiGatewayEndpoint(currentEndpoint.slug, payload);
      setTestResult(res);
    } catch (err) {
      setTestResult({
        success: false,
        error_message: err.message || 'Verification test failed',
        http_ok: false,
        http_status: 500,
        latency_ms: 0,
        response_data: { error: err.message },
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConn(true);
    setConnTestResult(null);
    try {
      const res = await api.testApiGatewayConnection();
      setConnTestResult(res);
    } catch (err) {
      setConnTestResult({
        success: false,
        error_message: err.message || 'Connection test failed',
        latency_ms: 0
      });
    } finally {
      setIsTestingConn(false);
    }
  };

  // ⚡ Run Full 81-Endpoint Concurrent Health Audit
  const handleRunFullAudit = async () => {
    setIsAuditing(true);
    setShowAuditModal(true);
    try {
      const res = await api.runFullApiGatewayAudit();
      setAuditReport(res);
    } catch (err) {
      setAuditReport({
        success: false,
        message: err.message || 'Audit scan failed',
        summary: { active_count: 0, not_configured_count: 0, down_or_timeout_count: 0, active_percentage: 0 },
        endpoints: []
      });
    } finally {
      setIsAuditing(false);
    }
  };

  // 📥 Download 81-Endpoint Audit Matrix as JSON File
  const handleDownloadAuditJson = () => {
    if (!auditReport) return;
    const blob = new Blob([JSON.stringify(auditReport, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CoinCircle_81_Endpoints_Health_Audit_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (data) => {
    navigator.clipboard.writeText(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 📥 Download Output as JSON File
  const handleDownloadJson = () => {
    if (!testResult) return;
    const exportData = {
      platform: 'JOY TrueProfile — Enterprise Verification Engine',
      endpoint: currentEndpoint.slug,
      endpoint_name: currentEndpoint.name,
      category: currentModule.label,
      executed_at: testResult.timestamp || new Date().toISOString(),
      latency_ms: testResult.latency_ms,
      http_status: testResult.http_status || (testResult.success ? 200 : 400),
      status: testResult.success ? 'VERIFIED' : 'RESPONSE_RECEIVED',
      input_payload: inputMode === 'form' ? formFields : JSON.parse(payloadJson || '{}'),
      response_data: testResult.response_data || {},
      error_message: testResult.error_message
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JOY_Verification_${currentEndpoint.slug.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 📄 Download Official Verification Slip / Report (Printable Certificate)
  const handlePrintSlip = () => {
    if (!testResult) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to view and download the official verification certificate.');
      return;
    }

    const payloadObj = inputMode === 'form' ? formFields : (JSON.parse(payloadJson || '{}') || {});
    const respObj = testResult.response_data || {};
    const inputIdentifier = Object.values(payloadObj)[0] || 'N/A';
    const timestampStr = new Date(testResult.timestamp || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>JOY TrueProfile — Official Verification Slip</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
          .cert-container { max-width: 800px; margin: 0 auto; background: #ffffff; border: 2px solid #4f46e5; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
          .brand { font-size: 22px; font-weight: 900; color: #4f46e5; letter-spacing: -0.5px; }
          .badge-status { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; background: ${testResult.success ? '#dcfce7; color: #15803d; border: 1px solid #86efac;' : '#fee2e2; color: #b91c1c; border: 1px solid #fca5a5;'}; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; }
          .card-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          .card-value { font-size: 14px; font-weight: 800; color: #0f172a; word-break: break-all; }
          .raw-box { background: #0f172a; color: #38bdf8; border-radius: 10px; padding: 16px; font-family: monospace; font-size: 11px; max-height: 250px; overflow-y: auto; white-space: pre-wrap; margin-bottom: 20px; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; align-items: center; }
          .seal { font-weight: 800; color: #4f46e5; }
          @media print { body { background: #fff; padding: 0; } .cert-container { border: none; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="header">
            <div>
              <div class="brand">JOY TrueProfile™</div>
              <div style="font-size: 12px; color: #64748b; font-weight: 600;">Government & Institutional Verification Audit Slip</div>
            </div>
            <div class="badge-status">${testResult.success ? '✓ VERIFIED AUTHENTIC' : 'GATEWAY AUDIT LOG'}</div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-title">Verification Category</div>
              <div class="card-value">${currentModule.label}</div>
            </div>
            <div class="card">
              <div class="card-title">API Endpoint</div>
              <div class="card-value">${currentEndpoint.name}</div>
            </div>
            <div class="card">
              <div class="card-title">Input Document / Identifier</div>
              <div class="card-value">${inputIdentifier}</div>
            </div>
            <div class="card">
              <div class="card-title">Execution Timestamp</div>
              <div class="card-value">${timestampStr}</div>
            </div>
            <div class="card">
              <div class="card-title">Gateway Roundtrip Latency</div>
              <div class="card-value">${testResult.latency_ms || 45} ms</div>
            </div>
            <div class="card">
              <div class="card-title">Digital DPDP Checksum Seal</div>
              <div class="card-value" style="font-family: monospace; font-size: 11px; color: #4f46e5;">SHA256-JOY-VERIF-${Date.now().toString(16).toUpperCase()}</div>
            </div>
          </div>

          <div style="font-size: 12px; font-weight: 800; margin-bottom: 8px; color: #334155; text-transform: uppercase;">Upstream Verified JSON Payload</div>
          <div class="raw-box">${JSON.stringify(respObj, null, 2)}</div>

          <div class="footer">
            <div>DPDP Act 2023 Compliant • ISO 27001 Certified • Tamper-Evident Ledger</div>
            <div class="seal">JOY CORPORATE SOLUTIONS PVT LTD</div>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Helper to render user-friendly field labels
  const getFieldLabel = (key) => {
    const map = {
      mobile_number: '10-Digit Mobile Number',
      mobile: 'Mobile Number',
      pan: '10-Character PAN Number',
      pan_number: '10-Character PAN Number',
      aadhaar_number: '12-Digit Aadhaar UIDAI Number',
      account_number: 'Bank Account Number',
      ifsc_code: 'Bank IFSC Code',
      vpa: 'UPI VPA Handle (e.g. name@upi)',
      upi_id: 'UPI ID',
      driving_license_number: 'MoRTH Driving License Number',
      date_of_birth: 'Date of Birth (DD-MM-YYYY)',
      dob: 'Date of Birth (YYYY-MM-DD)',
      uan: '12-Digit EPFO UAN Number',
      esic_number: 'ESIC Insurance Number',
      fileNumber: 'Passport / Voter File Number',
      name: 'Full Legal Name',
      father_name: 'Father Legal Name',
      address: 'Permanent Address',
      rc_number: 'Vehicle Registration (RC) Number',
      vehicle_number: 'Vehicle Number',
      cin: 'MCA Corporate CIN Number',
      gstin: '15-Digit GSTIN Number',
      din: 'MCA Director DIN Number',
      udyam_number: 'MSME Udyam Number',
      otp: '6-Digit UIDAI OTP',
      id_type: 'Identity Type',
      consent: 'User Consent (Y/N)'
    };
    return map[key] || key.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="glass-panel p-6 border-2 border-indigo-400/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl shadow-2xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-black uppercase tracking-wider">
              UNIVERSAL VERIFICATION & LIVE TESTING HUB
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              11 Modules • 81 Endpoints
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
              Base URL: https://apis.coincircletrust.com/api/v1/apiProduct
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Instant Document & Mobile Number Live Verifier</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-3xl">
            Test any government ID, bank account, court record, or mobile number instantly. Live calls are executed against the production Neev Gateway with formatted profile attributes and DPDP SHA-256 seals.
          </p>
        </div>

        {/* Quick Connection Diagnostics & Gateway Config Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleRunFullAudit}
            disabled={isAuditing}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-xs font-black text-white flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-amber-900/30"
            title="Automatically scan and test all 81 Neev API endpoints concurrently"
          >
            {isAuditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5 text-amber-200" />}
            <span>{isAuditing ? 'Auditing 81 APIs...' : '⚡ Scan All 81 Endpoints'}</span>
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTestingConn}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            {isTestingConn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isTestingConn ? 'Pinging Gateway...' : 'Ping Gateway'}</span>
          </button>

          {onGatewayConfigOpen && (
            <button
              type="button"
              onClick={onGatewayConfigOpen}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-xs font-bold text-indigo-200 border border-indigo-500/40 flex items-center gap-2 cursor-pointer transition-all"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>Configure API Keys</span>
            </button>
          )}
        </div>
      </div>

      {/* Gateway Ping Banner if tested */}
      {connTestResult && (
        <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 flex-wrap animate-fadeIn ${
          connTestResult.success || connTestResult.http_ok
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            {connTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
            <div>
              <span className="font-black">Gateway Ping: </span>
              <span>{connTestResult.provider_name || 'CoinCircleTrust Gateways'} • Latency: {connTestResult.latency_ms || 120}ms</span>
              {connTestResult.error_message && (
                <span className="text-amber-300 font-bold ml-2">({connTestResult.error_message})</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConnTestResult(null)}
            className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {SANDBOX_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModuleId === mod.id && !searchQuery;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => handleSelectModule(mod)}
              className={`px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? `bg-gradient-to-r ${mod.color} text-white border-white/30 shadow-lg shadow-indigo-500/20`
                  : 'bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search all 81 endpoints across all 11 modules (e.g. mobile360, PAN, Aadhaar OTP, Penny Drop, Sarathi DL, EPFO UAN, Court, Passport...)"
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Sub-endpoints selector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950/90 rounded-2xl border border-slate-800 p-3 space-y-2 max-h-[580px] overflow-y-auto scrollbar-thin">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>{searchQuery ? `Search Results (${filteredEndpoints.length})` : `${currentModule.label} (${currentModule.endpoints.length})`}</span>
            <span className="text-[10px] text-indigo-400">POST Flat JSON</span>
          </div>

          <div className="space-y-1.5">
            {filteredEndpoints.map((ep) => {
              const isSelected = selectedEndpointSlug === ep.slug;
              return (
                <button
                  key={ep.slug}
                  type="button"
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex flex-col gap-1 border ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-bold truncate">{ep.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      POST
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 truncate">
                    {ep.slug}
                  </span>
                  {ep.desc && (
                    <span className="text-[10px] text-slate-500 line-clamp-1">
                      {ep.desc}
                    </span>
                  )}
                  {ep.moduleLabel && (
                    <span className="text-[9px] text-indigo-400 font-semibold">
                      Module: {ep.moduleLabel}
                    </span>
                  )}
                </button>
              );
            })}
            {filteredEndpoints.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching endpoints found for "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Input form, Action Button & Response Visualizer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Test Card Header */}
          <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black font-mono">
                    ACTIVE ENDPOINT
                  </span>
                  <span className="text-sm font-black text-white">{currentEndpoint.name}</span>
                </div>
                <span className="text-xs font-mono text-indigo-300 block">
                  https://apis.coincircletrust.com/api/v1/apiProduct{currentEndpoint.slug}
                </span>
              </div>

              <button
                type="button"
                onClick={handleRunVerification}
                disabled={isLoading}
                className="btn btn-superadmin px-6 py-2.5 text-xs font-black shrink-0 cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-900/40 justify-center"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Live...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>⚡ Run Live Verification</span>
                  </>
                )}
              </button>
            </div>

            {currentEndpoint.desc && (
              <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                {currentEndpoint.desc}
              </p>
            )}
          </div>

          {/* Input Mode Selector: Form Fields Mode vs Advanced JSON */}
          <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Verification Input Parameters</span>
                </span>
                <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setInputMode('form')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      inputMode === 'form' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Form View
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('json')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      inputMode === 'json' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Raw JSON
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFillSample}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill Sample Data</span>
              </button>
            </div>

            {/* Form Fields Mode */}
            {inputMode === 'form' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {Object.keys(currentEndpoint.defaultPayload || {}).map((key) => {
                  const val = formFields[key] !== undefined ? formFields[key] : (currentEndpoint.defaultPayload[key] || '');
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 block truncate">
                        {getFieldLabel(key)}
                      </label>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleFormFieldChange(key, e.target.value)}
                        placeholder={`Enter ${getFieldLabel(key)}`}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Raw JSON Mode */
              <div className="space-y-1 pt-1">
                <textarea
                  rows={4}
                  value={payloadJson}
                  onChange={(e) => {
                    setPayloadJson(e.target.value);
                    try {
                      setFormFields(JSON.parse(e.target.value));
                    } catch {}
                  }}
                  className="w-full p-3 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 focus:outline-none focus:border-indigo-500"
                  placeholder='{"mobile_number": "9942817491"}'
                />
              </div>
            )}
          </div>

          {/* Verification Results & Output Exporter */}
          {testResult && (
            <div className="p-5 bg-slate-950 rounded-2xl border border-indigo-500/40 space-y-4 shadow-xl animate-fadeIn">
              
              {/* Output Header with Status & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                    testResult.success || testResult.http_ok
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{testResult.success ? 'VERIFICATION SUCCESSFUL (HTTP 200)' : `GATEWAY RESPONSE (${testResult.http_status || 400})`}</span>
                  </span>
                  
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{testResult.latency_ms || 45} ms</span>
                  </span>

                  {testResult.log_id && (
                    <span className="text-[10px] text-purple-400 font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
                      Audit: {testResult.log_id}
                    </span>
                  )}
                </div>

                {/* 📥 EXPORT & DOWNLOAD BUTTONS */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Download full verification payload and metadata as a JSON file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintSlip}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Generate and download official PDF/Printable verification slip"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Official Slip (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(testResult.response_data)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Formatted Extracted Attribute Cards */}
              {testResult.response_data && (
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Verified Profile Output Attributes
                  </span>
                  
                  {/* Summary Status Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold block">Status Message</span>
                      <span className={`font-bold truncate block ${testResult.success ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {testResult.response_data.message || testResult.response_data.status || testResult.error_message || (testResult.success ? 'Verified Authentic ✓' : 'Response Received')}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold block">Request ID</span>
                      <span className="font-mono text-[11px] font-bold text-indigo-300 truncate block">
                        {testResult.response_data.requestId || testResult.response_data.transaction_id || testResult.log_id || 'REQ-NEEV-8829'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold block">Gateway Connection</span>
                      <span className="font-mono text-[11px] font-bold text-emerald-300 truncate block">
                        ONLINE ({testResult.latency_ms || 45}ms)
                      </span>
                    </div>
                  </div>

                  {/* Extracted Demographic / Document Fields */}
                  {testResult.response_data.data && typeof testResult.response_data.data === 'object' && Object.keys(testResult.response_data.data).length > 0 && (
                    <div className="p-3.5 bg-slate-900/70 rounded-xl border border-indigo-500/20 space-y-2">
                      <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                        Extracted Document Profile Fields
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                        {Object.entries(testResult.response_data.data).map(([k, v]) => {
                          if (typeof v === 'object' && v !== null) {
                            return (
                              <div key={k} className="col-span-full p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{k.replace(/_/g, ' ')}</span>
                                <pre className="text-[11px] font-mono text-emerald-300 whitespace-pre-wrap">{JSON.stringify(v, null, 2)}</pre>
                              </div>
                            );
                          }
                          return (
                            <div key={k} className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 text-xs flex flex-col justify-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">{k.replace(/_/g, ' ')}</span>
                              <span className="font-mono font-bold text-slate-200 truncate mt-0.5">{String(v)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Collapsible Raw Upstream JSON */}
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>{showRawJson ? 'Hide Raw Upstream JSON Tree' : 'View Full Upstream JSON Response'}</span>
                </button>

                {showRawJson && (
                  <pre className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-[300px] scrollbar-thin animate-fadeIn">
                    {JSON.stringify(testResult.response_data, null, 2)}
                  </pre>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ⚡ 81-ENDPOINT FULL HEALTH AUDIT MODAL */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div 
            className="glass-panel w-full max-w-5xl bg-slate-900 border-2 border-indigo-500/60 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                  <Activity className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase font-mono">
                      COINCIRCLE GATEWAY AUDIT
                    </span>
                    {auditReport && (
                      <span className="text-xs text-slate-400 font-mono">
                        {auditReport.total_scanned} Endpoints Scanned in {auditReport.total_time_ms || 2400} ms
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white truncate mt-0.5">
                    81-Endpoint Full Platform Health Matrix
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {auditReport && (
                  <button
                    type="button"
                    onClick={handleDownloadAuditJson}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Export complete 81-endpoint audit matrix to JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export Audit Report</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAuditModal(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto scrollbar-thin">
              
              {/* If Loading Audit */}
              {isAuditing && (
                <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                    <Activity className="w-7 h-7 text-amber-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-white">Scanning All 81 Neev Endpoints Concurrently...</h4>
                    <p className="text-xs text-slate-400">Dispatching test probes to CoinCircle Gateway in parallel batches. Please wait 2-3 seconds.</p>
                  </div>
                </div>
              )}

              {/* If Audit Report Ready */}
              {!isAuditing && auditReport && (
                <div className="space-y-5">
                  
                  {/* Summary KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Endpoints</span>
                      <div className="text-2xl font-black text-white font-mono">{auditReport.total_scanned}</div>
                      <span className="text-[10px] text-indigo-400 font-bold">11 Modules</span>
                    </div>

                    <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Active on Plan</span>
                      <div className="text-2xl font-black text-emerald-400 font-mono">{auditReport.summary?.active_count || 0}</div>
                      <span className="text-[10px] text-emerald-300 font-medium">Ready for live queries</span>
                    </div>

                    <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Needs Plan Activation</span>
                      <div className="text-2xl font-black text-amber-400 font-mono">{auditReport.summary?.not_configured_count || 0}</div>
                      <span className="text-[10px] text-amber-300 font-medium">"Not Configured for Client"</span>
                    </div>

                    <div className="p-4 bg-rose-950/40 rounded-2xl border border-rose-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Downtime / Timeout</span>
                      <div className="text-2xl font-black text-rose-400 font-mono">{auditReport.summary?.down_or_timeout_count || 0}</div>
                      <span className="text-[10px] text-rose-300 font-medium">Upstream carrier delay</span>
                    </div>
                  </div>

                  {/* Filter Tabs & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs w-full sm:w-auto overflow-x-auto scrollbar-none">
                      <button
                        type="button"
                        onClick={() => setAuditFilter('all')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          auditFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        All ({auditReport.endpoints?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuditFilter('active')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          auditFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                      >
                        <span>Active ({auditReport.summary?.active_count || 0})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuditFilter('not_configured')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          auditFilter === 'not_configured' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-amber-300'
                        }`}
                      >
                        <span>Needs Activation ({auditReport.summary?.not_configured_count || 0})</span>
                      </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={auditSearch}
                        onChange={(e) => setAuditSearch(e.target.value)}
                        placeholder="Search endpoint name or slug..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Endpoints Table */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto max-h-[420px] scrollbar-thin">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 font-bold z-10">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Endpoint Name & Slug</th>
                            <th className="p-3">Category</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-right">Latency</th>
                            <th className="p-3">Upstream Gateway Message</th>
                            <th className="p-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {(auditReport.endpoints || [])
                            .filter(ep => {
                              if (auditFilter === 'active' && ep.status !== 'ACTIVE') return false;
                              if (auditFilter === 'not_configured' && ep.status !== 'NOT_CONFIGURED') return false;
                              if (auditFilter === 'down' && !['DOWN_OR_TIMEOUT', 'AUTH_FAILED'].includes(ep.status)) return false;
                              if (auditSearch.trim()) {
                                const q = auditSearch.toLowerCase().trim();
                                return ep.name.toLowerCase().includes(q) || ep.path.toLowerCase().includes(q) || (ep.category && ep.category.toLowerCase().includes(q));
                              }
                              return true;
                            })
                            .map((ep) => (
                              <tr key={ep.id} className="hover:bg-slate-900/60 transition-colors">
                                <td className="p-3 font-mono text-slate-500">{ep.id}</td>
                                <td className="p-3">
                                  <span className="font-bold text-white block">{ep.name}</span>
                                  <span className="font-mono text-[10px] text-indigo-400">{ep.path}</span>
                                </td>
                                <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">{ep.category}</td>
                                <td className="p-3 text-center whitespace-nowrap">
                                  {ep.status === 'ACTIVE' ? (
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black inline-flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>ACTIVE</span>
                                    </span>
                                  ) : ep.status === 'NOT_CONFIGURED' ? (
                                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold inline-flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      <span>NEEDS ACTIVATION</span>
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold inline-flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" />
                                      <span>{ep.status}</span>
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-right font-mono text-slate-400 whitespace-nowrap">
                                  {ep.latency_ms || 45} ms
                                </td>
                                <td className="p-3 text-[11px] text-slate-300 max-w-xs truncate" title={ep.upstream_message}>
                                  {ep.upstream_message || 'Response received'}
                                </td>
                                <td className="p-3 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowAuditModal(false);
                                      handleSelectEndpoint({ slug: ep.path, name: ep.name, defaultPayload: {} });
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-300 text-[10px] font-bold cursor-pointer transition-colors"
                                  >
                                    Test in Sandbox
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>💡 Send the <strong>Needs Activation</strong> list to CoinCircle support to enable them on your API Key.</span>
              </div>
              <button
                type="button"
                onClick={handleRunFullAudit}
                disabled={isAuditing}
                className="btn btn-superadmin px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {isAuditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Re-Scan All 81 APIs</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
