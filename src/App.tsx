import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { LanguageSelector } from './components/UI/LanguageSelector';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ContactList } from './components/Contacts/ContactList';
import { CompanyList } from './components/Companies/CompanyList';
import { DealList } from './components/Deals/DealList';
import { QuoteList } from './components/Quotes/QuoteList';
import { QuoteBuilder } from './components/Quotes/QuoteBuilder';

const sectionTitles = {
  dashboard: 'Dashboard',
  contacts: 'Contactos',
  companies: 'Empresas',
  deals: 'Negocios',
  quotes: 'Cotizaciones',
  pipeline: 'Pipeline',
  reports: 'Novedades',
  settings: 'Configuración',
};

function App() {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'dashboard';
  });

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pipeline</h3>
            <p className="text-gray-600">Módulo de pipeline en desarrollo</p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Novedades</h3>
            <p className="text-gray-600">Módulo de novedades en desarrollo</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración</h3>
            <p className="text-gray-600">Módulo de configuración en desarrollo</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      <Header activeSection={activeSection} onSectionChange={handleSectionChange} />
      
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