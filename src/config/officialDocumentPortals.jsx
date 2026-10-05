import React from 'react';
import { ExternalLink, Sparkles, Building2, ShieldCheck, Scale, FileText } from 'lucide-react';

/**
 * Official Government Authority Portals & Direct Application Redirect Catalogue
 * Provides verified redirect URLs for employees/candidates who do not yet have original government documents.
 */
export const OFFICIAL_DOCUMENT_PORTALS = {
  panNo: {
    key: 'panNo',
    docName: 'Income Tax PAN Card',
    authority: 'Income Tax Department (NSDL Protean / UTIITSL / e-Filing)',
    applyUrl: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/instant-e-pan',
    secondaryUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    badgeText: "Don't have PAN? Apply / Instant e-PAN (Free in 10 Mins) ↗",
    shortLabel: 'Apply PAN ↗',
    tooltip: 'Direct link to Income Tax Department Instant e-PAN & NSDL PAN Application Portal',
    theme: 'amber'
  },
  aadhaarNo: {
    key: 'aadhaarNo',
    docName: 'Aadhaar Identity Card',
    authority: 'UIDAI (Unique Identification Authority of India)',
    applyUrl: 'https://appointments.uidai.gov.in/bookappointment.aspx',
    secondaryUrl: 'https://myaadhaar.uidai.gov.in/',
    badgeText: "Don't have Aadhaar? Book Enrollment / Download e-Aadhaar ↗",
    shortLabel: 'Enroll Aadhaar ↗',
    tooltip: 'Direct link to UIDAI Sovereign Portal for Aadhaar Enrollment & e-Aadhaar XML Download',
    theme: 'emerald'
  },
  uanEpf: {
    key: 'uanEpf',
    docName: 'EPFO Universal Account Number (UAN)',
    authority: 'Employees\' Provident Fund Organisation (EPFO)',
    applyUrl: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/no-uan-reg',
    secondaryUrl: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/',
    badgeText: "Don't have UAN? Direct UAN Allotment on EPFO Portal ↗",
    shortLabel: 'Generate UAN ↗',
    tooltip: 'Direct link to EPFO Member Portal for citizen direct UAN allotment (Aadhaar based)',
    theme: 'purple'
  },
  pfNumber: {
    key: 'pfNumber',
    docName: 'EPFO Universal Account Number (UAN)',
    authority: 'Employees\' Provident Fund Organisation (EPFO)',
    applyUrl: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/no-uan-reg',
    secondaryUrl: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/',
    badgeText: "Don't have UAN? Direct UAN Allotment on EPFO Portal ↗",
    shortLabel: 'Generate UAN ↗',
    theme: 'purple'
  },
  drivingLicense: {
    key: 'drivingLicense',
    docName: 'Driving License (LMV / MCWG)',
    authority: 'Ministry of Road Transport and Highways (MoRTH / Sarathi)',
    applyUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do',
    secondaryUrl: 'https://parivahan.gov.in/',
    badgeText: "Don't have DL? Apply for Learner / Driving License on Sarathi ↗",
    shortLabel: 'Apply DL ↗',
    tooltip: 'Direct link to Parivahan Sarathi Government Portal for online DL / LL application',
    theme: 'sky'
  },
  dlNo: {
    key: 'dlNo',
    docName: 'Driving License (LMV / MCWG)',
    authority: 'Ministry of Road Transport and Highways (MoRTH / Sarathi)',
    applyUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do',
    secondaryUrl: 'https://parivahan.gov.in/',
    badgeText: "Don't have DL? Apply for Learner / Driving License on Sarathi ↗",
    shortLabel: 'Apply DL ↗',
    theme: 'sky'
  },
  voterId: {
    key: 'voterId',
    docName: 'Voter ID (EPIC Card)',
    authority: 'Election Commission of India (ECI)',
    applyUrl: 'https://voters.eci.gov.in/signup',
    secondaryUrl: 'https://voters.eci.gov.in/',
    badgeText: "Don't have Voter ID? Apply for New Voter Card (Form 6) ↗",
    shortLabel: 'Apply Voter ID ↗',
    tooltip: 'Direct link to Election Commission of India Voters\' Services Portal',
    theme: 'blue'
  },
  passportNo: {
    key: 'passportNo',
    docName: 'Indian Passport',
    authority: 'Passport Seva • Ministry of External Affairs (MEA)',
    applyUrl: 'https://www.passportindia.gov.in/AppOnlineProject/welcomeLink',
    secondaryUrl: 'https://www.passportindia.gov.in/AppOnlineProject/user/RegistrationBaseAction?request_locale=en',
    badgeText: "Don't have Passport? Apply on Passport Seva Portal ↗",
    shortLabel: 'Apply Passport ↗',
    tooltip: 'Direct link to MEA Passport Seva Online Portal for new passport application',
    theme: 'indigo'
  },
  rationCardNo: {
    key: 'rationCardNo',
    docName: 'National / State Food Security Ration Card',
    authority: 'NFSA • Department of Food & Public Distribution',
    applyUrl: 'https://nfsa.gov.in/portal/apply-ration-card',
    secondaryUrl: 'https://nfsa.gov.in/',
    badgeText: "Don't have Ration Card? Apply Online on NFSA State Portal ↗",
    shortLabel: 'Apply Ration Card ↗',
    tooltip: 'Direct link to National Food Security Portal for State Ration Card enrollment',
    theme: 'rose'
  },
  esicNumber: {
    key: 'esicNumber',
    docName: 'ESIC Insured Person (IP) Number',
    authority: 'Employees\' State Insurance Corporation (ESIC)',
    applyUrl: 'https://www.esic.gov.in/insurance-services',
    secondaryUrl: 'https://www.esic.gov.in/',
    badgeText: "Don't have ESIC IP? Check ESIC Registration & Portal ↗",
    shortLabel: 'Check ESIC ↗',
    tooltip: 'Direct link to ESIC Official Portal for Employee Insurance & IP services',
    theme: 'teal'
  },
  esiNumber: {
    key: 'esiNumber',
    docName: 'ESIC Insured Person (IP) Number',
    authority: 'Employees\' State Insurance Corporation (ESIC)',
    applyUrl: 'https://www.esic.gov.in/insurance-services',
    secondaryUrl: 'https://www.esic.gov.in/',
    badgeText: "Don't have ESIC IP? Check ESIC Registration & Portal ↗",
    shortLabel: 'Check ESIC ↗',
    theme: 'teal'
  },
  digilocker: {
    key: 'digilocker',
    docName: 'DigiLocker Digital Government Vault',
    authority: 'NeGD • Ministry of Electronics & IT (MeitY)',
    applyUrl: 'https://www.digilocker.gov.in/',
    secondaryUrl: 'https://api.digitallocker.gov.in/',
    badgeText: "Don't have DigiLocker? Create DigiLocker Citizen Account ↗",
    shortLabel: 'Open DigiLocker ↗',
    theme: 'cyan'
  }
};

