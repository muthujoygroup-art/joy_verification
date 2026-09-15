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
  ShieldCheck
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
        ...landingPageContent
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" /> Live Homepage Content Management
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Landing Page CMS & Communication Control
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Edit hero headings, communication addresses, official support channels, top announcement alerts, and statistics. All updates synchronize instantly with the database.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all hover:text-white shadow-sm"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" /> Save to Database
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center gap-2 text-emerald-300 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            Homepage content saved in Database & broadcasted live!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/80 space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'hero'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Hero & Headlines
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'contact'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Phone className="w-4 h-4" /> Contact & Communication
        </button>

        <button
          onClick={() => setActiveTab('announcement')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'announcement'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Announcement Banner
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'stats'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-x border-slate-700 border-t-indigo-500 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Statistics & Metrics
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all shrink-0 ${
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
              <p className="text-slate-400 text-xs">Configure the primary headline and value proposition that candidates and companies see on first load.</p>
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
                  placeholder="e.g. AI-Powered Workforce Verification"
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

        {/* Tab 2: Contact & Communication */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" /> Communication & Corporate Details
              </h3>
              <p className="text-slate-400 text-xs">Update official communication emails, phone numbers, WhatsApp lines, and registered office addresses shown to clients.</p>
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
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Announcement Banner */}
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

        {/* Tab 4: Statistics */}
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

        {/* Tab 5: Live Preview */}
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

            {/* Communication Info Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-white text-sm">{formData.companyName}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-400">
                <div>📧 Support: <span className="text-indigo-300">{formData.supportEmail}</span></div>
                <div>📞 Phone: <span className="text-indigo-300">{formData.contactPhone}</span></div>
                <div>💬 WhatsApp: <span className="text-emerald-300">{formData.whatsappNumber}</span></div>
                <div>🕒 Hours: <span className="text-slate-300">{formData.workingHours}</span></div>
                <div className="md:col-span-2">📍 Address: <span className="text-slate-300">{formData.officeAddress}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Save Bar at Bottom */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Changes are saved to database and displayed in real-time.
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
};
