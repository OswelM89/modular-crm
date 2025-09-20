import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ContactList } from './components/Contacts/ContactList';
import { CompanyList } from './components/Companies/CompanyList';
import { DealList } from './components/Deals/DealList';
import { Pipeline } from './components/Pipeline/Pipeline';
import { QuoteList } from './components/Quotes/QuoteList';
import { CreateQuotePage } from './components/Quotes/CreateQuotePage';
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
        const { supabase } = await import('./integrations/supabase/client');
        
        // Check if user already has organizations
        const { data: orgs } = await supabase
          .from('organizations')
          .select('id')
          .limit(1);
        
        if (!orgs || orgs.length === 0) {
          // Create default organization for new user
          const { data: newOrg } = await supabase
            .from('organizations')
            .insert({
              name: `Org'${user.email?.split('@')[0] || 'Mi_Organizacion'}`,
              organization_type: 'Startup'
            })
            .select()
            .single();
          
          if (newOrg) {
            // Add user as admin to the organization
            await supabase
              .from('organization_members')
              .insert({
                organization_id: newOrg.id,
                user_id: user.id,
                role: 'admin'
              });
          }
        }
      } catch (error) {
        console.error('Error initializing default organization:', error);
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
        return <Dashboard />;
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
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
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