/**
 * Renders a clickable, responsive redirect badge next to / below a document input field
 */
export const OfficialDocRedirectPill = ({ fieldKey, className = '' }) => {
  const portal = OFFICIAL_DOCUMENT_PORTALS[fieldKey];
  if (!portal) return null;

  return (
    <div className={`mt-1 flex items-center justify-between ${className}`}>
      <a
        href={portal.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-700 hover:text-sky-950 bg-sky-50 hover:bg-sky-100/90 px-2 py-0.5 rounded-md border border-sky-200/90 transition-all cursor-pointer shadow-2xs group active:scale-95 leading-tight"
        title={portal.tooltip || `Don't have ${portal.docName}? Click to apply directly on official ${portal.authority} portal`}
      >
        <ExternalLink className="w-3 h-3 text-sky-600 group-hover:scale-110 group-hover:text-sky-800 transition-transform shrink-0" />
        <span className="truncate">{portal.badgeText}</span>
      </a>
    </div>
  );
};

/**
 * Interactive Official Document Application & Creation Hub Bar
 * Displayed at the top of Statutory Documents section for rapid single-click access
 */
export const OfficialDocumentHubBanner = ({ onQuickFillDemo }) => {
  return (
    <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 p-4 rounded-2xl border border-sky-200 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-2xs font-black text-sm">
            🏛️
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <span>Official Government Document Application & Creation Hub</span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[9px] font-black border border-emerald-300">
                Direct Portals Live
              </span>
            </h4>
            <p className="text-[11px] text-slate-600 font-medium">
              If an onboarding employee does not possess any statutory document, click below to open the official Government creation portal in a new tab.
            </p>
          </div>
        </div>

        <span className="text-[10px] text-slate-500 font-mono font-bold shrink-0 self-start sm:self-auto bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
          Govt. Direct Gateway ⚡
        </span>
      </div>

      {/* Grid of Direct Government Portal Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        <a
          href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/instant-e-pan"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-all flex flex-col justify-between group shadow-2xs"
          title="Income Tax Department Instant e-PAN Portal (Free 10-Minute Generation)"
        >
          <div className="flex items-center justify-between">
            <span className="text-base">💳</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <div className="mt-1">
            <div className="text-[10px] font-black text-slate-800 group-hover:text-amber-900">Instant e-PAN</div>
            <div className="text-[9px] text-slate-400 truncate">Income Tax Dept</div>
          </div>
        </a>

        <a
          href="https://appointments.uidai.gov.in/bookappointment.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group shadow-2xs"
          title="UIDAI myAadhaar Portal (Enrollment & e-Aadhaar Download)"
        >
          <div className="flex items-center justify-between">
            <span className="text-base">🪪</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="mt-1">
            <div className="text-[10px] font-black text-slate-800 group-hover:text-emerald-900">UIDAI Aadhaar</div>
            <div className="text-[9px] text-slate-400 truncate">Enrollment / e-KYC</div>
          </div>
        </a>

        <a
          href="https://unifiedportal-mem.epfindia.gov.in/memberinterface/no-uan-reg"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between group shadow-2xs"
          title="EPFO Direct UAN Allotment for First-Time Employees"
        >
          <div className="flex items-center justify-between">
            <span className="text-base">💼</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <div className="mt-1">
            <div className="text-[10px] font-black text-slate-800 group-hover:text-purple-900">EPFO UAN Direct</div>
            <div className="text-[9px] text-slate-400 truncate">PF Allotment</div>
          </div>
        </a>

        <a
          href="https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between group shadow-2xs"
          title="MoRTH Sarathi Portal for Learner & Driving License Application"
        >
          <div className="flex items-center justify-between">
            <span className="text-base">🚗</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </div>
          <div className="mt-1">
            <div className="text-[10px] font-black text-slate-800 group-hover:text-sky-900">Parivahan Sarathi</div>
            <div className="text-[9px] text-slate-400 truncate">Driving License</div>
          </div>
        </a>

        <a
          href="https://voters.eci.gov.in/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between group shadow-2xs"
          title="Election Commission of India Voters' Services Portal (Form 6 New Voter)"
        >
          <div className="flex items-center justify-between">
            <span className="text-base">🗳️</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="mt-1">
            <div className="text-[10px] font-black text-slate-800 group-hover:text-blue-900">ECI Voter ID</div>
            <div className="text-[9px] text-slate-400 truncate">Form 6 Application</div>
          </div>
        </a>

        <a
          href="https://www.passportindia.gov.in/AppOnlineProject/welcomeLink"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between group shadow-2xs"
          title="Ministry of External Affairs Passport Seva Portal"
        >
          <div className="flex items-center justify-between">
            <span className="text-base">🛂</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="mt-1">
            <div className="text-[10px] font-black text-slate-800 group-hover:text-indigo-900">Passport Seva</div>
            <div className="text-[9px] text-slate-400 truncate">MEA Application</div>
          </div>
        </a>
      </div>
    </div>
  );
};
