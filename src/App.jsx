import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { PortalLayout } from './components/PortalLayout';
import { SessionInactivityModal } from './components/SessionInactivityModal';
import { GuidedTourSpotlight } from './components/GuidedTourSpotlight';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlobalPlatformPreloader } from './components/GlobalPlatformPreloader';

// Statically import all views for instantaneous zero-latency access and complete resilience against chunk mismatch
import { LandingPageView } from './views/LandingPageView';
import { LoginView } from './views/LoginView';
import { PublicPagesView } from './views/PublicPagesView';
import { SuperAdminView } from './views/SuperAdminView';
import { CompanyAdminView } from './views/CompanyAdminView';
import { HrExecutiveView } from './views/HrExecutiveView';
import { EmployeePortalView } from './views/EmployeePortalView';
import { VendorPortalView } from './views/VendorPortalView';
import { CompanyActivationView } from './views/CompanyActivationView';
import { HrActivationView } from './views/HrActivationView';

// Authentic Brand Loading Animation for Suspense Fallback
const RouteLoadingSpinner = () => (
  <GlobalPlatformPreloader 
    isFullScreen={true}
    autoDismissMs={1200}
    subtitleText="AUTHENTICATING SECURE SESSION"
  />
);

// Global Route & Action Cinematic Preloader (Matches main landing page branding across all pages)
const GlobalPageReloadPreloader = () => {
  const location = useLocation();
  const [showPreloader, setShowPreloader] = useState(false);
  const [subtitle, setSubtitle] = useState('INSTANT WORKFORCE VERIFICATION');
  const prevPortalRootRef = React.useRef(null);

  const getPortalRoot = (pathname) => {
    const p = (pathname || '').toLowerCase();
    if (p.startsWith('/superadmin')) return 'superadmin';
    if (p.includes('/company') || p.startsWith('/company')) return 'company';
    if (p.includes('/hr') || p.startsWith('/hr')) return 'hr';
    if (p.includes('/vendor') || p.startsWith('/vendor')) return 'vendor';
    if (p.startsWith('/verify') || p.startsWith('/candidate') || p.startsWith('/employee') || p.includes('/verify') || p.includes('/candidate')) return 'candidate';
    if (p.startsWith('/login')) return 'login';
    if (p.includes('activate')) return 'activate';
    return p;
  };

  const getSubtitleForPath = (pathname) => {
    const p = (pathname || '').toLowerCase();
    if (p.startsWith('/superadmin')) return 'AUTHENTICATING SUPERADMIN CONSOLE';
    if (p.includes('/company') || p.startsWith('/company')) return 'AUTHENTICATING COMPANY PORTAL';
    if (p.includes('/hr') || p.startsWith('/hr')) return 'AUTHENTICATING HR WORKSTATION';
    if (p.includes('/vendor') || p.startsWith('/vendor')) return 'AUTHENTICATING B2B VENDOR VERIFICATION';
    if (p.startsWith('/verify') || p.startsWith('/candidate') || p.startsWith('/employee') || p.includes('/verify') || p.includes('/candidate')) return 'INITIALIZING CANDIDATE VERIFICATION';
    if (p.startsWith('/login')) return 'SECURE SYSTEM PORTAL LOGIN';
    if (p.includes('activate')) return 'VERIFYING ONBOARDING ACTIVATION';
    if (p.startsWith('/features')) return 'EXPLORING PLATFORM CAPABILITIES';
    if (p.startsWith('/solutions')) return 'ENTERPRISE VERIFICATION SOLUTIONS';
    if (p.startsWith('/how-it-works')) return 'INSTANT VERIFICATION WORKFLOWS';
    if (p.startsWith('/pricing')) return 'TRANSPARENT POSTPAID BILLING';
    if (p.startsWith('/contact')) return 'CONNECT WITH JOY VERIFICATION';
    if (p.startsWith('/about')) return 'ABOUT JOY CORPORATE SOLUTIONS';
    return 'INSTANT WORKFORCE VERIFICATION';
  };

  // Trigger full loading animation on initial page load / reload or major portal transition
  useEffect(() => {
    if (location.pathname === '/') {
      setShowPreloader(false);
      prevPortalRootRef.current = '/';
      return;
    }
    const currentRoot = getPortalRoot(location.pathname);
    if (prevPortalRootRef.current !== currentRoot) {
      prevPortalRootRef.current = currentRoot;
      setSubtitle(getSubtitleForPath(location.pathname));
      setShowPreloader(true);
    }
  }, [location.pathname]);

  // Listen to custom window events for long-running processes / manual triggers
  useEffect(() => {
    const handleTriggerAnimation = (e) => {
      const { subtitle: customSub } = e.detail || {};
      if (customSub) setSubtitle(customSub);
      setShowPreloader(true);
    };

    window.addEventListener('trigger_full_loading_animation', handleTriggerAnimation);
    return () => window.removeEventListener('trigger_full_loading_animation', handleTriggerAnimation);
  }, []);

  if (!showPreloader) return null;

  return (
    <GlobalPlatformPreloader
      onFinish={() => setShowPreloader(false)}
      subtitleText={subtitle}
      isFullScreen={true}
      autoDismissMs={1100}
    />
  );
};

