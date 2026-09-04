import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Scale, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Building2, 
  UserCheck, 
  Clock, 
  Award, 
  Download, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';

export const LegalComplianceHandbookModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('dpdp');

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

  const complianceSections = {
    dpdp: {
      id: 'dpdp',
      title: 'Digital Personal Data Protection (DPDP) Act, 2023',
      badge: 'Statutory Data Protection',
      badgeClass: 'badge-purple',
      summary: 'Strict adherence to India\'s landmark data privacy statute governing explicit candidate consent, purpose limitation, data fiduciary obligations, and automated retention lifecycles.',
      clauses: [
        {
          num: 'Section 6(1)',
          heading: 'Unambiguous & Affirmative Consent',
          detail: 'JOY mandates explicit, digital candidate consent before initiating any verification check against UIDAI, NSDL, or EPFO repositories. All consent records are digitally stamped with ISO timestamps, IP addresses, and device identifiers.'
        },
        {
          num: 'Section 7(a)',
          heading: 'Specified Legitimate Purpose',
          detail: 'Candidate information is processed exclusively for employment credential verification and payroll onboarding as requested by the authorized employer. Data is never repurposed, sold, or shared with third parties.'
        },
        {
          num: 'Section 8(7)',
          heading: 'Automated 60-Day Data Erasure Lifecycle',
          detail: 'To prevent indefinite personal data storage, all verification dossiers carry an automated 60-day certificate validity lifecycle, after which candidate records are queued for encrypted archival or purge.'
        },
        {
          num: 'Section 11',
          heading: 'Candidate Rights & Grievance Redressal',
          detail: 'Candidates possess the legal right to review their verified credentials, request corrections of erroneous repository data, and register privacy grievances directly with the Data Protection Officer.'
        }
      ]
    },
    aadhaar: {
      id: 'aadhaar',
      title: 'Aadhaar Act 2016 & UIDAI Security Regulations',
      badge: 'UIDAI Identity Shield',
      badgeClass: 'badge-indigo',
      summary: 'Stringent compliance protocols governing the voluntary verification of Aadhaar numbers without storing unencrypted 12-digit numbers.',
      clauses: [
        {
          num: 'Regulation 16B',
          heading: 'Mandatory Aadhaar Masking Protocol',
          detail: 'Under UIDAI guidelines, JOY strictly masks the first 8 digits of all Aadhaar numbers (e.g. XXXX-XXXX-9876) across all user interfaces, database tables, and downloadable PDF audit dossiers.'
        },
        {
          num: 'Regulation 19',
          heading: 'Aadhaar Data Vault Architecture',
          detail: 'No plain-text 12-digit Aadhaar numbers are persisted in standard relational databases. Any ephemeral tokenization conforms to encrypted vault standards with hardware-grade key management.'
        },
        {
          num: 'Regulation 21',
          heading: 'Voluntary Candidate OTP Verification',
          detail: 'Aadhaar authentication is conducted strictly via direct UIDAI OTP sent to the candidate\'s registered mobile number. No biometric or demographic data is accessed without real-time OTP confirmation.'
        },
        {
          num: 'Biometric Shield',
          heading: 'Zero Core Biometric Storage',
          detail: 'Fingerprint and iris biometric records are neither requested nor stored. AI Face Liveness scans are executed locally as ephemeral anti-spoofing vectors without storing raw biometric templates.'
        }
      ]
    },
    it_act: {
      id: 'it_act',
      title: 'Information Technology Act, 2000 (Section 79 Safe Harbor)',
      badge: 'Intermediary Protection',
      badgeClass: 'badge-cyan',
      summary: 'Legal framework establishing JOY Corporate Solutions Pvt Ltd as a bona fide technology intermediary facilitating authorized repository queries.',
      clauses: [
        {
          num: 'Section 79(1)',
          heading: 'Intermediary Liability Exemption (Safe Harbor)',
          detail: 'JOY functions as an automated digital conduit retrieving point-in-time public records. The platform is exempted from liability for repository discrepancies originating from government or institutional databases.'
        },
        {
          num: 'SPDI Rules 2011',
          heading: 'Sensitive Personal Data Security Practices',
          detail: 'Compliance with Rule 8 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, including 256-bit AES database encryption and TLS 1.3 in-transit security.'
        },
        {
          num: 'Section 43A',
          heading: 'Enterprise Data Breach Indemnity Safeguards',
          detail: 'Comprehensive security controls, role-based access tokens, multi-factor authentication, and continuous vulnerability monitoring protect corporate and candidate data.'
        },
        {
          num: 'Section 65',
          heading: 'Digital Audit Trail & Hash Integrity',
          detail: 'Every generated BGV dossier is cryptographically sealed with a SHA-256 integrity hash to prevent post-verification document tampering or forgery.'
        }
      ]
    },
    banking: {
      id: 'banking',
      title: 'RBI & NPCI Banking & Payroll Validation Guidelines',
      badge: 'Financial & IMPS Compliance',
      badgeClass: 'badge-emerald',
      summary: 'Regulatory standards for executing Instant ₹1 IMPS Penny Drop transactions for legitimate employee salary account verification.',
      clauses: [
        {
          num: 'NPCI IMPS Rules',
          heading: 'Beneficiary Name Match Verification',
          detail: 'The ₹1 penny drop transaction is routed via National Payments Corporation of India (NPCI) member banks strictly to confirm that the bank account is active and the account holder name matches the candidate.'
        },
        {
          num: 'PMLA 2002 Norms',
          heading: 'Prevention of Money Laundering Compliance',
          detail: 'Assists corporate employers in fulfilling statutory Day-1 payroll KYC and preventing fraudulent payroll disbursement into ghost accounts.'
        },
        {
          num: 'Zero Credential Access',
          heading: 'No Sensitive Financial Credential Storage',
          detail: 'JOY never requests, handles, or stores debit card numbers, CVVs, ATM PINs, UPI PINs, or NetBanking passwords. Only standard Account Number and IFSC codes are processed.'
        }
      ]
    },
    epfo: {
      id: 'epfo',
      title: 'EPFO & Ministry of Labour Employment Verification Norms',
      badge: 'Workforce Integrity',
      badgeClass: 'badge-amber',
      summary: 'Ethical and lawful verification of past employment timelines to eliminate resume fraud and moonlighting risks.',
      clauses: [
        {
          num: 'Tenure Audits',
          heading: 'Chronological Employment Timeline Validation',
          detail: 'EPFO Unified Portal integration validates authentic past company names, Date of Joining (DOJ), and Date of Exit (DOE) based on candidate consent.'
        },
        {
          num: 'Confidentiality',
          heading: 'Non-Disclosure of Private PF Wage Balances',
          detail: 'Verification is strictly limited to employment service history. Accumulated employee provident fund balances and financial savings are excluded from BGV reports.'
        },
        {
          num: 'Fair Employment',
          heading: 'Equal Opportunity & Non-Discrimination',
          detail: 'Employment history data is provided to authorized HR personnel strictly to verify candidate credentials, supporting fair and objective hiring decisions.'
        }
      ]
    }
  };

  const currentSection = complianceSections[activeTab];

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 relative z-10 my-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Header Bar */}
        <div className="p-4 sm:px-8 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <img 
              src="/joy_logo.png" 
              alt="JOY Logo" 
              className="w-10 h-10 object-contain shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  🏛️ Statutory Regulatory Framework
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">ISO 27001 & DPDP Act 2023</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                Government Policy & Legal Compliance Handbook
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-8 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('dpdp')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dpdp' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>DPDP Act 2023</span>
          </button>

          <button
            onClick={() => setActiveTab('aadhaar')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'aadhaar' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>UIDAI Aadhaar Shield</span>
          </button>

          <button
            onClick={() => setActiveTab('it_act')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'it_act' ? 'bg-sky-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>IT Act Sec 79 (Safe Harbor)</span>
          </button>

          <button
            onClick={() => setActiveTab('banking')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'banking' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>RBI / NPCI Banking</span>
          </button>

          <button
            onClick={() => setActiveTab('epfo')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'epfo' ? 'bg-amber-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>EPFO Employment</span>
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-xs leading-relaxed">
          
          {/* Section Summary Banner */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className={`badge ${currentSection.badgeClass} text-[10px] font-black`}>
                {currentSection.badge}
              </span>
              <span className="text-[11px] text-slate-300 font-mono">Statutory Policy Document</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {currentSection.title}
            </h3>
            <p className="text-slate-300 text-xs font-medium leading-relaxed">
              {currentSection.summary}
            </p>
          </div>

          {/* Key Legal Clauses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSection.clauses.map((clause, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-indigo-300 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {clause.num}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {clause.heading}
                </h4>
                <p className="text-slate-600 text-xs font-medium leading-relaxed">
                  {clause.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Master Intermediary Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>JOY CORPORATE SOLUTIONS — Statutory Technology Intermediary Statement</span>
            </div>
            <p className="text-[11px] text-amber-900/90 font-medium leading-relaxed">
              JOY Corporate Solutions Pvt Ltd operates strictly as a digital technology intermediary connecting authorized employers with government and financial repositories (via licensed API providers including Sandbox & Coincircletrust). All verifications are executed pursuant to candidate-authorized digital consent. JOY does not alter, falsify, or manufacture repository records.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-8 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Certified DPDP Act 2023 & ISO 27001:2022 Architecture</span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-superadmin text-xs py-2 px-5 font-bold shadow-md cursor-pointer"
          >
            <span>Close Compliance Handbook</span>
          </button>
        </div>

      </div>
    </div>
  );
};
