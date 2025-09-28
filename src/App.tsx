import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    const routes: { [key: string]: string } = {
      'dashboard': '/',
      'contacts': '/contactos',
      'companies': '/companias',
      'deals': '/negocios',
      'pipeline': '/pipeline',
      'quotes': '/cotizaciones',
      'create-quote': '/cotizaciones/crear',
      'profile': '/perfil',
      'settings': '/configuracion'
    };
    navigate(routes[section] || '/');
  };

  if (!transformedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get current section from path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path === '/contactos') return 'contacts';
    if (path === '/companias') return 'companies';
    if (path === '/negocios') return 'deals';
    if (path === '/pipeline') return 'pipeline';
    if (path === '/cotizaciones') return 'quotes';
    if (path === '/cotizaciones/crear') return 'create-quote';
    if (path === '/perfil') return 'profile';
    if (path === '/configuracion') return 'settings';
    return 'dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeSection={getActiveSection()}
        onSectionChange={handleSectionChange}
        user={transformedUser}
      />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard user={transformedUser} onSectionChange={handleSectionChange} />} />
          <Route path="/contactos" element={<ContactList />} />
          <Route path="/companias" element={<CompanyList />} />
          <Route path="/negocios" element={<DealList />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/cotizaciones" element={<QuoteList />} />
          <Route path="/cotizaciones/crear" element={<CreateQuotePage onBack={() => handleSectionChange('quotes')} />} />
          <Route path="/perfil" element={<ProfilePage user={transformedUser} onBack={() => handleSectionChange('dashboard')} />} />
          <Route path="/configuracion" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionGuard>
        <Router>
          <AppContent />
        </Router>
      </SubscriptionGuard>
    </AuthProvider>
  );
}

export default App;