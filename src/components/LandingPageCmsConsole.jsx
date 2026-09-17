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
  Check
} from 'lucide-react';
import { useApp, DEFAULT_LANDING_PAGE_CONTENT, POSTPAID_PLANS } from '../context/AppContext';

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

  const handleSave = (e) => {
    if (e) e.preventDefault();
    updateLandingPageContent(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the landing page content to platform defaults?')) {
      resetLandingPageContent();
      setFormData(DEFAULT_LANDING_PAGE_CONTENT);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const products = formData.products || DEFAULT_LANDING_PAGE_CONTENT.products;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" /> Super Admin CMS Console
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Landing Page & Product Ecosystem CMS
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Control hero messaging, JOY Group software products (including Joy People HR at joypeoplehr.com), contact channels, Google Maps embed, announcement alert, and postpaid pricing information. Synchronized directly with PostgreSQL.
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
            Homepage and ecosystem content saved to PostgreSQL database & broadcasted live!
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-700/80 space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Hero & Headlines
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" /> Products Suite (Joy People HR)
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Phone className="w-4 h-4" /> Contact & Google Map
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Postpaid Tiers (5 Plans)
        </button>

        <button
          onClick={() => setActiveTab('announcement')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'announcement'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Announcement Banner
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Statistics & Proof
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'preview'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Eye className="w-4 h-4" /> Live Preview
        </button>
      </div>

      {/* Main Form Content */}
      <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        
        {/* Tab 1: Hero Section */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Hero Header & Taglines
              </h3>
              <p className="text-slate-400 text-xs">Configure the primary headline, value proposition badge, and call-to-action buttons shown on first load.</p>
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
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
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
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
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
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
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
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
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
                    placeholder="Explore Features"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Software Products Suite */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> JOY Group Software Products Ecosystem
              </h3>
              <p className="text-slate-400 text-xs">
                Manage the ecosystem showcase section that replaced industrial activity. Prominently features <strong>Joy People HR (joypeoplehr.com)</strong> for complete HRMS, biometric attendance, and payroll processing.
              </p>
            </div>

            {/* Section Heading Controls */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Section Header Settings</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Section Badge</label>
                  <input
                    type="text"
                    name="productsSectionBadge"
                    value={formData.productsSectionBadge || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Section Title</label>
                  <input
                    type="text"
                    name="productsSectionTitle"
                    value={formData.productsSectionTitle || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    name="productsSectionSubtitle"
                    value={formData.productsSectionSubtitle || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Product 1: JOY PEOPLE HR */}
            <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">
                    Flagship HRMS Suite
                  </span>
                  <span className="text-sm font-bold text-white">JOY PEOPLE HR</span>
                </div>
                <a
                  href={products.joyPeopleHr?.url || 'https://joypeoplehr.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                >
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
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Tagline / Short Title</label>
                  <input
                    type="text"
                    value={products.joyPeopleHr?.tagline || ''}
                    onChange={(e) => handleProductChange('joyPeopleHr', 'tagline', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Redirect / Website URL</label>
                  <input
                    type="url"
                    value={products.joyPeopleHr?.url || ''}
                    onChange={(e) => handleProductChange('joyPeopleHr', 'url', e.target.value)}
                    placeholder="https://joypeoplehr.com"
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
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
                  Verification Engine
                </span>
                <span className="text-sm font-bold text-white">JOY TRUE PROFILE</span>
              </div>

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
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Description</label>
                  <textarea
                    rows="3"
                    value={products.joyTrueProfile?.description || ''}
                    onChange={(e) => handleProductChange('joyTrueProfile', 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Product 3: JOY CONTRACTOR & CLRA */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase">
                  Compliance Suite
                </span>
                <span className="text-sm font-bold text-white">JOY CONTRACTOR & CLRA</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={products.joyContractorClra?.name || ''}
                    onChange={(e) => handleProductChange('joyContractorClra', 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Tagline</label>
                  <input
                    type="text"
                    value={products.joyContractorClra?.tagline || ''}
                    onChange={(e) => handleProductChange('joyContractorClra', 'tagline', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Description</label>
                  <textarea
                    rows="2"
                    value={products.joyContractorClra?.description || ''}
                    onChange={(e) => handleProductChange('joyContractorClra', 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Product 4: JOY DIGITAL VAULT */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase">
                  DPDP Act 2023 Shield
                </span>
                <span className="text-sm font-bold text-white">JOY DIGITAL VAULT</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={products.joyDigitalVault?.name || ''}
                    onChange={(e) => handleProductChange('joyDigitalVault', 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Tagline</label>
                  <input
                    type="text"
                    value={products.joyDigitalVault?.tagline || ''}
                    onChange={(e) => handleProductChange('joyDigitalVault', 'tagline', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Description</label>
                  <textarea
                    rows="2"
                    value={products.joyDigitalVault?.description || ''}
                    onChange={(e) => handleProductChange('joyDigitalVault', 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contact & Google Maps */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" /> Communication Channels & Google Maps Mini Layout
              </h3>
              <p className="text-slate-400 text-xs">Update official emails, phone, WhatsApp lines, office address, and embed URL for the live interactive Google Maps widget.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official Corporate Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official Support Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    name="supportEmail"
                    value={formData.supportEmail || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Sales / Demo Request Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    name="salesEmail"
                    value={formData.salesEmail || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official WhatsApp Contact Number
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={formData.whatsappNumber || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Working Hours / Support Schedule
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    name="workingHours"
                    value={formData.workingHours || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Registered Office Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <textarea
                    name="officeAddress"
                    rows="2"
                    value={formData.officeAddress || ''}
                    onChange={handleChange}
                    placeholder="e.g. Coimbatore, Tamilnadu, India"
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Google Maps Location Link (External URL)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="url"
                    name="googleMapsUrl"
                    value={formData.googleMapsUrl || ''}
                    onChange={handleChange}
                    placeholder="https://maps.app.goo.gl/xK2B3J4VvC73oQwd8"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Google Maps Embed Iframe URL (Mini Layout)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="url"
                    name="googleMapsEmbedUrl"
                    value={formData.googleMapsEmbedUrl || ''}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/maps?q=Coimbatore,%20Tamil%20Nadu&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-xs"
                  />
                </div>
              </div>

              {/* Interactive Google Map Preview */}
              <div className="md:col-span-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                  🗺️ Google Map Mini Layout Preview
                </label>
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 h-56 relative shadow-inner">
                  {formData.googleMapsEmbedUrl ? (
                    <iframe
                      title="Google Map Mini Layout Preview"
                      src={formData.googleMapsEmbedUrl}
                      className="w-full h-full border-0"
                      allowFullScreen=""
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                      No Google Maps Embed URL provided
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Postpaid Pricing Tiers */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" /> Postpaid Pay-As-You-Verify Tier Architecture
              </h3>
              <p className="text-slate-400 text-xs">
                Review the 5 active Postpaid Quota Tiers with zero advance lock-in and automated month-end 18% GST billing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(POSTPAID_PLANS).map((plan) => (
                <div key={plan.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase text-indigo-400">{plan.shortName}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300">
                        Tier {plan.tierNumber}
                      </span>
                    </div>

                    <div className="text-2xl font-black text-white">
                      {plan.isCustom ? 'Custom' : `₹${plan.ratePerProfile}`}
                      <span className="text-xs font-normal text-slate-400 ml-1">/ verified profile</span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">{plan.description}</p>

                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                      <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-400" /> Quota: {plan.employeeThreshold}
                      </div>
                      <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> 100% Postpaid (Pay on-demand)
                      </div>
                      <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Vendor Profile Parity (1:1)
                      </div>
                      <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Automated GST Invoices
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500">
                    Overage Rate: {plan.isCustom ? 'Custom SLA' : `₹${plan.overageRate}/profile (Never blocked)`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Announcement Banner */}
        {activeTab === 'announcement' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-400" /> Announcement Bar & Alerts
              </h3>
              <p className="text-slate-400 text-xs">Configure the top ticker notification banner displayed at the very top of the landing page.</p>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Announcement Message Text
              </label>
              <textarea
                name="announcementText"
                rows="3"
                value={formData.announcementText || ''}
                onChange={handleChange}
                placeholder="e.g. 🚀 New: Automated Postpaid Billing with 18% GST Invoices is now live!"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* Tab 6: Statistics */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" /> Performance Metrics & Proof Counters
              </h3>
              <p className="text-slate-400 text-xs">Configure the statistics displayed in the trust and social proof sections of the website.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase text-indigo-400">Metric 1: Speed</span>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Value</label>
                  <input
                    type="text"
                    name="statSpeed"
                    value={formData.statSpeed || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Label</label>
                  <input
                    type="text"
                    name="statSpeedLabel"
                    value={formData.statSpeedLabel || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase text-emerald-400">Metric 2: Accuracy</span>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Value</label>
                  <input
                    type="text"
                    name="statAccuracy"
                    value={formData.statAccuracy || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Label</label>
                  <input
                    type="text"
                    name="statAccuracyLabel"
                    value={formData.statAccuracyLabel || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase text-amber-400">Metric 3: Clients</span>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Value</label>
                  <input
                    type="text"
                    name="statClients"
                    value={formData.statClients || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Label</label>
                  <input
                    type="text"
                    name="statClientsLabel"
                    value={formData.statClientsLabel || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase text-purple-400">Metric 4: Volume</span>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Value</label>
                  <input
                    type="text"
                    name="statProfiles"
                    value={formData.statProfiles || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Label</label>
                  <input
                    type="text"
                    name="statProfilesLabel"
                    value={formData.statProfilesLabel || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Live Preview */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" /> Live Landing Page Component Preview
              </h3>
              <p className="text-slate-400 text-xs">Preview how your configured content renders on the live home page.</p>
            </div>

            {/* Announcement Bar Preview */}
            {formData.showAnnouncement && (
              <div className="p-3 bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-indigo-900/60 border border-indigo-500/30 rounded-xl text-center text-xs font-medium text-indigo-200">
                {formData.announcementText}
              </div>
            )}

            {/* Hero Mockup */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> {formData.heroBadge}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
                {formData.heroTitle}
              </h1>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                {formData.heroSubtitle}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30">
                  {formData.ctaPrimaryText}
                </div>
                <div className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700">
                  {formData.ctaSecondaryText}
                </div>
              </div>
            </div>

            {/* Software Products Preview */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-indigo-400 tracking-wider">Product Ecosystem Preview</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{products.joyPeopleHr?.name || 'JOY PEOPLE HR'}</span>
                    <a href={products.joyPeopleHr?.url || 'https://joypeoplehr.com'} target="_blank" rel="noopener noreferrer" className="text-[11px] text-indigo-300 hover:underline flex items-center gap-1 font-semibold">
                      <span>joypeoplehr.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-indigo-200/80">{products.joyPeopleHr?.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{products.joyPeopleHr?.description}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{products.joyTrueProfile?.name || 'JOY TRUE PROFILE'}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">Verification Engine</span>
                  </div>
                  <p className="text-xs text-emerald-200/80">{products.joyTrueProfile?.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{products.joyTrueProfile?.description}</p>
                </div>
              </div>
            </div>

            {/* Stats Mockup */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xl font-extrabold text-indigo-400">{formData.statSpeed}</div>
                <div className="text-[11px] text-slate-400 mt-1">{formData.statSpeedLabel}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xl font-extrabold text-emerald-400">{formData.statAccuracy}</div>
                <div className="text-[11px] text-slate-400 mt-1">{formData.statAccuracyLabel}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xl font-extrabold text-amber-400">{formData.statClients}</div>
                <div className="text-[11px] text-slate-400 mt-1">{formData.statClientsLabel}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xl font-extrabold text-purple-400">{formData.statProfiles}</div>
                <div className="text-[11px] text-slate-400 mt-1">{formData.statProfilesLabel}</div>
              </div>
            </div>

            {/* Communication Info & Mini Map Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-white text-sm">{formData.companyName}</div>
                <div className="grid grid-cols-1 gap-1.5 text-slate-400">
                  <div>📧 Support: <span className="text-indigo-300">{formData.supportEmail}</span></div>
                  <div>📞 Phone: <span className="text-indigo-300">{formData.contactPhone}</span></div>
                  <div>💬 WhatsApp: <span className="text-emerald-300">{formData.whatsappNumber}</span></div>
                  <div>🕒 Hours: <span className="text-slate-300">{formData.workingHours}</span></div>
                  <div>📍 Address: <span className="text-slate-300">{formData.officeAddress}</span></div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-44 relative">
                {formData.googleMapsEmbedUrl ? (
                  <iframe
                    title="Google Map Mini Layout Preview"
                    src={formData.googleMapsEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                    No Google Maps Embed URL provided
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Save Bar at Bottom */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Changes are saved to PostgreSQL database & displayed live across the website.
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
