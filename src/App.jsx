import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { PortalLayout } from './components/PortalLayout';
import { SessionInactivityModal } from './components/SessionInactivityModal';
import { GuidedTourSpotlight } from './components/GuidedTourSpotlight';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlobalPlatformPreloader } from './components/GlobalPlatformPreloader';

// Resilient Lazy Loader with Automatic Chunk Reload & Cache-Busting Recovery
function lazyWithRetry(componentImport, chunkName = 'chunk') {
  return lazy(async () => {
    const isRetried = window.sessionStorage.getItem(`chunk_retry_${chunkName}`);

    try {
      const component = await componentImport();
      window.sessionStorage.removeItem(`chunk_retry_${chunkName}`);
      return component;
    } catch (error) {
      console.warn(`Dynamic chunk import failed for [${chunkName}]:`, error);

      if (!isRetried) {
        window.sessionStorage.setItem(`chunk_retry_${chunkName}`, 'true');

        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
          } catch (e) {
            console.warn('Failed clearing caches on chunk error:', e);
          }
        }

        window.location.reload();
        return new Promise(() => {}); // Keep Suspense active until reload completes
      }

      window.sessionStorage.removeItem(`chunk_retry_${chunkName}`);
      throw error;
    }
  });
}

// Statically import LandingPageView to prevent Suspense fallback flash on reload
import { LandingPageView } from './views/LandingPageView';

// Route-Level Code Splitting for Authenticated Portals
const LoginView = lazyWithRetry(() => import('./views/LoginView').then(m => ({ default: m.LoginView })), 'LoginView');
const SuperAdminView = lazyWithRetry(() => import('./views/SuperAdminView').then(m => ({ default: m.SuperAdminView })), 'SuperAdminView');
const CompanyAdminView = lazyWithRetry(() => import('./views/CompanyAdminView').then(m => ({ default: m.CompanyAdminView })), 'CompanyAdminView');
const HrExecutiveView = lazyWithRetry(() => import('./views/HrExecutiveView').then(m => ({ default: m.HrExecutiveView })), 'HrExecutiveView');
const EmployeePortalView = lazyWithRetry(() => import('./views/EmployeePortalView').then(m => ({ default: m.EmployeePortalView })), 'EmployeePortalView');
const CompanyActivationView = lazyWithRetry(() => import('./views/CompanyActivationView').then(m => ({ default: m.CompanyActivationView })), 'CompanyActivationView');
const HrActivationView = lazyWithRetry(() => import('./views/HrActivationView').then(m => ({ default: m.HrActivationView })), 'HrActivationView');

// Seamless Innovative Brand Loading Component for Suspense Fallback
const RouteLoadingSpinner = () => (
  <GlobalPlatformPreloader isFullScreen={true} autoDismissMs={2200} subtitleText="AUTHENTICATING SECURE PORTAL SESSION" />
);

// Global Route & Reload Cinematic Preloader Component (Triggers on initial load, page refresh F5, and long processes)
const GlobalPageReloadPreloader = () => {
  const location = useLocation();
  const [showPreloader, setShowPreloader] = useState(true);
  const [subtitle, setSubtitle] = useState('INSTANT WORKFORCE VERIFICATION');

  const getSubtitleForPath = (pathname) => {
    if (pathname.startsWith('/superadmin')) return 'AUTHENTICATING SUPERADMIN CONSOLE';
    if (pathname.startsWith('/company')) return 'AUTHENTICATING COMPANY PORTAL';
    if (pathname.startsWith('/hr')) return 'AUTHENTICATING HR WORKSTATION';
    if (pathname.startsWith('/verify') || pathname.startsWith('/candidate')) return 'INITIALIZING CANDIDATE VERIFICATION';
    if (pathname.startsWith('/login')) return 'SECURE SYSTEM PORTAL LOGIN';
    return 'INSTANT WORKFORCE VERIFICATION';
  };

  // Trigger full loading animation on route change, page refresh, or initial load
  useEffect(() => {
    setSubtitle(getSubtitleForPath(location.pathname));
    setShowPreloader(true);
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
      autoDismissMs={2200}
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
  return <LoginView initialRole="superadmin" />;
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
  return <LoginView initialRole="company" />;
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
  return <LoginView initialRole="hrexecutive" />;
};

// Wrapper for Candidate Verification Route (/verify or /candidate)
const CandidateRoute = () => {
  const { currentRole, currentUser, loginUser, setSelectedCandidateToken } = useApp();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Extract token from route param, query param, or path split
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pathToken = pathParts[pathParts.length - 1];
  const token = (pathToken && pathToken.startsWith('tok_')) ? pathToken : (searchParams.get('token') || 'tok_karan_903');

  useEffect(() => {
    if (token) {
      setSelectedCandidateToken(token);
    }
    if (token && (!currentUser || currentRole !== 'employee_link')) {
      loginUser('employee_link', { token });
    }
  }, [token, currentUser, currentRole, loginUser, setSelectedCandidateToken]);

  return (
    <PortalLayout>
      <EmployeePortalView />
    </PortalLayout>
  );
};

export const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <GlobalPageReloadPreloader />
          <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col justify-between overflow-x-hidden">
            <Suspense fallback={<RouteLoadingSpinner />}>
              <Routes>
                {/* 1. Public Marketing Landing Page */}
                <Route path="/" element={<LandingPageView />} />

                {/* 2. Single-Role Login Routes */}
                <Route path="/login" element={<LoginView />} />
                <Route path="/superadmin/login" element={<LoginView initialRole="superadmin" />} />
                <Route path="/company/login" element={<LoginView initialRole="company" />} />
                <Route path="/hr/login" element={<LoginView initialRole="hrexecutive" />} />

                {/* 3. Authenticated & Role-Gated Portal Dashboards with Hierarchical Slugs */}
                <Route path="/superadmin/*" element={<SuperAdminRoute />} />
                
                {/* Company Admin Routes */}
                <Route path="/:companySlug/company/admin/*" element={<CompanyRoute />} />
                <Route path="/:companySlug/company/*" element={<CompanyRoute />} />
                <Route path="/company/:companySlug/*" element={<CompanyRoute />} />
                <Route path="/company/*" element={<CompanyRoute />} />

                {/* HR Executive Routes (Domain/company-name/hr/hr-name/tab) */}
                <Route path="/:companySlug/hr/:hrSlug/*" element={<HrRoute />} />
                <Route path="/:companySlug/hr/*" element={<HrRoute />} />
                <Route path="/hr/:companySlug/:hrSlug/*" element={<HrRoute />} />
                <Route path="/hr/:companySlug/*" element={<HrRoute />} />
                <Route path="/hr/*" element={<HrRoute />} />

                {/* 4. Candidate Verification Magic Links */}
                <Route path="/:companySlug/verify/:token" element={<CandidateRoute />} />
                <Route path="/verify/:token" element={<CandidateRoute />} />
                <Route path="/verify" element={<CandidateRoute />} />
                <Route path="/candidate" element={<CandidateRoute />} />

                {/* 5. Onboarding & Activation Flows */}
                <Route path="/activate" element={<CompanyActivationView />} />
                <Route path="/activate-company" element={<CompanyActivationView />} />
                <Route path="/activate-hr" element={<HrActivationView />} />

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
