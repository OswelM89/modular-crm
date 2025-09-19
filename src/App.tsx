import { useState, useEffect } from 'react';

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
import { AuthPage } from './components/Auth/AuthPage';
import { useAuth } from './contexts/AuthContext';
import { getDefaultOrganization } from './utils/org';
import { SidebarProvider, SidebarInset } from './components/UI/sidebar';
import { AppSidebar } from './components/AppSidebar';

function App() {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'dashboard';
  });

  // Initialize user's default organization on first login
  useEffect(() => {
    if (user) {
      getDefaultOrganization().catch(console.error);
    }
  }, [user]);

  // Transform auth user to match existing interface
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
      case 'quotes':
        return <QuoteList />;
      case 'quote-builder':
        return <QuoteBuilder />;
      case 'pipeline':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-display-lg text-foreground">Pipeline</h1>
                <p className="text-muted-foreground">Administra tu pipeline de ventas</p>
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-sm border border-border p-8 text-center">
              <p className="text-muted-foreground">Módulo de pipeline en desarrollo</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-display-lg text-foreground">Novedades</h1>
                <p className="text-muted-foreground">Últimas novedades y actualizaciones</p>
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-sm border border-border p-8 text-center">
              <p className="text-muted-foreground">Módulo de novedades en desarrollo</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <SettingsPage />
        );
      case 'profile':
        return (
          <ProfilePage user={transformedUser} onBack={() => handleSectionChange('dashboard')} />
        );
      default:
        return <Dashboard user={transformedUser} onSectionChange={handleSectionChange} />;
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show auth page if user is not authenticated
  if (!user) {
    return <AuthPage />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
        />
        
        <SidebarInset className="flex flex-col flex-1">
          {/* Selector de idioma flotante */}
          <LanguageSelector />
          
          <main className="flex-1 px-6 py-8">
            <div className="max-w-[1150px] mx-auto">
              {renderContent()}
            </div>
          </main>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default App;