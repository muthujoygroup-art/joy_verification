import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Megaphone,
  BarChart3,
  Building2,
  Send,
  Zap,
  ShieldCheck,
  ExternalLink,
  CreditCard,
  Lock,
  HardHat,
  Users,
  Check,
  FileCheck,
  Scale,
  ListOrdered,
  HelpCircle,
  Briefcase,
  Star,
  Compass,
  Video,
  Play,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useApp, DEFAULT_LANDING_PAGE_CONTENT, POSTPAID_PLANS } from '../context/AppContext';
import { ReviewsModerationConsole } from './ReviewsModerationConsole';
import { getYouTubeEmbedUrl } from '../utils/youtubeHelper';

export const LandingPageCmsConsole = () => {
  const { landingPageContent, updateLandingPageContent, resetLandingPageContent, showToast } = useApp();

  const [formData, setFormData] = useState({
    ...DEFAULT_LANDING_PAGE_CONTENT,
    ...(landingPageContent || {})
  });

  const [activeTab, setActiveTab] = useState('hero');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (landingPageContent) {
      setFormData(prev => ({
        ...DEFAULT_LANDING_PAGE_CONTENT,
        ...landingPageContent,
        products: {
          ...DEFAULT_LANDING_PAGE_CONTENT.products,
          ...(landingPageContent.products || {})
        },
        featuresModules: {
          ...DEFAULT_LANDING_PAGE_CONTENT.featuresModules,
          ...(landingPageContent.featuresModules || {})
        }
      }));
    }
  }, [landingPageContent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaveSuccess(false);
  };

  const handleProductChange = (productKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      products: {
        ...prev.products,
        [productKey]: {
          ...(prev.products?.[productKey] || DEFAULT_LANDING_PAGE_CONTENT.products?.[productKey] || {}),
          [field]: value
        }
      }
    }));
    setSaveSuccess(false);
  };

  const handleFeatureModuleChange = (modKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      featuresModules: {
        ...prev.featuresModules,
        [modKey]: {
          ...(prev.featuresModules?.[modKey] || DEFAULT_LANDING_PAGE_CONTENT.featuresModules?.[modKey] || {}),
          [field]: value
        }
      }
    }));
    setSaveSuccess(false);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    updateLandingPageContent(formData);
    setSaveSuccess(true);
    if (showToast) showToast('✅ Landing page CMS content saved to database!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all CMS content to platform defaults?')) {
      resetLandingPageContent();
      setFormData(DEFAULT_LANDING_PAGE_CONTENT);
      setSaveSuccess(true);
      if (showToast) showToast('🔄 Reset all landing page content to factory defaults.');
    }
  };

  const handleTourModuleChange = (modId, field, value) => {
    setFormData(prev => {
      const currentSettings = prev.tourGuideSettings || DEFAULT_LANDING_PAGE_CONTENT.tourGuideSettings;
      const currentModules = currentSettings.modules || DEFAULT_LANDING_PAGE_CONTENT.tourGuideSettings.modules;
      const updatedModules = currentModules.map(m => m.id === modId ? { ...m, [field]: value } : m);
      return {
        ...prev,
        tourGuideSettings: {
          ...currentSettings,
          modules: updatedModules
        }
      };
    });
    setSaveSuccess(false);
  };

  const handleToggleTourGlobal = () => {
    setFormData(prev => {
      const currentSettings = prev.tourGuideSettings || DEFAULT_LANDING_PAGE_CONTENT.tourGuideSettings;
      return {
        ...prev,
        tourGuideSettings: {
          ...currentSettings,
          enabled: currentSettings.enabled === false ? true : false
        }
      };
    });
    setSaveSuccess(false);
  };

  const products = formData.products || DEFAULT_LANDING_PAGE_CONTENT.products;
  const featuresModules = formData.featuresModules || DEFAULT_LANDING_PAGE_CONTENT.featuresModules;

  return (
    <div className="space-y-6">
      
      {/* Header Banner - High Contrast Light Enterprise Theme */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 text-slate-900 rounded-3xl border-2 border-purple-200/80 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-200/60 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-purple-100 border border-purple-300 rounded-2xl text-purple-700 shadow-xs">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-black uppercase">
                  Comprehensive Landing Page CMS
                </span>
                <span className="text-xs text-slate-600 font-bold font-mono">11 Modular Sections</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
                Website & Multi-Page Content Controller
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleReset}
              className="btn bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs py-2.5 px-4 font-bold shadow-xs flex items-center gap-2 cursor-pointer rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2.5 px-5 font-black shadow-md flex items-center gap-2 cursor-pointer transition-all rounded-xl"
            >
              <Save className="w-4 h-4" /> Save to Database 💾
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed max-w-3xl">
          Edit all public pages: Home, Features, Solutions, What We Do, How It Works, Services, Pricing, Contact Us, Reviews, and Tour & Guide Videos.
        </p>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center gap-2 text-emerald-900 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            All section contents saved to PostgreSQL database and broadcasted live across all portals!
          </div>
        )}
      </div>

      {/* Tabs Navigation across all pages */}
      <div className="flex border-b border-slate-200 space-x-1 overflow-x-auto pb-1 bg-white p-2 rounded-2xl shadow-xs border border-slate-200">
        {[
          { id: 'hero', label: '1. Home / Hero', icon: Sparkles },
          { id: 'features', label: '2. Features', icon: Zap },
          { id: 'solutions', label: '3. Solutions (Joy HR)', icon: Layers },
          { id: 'what_we', label: '4. What We Do', icon: Briefcase },
          { id: 'how_it_works', label: '5. How It Works', icon: ListOrdered },
          { id: 'services', label: '6. Services', icon: ShieldCheck },
          { id: 'pricing', label: '7. Pricing', icon: CreditCard },
          { id: 'contact', label: '8. Contact & Map', icon: Phone },
          { id: 'announcement', label: '9. Banner & Stats', icon: Megaphone },
          { id: 'reviews', label: '10. Customer Reviews', icon: Star },
          { id: 'tour_guide', label: '11. Tour & Guide Videos 🎥', icon: Compass },
          { id: 'preview', label: 'Live Preview', icon: Eye }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Content Container */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        
        {/* Tab 1: Home / Hero Section */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Home Page & Hero Section</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Configure top hero headlines, value proposition badge, and primary buttons.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Hero Badge / Pill Tag
                </label>
                <input
                  type="text"
                  name="heroBadge"
                  value={formData.heroBadge || ''}
                  onChange={handleChange}
                  placeholder="e.g. Direct Registry Rails"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle || ''}
                  onChange={handleChange}
                  placeholder="e.g. Instant & Accurate Employee Background Verification"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-black text-sm focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Hero Subtitle / Description
                </label>
                <textarea
                  name="heroSubtitle"
                  rows="3"
                  value={formData.heroSubtitle || ''}
                  onChange={handleChange}
                  placeholder="Explain core benefits in simple, clear language..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="ctaPrimaryText"
                    value={formData.ctaPrimaryText || ''}
                    onChange={handleChange}
                    placeholder="Request a Free Demo 🚀"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="ctaSecondaryText"
                    value={formData.ctaSecondaryText || ''}
                    onChange={handleChange}
                    placeholder="How It Works 🧭"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Features Section */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <span>Features Page & 6 Core Capabilities</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Configure titles and descriptions for the 6 core platform capabilities.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-700 block">Features Section Header</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    name="featuresBadge"
                    value={formData.featuresBadge || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="featuresTitle"
                    value={formData.featuresTitle || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="featuresSubtitle"
                  value={formData.featuresSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>
            </div>

            {/* 6 Feature Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(featuresModules).map(modKey => {
                const mod = featuresModules[modKey];
                return (
                  <div key={modKey} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-black uppercase text-indigo-700 block">Module: {modKey}</span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={mod.title || ''}
                        onChange={(e) => handleFeatureModuleChange(modKey, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                      <textarea
                        rows="2"
                        value={mod.desc || ''}
                        onChange={(e) => handleFeatureModuleChange(modKey, 'desc', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Solutions (Joy HR) */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Solutions Page & Joy HR Module Descriptions</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Configure corporate solution pillars for Joy HR and enterprise HR teams.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Badge</label>
                <input
                  type="text"
                  name="solutionsBadge"
                  value={formData.solutionsBadge || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Title</label>
                <input
                  type="text"
                  name="solutionsTitle"
                  value={formData.solutionsTitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-black text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Subtitle</label>
                <textarea
                  name="solutionsSubtitle"
                  rows="2"
                  value={formData.solutionsSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: What We Do */}
        {activeTab === 'what_we' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>What We Do Section</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Configure corporate mission statements and core verification services.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Badge</label>
                <input
                  type="text"
                  name="whatWeDoBadge"
                  value={formData.whatWeDoBadge || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Title</label>
                <input
                  type="text"
                  name="whatWeDoTitle"
                  value={formData.whatWeDoTitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-black text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Subtitle</label>
                <textarea
                  name="whatWeDoSubtitle"
                  rows="2"
                  value={formData.whatWeDoSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: How It Works */}
        {activeTab === 'how_it_works' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-indigo-600" />
                <span>How It Works Section</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Configure the 4-step direct-registry onboarding timeline headers.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Badge</label>
                <input
                  type="text"
                  name="howItWorksBadge"
                  value={formData.howItWorksBadge || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Title</label>
                <input
                  type="text"
                  name="howItWorksTitle"
                  value={formData.howItWorksTitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-black text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Subtitle</label>
                <textarea
                  name="howItWorksSubtitle"
                  rows="2"
                  value={formData.howItWorksSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Services */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Services Page & Verification Catalog</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Configure verification catalog header and descriptions.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Badge</label>
                <input
                  type="text"
                  name="servicesBadge"
                  value={formData.servicesBadge || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Title</label>
                <input
                  type="text"
                  name="servicesTitle"
                  value={formData.servicesTitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-black text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Section Subtitle</label>
                <textarea
                  name="servicesSubtitle"
                  rows="2"
                  value={formData.servicesSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Pricing */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>Pricing Page & Credit Packages</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Configure pricing header, GST notes, and review active credit packages.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-700 block">Pricing Header</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    name="pricingBadge"
                    value={formData.pricingBadge || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="pricingTitle"
                    value={formData.pricingTitle || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="pricingSubtitle"
                  value={formData.pricingSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {POSTPAID_PLANS.map(plan => (
                <div key={plan.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-indigo text-[10px] font-bold">{plan.badge || plan.id}</span>
                    <span className="text-xs font-mono font-bold text-indigo-700">{plan.credits} Credits</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900">{plan.name}</h4>
                  <div className="text-xl font-black text-indigo-900">
                    ₹{plan.price.toLocaleString()}
                    <span className="text-xs font-normal text-slate-600 ml-1">/ profile</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{plan.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Contact & Map */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-600" />
                <span>Contact US Page & Google Maps Integration</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Update official emails, phone, WhatsApp lines, office address, and embed location link.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Official Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Official Support Phone *</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Official WhatsApp Business Line *</label>
                <input
                  type="text"
                  name="contactWhatsapp"
                  value={formData.contactWhatsapp || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Official Website URL *</label>
                <input
                  type="text"
                  name="contactWebsite"
                  value={formData.contactWebsite || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Registered Corporate Office Address *</label>
              <textarea
                name="contactAddress"
                rows="2"
                value={formData.contactAddress || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Google Maps Embed URL (iframe src) *</label>
                <input
                  type="text"
                  name="googleMapsEmbedUrl"
                  value={formData.googleMapsEmbedUrl || ''}
                  onChange={handleChange}
                  placeholder="https://www.google.com/maps/embed?..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Google Maps Direct View Link *</label>
                <input
                  type="text"
                  name="googleMapsDirectLink"
                  value={formData.googleMapsDirectLink || ''}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-mono"
                />
              </div>
            </div>

            {formData.googleMapsEmbedUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 h-48 relative shadow-inner">
                <iframe
                  title="Google Maps Location Preview"
                  src={formData.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 9: Announcement Banner & Stats */}
        {activeTab === 'announcement' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <span>Announcement Banner & Platform Metrics</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Configure top announcement bar and statistics counters.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-slate-900">Enable Announcement Banner</h4>
                <p className="text-xs text-slate-600 font-medium mt-0.5">Toggle top broadcast alert banner on or off.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="announcementEnabled"
                  checked={formData.announcementEnabled !== false}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Announcement Banner Text</label>
              <input
                type="text"
                name="announcementText"
                value={formData.announcementText || ''}
                onChange={handleChange}
                placeholder="⚡ Live DPDP Act 2023 Statutory Compliance Enabled..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
              />
            </div>

            {/* Platform Stats Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <label className="text-[11px] text-slate-700 font-bold block">Speed Value</label>
                <input
                  type="text"
                  name="statSpeedValue"
                  value={formData.statSpeedValue || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <label className="text-[11px] text-slate-700 font-bold block">Accuracy Value</label>
                <input
                  type="text"
                  name="statAccuracyValue"
                  value={formData.statAccuracyValue || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <label className="text-[11px] text-slate-700 font-bold block">Clients Value</label>
                <input
                  type="text"
                  name="statClientsValue"
                  value={formData.statClientsValue || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <label className="text-[11px] text-slate-700 font-bold block">Profiles Value</label>
                <input
                  type="text"
                  name="statProfilesValue"
                  value={formData.statProfilesValue || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 10: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span>Customer Reviews & Testimonials Console</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Moderate, feature, and enable/disable client reviews published on the homepage.</p>
            </div>
            <ReviewsModerationConsole />
          </div>
        )}

        {/* Tab 11: Tour & Guide Videos */}
        {activeTab === 'tour_guide' && (() => {
          const tourSettings = formData.tourGuideSettings || DEFAULT_LANDING_PAGE_CONTENT.tourGuideSettings;
          const isEnabled = tourSettings.enabled !== false;
          const modulesList = tourSettings.modules || DEFAULT_LANDING_PAGE_CONTENT.tourGuideSettings.modules;

          return (
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 border border-purple-300 rounded-2xl text-purple-700 shadow-xs">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">"Tour & Guide" Main Page Controller</h3>
                    <p className="text-xs text-slate-600 font-medium">Configure process video links, step-by-step guidance cards, data security awareness modules, and enable/disable responsiveness.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {isEnabled ? 'MODULE ACTIVE 🟢' : 'MODULE DISABLED 🔴'}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleTourGlobal}
                    className={`btn text-xs py-2 px-4 font-black shadow-xs flex items-center gap-1.5 cursor-pointer rounded-xl transition-all ${
                      isEnabled ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {isEnabled ? <ToggleRight className="w-5 h-5 text-white" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                    <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
                  </button>
                </div>
              </div>

              {/* Modules Video Editor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {modulesList.map((mod) => {
                  const embedUrl = getYouTubeEmbedUrl(mod.videoUrl);
                  return (
                    <div key={mod.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="badge badge-indigo text-[10px] font-black uppercase">{mod.categoryTag || 'PROCESS MODULE'}</span>
                        <span className="text-xs font-mono font-bold text-slate-700">#{mod.id}</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Module Title *</label>
                        <input
                          type="text"
                          value={mod.title || ''}
                          onChange={(e) => handleTourModuleChange(mod.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">YouTube Video URL *</label>
                        <input
                          type="text"
                          value={mod.videoUrl || ''}
                          onChange={(e) => handleTourModuleChange(mod.id, 'videoUrl', e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Process Explanation & Steps *</label>
                        <textarea
                          rows="2"
                          value={mod.desc || ''}
                          onChange={(e) => handleTourModuleChange(mod.id, 'desc', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-xs"
                        />
                      </div>

                      {/* YouTube Mini Window Player Preview */}
                      <div className="rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 h-44 relative shadow-sm">
                        {embedUrl ? (
                          <iframe
                            title={`Video player preview for ${mod.title}`}
                            src={embedUrl}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                            <Video className="w-8 h-8 text-slate-500 mb-1" />
                            <span>Enter a valid YouTube URL above to view mini window player preview</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Tab 12: Live Preview */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                <span>Live Public Page Preview</span>
              </h3>
              <p className="text-slate-600 text-xs font-medium">Preview all configured sections as they appear on the live website.</p>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold uppercase tracking-wider">
                  {formData.heroBadge}
                </span>
                <h1 className="text-2xl font-black text-white">{formData.heroTitle}</h1>
                <p className="text-xs text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">{formData.heroSubtitle}</p>
                <div className="pt-2 flex justify-center gap-3">
                  <span className="btn bg-indigo-600 text-white text-xs py-2 px-4 font-bold rounded-xl">{formData.ctaPrimaryText}</span>
                  <span className="btn bg-slate-800 text-slate-200 border border-slate-700 text-xs py-2 px-4 font-bold rounded-xl">{formData.ctaSecondaryText}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Footer Save Button */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-600 flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Instant sync across all public routes & user portals</span>
          </div>

          <button
            type="submit"
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2.5 px-6 font-black shadow-md rounded-xl cursor-pointer transition-all active:scale-98"
          >
            <span>Save to Database 💾</span>
          </button>
        </div>

      </form>
    </div>
  );
};
