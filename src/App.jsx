import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SessionInactivityModal } from './components/SessionInactivityModal';
import { GuidedTourSpotlight } from './components/GuidedTourSpotlight';
import { InteractiveTourGuideModal } from './components/InteractiveTourGuideModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RefreshCw } from 'lucide-react';

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

      // If this is the first failure in current session, clear caches and reload
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

      // If already retried and failed again, bubble to ErrorBoundary
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
const BlogView = lazyWithRetry(() => import('./views/BlogView').then(m => ({ default: m.BlogView })), 'BlogView');

// Seamless Dark Loading Fallback Component (No white flash)
const RouteLoadingSpinner = () => (
  <div className="fixed inset-0 bg-[#07090e] flex flex-col items-center justify-center z-50">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500/40 border-t-amber-400 animate-spin"></div>
  </div>
);

// Wrapper for Super Admin Route (/superadmin)
const SuperAdminRoute = () => {
  const { currentRole, currentUser } = useApp();
  if (currentUser && currentRole === 'superadmin') {
    return (
      <div className="min-h-screen flex flex-col justify-between text-slate-900 overflow-x-hidden">
        <div>
          <Navbar />
          <main className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 w-full overflow-x-hidden pb-32 sm:pb-12">
            <SuperAdminView />
          </main>
        </div>
      </div>
    );
  }
  return <LoginView initialRole="superadmin" />;
};

// Wrapper for Company Admin Route (/company)
const CompanyRoute = () => {
  const { currentRole, currentUser } = useApp();
  if (currentUser && currentRole === 'company') {
    return (
      <div className="min-h-screen flex flex-col justify-between text-slate-900 overflow-x-hidden">
        <div>
          <Navbar />
          <main className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 w-full overflow-x-hidden pb-32 sm:pb-12">
            <CompanyAdminView />
          </main>
        </div>
      </div>
    );
  }
  return <LoginView initialRole="company" />;
};

// Wrapper for HR Executive Route (/hr)
const HrRoute = () => {
  const { currentRole, currentUser } = useApp();
  if (currentUser && currentRole === 'hrexecutive') {
    return (
      <div className="min-h-screen flex flex-col justify-between text-slate-900 overflow-x-hidden">
        <div>
          <Navbar />
          <main className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 w-full overflow-x-hidden pb-32 sm:pb-12">
            <HrExecutiveView />
          </main>
        </div>
      </div>
    );
  }
  return <LoginView initialRole="hrexecutive" />;
};

// Wrapper for Candidate Verification Route (/verify or /candidate)
const CandidateRoute = () => {
  const { currentRole, currentUser, loginUser, setSelectedCandidateToken, candidates } = useApp();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'tok_karan_903';

  useEffect(() => {
    if (token) {
      setSelectedCandidateToken(token);
    }
    if (token && (!currentUser || currentRole !== 'employee_link')) {
      loginUser('employee_link', { token });
    }
  }, [token, currentUser, currentRole, loginUser, setSelectedCandidateToken]);

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-900 overflow-x-hidden">
      <div>
        <Navbar />
        <main className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 w-full overflow-x-hidden pb-32 sm:pb-12">
          <EmployeePortalView />
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between overflow-x-hidden">
            <Suspense fallback={<RouteLoadingSpinner />}>
              <Routes>
                {/* 1. Public Marketing Landing Page (No Portal URLs Leaked) */}
                <Route path="/" element={<LandingPageView />} />

                {/* 2. Public Knowledge Hub / Blog */}
                <Route path="/blog" element={<BlogView />} />

                {/* 3. Role-Based Login Workstations */}
                <Route path="/login" element={<LoginView />} />
                <Route path="/superadmin/login" element={<LoginView initialRole="superadmin" />} />
                <Route path="/company/login" element={<LoginView initialRole="company" />} />
                <Route path="/hr/login" element={<LoginView initialRole="hrexecutive" />} />

                {/* 4. Authenticated & Role-Gated Portal Dashboards */}
                <Route path="/superadmin/*" element={<SuperAdminRoute />} />
                <Route path="/company/*" element={<CompanyRoute />} />
                <Route path="/hr/*" element={<HrRoute />} />

                {/* 5. Mobile Candidate Verification Magic Links */}
                <Route path="/verify" element={<CandidateRoute />} />
                <Route path="/candidate" element={<CandidateRoute />} />

                {/* 6. Onboarding & Activation Flows */}
                <Route path="/activate" element={<CompanyActivationView />} />
                <Route path="/activate-company" element={<CompanyActivationView />} />
                <Route path="/activate-hr" element={<HrActivationView />} />

                {/* 7. Fallback Wildcard Redirect */}
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
