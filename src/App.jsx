import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPageView } from './views/LandingPageView';
import { LoginView } from './views/LoginView';
import { SuperAdminView } from './views/SuperAdminView';
import { CompanyAdminView } from './views/CompanyAdminView';
import { HrExecutiveView } from './views/HrExecutiveView';
import { EmployeePortalView } from './views/EmployeePortalView';
import { SessionInactivityModal } from './components/SessionInactivityModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CheckCircle2 } from 'lucide-react';

// Wrapper for Super Admin Route (/superadmin)
const SuperAdminRoute = () => {
  const { currentRole, currentUser } = useApp();
  if (currentUser && currentRole === 'superadmin') {
    return (
      <div className="min-h-screen flex flex-col justify-between text-slate-900">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="min-h-screen flex flex-col justify-between text-slate-900">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="min-h-screen flex flex-col justify-between text-slate-900">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
  const { currentRole, currentUser, loginUser, candidates } = useApp();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'tok_sunita_412';

  useEffect(() => {
    // If token exists in URL and candidate not logged in, auto-login via magic token
    if (token && (!currentUser || currentRole !== 'employee_link')) {
      loginUser('employee_link', { token });
    }
  }, [token, currentUser, currentRole, loginUser]);

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-900">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmployeePortalView />
        </main>
      </div>
    </div>
  );
};

// Wrapper for Generic /login Route
const GenericLoginRoute = () => {
  const { currentRole, currentUser } = useApp();
  if (currentUser) {
    if (currentRole === 'superadmin') return <Navigate to="/superadmin" replace />;
    if (currentRole === 'company') return <Navigate to="/company" replace />;
    if (currentRole === 'hrexecutive') return <Navigate to="/hr" replace />;
    if (currentRole === 'employee_link') return <Navigate to="/verify" replace />;
  }
  return <LoginView initialRole="superadmin" />;
};

// Main Routing Container with Inactivity and Toast Modals
const MainApp = () => {
  const { 
    currentRole, 
    toastMessage, 
    showInactivityWarning, 
    inactivityCountdown, 
    refreshUserSession, 
    logoutUser 
  } = useApp();

  useEffect(() => {
    if (currentRole) {
      document.body.setAttribute('data-role', currentRole);
    } else {
      document.body.removeAttribute('data-role');
    }
  }, [currentRole]);

  return (
    <>
      <Routes>
        {/* Main Root URL: Public Enterprise Marketing & Services Homepage */}
        <Route path="/" element={<LandingPageView />} />

        {/* Dedicated Sub-Portal Direct URLs */}
        <Route path="/superadmin/*" element={<SuperAdminRoute />} />
        <Route path="/company/*" element={<CompanyRoute />} />
        <Route path="/hr/*" element={<HrRoute />} />
        <Route path="/verify" element={<CandidateRoute />} />
        <Route path="/candidate" element={<CandidateRoute />} />
        <Route path="/login" element={<GenericLoginRoute />} />

        {/* Catch-All Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Inactivity Warning Modal */}
      <SessionInactivityModal
        isOpen={showInactivityWarning}
        countdownSeconds={inactivityCountdown}
        onStayLoggedIn={refreshUserSession}
        onLogoutNow={logoutUser}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="glass-panel px-4 py-3 border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}
    </>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
