import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ContactList } from './components/Contacts/ContactList';
import { CompanyList } from './components/Companies/CompanyList';
import { DealList } from './components/Deals/DealList';
import { Pipeline } from './components/Pipeline/Pipeline';
import { QuoteList } from './components/Quotes/QuoteList';
import { CreateQuotePage } from './components/Quotes/CreateQuotePage';
import { ProfilePage } from './components/Profile/ProfilePage';
import { SettingsPage } from './components/Settings/SettingsPage';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Mock user for now
  const mockUser = {
    id: '1',
    firstName: 'Usuario',
    lastName: 'Demo',
    email: 'demo@example.com',
    avatar_url: null
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeSection={activeSection}
        onSectionChange={handleNavigate}
        user={mockUser}
      />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard user={mockUser} onSectionChange={handleNavigate} />} />
          <Route path="/contactos" element={<ContactList />} />
          <Route path="/empresas" element={<CompanyList />} />
          <Route path="/negocios" element={<DealList />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/cotizaciones" element={<QuoteList />} />
          <Route path="/cotizaciones/crear" element={<CreateQuotePage onBack={() => handleNavigate('quotes')} />} />
          <Route path="/perfil" element={<ProfilePage user={mockUser} onBack={() => handleNavigate('dashboard')} />} />
          <Route path="/configuracion/*" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
