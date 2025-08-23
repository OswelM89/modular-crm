import React, { useState } from 'react';
import { AuthProvider, useAuthContext } from './components/Auth/AuthProvider';
import { SupabaseLoginPage } from './components/Auth/SupabaseLoginPage';
import { LoadingScreen } from './components/Auth/LoadingScreen';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { LanguageSelector } from './components/UI/LanguageSelector';
import { LoginPage } from './components/Auth/LoginPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ContactList } from './components/Contacts/ContactList';
import { CompanyList } from './components/Companies/CompanyList';
import { DealList } from './components/Deals/DealList';
import { QuoteList } from './components/Quotes/QuoteList';
import { QuoteBuilder } from './components/Quotes/QuoteBuilder';
import { SettingsPage } from './components/Settings/SettingsPage';
import { ProfilePage } from './components/Profile/ProfilePage';

function AppContent() {
  const { user, profile, loading } = useAuthContext();
const sectionTitles = {
  dashboard: 'Dashboard',
  contacts: 'Contactos',
  companies: 'Empresas',
  deals: 'Negocios',
  quotes: 'Cotizaciones',
  pipeline: 'Pipeline',
  reports: 'Novedades',
  settings: 'Configuración',
  profile: 'Mi Perfil',
};

function App() {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'dashboard';
  });

  const handleSectionChange = (section: string) => {
    if (section === 'logout') {
      // El logout se maneja en el Header
      return;
    }
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard user={profile} onSectionChange={handleSectionChange} />;
      case 'contacts':
        return <ContactList />;
      case 'companies':
        return <CompanyList />;
      case 'deals':
        return <DealList />;
      case 'quotes':
        return <QuoteList />;
      case 'quote-builder':
        return <QuoteBuilder />;
      case 'pipeline':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>Pipeline</h1>
                <p className="text-sm text-gray-600">Administra tu pipeline de ventas</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Módulo de pipeline en desarrollo</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>Novedades</h1>
                <p className="text-sm text-gray-600">Últimas novedades y actualizaciones</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Módulo de novedades en desarrollo</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <SettingsPage onSectionChange={handleSectionChange} />
        );
      case 'profile':
        return (
          <ProfilePage user={profile} onBack={() => handleSectionChange('dashboard')} />
        );
      default:
        return <Dashboard />;
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <LoadingScreen />;
  }

  // Si no hay usuario logueado, mostrar página de login de Supabase
  if (!user || !profile) {
    return <SupabaseLoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      <Header 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        user={profile}
      />
      
      {/* Selector de idioma flotante */}
      <LanguageSelector />
      
      <main className="flex-1 px-6 py-8">
        <div className="max-w-[1150px] mx-auto">
          {renderContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;