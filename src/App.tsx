import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ContactList } from './components/Contacts/ContactList';
import { ContactDetail } from './components/Contacts/ContactDetail';
import { ContactForm } from './components/Contacts/ContactForm';
import { CompanyList } from './components/Companies/CompanyList';
import { CompanyForm } from './components/Companies/CompanyForm';
import { DealList } from './components/Deals/DealList';
import { DealForm } from './components/Deals/DealForm';
import { Pipeline } from './components/Pipeline/Pipeline';
import { QuoteList } from './components/Quotes/QuoteList';
import { CreateQuotePage } from './components/Quotes/CreateQuotePage';
import { QuoteViewer } from './components/Quotes/QuoteViewer';
import { SettingsPage } from './components/Settings/SettingsPage';
import { Header } from './components/Layout/Header';
import { SubscriptionGuard } from './components/Auth/SubscriptionGuard';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import type { Contact, Company, Deal, Quote } from './types';

function AppContent() {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'dashboard';
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

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
    name: user.user_metadata?.first_name && user.user_metadata?.last_name 
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : user.email || 'Usuario',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url || null
  } : null;

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
    // Reset selections when changing sections
    setSelectedContact(null);
    setSelectedCompany(null);
    setSelectedDeal(null);
    setSelectedQuote(null);
    setEditingContact(null);
    setEditingCompany(null);
    setEditingDeal(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'contacts':
        if (editingContact) {
          return (
            <ContactForm
              contact={editingContact}
              onSave={() => setEditingContact(null)}
              onCancel={() => setEditingContact(null)}
            />
          );
        }
        if (selectedContact) {
          return (
            <ContactDetail
              contact={selectedContact}
              onBack={() => setSelectedContact(null)}
              onEdit={(contact) => setEditingContact(contact)}
            />
          );
        }
        return (
          <ContactList
            onSelectContact={setSelectedContact}
            onEditContact={setEditingContact}
          />
        );
      case 'companies':
        if (editingCompany) {
          return (
            <CompanyForm
              company={editingCompany}
              onSave={() => setEditingCompany(null)}
              onCancel={() => setEditingCompany(null)}
            />
          );
        }
        return (
          <CompanyList
            onSelectCompany={setSelectedCompany}
            onEditCompany={setEditingCompany}
          />
        );
      case 'deals':
        if (editingDeal) {
          return (
            <DealForm
              deal={editingDeal}
              onSave={() => setEditingDeal(null)}
              onCancel={() => setEditingDeal(null)}
            />
          );
        }
        return (
          <DealList
            onSelectDeal={setSelectedDeal}
            onEditDeal={setEditingDeal}
          />
        );
      case 'pipeline':
        return <Pipeline />;
      case 'quotes':
        if (selectedQuote) {
          return (
            <QuoteViewer
              quote={selectedQuote}
              onBack={() => setSelectedQuote(null)}
            />
          );
        }
        if (activeSection === 'create-quote') {
          return <CreateQuotePage onBack={() => handleSectionChange('quotes')} />;
        }
        return (
          <QuoteList
            onSelectQuote={setSelectedQuote}
            onCreateQuote={() => handleSectionChange('create-quote')}
          />
        );
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
        user={transformedUser}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
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