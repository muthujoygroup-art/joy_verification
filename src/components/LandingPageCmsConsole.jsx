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
  Star
} from 'lucide-react';
import { useApp, DEFAULT_LANDING_PAGE_CONTENT, POSTPAID_PLANS } from '../context/AppContext';
import { ReviewsModerationConsole } from './ReviewsModerationConsole';

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
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all landing page sections to platform defaults?')) {
      resetLandingPageContent();
      setFormData(DEFAULT_LANDING_PAGE_CONTENT);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const products = formData.products || DEFAULT_LANDING_PAGE_CONTENT.products;
  const featuresModules = formData.featuresModules || DEFAULT_LANDING_PAGE_CONTENT.featuresModules;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" /> Comprehensive Landing Page CMS
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Website & Multi-Page Content Controller
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Edit all public pages: Home, Features, Solutions, What We Do, How It Works, Services, Pricing, and Contact Us. Every update synchronizes instantly with the PostgreSQL database.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all hover:text-white shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save to Database
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center gap-2 text-emerald-300 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            All section contents saved to PostgreSQL database and broadcasted live!
          </div>
        )}
      </div>

      {/* Tabs Navigation across all pages */}
      <div className="flex border-b border-slate-700/80 space-x-1 overflow-x-auto pb-1">
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
          { id: 'preview', label: 'Live Preview', icon: Eye }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Content */}
      <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        
        {/* Tab 1: Home / Hero Section */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Home Page & Hero Section
              </h3>
              <p className="text-slate-400 text-xs">Configure the top hero headlines, value proposition badge, and primary buttons.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Hero Badge / Pill Tag
                </label>
                <input
                  type="text"
                  name="heroBadge"
                  value={formData.heroBadge || ''}
                  onChange={handleChange}
                  placeholder="e.g. Direct Registry Rails"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle || ''}
                  onChange={handleChange}
                  placeholder="e.g. Instant & Accurate Employee Background Verification"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Hero Subtitle / Description
                </label>
                <textarea
                  name="heroSubtitle"
                  rows="3"
                  value={formData.heroSubtitle || ''}
                  onChange={handleChange}
                  placeholder="Explain the core benefits in simple, clear language..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="ctaPrimaryText"
                    value={formData.ctaPrimaryText || ''}
                    onChange={handleChange}
                    placeholder="Request a Free Demo 🚀"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="ctaSecondaryText"
                    value={formData.ctaSecondaryText || ''}
                    onChange={handleChange}
                    placeholder="How It Works 🧭"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Features Section */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" /> Features Page & 6 Core Capabilities
              </h3>
              <p className="text-slate-400 text-xs">Configure the titles and descriptions for the 6 core platform capabilities.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Features Section Header</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Badge</label>
                  <input
                    type="text"
                    name="featuresBadge"
                    value={formData.featuresBadge || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    name="featuresTitle"
                    value={formData.featuresTitle || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Subtitle</label>
                  <input
                    type="text"
                    name="featuresSubtitle"
                    value={formData.featuresSubtitle || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 6 Feature Modules Customization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mod 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase text-indigo-400">1. Easy Verification</span>
                <input
                  type="text"
                  value={featuresModules.easyVerification?.title || ''}
                  onChange={(e) => handleFeatureModuleChange('easyVerification', 'title', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold"
                />
                <textarea
                  rows="2"
                  value={featuresModules.easyVerification?.description || ''}
                  onChange={(e) => handleFeatureModuleChange('easyVerification', 'description', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                />
              </div>

              {/* Mod 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase text-emerald-400">2. Complete BGV</span>
                <input
                  type="text"
                  value={featuresModules.completeBgv?.title || ''}
                  onChange={(e) => handleFeatureModuleChange('completeBgv', 'title', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold"
                />
                <textarea
                  rows="2"
                  value={featuresModules.completeBgv?.description || ''}
                  onChange={(e) => handleFeatureModuleChange('completeBgv', 'description', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                />
              </div>

              {/* Mod 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase text-purple-400">3. Neat HR Workstation</span>
                <input
                  type="text"
                  value={featuresModules.neatHr?.title || ''}
                  onChange={(e) => handleFeatureModuleChange('neatHr', 'title', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold"
                />
                <textarea
                  rows="2"
                  value={featuresModules.neatHr?.description || ''}
                  onChange={(e) => handleFeatureModuleChange('neatHr', 'description', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                />
              </div>

              {/* Mod 4 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase text-amber-400">4. CLRA Compliance</span>
                <input
                  type="text"
                  value={featuresModules.clraCompliance?.title || ''}
                  onChange={(e) => handleFeatureModuleChange('clraCompliance', 'title', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold"
                />
                <textarea
                  rows="2"
                  value={featuresModules.clraCompliance?.description || ''}
                  onChange={(e) => handleFeatureModuleChange('clraCompliance', 'description', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                />
              </div>

              {/* Mod 5 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase text-teal-400">5. Turnstile Gate Passes</span>
                <input
                  type="text"
                  value={featuresModules.turnstilePasses?.title || ''}
                  onChange={(e) => handleFeatureModuleChange('turnstilePasses', 'title', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold"
                />
                <textarea
                  rows="2"
                  value={featuresModules.turnstilePasses?.description || ''}
                  onChange={(e) => handleFeatureModuleChange('turnstilePasses', 'description', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                />
              </div>

              {/* Mod 6 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase text-rose-400">6. Postpaid Billing</span>
                <input
                  type="text"
                  value={featuresModules.postpaidBilling?.title || ''}
                  onChange={(e) => handleFeatureModuleChange('postpaidBilling', 'title', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold"
                />
                <textarea
                  rows="2"
                  value={featuresModules.postpaidBilling?.description || ''}
                  onChange={(e) => handleFeatureModuleChange('postpaidBilling', 'description', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Solutions & JOY Group Software Suite */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> Solutions & JOY Group Software Ecosystem
              </h3>
              <p className="text-slate-400 text-xs">Manage the software suite cards prominently featuring <strong>Joy People HR (joypeoplehr.com)</strong>.</p>
            </div>

            {/* Product 1: JOY PEOPLE HR */}
            <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">
                  Flagship HRMS Suite
                </span>
                <a href={products.joyPeopleHr?.url || 'https://joypeoplehr.com'} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
                  <span>{products.joyPeopleHr?.url || 'https://joypeoplehr.com'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={products.joyPeopleHr?.name || ''}
                    onChange={(e) => handleProductChange('joyPeopleHr', 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Tagline</label>
                  <input
                    type="text"
                    value={products.joyPeopleHr?.tagline || ''}
                    onChange={(e) => handleProductChange('joyPeopleHr', 'tagline', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={products.joyPeopleHr?.url || ''}
                    onChange={(e) => handleProductChange('joyPeopleHr', 'url', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-indigo-300 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={products.joyPeopleHr?.badge || ''}
                    onChange={(e) => handleProductChange('joyPeopleHr', 'badge', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Description</label>
                  <textarea
                    rows="3"
                    value={products.joyPeopleHr?.description || ''}
                    onChange={(e) => handleProductChange('joyPeopleHr', 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Product 2: JOY TRUE PROFILE */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
                Verification Engine
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={products.joyTrueProfile?.name || ''}
                    onChange={(e) => handleProductChange('joyTrueProfile', 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Tagline</label>
                  <input
                    type="text"
                    value={products.joyTrueProfile?.tagline || ''}
                    onChange={(e) => handleProductChange('joyTrueProfile', 'tagline', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                  <textarea
                    rows="2"
                    value={products.joyTrueProfile?.description || ''}
                    onChange={(e) => handleProductChange('joyTrueProfile', 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: What We Do */}
        {activeTab === 'what_we' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> What We Do Section
              </h3>
              <p className="text-slate-400 text-xs">Configure the mission statement and core value pillars.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Section Badge</label>
                <input
                  type="text"
                  name="whatWeBadge"
                  value={formData.whatWeBadge || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Section Title</label>
                <input
                  type="text"
                  name="whatWeTitle"
                  value={formData.whatWeTitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Section Subtitle</label>
                <textarea
                  name="whatWeSubtitle"
                  rows="3"
                  value={formData.whatWeSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: How It Works */}
        {activeTab === 'how_it_works' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-indigo-400" /> How It Works Section
              </h3>
              <p className="text-slate-400 text-xs">Configure the 4-step direct-registry onboarding timeline headers.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Section Badge</label>
                <input
                  type="text"
                  name="howItWorksBadge"
                  value={formData.howItWorksBadge || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Section Title</label>
                <input
                  type="text"
                  name="howItWorksTitle"
                  value={formData.howItWorksTitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Section Subtitle</label>
                <textarea
                  name="howItWorksSubtitle"
                  rows="3"
                  value={formData.howItWorksSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Services Catalog */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Services Page Section
              </h3>
              <p className="text-slate-400 text-xs">Configure the verification catalog header and descriptions.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Section Badge</label>
                <input
                  type="text"
                  name="servicesBadge"
                  value={formData.servicesBadge || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Section Title</label>
                <input
                  type="text"
                  name="servicesTitle"
                  value={formData.servicesTitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Section Subtitle</label>
                <textarea
                  name="servicesSubtitle"
                  rows="3"
                  value={formData.servicesSubtitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Pricing & Postpaid Plans */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" /> Pricing Page & Postpaid Tiers
              </h3>
              <p className="text-slate-400 text-xs">Configure the pricing page header, GST notes, and review the 5 active Postpaid Quota Tiers.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Pricing Section Header</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Badge</label>
                  <input
                    type="text"
                    name="pricingBadge"
                    value={formData.pricingBadge || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    name="pricingTitle"
                    value={formData.pricingTitle || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Subtitle</label>
                  <input
                    type="text"
                    name="pricingSubtitle"
                    value={formData.pricingSubtitle || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 5 Postpaid Tiers Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(POSTPAID_PLANS).map((plan) => (
                <div key={plan.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">{plan.shortName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700 text-indigo-300">
                      Tier {plan.tierNumber}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {plan.isCustom ? 'Custom' : `₹${plan.ratePerProfile}`}
                    <span className="text-[11px] font-normal text-slate-400 ml-1">/ profile</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{plan.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Contact & Google Maps */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" /> Contact Channels & Google Maps Embed
              </h3>
              <p className="text-slate-400 text-xs">Update official emails, phone, WhatsApp lines, office address, and embed URL for the live Google Maps iframe.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Official Corporate Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Official Support Email</label>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Official Phone Number</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Official WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Registered Office Address</label>
                <input
                  type="text"
                  name="officeAddress"
                  value={formData.officeAddress || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Google Maps App Link (URL)</label>
                <input
                  type="url"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Google Maps Embed Iframe URL</label>
                <input
                  type="url"
                  name="googleMapsEmbedUrl"
                  value={formData.googleMapsEmbedUrl || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>

              {/* Map Preview */}
              <div className="md:col-span-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">Google Map Live Embed</label>
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 h-48 relative">
                  {formData.googleMapsEmbedUrl && (
                    <iframe
                      title="Google Maps Preview"
                      src={formData.googleMapsEmbedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Announcement Banner & Stats */}
        {activeTab === 'announcement' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-400" /> Announcement Bar & Metrics
              </h3>
              <p className="text-slate-400 text-xs">Configure the top announcement bar and statistics counters.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Enable Announcement Banner</h4>
                <p className="text-xs text-slate-400 mt-0.5">Toggle the top broadcast alert banner on or off.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="showAnnouncement"
                  checked={!!formData.showAnnouncement}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Announcement Text</label>
              <textarea
                name="announcementText"
                rows="2"
                value={formData.announcementText || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Speed Value</label>
                <input
                  type="text"
                  name="statSpeed"
                  value={formData.statSpeed || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Accuracy Value</label>
                <input
                  type="text"
                  name="statAccuracy"
                  value={formData.statAccuracy || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Clients Value</label>
                <input
                  type="text"
                  name="statClients"
                  value={formData.statClients || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Profiles Value</label>
                <input
                  type="text"
                  name="statProfiles"
                  value={formData.statProfiles || ''}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 10: Live Preview */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" /> Live Multi-Section Preview
              </h3>
              <p className="text-slate-400 text-xs">Preview all configured sections as they appear on the live website.</p>
            </div>

            {formData.showAnnouncement && (
              <div className="p-3 bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-indigo-900/60 border border-indigo-500/30 rounded-xl text-center text-xs font-medium text-indigo-200">
                {formData.announcementText}
              </div>
            )}

            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> {formData.heroBadge}
              </div>
              <h1 className="text-2xl font-bold text-white">{formData.heroTitle}</h1>
              <p className="text-xs text-slate-300 max-w-xl mx-auto">{formData.heroSubtitle}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-lg font-bold text-indigo-400">{formData.statSpeed}</div>
                <div className="text-[10px] text-slate-400">{formData.statSpeedLabel}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-lg font-bold text-emerald-400">{formData.statAccuracy}</div>
                <div className="text-[10px] text-slate-400">{formData.statAccuracyLabel}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-lg font-bold text-amber-400">{formData.statClients}</div>
                <div className="text-[10px] text-slate-400">{formData.statClientsLabel}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-lg font-bold text-purple-400">{formData.statProfiles}</div>
                <div className="text-[10px] text-slate-400">{formData.statProfilesLabel}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 10: Customer Reviews & Moderation */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <ReviewsModerationConsole />
          </div>
        )}

        {/* Save Bar at Bottom */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Synchronized directly with PostgreSQL database.
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
};
