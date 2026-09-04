import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HelpCircle, 
  ShieldCheck, 
  Building2, 
  Users, 
  UserCheck, 
  Smartphone, 
  KeyRound, 
  Camera, 
  FileText, 
  Zap, 
  FolderDown, 
  CreditCard, 
  X,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Search,
  MessageSquare,
  FileCheck
} from 'lucide-react';

export const HelpGuidelinesModal = ({ initialRole, onClose }) => {
  const { roleView, platformGuidelines } = useApp();

  // Determine initial guide tab based on logged-in role context
  const defaultTab = initialRole || (roleView === 'employee_link' ? 'candidate' : roleView === 'hrexecutive' ? 'hr' : roleView === 'company' ? 'company' : 'superadmin');
  
  const [activeGuideTab, setActiveGuideTab] = useState(defaultTab);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="glass-panel w-full max-w-4xl max-h-[92vh] flex flex-col border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl relative z-10 overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-b border-slate-100 space-y-3 shadow-2xs">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 font-bold shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Role-Specific Operational Guidelines & How-To Manual</h2>
              <p className="text-xs text-slate-500 font-medium">Tailored step-by-step procedures for Super Admin, Company Admin, HR Executive, and Candidate portals</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

        {/* Role Guide Selector Tabs */}
        <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setActiveGuideTab('superadmin')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeGuideTab === 'superadmin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Manual</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('company')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeGuideTab === 'company' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Company Admin Manual</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('hr')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeGuideTab === 'hr' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>HR Executive Manual</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('candidate')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeGuideTab === 'candidate' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Candidate Manual</span>
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-8 text-xs py-1.5"
            />
          </div>
        </div>

        {/* Guide Content Body */}
        <div className="space-y-4 text-xs max-h-[55vh] overflow-y-auto pr-1">
          {/* Dynamic Guideline Manual Display */}
          {(() => {
            const currentGuide = platformGuidelines[activeGuideTab] || platformGuidelines.superadmin;
            const isSa = activeGuideTab === 'superadmin';
            const isComp = activeGuideTab === 'company';
            const isHr = activeGuideTab === 'hr';
            const isCand = activeGuideTab === 'candidate';

            const bgClass = isSa ? 'bg-purple-50 border-purple-200 text-purple-900' : isComp ? 'bg-sky-50 border-sky-200 text-sky-900' : isHr ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900';
            const iconColor = isSa ? 'text-purple-600' : isComp ? 'text-sky-600' : isHr ? 'text-emerald-600' : 'text-amber-600';
            const badgeBg = isSa ? 'bg-indigo-600' : isComp ? 'bg-sky-600' : isHr ? 'bg-emerald-600' : 'bg-amber-600';
            const GuideIcon = isSa ? ShieldCheck : isComp ? Building2 : isHr ? Users : UserCheck;

            return (
              <div className="space-y-4 animate-fadeIn">
                <div className={`p-4 rounded-xl border ${bgClass}`}>
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    <GuideIcon className={`w-4 h-4 ${iconColor}`} />
                    <span>{currentGuide.title}</span>
                  </h3>
                  <p className="text-xs mt-1 font-medium">{currentGuide.summary}</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <span className={`w-5 h-5 rounded-full ${badgeBg} text-white text-[10px] flex items-center justify-center font-bold`}>1</span>
                      <span>Procedure Step 1</span>
                    </h4>
                    <p className="text-slate-600 mt-1 pl-6 text-xs">{currentGuide.step1}</p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <span className={`w-5 h-5 rounded-full ${badgeBg} text-white text-[10px] flex items-center justify-center font-bold`}>2</span>
                      <span>Procedure Step 2</span>
                    </h4>
                    <p className="text-slate-600 mt-1 pl-6 text-xs">{currentGuide.step2}</p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <span className={`w-5 h-5 rounded-full ${badgeBg} text-white text-[10px] flex items-center justify-center font-bold`}>3</span>
                      <span>Procedure Step 3</span>
                    </h4>
                    <p className="text-slate-600 mt-1 pl-6 text-xs">{currentGuide.step3}</p>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">Need immediate assistance? Click Support & Tickets 🎫 in navigation header.</span>
          <button onClick={onClose} className="btn btn-hrexecutive text-xs py-2 px-4 font-bold shadow-md">
            Close Guidelines Window
          </button>
        </div>

        </div>
      </div>
    </div>
  );
};
