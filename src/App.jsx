import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SessionInactivityModal } from './components/SessionInactivityModal';
import { GuidedTourSpotlight } from './components/GuidedTourSpotlight';
import { InteractiveTourGuideModal } from './components/InteractiveTourGuideModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RefreshCw } from 'lucide-react';

// Route-Level Code Splitting & Security Chunk Isolation (Lazy Loading)
const LandingPageView = lazy(() => import('./views/LandingPageView').then(m => ({ default: m.LandingPageView })));
const LoginView = lazy(() => import('./views/LoginView').then(m => ({ default: m.LoginView })));
const SuperAdminView = lazy(() => import('./views/SuperAdminView').then(m => ({ default: m.SuperAdminView })));
const CompanyAdminView = lazy(() => import('./views/CompanyAdminView').then(m => ({ default: m.CompanyAdminView })));
const HrExecutiveView = lazy(() => import('./views/HrExecutiveView').then(m => ({ default: m.HrExecutiveView })));
const EmployeePortalView = lazy(() => import('./views/EmployeePortalView').then(m => ({ default: m.EmployeePortalView })));
const CompanyActivationView = lazy(() => import('./views/CompanyActivationView').then(m => ({ default: m.CompanyActivationView })));
const HrActivationView = lazy(() => import('./views/HrActivationView').then(m => ({ default: m.HrActivationView })));
const BlogView = lazy(() => import('./views/BlogView').then(m => ({ default: m.BlogView })));

// Loading Fallback Component
const RouteLoadingSpinner = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
    <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Loading Secure Workspace...</span>
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
          <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between overflow-x-hidden">
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
