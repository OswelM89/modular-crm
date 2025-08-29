import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { LanguageSelector } from './components/UI/LanguageSelector';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ContactList } from './components/Contacts/ContactList';
import { CompanyList } from './components/Companies/CompanyList';
import { DealList } from './components/Deals/DealList';
import { QuoteList } from './components/Quotes/QuoteList';
import { QuoteBuilder } from './components/Quotes/QuoteBuilder';
import { SettingsPage } from './components/Settings/SettingsPage';
import { ProfilePage } from './components/Profile/ProfilePage';

function App() {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'dashboard';
  });

  // Usuario mock para desarrollo
  const mockUser = {
    id: '1',
    firstName: 'Usuario',
    lastName: 'Demo',
    email: 'demo@modularcrm.com',
    avatar_url: null
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard user={mockUser} onSectionChange={handleSectionChange} />;
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
          <SettingsPage />
        );
      case 'profile':
        return (
          <ProfilePage user={mockUser} onBack={() => handleSectionChange('dashboard')} />
        );
      default:
        return <Dashboard user={mockUser} onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        user={mockUser}
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

export default App;