import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ContactList } from './components/Contacts/ContactList';
import { CompanyList } from './components/Companies/CompanyList';
import { DealList } from './components/Deals/DealList';
import { Pipeline } from './components/Pipeline/Pipeline';
import { QuoteList } from './components/Quotes/QuoteList';
import { CreateQuotePage } from './components/Quotes/CreateQuotePage';
import { ProfilePage } from './components/Profile/ProfilePage';
import { SettingsPage } from './components/Settings/SettingsPage';
import { Header } from './components/Layout/Header';
import { SubscriptionGuard } from './components/Auth/SubscriptionGuard';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'dashboard';
  });

  const { user } = useAuth();

  useEffect(() => {
    const initializeDefaultOrg = async () => {
      if (!user) return;
      
      try {
        const { ensureUserOrganization } = await import('./utils/org');
        
        // Usar la función robusta para garantizar organización correcta
        const organizationId = await ensureUserOrganization();
        
        if (!organizationId) {
          console.warn('⚠️ No se pudo obtener organización del usuario en App.tsx');
        } else {
          console.log('✅ Organización inicializada correctamente:', organizationId);
        }
      } catch (error) {
        console.error('❌ Error inicializando organización:', error);
      }
    };

    initializeDefaultOrg();
  }, [user]);

  // Transform user data to match expected format
  const transformedUser = user ? {
    id: user.id,
    firstName: user.user_metadata?.first_name || 'Usuario',
    lastName: user.user_metadata?.last_name || '',
    email: user.email || '',
    avatar_url: user.user_metadata?.avatar_url || null
  } : null;

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard user={transformedUser} onSectionChange={handleSectionChange} />;
      case 'contacts':
        return <ContactList />;
      case 'companies':
        return <CompanyList />;
      case 'deals':
        return <DealList />;
      case 'pipeline':
        return <Pipeline />;
      case 'quotes':
        return <QuoteList />;
      case 'create-quote':
        return <CreateQuotePage onBack={() => handleSectionChange('quotes')} />;
      case 'profile':
        return <ProfilePage user={transformedUser} onBack={() => handleSectionChange('dashboard')} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard user={transformedUser} onSectionChange={handleSectionChange} />;
    }
  };

  if (!transformedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        user={transformedUser}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionGuard>
        <AppContent />
      </SubscriptionGuard>
    </AuthProvider>
  );
}

export default App;