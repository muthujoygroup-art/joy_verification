import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  User, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Save, 
  FileText, 
  FileCheck, 
  Scale, 
  Briefcase, 
  GraduationCap, 
  Phone, 
  Mail, 
  CheckCircle2, 
  X, 
  Download, 
  ExternalLink, 
  ToggleLeft, 
  ToggleRight, 
  Send,
  AlertTriangle,
  Sparkles,
  Lock,
  Plus,
  Trash2,
  Globe,
  Heart,
  Baby,
  Users,
  Languages,
  CreditCard,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { Linkedin, Github, Twitter, Instagram, Facebook, Youtube } from './SocialIcons';
import { api } from '../services/api';
import { 
  LANGUAGE_OPTIONS, 
  OCCUPATION_OPTIONS, 
  SIBLING_RELATION_OPTIONS, 
  CHILD_GENDER_OPTIONS 
} from '../data/masterDropdownOptions';
import { EmployeeProfileDossierModal } from './EmployeeProfileDossierModal';

export const HrGovernanceModal = ({ 
  hrUser, 
  companyId, 
  isOpen, 
  onClose, 
  onUpdateHr, 
  showToast 
}) => {
  if (!isOpen || !hrUser) return null;

  const [activeTab, setActiveTab] = useState('profile');
  // 'profile' | 'family' | 'languages_social' | 'statutory' | 'education' | 'documents' | 'security' | 'legal'
  const [showDossierModal, setShowDossierModal] = useState(false);

  const personal = hrUser.personal_details || hrUser.personalDetails || {};
  const employment = hrUser.employment_details || hrUser.employmentDetails || {};
  const education = hrUser.education_details || hrUser.educationDetails || {};
  const docs = hrUser.documents || {};
  const family = hrUser.family_details || hrUser.familyDetails || {};
  const statutory = hrUser.statutory_details || hrUser.statutoryDetails || {};
  const social = hrUser.social_links || hrUser.socialLinks || {};

  // Form State
  const [formData, setFormData] = useState({
    name: hrUser.name || '',
    phone: hrUser.phone || personal.phone || '',
    dept: hrUser.dept || employment.department || 'Human Resources',
    designation: hrUser.designation || employment.designation || 'HR Recruiter',
    dob: personal.dob || hrUser.dob || '',
    gender: personal.gender || hrUser.gender || 'Male',
    marital_status: personal.marital_status || hrUser.maritalStatus || 'Single',
    blood_group: personal.blood_group || hrUser.bloodGroup || 'O+',
    emergency_contact: personal.emergency_contact || hrUser.emergencyContactPhone || '',
    current_address: personal.current_address || hrUser.presentAddress || '',
    permanent_address: personal.permanent_address || hrUser.permanentAddress || '',
    emp_id: employment.emp_id || hrUser.empId || hrUser.employeeNumber || '',
    doj: employment.doj || hrUser.doj || '',
    work_location: employment.work_location || hrUser.workLocation || '',

    // Parents
    father_name: family.father_name || hrUser.fatherName || '',
    father_mobile: family.father_mobile || hrUser.fatherMobile || '',
    father_occupation: family.father_occupation || hrUser.fatherOccupation || 'Private Corporate Employee',
    mother_name: family.mother_name || hrUser.motherName || '',
    mother_mobile: family.mother_mobile || hrUser.motherMobile || '',
    mother_occupation: family.mother_occupation || hrUser.motherOccupation || 'Homemaker / Housewife',

    // Spouse
    spouse_name: family.spouse_name || hrUser.spouseName || '',
    spouse_mobile: family.spouse_mobile || hrUser.spouseMobile || '',
    spouse_occupation: family.spouse_occupation || hrUser.spouseOccupation || 'Private Corporate Employee',

    // Social Profiles
    linkedin_url: social.linkedin_url || hrUser.linkedInUrl || '',
    github_url: social.github_url || hrUser.githubUrl || '',
    twitter_url: social.twitter_url || hrUser.twitterUrl || '',
    portfolio_url: social.portfolio_url || hrUser.portfolioUrl || '',
    instagram_url: social.instagram_url || hrUser.instagramUrl || '',
    facebook_url: social.facebook_url || hrUser.facebookUrl || '',
    youtube_url: social.youtube_url || hrUser.youtubeUrl || '',

    // Statutory IDs
    pan_no: statutory.pan_no || hrUser.panNo || hrUser.panNumber || '',
    aadhaar_no: statutory.aadhaar_no || hrUser.aadhaarNo || hrUser.aadhaarNumber || '',
    passport_no: statutory.passport_no || hrUser.passportNo || hrUser.passportNumber || '',
    driving_license_no: statutory.driving_license_no || hrUser.drivingLicenseNo || hrUser.drivingLicenseNumber || '',
    voter_id_no: statutory.voter_id_no || hrUser.voterId || hrUser.voterIdNo || '',
    ration_card_no: statutory.ration_card_no || hrUser.rationCardNo || '',
    uan_no: statutory.uan_no || hrUser.uanNo || hrUser.uanNumber || '',
    esic_no: statutory.esic_no || hrUser.esiNumber || hrUser.esiNo || '',
    bank_account_no: statutory.bank_account_no || hrUser.bankAccountNumber || '',
    bank_ifsc: statutory.bank_ifsc || hrUser.bankIfsc || '',
    bank_name: statutory.bank_name || hrUser.bankName || '',

    // Education
    highest_degree: education.highest_degree || hrUser.highestDegree || 'Bachelor of Technology (B.Tech / B.E.)',
    institution: education.institution || hrUser.institution || '',
    passing_year: education.passing_year || hrUser.passingYear || '2022',
    specialization: education.specialization || hrUser.specialization || ''
  });

  // Dynamic Siblings List
  const [siblings, setSiblings] = useState(() => {
    if (Array.isArray(family.siblings) && family.siblings.length > 0) return family.siblings;
    if (Array.isArray(hrUser.siblings) && hrUser.siblings.length > 0) return hrUser.siblings;
    return [];
  });

  // Dynamic Children List
  const [children, setChildren] = useState(() => {
    if (Array.isArray(family.children) && family.children.length > 0) return family.children;
    if (Array.isArray(hrUser.children) && hrUser.children.length > 0) return hrUser.children;
    return [];
  });

  // Dynamic Languages List
  const [languages, setLanguages] = useState(() => {
    if (Array.isArray(hrUser.languages) && hrUser.languages.length > 0) return hrUser.languages;
    if (hrUser.languagesKnown && typeof hrUser.languagesKnown === 'string') {
      return hrUser.languagesKnown.split(',').map(l => l.trim()).filter(Boolean).map(name => ({
        name,
        read: true,
        write: true,
        speak: true
      }));
    }
    return [
      { name: 'English', read: true, write: true, speak: true },
      { name: 'Tamil', read: true, write: true, speak: true }
    ];
  });
  const [customLanguage, setCustomLanguage] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security / Password State
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendPasswordEmail, setSendPasswordEmail] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showDossierModal) {
          setShowDossierModal(false);
        } else if (typeof onClose === 'function') {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showDossierModal]);

  // Sibling Helpers
  const handleAddSibling = () => {
    setSiblings(prev => [
      ...prev,
      { id: Date.now(), name: '', relation: 'Brother', occupation: 'Private Corporate Employee', mobile: '' }
    ]);
  };

  const handleUpdateSibling = (idx, field, value) => {
    setSiblings(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleRemoveSibling = (idx) => {
    setSiblings(prev => prev.filter((_, i) => i !== idx));
  };

  // Children Helpers
  const handleAddChild = () => {
    setChildren(prev => [
      ...prev,
      { id: Date.now(), name: '', gender: 'Male', age: '5', occupation: 'Student' }
    ]);
  };

  const handleUpdateChild = (idx, field, value) => {
    setChildren(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleRemoveChild = (idx) => {
    setChildren(prev => prev.filter((_, i) => i !== idx));
  };

  // Language Helpers
  const handleAddLanguage = (langName) => {
    if (!langName || !langName.trim()) return;
    const trimmed = langName.trim();
    if (languages.some(l => l.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast?.(`Language "${trimmed}" is already added.`);
      return;
    }
    setLanguages(prev => [
      ...prev,
      { name: trimmed, read: true, write: true, speak: true }
    ]);
    setCustomLanguage('');
  };

  const handleRemoveLanguage = (langName) => {
    setLanguages(prev => prev.filter(l => l.name !== langName));
  };

  const handleToggleLanguageProficiency = (langName, skill) => {
    setLanguages(prev => prev.map(l => {
      if (l.name === langName) {
        return { ...l, [skill]: !l[skill] };
      }
      return l;
    }));
  };

  // 1. Save HR Profile Changes
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSavingProfile(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        dept: formData.dept,
        designation: formData.designation,
        maritalStatus: formData.marital_status,
        bloodGroup: formData.blood_group,
        fatherName: formData.father_name,
        fatherMobile: formData.father_mobile,
        fatherOccupation: formData.father_occupation,
        motherName: formData.mother_name,
        motherMobile: formData.mother_mobile,
        motherOccupation: formData.mother_occupation,
        spouseName: formData.spouse_name,
        spouseMobile: formData.spouse_mobile,
        spouseOccupation: formData.spouse_occupation,
        siblings: siblings,
        children: children,
        languages: languages,
        languagesKnown: languages.map(l => l.name).join(', '),
        linkedInUrl: formData.linkedin_url,
        githubUrl: formData.github_url,
        twitterUrl: formData.twitter_url,
        portfolioUrl: formData.portfolio_url,
        instagramUrl: formData.instagram_url,
        facebookUrl: formData.facebook_url,
        youtubeUrl: formData.youtube_url,
        panNo: formData.pan_no,
        aadhaarNo: formData.aadhaar_no,
        passportNo: formData.passport_no,
        drivingLicenseNo: formData.driving_license_no,
        voterId: formData.voter_id_no,
        rationCardNo: formData.ration_card_no,
        uanNo: formData.uan_no,
        esiNumber: formData.esic_no,
        bankAccountNumber: formData.bank_account_no,
        bankIfsc: formData.bank_ifsc,
        bankName: formData.bank_name,
        personal_details: {
          ...personal,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          marital_status: formData.marital_status,
          blood_group: formData.blood_group,
          emergency_contact: formData.emergency_contact,
          current_address: formData.current_address,
          permanent_address: formData.permanent_address
        },
        employment_details: {
          ...employment,
          emp_id: formData.emp_id,
          doj: formData.doj,
          work_location: formData.work_location,
          department: formData.dept,
          designation: formData.designation
        },
        family_details: {
          father_name: formData.father_name,
          father_mobile: formData.father_mobile,
          father_occupation: formData.father_occupation,
          mother_name: formData.mother_name,
          mother_mobile: formData.mother_mobile,
          mother_occupation: formData.mother_occupation,
          spouse_name: formData.spouse_name,
          spouse_mobile: formData.spouse_mobile,
          spouse_occupation: formData.spouse_occupation,
          siblings: siblings,
          children: children
        },
        social_links: {
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          twitter_url: formData.twitter_url,
          portfolio_url: formData.portfolio_url,
          instagram_url: formData.instagram_url,
          facebook_url: formData.facebook_url,
          youtube_url: formData.youtube_url
        },
        statutory_details: {
          pan_no: formData.pan_no,
          aadhaar_no: formData.aadhaar_no,
          passport_no: formData.passport_no,
          driving_license_no: formData.driving_license_no,
          voter_id_no: formData.voter_id_no,
          ration_card_no: formData.ration_card_no,
          uan_no: formData.uan_no,
          esic_no: formData.esic_no,
          bank_account_no: formData.bank_account_no,
          bank_ifsc: formData.bank_ifsc,
          bank_name: formData.bank_name
        },
        education_details: {
          ...education,
          highest_degree: formData.highest_degree,
          institution: formData.institution,
          passing_year: formData.passing_year,
          specialization: formData.specialization
        }
      };

      const res = await api.updateHrProfile(companyId, hrUser.id, payload);
      showToast(res.message || `👤 ${hrUser.name} profile updated successfully!`);
      if (onUpdateHr) {
        onUpdateHr({ ...hrUser, ...payload });
      }
    } catch (err) {
      showToast(`❌ Failed to update HR profile: ${err.message}`, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 2. Update Password
  const handleUpdatePassword = async (e) => {
    e?.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      showToast('⚠️ Please enter a password with at least 4 characters');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await api.updateHrPassword(companyId, hrUser.id, newPassword, sendPasswordEmail);
      showToast(res.message || `🔐 Password updated successfully!`);
      setNewPassword('');
    } catch (err) {
      showToast(`❌ Failed to update password: ${err.message}`, 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // 3. Toggle Status (Active vs Suspended)
  const handleToggleStatus = async () => {
    setIsTogglingStatus(true);
    const newStatus = (hrUser.status === 'Active') ? 'Suspended' : 'Active';
    try {
      await api.updateHrStatus(companyId, hrUser.id, newStatus);
      showToast(`👤 Recruiter login access ${newStatus === 'Active' ? 'ENABLED 🟢' : 'DISABLED 🔴'}!`);
      if (onUpdateHr) {
        onUpdateHr({ ...hrUser, status: newStatus, activation_status: newStatus });
      }
    } catch (err) {
      showToast(`❌ Failed to update status: ${err.message}`, 'error');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const isPendingActivation = hrUser.status === 'Pending Activation' || hrUser.activation_status === 'Pending Activation';
  const isPendingApproval = hrUser.status === 'Pending Approval' || hrUser.activation_status === 'Pending Approval';
  const isActive = hrUser.status === 'Active';
  const isMarried = formData.marital_status === 'Married' || (formData.marital_status && formData.marital_status.toLowerCase().includes('married'));

  // HR as Candidate Adapter for Master Dossier PDF Export
  const hrAsCandidate = {
    id: hrUser.id,
    name: formData.name || hrUser.name,
    fullName: formData.name || hrUser.name,
    email: hrUser.email,
    mobile: formData.phone || hrUser.phone,
    phone: formData.phone || hrUser.phone,
    empId: formData.emp_id || hrUser.id,
    employeeNumber: formData.emp_id || hrUser.id,
    designation: formData.designation || hrUser.designation || 'HR Recruiter',
    dept: formData.dept || hrUser.dept || 'Human Resources',
    department: formData.dept || hrUser.dept || 'Human Resources',
    companyName: hrUser.company_name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
    status: isActive ? 'Verified' : 'Pending',
    gender: formData.gender,
    dob: formData.dob,
    maritalStatus: formData.marital_status,
    bloodGroup: formData.blood_group,
    presentAddress: formData.current_address,
    permanentAddress: formData.permanent_address || formData.current_address,
    fatherName: formData.father_name,
    fatherMobile: formData.father_mobile,
    fatherOccupation: formData.father_occupation,
    motherName: formData.mother_name,
    motherMobile: formData.mother_mobile,
    motherOccupation: formData.mother_occupation,
    spouseName: formData.spouse_name,
    spouseMobile: formData.spouse_mobile,
    spouseOccupation: formData.spouse_occupation,
    siblings: siblings,
    children: children,
    languages: languages,
    languagesKnown: languages.map(l => l.name).join(', '),
    linkedInUrl: formData.linkedin_url,
    githubUrl: formData.github_url,
    twitterUrl: formData.twitter_url,
    portfolioUrl: formData.portfolio_url,
    instagramUrl: formData.instagram_url,
    facebookUrl: formData.facebook_url,
    youtubeUrl: formData.youtube_url,
    panNo: formData.pan_no,
    panNumber: formData.pan_no,
    aadhaarNo: formData.aadhaar_no,
    aadhaarNumber: formData.aadhaar_no,
    passportNo: formData.passport_no,
    passportNumber: formData.passport_no,
    drivingLicenseNo: formData.driving_license_no,
    drivingLicenseNumber: formData.driving_license_no,
    voterId: formData.voter_id_no,
    voterIdNo: formData.voter_id_no,
    rationCardNo: formData.ration_card_no,
    uanNo: formData.uan_no,
    uanNumber: formData.uan_no,
    esiNumber: formData.esic_no,
    esiNo: formData.esic_no,
    bankAccountNumber: formData.bank_account_no,
    bankIfsc: formData.bank_ifsc,
    bankName: formData.bank_name,
    educationList: [
      {
        qualificationCategory: 'Degree / University',
        degreeName: formData.highest_degree,
        institutionName: formData.institution,
        passingYear: formData.passing_year,
        specialization: formData.specialization
      }
    ],
    verificationsCompleted: {
      email: true,
      aadhaar: !!formData.aadhaar_no,
      pan: !!formData.pan_no,
      bank: !!formData.bank_account_no,
      mobile: !!formData.phone
    }
  };

  return createPortal((
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden relative z-10 my-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black tracking-tight">{hrUser.name}</h2>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  #{hrUser.id}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                    : isPendingApproval 
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                    : isPendingActivation
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                }`}>
                  {isActive ? '🟢 Active Recruiter' : isPendingApproval ? '🟣 Pending Approval' : isPendingActivation ? '🟡 Pending Activation' : '🔴 Suspended'}
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>{formData.designation || hrUser.designation || 'HR Recruiter'}</span>
                <span>•</span>
                <span>{formData.dept || hrUser.dept || 'Human Resources'}</span>
                <span>•</span>
                <span>{hrUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View / Download HR Dossier PDF */}
            <button
              onClick={() => setShowDossierModal(true)}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border-indigo-400/40 cursor-pointer shadow-xs"
              title="View and Download Adaptive HR Profile PDF & Dossier"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-300" />
              <span className="hidden sm:inline">📄 Profile Dossier PDF</span>
            </button>

            {/* Quick Login Toggle */}
            <button
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40 hover:bg-rose-500/30'
              }`}
              title={isActive ? 'Click to Suspend HR Login Access' : 'Click to Enable HR Login Access'}
            >
              {isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-rose-400" />}
              <span className="hidden md:inline">{isActive ? 'Login Allowed' : 'Login Blocked'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <User className="w-4 h-4" />
            <span>👤 Personal & Work</span>
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'family'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👨‍👩‍👧 Parents & Family</span>
          </button>

          <button
            onClick={() => setActiveTab('languages_social')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'languages_social'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>🌐 Languages & Social</span>
          </button>

          <button
            onClick={() => setActiveTab('statutory')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'statutory'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>🏛️ Statutory IDs</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'education'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>🎓 Academic</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📄 Proofs ({Object.keys(docs).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>🔐 Login & Password</span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'legal'
                ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>⚖️ DPDP Consent</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* TAB 1: PERSONAL & EMPLOYMENT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Login Email (Read Only)</label>
                  <input
                    type="email"
                    value={hrUser.email}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 bg-slate-100 text-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Staff / Employee ID</label>
                  <input
                    type="text"
                    value={formData.emp_id}
                    onChange={(e) => setFormData({ ...formData, emp_id: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. JOY-HR-004"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role Title</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marital Status</label>
                  <select
                    value={formData.marital_status}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Single">Single / Unmarried</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Location</label>
                  <input
                    type="text"
                    value={formData.work_location}
                    onChange={(e) => setFormData({ ...formData, work_location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Bangalore HQ / Chennai Plant"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Mobile</label>
                  <input
                    type="text"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Residential Address</label>
                  <textarea
                    rows={2}
                    value={formData.current_address}
                    onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Enter complete current residential address"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : '💾 Save Profile to PostgreSQL'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PARENTS, SIBLINGS & DEPENDENTS */}
          {activeTab === 'family' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Parents Information */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Parents Information</h4>
                    <p className="text-xs text-slate-500 font-medium">Father and Mother details, contact numbers and professions</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Father's Full Name</label>
                    <input
                      type="text"
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      placeholder="e.g. Suresh Kumar"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Father's Mobile Number</label>
                    <input
                      type="text"
                      value={formData.father_mobile}
                      onChange={(e) => setFormData({ ...formData, father_mobile: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Father's Occupation</label>
                    <select
                      value={formData.father_occupation}
                      onChange={(e) => setFormData({ ...formData, father_occupation: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    >
                      {OCCUPATION_OPTIONS.map(occ => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Full Name</label>
                    <input
                      type="text"
                      value={formData.mother_name}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      placeholder="e.g. Lakshmi Devi"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Mobile Number</label>
                    <input
                      type="text"
                      value={formData.mother_mobile}
                      onChange={(e) => setFormData({ ...formData, mother_mobile: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      placeholder="e.g. 9876543211"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Occupation</label>
                    <select
                      value={formData.mother_occupation}
                      onChange={(e) => setFormData({ ...formData, mother_occupation: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    >
                      {OCCUPATION_OPTIONS.map(occ => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Siblings Information */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Siblings Details</h4>
                      <p className="text-xs text-slate-500 font-medium">Add brothers and sisters with their profession and contact details</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSibling}
                    className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Sibling</span>
                  </button>
                </div>

                {siblings.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No siblings added. Click <strong>"+ Add Sibling"</strong> above to record brother/sister details.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {siblings.map((sib, sIdx) => (
                      <div key={sib.id || sIdx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Sibling Name *</label>
                          <input
                            type="text"
                            value={sib.name}
                            onChange={(e) => handleUpdateSibling(sIdx, 'name', e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Relationship</label>
                          <select
                            value={sib.relation || 'Brother'}
                            onChange={(e) => handleUpdateSibling(sIdx, 'relation', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          >
                            {SIBLING_RELATION_OPTIONS.map(rel => (
                              <option key={rel} value={rel}>{rel}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Occupation</label>
                          <select
                            value={sib.occupation || 'Private Corporate Employee'}
                            onChange={(e) => handleUpdateSibling(sIdx, 'occupation', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          >
                            {OCCUPATION_OPTIONS.map(occ => (
                              <option key={occ} value={occ}>{occ}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile No</label>
                            <input
                              type="text"
                              value={sib.mobile || ''}
                              onChange={(e) => handleUpdateSibling(sIdx, 'mobile', e.target.value)}
                              placeholder="Mobile"
                              className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSibling(sIdx)}
                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 cursor-pointer mt-5"
                            title="Remove Sibling"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Marital & Dependents (Spouse & Children) */}
              {isMarried && (
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-pink-200 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Spouse & Children Details</h4>
                      <p className="text-xs text-slate-500 font-medium">Family dependents registered for company benefits and medical coverage</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Spouse Full Name</label>
                      <input
                        type="text"
                        value={formData.spouse_name}
                        onChange={(e) => setFormData({ ...formData, spouse_name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        placeholder="Spouse Legal Name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Spouse Mobile Number</label>
                      <input
                        type="text"
                        value={formData.spouse_mobile}
                        onChange={(e) => setFormData({ ...formData, spouse_mobile: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        placeholder="Spouse Phone"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Spouse Occupation</label>
                      <select
                        value={formData.spouse_occupation}
                        onChange={(e) => setFormData({ ...formData, spouse_occupation: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      >
                        {OCCUPATION_OPTIONS.map(occ => (
                          <option key={occ} value={occ}>{occ}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Children List */}
                  <div className="pt-3 border-t border-pink-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Baby className="w-4 h-4 text-pink-600" />
                        <h5 className="text-xs font-bold text-slate-800">Children / Dependents</h5>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddChild}
                        className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1 font-bold bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add Child</span>
                      </button>
                    </div>

                    {children.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400 bg-pink-50/40 rounded-xl border border-dashed border-pink-200">
                        No children added. Click <strong>"+ Add Child"</strong> if applicable.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {children.map((ch, cIdx) => (
                          <div key={ch.id || cIdx} className="p-3 bg-pink-50/40 rounded-xl border border-pink-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Child Name *</label>
                              <input
                                type="text"
                                value={ch.name}
                                onChange={(e) => handleUpdateChild(cIdx, 'name', e.target.value)}
                                placeholder="Child Name"
                                className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
                              <select
                                value={ch.gender || 'Male'}
                                onChange={(e) => handleUpdateChild(cIdx, 'gender', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                              >
                                {CHILD_GENDER_OPTIONS.map(g => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Age (Years)</label>
                              <input
                                type="number"
                                min="0"
                                max="35"
                                value={ch.age || ''}
                                onChange={(e) => handleUpdateChild(cIdx, 'age', e.target.value)}
                                placeholder="Age"
                                className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">Occupation / School</label>
                                <input
                                  type="text"
                                  value={ch.occupation || 'Student'}
                                  onChange={(e) => handleUpdateChild(cIdx, 'occupation', e.target.value)}
                                  placeholder="e.g. Student"
                                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveChild(cIdx)}
                                className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 cursor-pointer mt-5"
                                title="Remove Child"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : '💾 Save Family Details'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LANGUAGES & SOCIAL PROFILES */}
          {activeTab === 'languages_social' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Known Languages Section */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Languages className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Known Languages & Fluency Matrix</h4>
                    <p className="text-xs text-slate-500 font-medium">Select from standard languages or add custom languages with Read/Write/Speak toggles</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map(lang => {
                      const isSelected = languages.some(l => l.name.toLowerCase() === lang.toLowerCase());
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              handleRemoveLanguage(lang);
                            } else {
                              handleAddLanguage(lang);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? `✓ ${lang}` : `+ ${lang}`}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 max-w-md pt-2">
                    <input
                      type="text"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="Add custom language (e.g. French, Telugu)..."
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddLanguage(customLanguage)}
                      className="btn btn-secondary text-xs py-2 px-3.5 font-bold cursor-pointer bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                    >
                      Add
                    </button>
                  </div>

                  {/* Active Selected Languages Matrix */}
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {languages.map((langObj) => (
                      <div key={langObj.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                        <div>
                          <div className="font-black text-xs text-slate-900">{langObj.name}</div>
                          <div className="flex items-center gap-2 mt-1.5">
                            {['read', 'write', 'speak'].map(skill => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => handleToggleLanguageProficiency(langObj.name, skill)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  langObj[skill]
                                    ? 'bg-emerald-500 text-white shadow-2xs'
                                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                }`}
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(langObj.name)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Remove Language"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Media Links Section */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Social Media & Public Profiles</h4>
                    <p className="text-xs text-slate-500 font-medium">Online profiles will be rendered with branded clickable badges in HR Profile PDFs</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                      <span>LinkedIn Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-slate-900" />
                      <span>GitHub Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Twitter className="w-3.5 h-3.5 text-slate-900" />
                      <span>Twitter / X Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.twitter_url}
                      onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                      placeholder="https://x.com/username"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Personal Portfolio / Website URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                      placeholder="https://myportfolio.com"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
                      <span>Instagram Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.instagram_url}
                      onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/username"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                      <span>Facebook Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.facebook_url}
                      onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                      placeholder="https://facebook.com/username"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                      <span>YouTube Channel URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                      placeholder="https://youtube.com/@channel"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : '💾 Save Languages & Social'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: STATUTORY GOVERNMENT IDS & BANKING */}
          {activeTab === 'statutory' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Government ID Numbers */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Original Statutory Document Numbers</h4>
                    <p className="text-xs text-slate-500 font-medium">National government identification numbers and welfare accounts</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PAN Card Number</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={formData.pan_no}
                      onChange={(e) => setFormData({ ...formData, pan_no: e.target.value.toUpperCase() })}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Card UID</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={formData.aadhaar_no}
                      onChange={(e) => setFormData({ ...formData, aadhaar_no: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="e.g. 234567890123"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Passport Number</label>
                    <input
                      type="text"
                      maxLength={9}
                      value={formData.passport_no}
                      onChange={(e) => setFormData({ ...formData, passport_no: e.target.value.toUpperCase() })}
                      placeholder="e.g. A1234567"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Driving License (DL) No</label>
                    <input
                      type="text"
                      value={formData.driving_license_no}
                      onChange={(e) => setFormData({ ...formData, driving_license_no: e.target.value.toUpperCase() })}
                      placeholder="e.g. TN0120200001234"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Voter ID (EPIC) Number</label>
                    <input
                      type="text"
                      value={formData.voter_id_no}
                      onChange={(e) => setFormData({ ...formData, voter_id_no: e.target.value.toUpperCase() })}
                      placeholder="e.g. WXZ1234567"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ration Card Number</label>
                    <input
                      type="text"
                      value={formData.ration_card_no}
                      onChange={(e) => setFormData({ ...formData, ration_card_no: e.target.value.toUpperCase() })}
                      placeholder="e.g. 05/G/0123456"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">EPFO UAN Number (12 Digits)</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={formData.uan_no}
                      onChange={(e) => setFormData({ ...formData, uan_no: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="e.g. 101298450123"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ESIC IP Number (17 Digits)</label>
                    <input
                      type="text"
                      maxLength={17}
                      value={formData.esic_no}
                      onChange={(e) => setFormData({ ...formData, esic_no: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="e.g. 31000123450000101"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Salary Account Details */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Bank Salary Account Details</h4>
                    <p className="text-xs text-slate-500 font-medium">Bank disbursement details for payroll and reimbursements</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      placeholder="e.g. HDFC Bank / ICICI Bank"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={formData.bank_account_no}
                      onChange={(e) => setFormData({ ...formData, bank_account_no: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="e.g. 50100234129845"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      maxLength={11}
                      value={formData.bank_ifsc}
                      onChange={(e) => setFormData({ ...formData, bank_ifsc: e.target.value.toUpperCase() })}
                      placeholder="e.g. HDFC0000128"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : '💾 Save Statutory & Bank Details'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: ACADEMIC CREDENTIALS */}
          {activeTab === 'education' && (
            <form onSubmit={handleSaveProfile} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Academic & Educational Credentials</h4>
                  <p className="text-xs text-slate-500 font-medium">Educational background recorded during onboarding</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Highest Qualification Degree</label>
                  <input
                    type="text"
                    value={formData.highest_degree}
                    onChange={(e) => setFormData({ ...formData, highest_degree: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institution / University</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialization / Domain</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year of Graduation</label>
                  <input
                    type="text"
                    value={formData.passing_year}
                    onChange={(e) => setFormData({ ...formData, passing_year: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : '💾 Save Academic Credentials'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: UPLOADED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <h4 className="text-sm font-black text-slate-900 mb-1">Uploaded Statutory Documents & Proofs</h4>
                <p className="text-xs text-slate-500 font-medium">Identity and academic proof documents submitted by {hrUser.name}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'gov_id', label: 'Government ID Proof (Aadhaar / PAN / Passport)', desc: 'Official identity document proof' },
                  { key: 'degree_cert', label: 'Highest Degree Certificate / Marksheet', desc: 'University Degree / Diploma certificate' },
                  { key: 'exp_letter', label: 'Experience / Relieving Letter', desc: 'Prior employment service letter' },
                  { key: 'photo', label: 'Passport Size Profile Photograph', desc: 'Recruiter profile image' }
                ].map(({ key, label, desc }) => {
                  const docVal = docs[key];
                  return (
                    <div key={key} className="p-4 rounded-2xl border bg-white border-slate-200 flex items-start justify-between gap-3 shadow-2xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <FileCheck className={`w-4 h-4 ${docVal ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <h5 className="text-xs font-bold text-slate-900">{label}</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                        <div className="mt-2">
                          {docVal ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Attached & Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                              Pending Submission
                            </span>
                          )}
                        </div>
                      </div>

                      {docVal && typeof docVal === 'string' && docVal.startsWith('data:') && (
                        <a
                          href={docVal}
                          download={`${hrUser.id}_${key}`}
                          className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* CURRENT LOGIN ACCESS STATUS */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isActive 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black">
                      Recruiter Login Status: {isActive ? 'ACTIVE & ENABLED 🟢' : 'SUSPENDED / BLOCKED 🔴'}
                    </h4>
                    <p className="text-xs opacity-80">
                      {isActive 
                        ? 'HR Recruiter can log in to initiate and audit candidate background verifications.' 
                        : 'Recruiter access is locked. User cannot sign in to the HR workstation.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  disabled={isTogglingStatus}
                  className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isActive ? '⛔ Suspend Access' : '✅ Enable Access'}
                </button>
              </div>

              {/* CHANGE PASSWORD */}
              <form onSubmit={handleUpdatePassword} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <KeyRound className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Reset HR Recruiter Login Password</h4>
                    <p className="text-xs text-slate-500 font-medium">Set a new permanent workstation password for {hrUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">HR Recruiter Email</label>
                    <input
                      type="text"
                      value={hrUser.email}
                      disabled
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 bg-slate-100 font-mono text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enter New Login Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="e.g. Recruiter@2026#"
                        className="w-full pl-3.5 pr-10 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={sendPasswordEmail}
                      onChange={(e) => setSendPasswordEmail(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-md border-slate-300"
                    />
                    <span>📧 Automatically email the new password to {hrUser.email}</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isUpdatingPassword || !newPassword}
                    className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUpdatingPassword ? 'Updating...' : '🔐 Update Password'}</span>
                  </button>
                </div>
              </form>

              {/* ACTIVATION DETAILS */}
              {hrUser.activation_token && (
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Self-Activation Security Details</div>
                    <div className="text-xs font-medium text-slate-700 mt-1">
                      Token: <code className="bg-indigo-100/70 text-indigo-800 px-1.5 py-0.5 rounded font-mono font-bold">{hrUser.activation_token}</code>
                      <span className="mx-2">•</span>
                      4-Digit PIN: <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-black">{hrUser.activation_password || '1234'}</code>
                    </div>
                  </div>

                  <a
                    href={`${window.location.origin}/hr-activation?token=${hrUser.activation_token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-bold bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open HR Activation Link</span>
                  </a>
                </div>
              )}

            </div>
          )}

          {/* TAB 8: DPDP & LEGAL */}
          {activeTab === 'legal' && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">HR Confidentiality & DPDP Act 2023 Audit</h4>
                  <p className="text-xs text-slate-500 font-medium">Digital compliance and data confidentiality acceptance record</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Agreement Version</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">HR-DPDP-v2.4-2026</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Acceptance Status</div>
                  <div className="text-sm font-black text-emerald-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Digitally Signed & Accepted
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Authorized Signatory</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{hrUser.name} ({formData.designation || hrUser.designation || 'HR Recruiter'})</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Timestamp of Acceptance</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                    {hrUser.terms_accepted_at ? new Date(hrUser.terms_accepted_at).toLocaleString('en-IN') : 'Completed during Onboarding'}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 📄 Adaptive Profile Dossier & PDF Modal */}
      {showDossierModal && (
        <EmployeeProfileDossierModal
          candidate={hrAsCandidate}
          companyName={hrUser.company_name || "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"}
          hrName="JOY SYSTEM ADMIN"
          onClose={() => setShowDossierModal(false)}
        />
      )}
    </div>
  ), document.body);
};
