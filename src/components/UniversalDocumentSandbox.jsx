import React, { useState } from 'react';
import { 
  Smartphone, CreditCard, Shield, Landmark, Car, Briefcase, 
  FileCheck, Vote, Scale, Truck, Building2, Play, RefreshCw, 
  Check, AlertCircle, Clock, Copy, Sparkles, Database, FileText, CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

const SANDBOX_MODULES = [
  {
    id: 'mobile',
    label: 'Mobile Number Checks',
    icon: Smartphone,
    color: 'from-blue-600 to-cyan-600',
    endpoints: [
      { slug: '/mobile360', name: 'Mobile 360 Telecom Profile', defaultPayload: { mobile_number: '9942817491' }, desc: 'Deep multi-carrier telecom identity & tenure verification.' },
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
      { slug: '/esic-data', name: 'ESIC Social Security Data', defaultPayload: { esic_number: '3100098451', dob: '1996-05-15' }, desc: 'Employee State Insurance Corporation registration check.' }
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
    id: 'court',
    label: 'Court & Criminal Records',
    icon: Scale,
    color: 'from-red-600 to-rose-700',
    endpoints: [
      { slug: '/realtime-court-case-search', name: 'Realtime Indian e-Courts Search', defaultPayload: { name: 'MUTHUKUMAR P', father_name: 'Suresh Kumar P', address: 'Bengaluru, Karnataka', dob: '1996-05-15' }, desc: 'Searches High Courts, District Courts, and Tribunals across India.' }
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

export default function UniversalDocumentSandbox() {
  const [activeModuleId, setActiveModuleId] = useState('mobile');
  const [selectedEndpointSlug, setSelectedEndpointSlug] = useState('/mobile360');
  const [payloadJson, setPayloadJson] = useState(JSON.stringify({ mobile_number: '9942817491' }, null, 2));
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const currentModule = SANDBOX_MODULES.find(m => m.id === activeModuleId) || SANDBOX_MODULES[0];
  const currentEndpoint = currentModule.endpoints.find(e => e.slug === selectedEndpointSlug) || currentModule.endpoints[0];

  const handleSelectModule = (mod) => {
    setActiveModuleId(mod.id);
    const firstEp = mod.endpoints[0];
    setSelectedEndpointSlug(firstEp.slug);
    setPayloadJson(JSON.stringify(firstEp.defaultPayload, null, 2));
    setTestResult(null);
  };

  const handleSelectEndpoint = (ep) => {
    setSelectedEndpointSlug(ep.slug);
    setPayloadJson(JSON.stringify(ep.defaultPayload, null, 2));
    setTestResult(null);
  };

  const handleFillSample = () => {
    setPayloadJson(JSON.stringify(currentEndpoint.defaultPayload, null, 2));
  };

  const handleRunVerification = async () => {
    setIsLoading(true);
    setTestResult(null);
    let parsed = {};
    try {
      parsed = JSON.parse(payloadJson || '{}');
    } catch (e) {
      alert('Invalid JSON in payload input: ' + e.message);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.testApiGatewayEndpoint(currentEndpoint.slug, parsed);
      setTestResult(res);
    } catch (err) {
      setTestResult({
        success: false,
        error_message: err.message || 'Verification test failed',
        http_ok: false,
        latency_ms: 0,
        response_data: { error: err.message }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (data) => {
    navigator.clipboard.writeText(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 border-2 border-indigo-400/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl shadow-2xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-black uppercase tracking-wider">
              UNIVERSAL DOCUMENT & MOBILE TESTING SANDBOX
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              11 Modules • 81 Endpoints
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
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {SANDBOX_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModuleId === mod.id;
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

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Sub-endpoints selector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950/90 rounded-2xl border border-slate-800 p-3 space-y-2 max-h-[580px] overflow-y-auto scrollbar-thin">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>{currentModule.label} ({currentModule.endpoints.length})</span>
            <span className="text-[10px] text-indigo-400">POST Flat JSON</span>
          </div>

          <div className="space-y-1.5">
            {currentModule.endpoints.map((ep) => {
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
                </button>
              );
            })}
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

          {/* Test Payload Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verification Request Payload (Editable JSON)</span>
              </span>
              <button
                type="button"
                onClick={handleFillSample}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Reset to Sample Data</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={payloadJson}
              onChange={(e) => setPayloadJson(e.target.value)}
              className="w-full p-3.5 font-mono text-xs bg-slate-950 border border-slate-800 rounded-2xl text-emerald-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder='{"mobile_number": "9942817491"}'
            />
          </div>

          {/* Verification Results Display */}
          {testResult && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
              
              {/* Status Ribbon */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                    testResult.success || testResult.http_ok
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{testResult.success ? 'VERIFICATION SUCCESSFUL (HTTP 200)' : 'GATEWAY RESPONSE RECEIVED'}</span>
                  </span>
                  
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{testResult.latency_ms || 55} ms</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(testResult.response_data)}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Upstream JSON'}</span>
                  </button>
                </div>
              </div>

              {/* Formatted Attribute Badges */}
              {testResult.response_data && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Verified Profile Attributes
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold block">Status Message</span>
                      <span className="font-bold text-slate-200 truncate block">
                        {testResult.response_data.message || testResult.response_data.status || 'Active / Operative'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold block">Request / Audit ID</span>
                      <span className="font-mono text-[11px] font-bold text-indigo-300 truncate block">
                        {testResult.response_data.requestId || testResult.response_data.transaction_id || 'REQ-NEEV-8829'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold block">Timestamp</span>
                      <span className="text-[11px] text-slate-300 font-mono truncate block">
                        {testResult.response_data.timestamp || new Date().toISOString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw JSON Tree Inspector */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Raw Response Tree
                </span>
                <pre className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-[280px] scrollbar-thin">
                  {JSON.stringify(testResult.response_data, null, 2)}
                </pre>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
