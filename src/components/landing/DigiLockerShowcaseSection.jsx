import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  FileText, 
  Download, 
  Sparkles, 
  ArrowRight,
  BadgeCheck,
  AlertCircle,
  FileCheck2,
  GraduationCap,
  Car,
  FileSpreadsheet,
  QrCode,
  Scale,
  CreditCard,
  Briefcase,
  Layers,
  Eye,
  ExternalLink,
  Zap,
  Check
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

export const DigiLockerShowcaseSection = ({ onOpenDemo, onOpenLegalHandbook }) => {
  // Interactive Document Type Preview Tab State
  const [activeDocTab, setActiveDocTab] = useState('aadhaar');

  const documentTypes = [
    {
      id: 'aadhaar',
      label: 'Aadhaar e-KYC',
      icon: ShieldCheck,
      badge: 'UIDAI Rail',
      color: 'sky',
      title: 'Aadhaar e-KYC XML (UIDAI Verified)',
      description: 'Instant demographic validation, high-res citizen photograph, verified residential address, and UIDAI masked identity with zero physical paperwork.',
      sampleData: {
        idNo: 'XXXX-XXXX-8942',
        name: 'Muthukumar P',
        dob: '15-08-1992 (Male)',
        issuer: 'Unique Identification Authority of India (UIDAI)',
        address: 'No. 12/A, Gandhi Street, Trichy Head Post Office, Tamil Nadu - 620001',
        verificationStatus: 'Cryptographically Verified ✓'
      }
    },
    {
      id: 'pan',
      label: 'PAN & Tax Card',
      icon: CreditCard,
      badge: 'ITD / NSDL',
      color: 'indigo',
      title: 'Income Tax PAN Verification Record',
      description: 'Real-time Permanent Account Number validation directly matching Income Tax Department database with citizen full name and date of birth.',
      sampleData: {
        idNo: 'AAAPM8942K',
        name: 'Muthukumar P',
        dob: '15-08-1992',
        issuer: 'Income Tax Department (ITD / Protean NSDL)',
        address: 'Verified against Permanent Tax Registry Records',
        verificationStatus: 'Active & Linked with Aadhaar ✓'
      }
    },
    {
      id: 'driving_license',
      label: 'Driving License',
      icon: Car,
      badge: 'MoRTH Parivahan',
      color: 'purple',
      title: 'Ministry of Road Transport Driving License',
      description: 'Validates commercial and non-commercial motor vehicle license validity, vehicle class endorsements (LMV/HMV), and transport authority records.',
      sampleData: {
        idNo: 'TN-45-2016-0049210',
        name: 'Muthukumar P',
        dob: '15-08-1992',
        issuer: 'Ministry of Road Transport & Highways (MoRTH)',
        address: 'RTO Tiruchirappalli West, Tamil Nadu',
        verificationStatus: 'Valid Through 2036 (Clean Record) ✓'
      }
    },
    {
      id: 'class_x',
      label: 'Class X Marksheet',
      icon: GraduationCap,
      badge: 'CBSE Secondary',
      color: 'amber',
      title: 'CBSE Secondary School Examination Certificate',
      description: 'Authentic 10th grade academic marksheet and pass certificate issued directly by the Central Board of Secondary Education with subject grades.',
      sampleData: {
        idNo: 'CBSE-X-2008-892104',
        name: 'Muthukumar P',
        dob: '15-08-1992',
        issuer: 'Central Board of Secondary Education (CBSE)',
        address: 'Roll No: 4109282 • Kendriya Vidyalaya No. 1',
        verificationStatus: 'Original Academic Pass Certificate ✓'
      }
    },
    {
      id: 'class_xii',
      label: 'Class XII Certificate',
      icon: FileText,
      badge: 'CBSE Higher Sec',
      color: 'rose',
      title: 'CBSE Senior School Certificate Marksheet',
      description: 'Higher secondary school certificate and marks statement authenticated directly against central educational board repositories.',
      sampleData: {
        idNo: 'CBSE-XII-2010-459102',
        name: 'Muthukumar P',
        dob: '15-08-1992',
        issuer: 'Central Board of Secondary Education (CBSE)',
        address: 'Roll No: 6201948 • Senior Secondary Board Pass',
        verificationStatus: 'Academic Qualification Authenticated ✓'
      }
    },
    {
      id: 'epfo_uan',
      label: 'EPFO UAN Passbook',
      icon: Briefcase,
      badge: 'EPFO Ministry of Labour',
      color: 'emerald',
      title: 'EPFO Universal Account Number (UAN) Ledger',
      description: 'Service tenure history, member IDs, active provident fund contribution records, and automated dual-employment moonlighting audit.',
      sampleData: {
        idNo: 'UAN 100829141052',
        name: 'Muthukumar P',
        dob: '15-08-1992',
        issuer: 'Employees\' Provident Fund Organisation (EPFO)',
        address: 'Regional Office: Trichy • Establishment: JOY CORP',
        verificationStatus: 'Single Active Employer (0 Moonlighting Overlaps) ✓'
      }
    }
  ];

  const currentDoc = documentTypes.find(d => d.id === activeDocTab) || documentTypes[0];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FCFCFA] via-sky-50/40 to-[#FCFCFA] text-[#182230] relative overflow-hidden border-t border-b border-[#E5EAF0]">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* 🌟 1. SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/80 text-sky-900 text-xs font-black border border-sky-300/60 shadow-2xs">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-700" />
              <span>NATIONAL DIGITAL VAULT</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-sky-400" />
            <span className="text-sky-800 font-mono">NeGD API Setu Live Gateway</span>
            <span className="w-1 h-1 rounded-full bg-sky-400" />
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
              Oct 2026 Mandate Ready
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#182230] font-outfit tracking-tight leading-[1.12]">
            Direct DigiLocker Government <br />
            <span className="text-sky-600">Digital Vault Verification Rails</span>
          </h2>

          <p className="text-base sm:text-lg text-[#5C6878] font-normal leading-relaxed max-w-2xl mx-auto">
            Eliminate forged paper certificates and fraud. Authenticate genuine citizen identities directly from official government repositories with instant SMS OTP consent on <strong>api.digitallocker.gov.in</strong>.
          </p>
        </div>

        {/* 🌟 2. HERO SHOWCASE IMAGE + LIVE INTERACTIVE EXPLORER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Premium 3D Vault Illustration with Floating Live Telemetry Cards */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-sky-200/80 shadow-2xl bg-white group">
              <img 
                src="/assets/3d/digilocker_vault_hero.jpg" 
                alt="DigiLocker Government Digital Verification Vault" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  // Graceful fallback if image is loading
                  e.target.src = "/assets/3d/corporate_shield_vault_3d.jpg";
                }}
              />

              {/* Glowing Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* In-Image Floating Badge 1: NeGD Gateway Connection */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-sky-300 shadow-md flex items-center gap-2 text-xs font-black text-sky-950 animate-bounce-slow">
                <BadgeCheck className="w-4 h-4 text-sky-600" />
                <span>NeGD Client ID: QEC8BCDA95</span>
              </div>

              {/* In-Image Floating Badge 2: DPDP Act Encrypted */}
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>DPDP Act 2023 Encrypted</span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographic SHA-256 Audit Seal</span>
                  </div>
                  <span className="font-mono text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-bold">
                    Sub-45s Ingestion
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Direct XML schema parsing from UIDAI, Income Tax Department, MoRTH, CBSE, and EPFO repositories.
                </p>
              </div>
            </div>

            {/* Quick Metrics Strip Below Image */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF0] text-center shadow-2xs">
                <span className="text-lg sm:text-xl font-black text-sky-600 block">6+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Govt Registries</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF0] text-center shadow-2xs">
                <span className="text-lg sm:text-xl font-black text-emerald-600 block">100%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Paperless e-KYC</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF0] text-center shadow-2xs">
                <span className="text-lg sm:text-xl font-black text-indigo-600 block">&lt; 45s</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Turnaround Time</span>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Document Explorer */}
          <div className="lg:col-span-6 space-y-5">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-600" />
                    <span>Live Document Intelligence Explorer</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Click any certificate type to inspect real government attributes ingested by Joy TrueProfile.</p>
                </div>
                <span className="badge badge-emerald text-[10px] font-black shrink-0">
                  Live Schema
                </span>
              </div>

              {/* Document Type Selector Tabs */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                {documentTypes.map(doc => {
                  const Icon = doc.icon;
                  const isActive = activeDocTab === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setActiveDocTab(doc.id);
                      }}
                      className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-white text-sky-700 shadow-xs font-black scale-102 border border-sky-200' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-bold truncate max-w-full leading-tight">{doc.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Document Card Preview */}
              <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-4 animate-fadeIn">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900 font-mono text-[10px] font-black border border-sky-300">
                      {currentDoc.badge}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                      {currentDoc.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {currentDoc.description}
                    </p>
                  </div>

                  <span className="badge badge-emerald text-xs font-black shrink-0">
                    VERIFIED ✓
                  </span>
                </div>

                {/* Simulated Extracted Data Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Certificate / Number:</span>
                    <strong className="font-mono text-amber-700 font-black">{currentDoc.sampleData.idNo}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Beneficiary Name:</span>
                    <strong className="text-slate-900 font-bold">{currentDoc.sampleData.name}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Date of Birth & Demographics:</span>
                    <strong className="text-slate-800">{currentDoc.sampleData.dob}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Authenticating Authority:</span>
                    <strong className="text-slate-800 truncate block">{currentDoc.sampleData.issuer}</strong>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Authority Address / Reference:</span>
                    <p className="text-slate-700 font-medium text-[11px] mt-0.5">{currentDoc.sampleData.address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentDoc.sampleData.verificationStatus}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">SHA256:DL80B55B86...</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    if (onOpenDemo) onOpenDemo();
                  }}
                  className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-sky-100" />
                  <span>Connect via Live DigiLocker Portal 🚀</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    if (onOpenLegalHandbook) onOpenLegalHandbook();
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <Scale className="w-3.5 h-3.5 text-indigo-600" />
                  <span>NeGD 2026 Compliance 🛡️</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* 🌟 3. FOUR CORE PERSPECTIVES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          
          {/* Perspective 1: Official Citizen Consent Gate */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-sky-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900 font-outfit">
              Citizen SMS OTP Gate
            </h4>
            <p className="text-xs text-[#5C6878] leading-relaxed">
              Redirects candidate securely to the official <strong>api.digitallocker.gov.in</strong> gateway. Citizen receives authentic SMS OTP directly to their mobile number for transparent statutory consent.
            </p>
            <ul className="text-[11px] text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>PKCE S256 Cryptographic Challenge</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Candidate App Downloads</span>
              </li>
            </ul>
          </div>

          {/* Perspective 2: NeGD 2026 Mandate Compliance */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-indigo-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900 font-outfit">
              Oct 2026 NeGD Compliant
            </h4>
            <p className="text-xs text-[#5C6878] leading-relaxed">
              Strictly adheres to the National e-Governance Division (NeGD) mandate requiring explicit <strong>purpose</strong> (max 50 chars) and requesting <strong>service_name</strong> declarations.
            </p>
            <ul className="text-[11px] text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Pre-Validated Purpose Catalogue</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>IT Rules 2016 & DPDP Act 2023</span>
              </li>
            </ul>
          </div>

          {/* Perspective 3: Multi-Certificate Ingestion */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900 font-outfit">
              6 Ingested Certificates
            </h4>
            <p className="text-xs text-[#5C6878] leading-relaxed">
              Query multiple government issuers simultaneously—Aadhaar e-KYC XML, PAN Card, Driving License, Class X & XII Marksheets, and EPFO UAN Service Passbooks in a single run.
            </p>
            <ul className="text-[11px] text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Raw XML & Digital URI Extraction</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Automated Deduplication Engine</span>
              </li>
            </ul>
          </div>

          {/* Perspective 4: Tamper-Proof Audit & PDF Dossier */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-purple-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900 font-outfit">
              PDF Slips & Excel Ledgers
            </h4>
            <p className="text-xs text-[#5C6878] leading-relaxed">
              Download individual verified certificate PDF slips with digital stamps, complete 360° Master Verification Dossiers, or export full company spreadsheets (.xlsx).
            </p>
            <ul className="text-[11px] text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Official PDF Verification Certificate</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Master Excel Export (.xlsx)</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

export default DigiLockerShowcaseSection;
