/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { UsersView } from './components/UsersView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { PaymentsView } from './components/PaymentsView';
import { ToolsView } from './components/ToolsView';
import { JobsView } from './components/JobsView';
import { HomesView } from './components/HomesView';
import { BrokersView } from './components/BrokersView';
import { AcademyView } from './components/AcademyView';
import { AcademyPaymentsView } from './components/AcademyPaymentsView';
import { ComplaintsView } from './components/ComplaintsView';
import { NotificationsView } from './components/NotificationsView';
import { EthioDriveView } from './components/EthioDriveView';
import { EthioVerifyView } from './components/EthioVerifyView';
import { MaintenanceView } from './components/MaintenanceView';
import { SettingsView } from './components/SettingsView';
import { AuditLogsView } from './components/AuditLogsView';
import { ProfileView } from './components/ProfileView';
import { DeploymentHubView } from './components/DeploymentHubView';
import { JobPortalManagerView } from './components/JobPortalManagerView';
import { AdminLoginGate } from './components/AdminLoginGate';
import { Language } from './types/admin';
import { adminStore } from './services/admin-data';
import { jobPortalStore } from './services/job-portal-data';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [currentLang, setCurrentLang] = useState<Language>('am'); // Default language: Amharic
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Re-render when adminStore or jobPortalStore emits changes
  const [, setStoreVersion] = useState(0);
  useEffect(() => {
    const unsub1 = adminStore.subscribe(() => {
      setStoreVersion((v) => v + 1);
    });
    const unsub2 = jobPortalStore.subscribe(() => {
      setStoreVersion((v) => v + 1);
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Sync dark mode class on <html> element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Support URL hash routing (#/users, #/payments, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash) {
        setCurrentView(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectView = (viewId: string) => {
    setCurrentView(viewId);
    window.location.hash = `#/${viewId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <AdminLoginGate
          currentLang={currentLang}
          onAuthenticated={() => setIsAuthenticated(true)}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={handleSelectView}
        currentLang={currentLang}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onNavigate={handleSelectView}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && <DashboardView currentLang={currentLang} onNavigate={handleSelectView} />}
          {currentView === 'job-portal' && <JobPortalManagerView currentLang={currentLang} />}
          {currentView === 'users' && <UsersView currentLang={currentLang} />}
          {currentView === 'subscriptions' && <SubscriptionsView currentLang={currentLang} />}
          {currentView === 'payments' && <PaymentsView currentLang={currentLang} />}
          {currentView === 'tools' && <ToolsView currentLang={currentLang} />}
          {currentView === 'jobs' && <JobsView currentLang={currentLang} />}
          {currentView === 'homes' && <HomesView currentLang={currentLang} />}
          {currentView === 'brokers' && <BrokersView currentLang={currentLang} />}
          {currentView === 'academy' && <AcademyView currentLang={currentLang} />}
          {currentView === 'academy-payments' && <AcademyPaymentsView currentLang={currentLang} />}
          {currentView === 'complaints' && <ComplaintsView currentLang={currentLang} />}
          {currentView === 'notifications' && <NotificationsView currentLang={currentLang} />}
          {currentView === 'ethiodrive' && <EthioDriveView currentLang={currentLang} />}
          {currentView === 'ethioverify' && <EthioVerifyView currentLang={currentLang} />}
          {currentView === 'maintenance' && <MaintenanceView currentLang={currentLang} />}
          {currentView === 'settings' && <SettingsView currentLang={currentLang} />}
          {currentView === 'audit-logs' && <AuditLogsView currentLang={currentLang} />}
          {currentView === 'profile' && <ProfileView currentLang={currentLang} />}
          {currentView === 'deployment' && <DeploymentHubView currentLang={currentLang} />}
        </main>
      </div>
    </div>
  );
}
