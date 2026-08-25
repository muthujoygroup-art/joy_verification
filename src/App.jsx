import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './views/LoginView';
import { SuperAdminView } from './views/SuperAdminView';
import { CompanyAdminView } from './views/CompanyAdminView';
import { HrExecutiveView } from './views/HrExecutiveView';
import { EmployeePortalView } from './views/EmployeePortalView';
import { SessionInactivityModal } from './components/SessionInactivityModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const MainContent = () => {
  const appContext = useApp() || {};
  const { 
    currentRole, 
    currentUser, 
    toastMessage, 
    showInactivityWarning, 
    inactivityCountdown, 
    refreshUserSession, 
    logoutUser 
  } = appContext;

  useEffect(() => {
    if (currentRole) {
      document.body.setAttribute('data-role', currentRole);
    } else {
      document.body.removeAttribute('data-role');
    }
  }, [currentRole]);

  // If user is not logged in, render Login View
  if (!currentUser || !currentRole) {
    return (
      <>
        <LoginView />
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
  }

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-900">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentRole === 'superadmin' && <SuperAdminView />}
          {currentRole === 'company' && <CompanyAdminView />}
          {currentRole === 'hrexecutive' && <HrExecutiveView />}
          {currentRole === 'employee_link' && <EmployeePortalView />}
        </main>
      </div>

      {/* Inactivity Warning Modal */}
      <SessionInactivityModal
        isOpen={Boolean(showInactivityWarning)}
        remainingSeconds={inactivityCountdown}
        onExtend={refreshUserSession}
        onLogout={logoutUser}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="glass-panel px-4 py-3 border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2 border">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Clean Corporate Footer */}
      <footer className="border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 bg-white text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-900">JOY DATA VERIFICATION</span>
            <span>• Enterprise Employee Identity Verification System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
            <span>Government Repositories</span>
            <span>•</span>
            <span>Automated Verification & Biometrics Engines</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