// Wrapper for Super Admin Route (/superadmin)
const SuperAdminRoute = () => {
  const { currentRole, currentUser } = useApp();
  if (currentUser && currentRole === 'superadmin') {
    return (
      <PortalLayout>
        <SuperAdminView />
      </PortalLayout>
    );
  }
  return <LoginView initialRole="superadmin" lockRole={true} />;
};

// Wrapper for Company Admin Route (/company)
const CompanyRoute = () => {
  const { currentRole, currentUser } = useApp();
  if (currentUser && currentRole === 'company') {
    return (
      <PortalLayout>
        <CompanyAdminView />
      </PortalLayout>
    );
  }
  return <LoginView initialRole="company" lockRole={true} />;
};

// Wrapper for HR Executive Route (/hr)
const HrRoute = () => {
  const { currentRole, currentUser } = useApp();
  if (currentUser && currentRole === 'hrexecutive') {
    return (
      <PortalLayout>
        <HrExecutiveView />
      </PortalLayout>
    );
  }
  return <LoginView initialRole="hrexecutive" lockRole={true} />;
};

// Wrapper for Candidate Verification Route (/verify, /employee, or /candidate)
const CandidateRoute = () => {
  const { setSelectedCandidateToken } = useApp();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Extract token from route param, query param, or path split
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  const reservedWords = ['verify', 'candidate', 'employee', 'onboarding', 'verification'];
  const isPathToken = lastPart && !reservedWords.includes(lastPart.toLowerCase());
  const token = searchParams.get('token') || searchParams.get('t') || searchParams.get('id') || (isPathToken ? lastPart : null) || '';

  useEffect(() => {
    if (token) {
      setSelectedCandidateToken(token);
    }
  }, [token, setSelectedCandidateToken]);

  return (
    <ErrorBoundary>
      <PortalLayout isCandidatePortal={true}>
        <EmployeePortalView directToken={token} />
      </PortalLayout>
    </ErrorBoundary>
  );
};

// Wrapper for Vendor Verification Self-Service Route (/vendor, /:companySlug/vendor, etc.)
const VendorRoute = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Extract token from route param, query param, or path split
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  const reservedWords = ['vendor', 'verify', 'onboarding', 'b2b', 'verification'];
  const isPathToken = lastPart && !reservedWords.includes(lastPart.toLowerCase());
  const token = searchParams.get('token') || searchParams.get('t') || searchParams.get('id') || (isPathToken ? lastPart : null) || 'vend-1';

  return (
    <PortalLayout isCandidatePortal={true}>
      <VendorPortalView directToken={token} />
    </PortalLayout>
  );
};

