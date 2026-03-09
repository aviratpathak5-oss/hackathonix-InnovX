import { useState, useEffect } from 'react';
import { AppProvider } from '@/hooks/useAppData';
import { LandingPage } from '@/components/LandingPage';
import { AuthPage } from '@/components/AuthPage';
import { Dashboard } from '@/components/Dashboard';

type AppView = 'landing' | 'auth' | 'dashboard';

const Index = () => {
  const [view, setView] = useState<AppView>(() => {
    return localStorage.getItem('budget_logged_in') ? 'dashboard' : 'landing';
  });

  const handleLogin = (name: string) => {
    localStorage.setItem('budget_logged_in', 'true');
    localStorage.setItem('budget_user_name', name);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('budget_logged_in');
    setView('landing');
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('auth')} />;
  }

  if (view === 'auth') {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <AppProvider>
      <Dashboard onLogout={handleLogout} />
    </AppProvider>
  );
};

export default Index;