export const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <GlobalPageReloadPreloader />
          <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between overflow-x-hidden">
            <Suspense fallback={<RouteLoadingSpinner />}>
              <Routes>
                {/* 1. Public Marketing Landing Page & Specialized Public Pages */}
                <Route path="/" element={<LandingPageView />} />
                <Route path="/features" element={<PublicPagesView initialPage="features" />} />
                <Route path="/solutions" element={<PublicPagesView initialPage="solutions" />} />
                <Route path="/services" element={<PublicPagesView initialPage="services" />} />
                <Route path="/how-it-works" element={<PublicPagesView initialPage="how-it-works" />} />
                <Route path="/about" element={<PublicPagesView initialPage="about" />} />
                <Route path="/contact" element={<PublicPagesView initialPage="contact" />} />
                <Route path="/resources" element={<PublicPagesView initialPage="resources" />} />
                <Route path="/faq" element={<PublicPagesView initialPage="faq" />} />
                <Route path="/pricing" element={<PublicPagesView initialPage="pricing" />} />
                <Route path="/privacy-policy" element={<PublicPagesView initialPage="privacy-policy" />} />
                <Route path="/privacy" element={<PublicPagesView initialPage="privacy-policy" />} />
                <Route path="/terms-and-conditions" element={<PublicPagesView initialPage="terms-and-conditions" />} />
                <Route path="/terms" element={<PublicPagesView initialPage="terms-and-conditions" />} />

                {/* 2. Single-Role Dedicated Login Routes */}
                <Route path="/login" element={<LoginView />} />
                <Route path="/superadmin/login" element={<LoginView initialRole="superadmin" lockRole={true} />} />
                <Route path="/company/login" element={<LoginView initialRole="company" lockRole={true} />} />
                <Route path="/hr/login" element={<LoginView initialRole="hrexecutive" lockRole={true} />} />
                <Route path="/candidate/login" element={<LoginView initialRole="employee_link" lockRole={true} />} />

                {/* 3. Authenticated & Role-Gated Portal Dashboards with Hierarchical Slugs */}
                <Route path="/superadmin/*" element={<SuperAdminRoute />} />
                <Route path="/superadmin" element={<SuperAdminRoute />} />
                
                {/* Company Admin Routes */}
                <Route path="/:companySlug/company/admin/*" element={<CompanyRoute />} />
                <Route path="/:companySlug/company/admin" element={<CompanyRoute />} />
                <Route path="/:companySlug/company/*" element={<CompanyRoute />} />
                <Route path="/:companySlug/company" element={<CompanyRoute />} />
                <Route path="/company/:companySlug/*" element={<CompanyRoute />} />
                <Route path="/company/:companySlug" element={<CompanyRoute />} />
                <Route path="/company/*" element={<CompanyRoute />} />
                <Route path="/company" element={<CompanyRoute />} />

                {/* HR Executive Routes (Domain/company-name/hr/hr-name/tab) */}
                <Route path="/:companySlug/hr/:hrSlug/*" element={<HrRoute />} />
                <Route path="/:companySlug/hr/:hrSlug" element={<HrRoute />} />
                <Route path="/:companySlug/hr/*" element={<HrRoute />} />
                <Route path="/:companySlug/hr" element={<HrRoute />} />
                <Route path="/hr/:companySlug/:hrSlug/*" element={<HrRoute />} />
                <Route path="/hr/:companySlug/:hrSlug" element={<HrRoute />} />
                <Route path="/hr/:companySlug/*" element={<HrRoute />} />
                <Route path="/hr/:companySlug" element={<HrRoute />} />
                <Route path="/hr/*" element={<HrRoute />} />
                <Route path="/hr" element={<HrRoute />} />

                {/* 4. Candidate & Employee Verification Magic Links */}
                <Route path="/:companySlug/verify/:token" element={<CandidateRoute />} />
                <Route path="/verify/:token" element={<CandidateRoute />} />
                <Route path="/verify" element={<CandidateRoute />} />
                <Route path="/:companySlug/employee/:token" element={<CandidateRoute />} />
                <Route path="/employee/:token" element={<CandidateRoute />} />
                <Route path="/employee" element={<CandidateRoute />} />
                <Route path="/:companySlug/candidate/:token" element={<CandidateRoute />} />
                <Route path="/candidate/:token" element={<CandidateRoute />} />
                <Route path="/candidate" element={<CandidateRoute />} />

                {/* 5. Enterprise Vendor Statutory Verification Magic Links & Self-Service Portal */}
                <Route path="/:companySlug/vendor/:token" element={<VendorRoute />} />
                <Route path="/:companySlug/vendor" element={<VendorRoute />} />
                <Route path="/vendor/verify/:token" element={<VendorRoute />} />
                <Route path="/vendor/verify" element={<VendorRoute />} />
                <Route path="/vendor/:token" element={<VendorRoute />} />
                <Route path="/vendor" element={<VendorRoute />} />

                {/* 6. Onboarding & Activation Flows */}
                <Route path="/activate" element={<CompanyActivationView />} />
                <Route path="/activate-company" element={<CompanyActivationView />} />
                <Route path="/company-activation" element={<CompanyActivationView />} />
                <Route path="/company-activation/*" element={<CompanyActivationView />} />
                <Route path="/company/activate" element={<CompanyActivationView />} />
                <Route path="/activate-hr" element={<HrActivationView />} />
                <Route path="/hr-activation" element={<HrActivationView />} />
                <Route path="/hr-activation/*" element={<HrActivationView />} />

                {/* 6. Fallback Wildcard Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>

            {/* Global Security & Inactivity Session Shield */}
            <SessionInactivityModal />

            {/* Guided Tour Spotlight */}
            <GuidedTourSpotlight />
          </div>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
