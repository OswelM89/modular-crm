import { useState } from 'react';
import { BarChart3, Building2, Users, Handshake, FileText, TrendingUp, PieChart, Menu, X } from 'lucide-react';
import { LanguageSelector } from '../UI/LanguageSelector';
import { useTranslation } from '../../hooks/useTranslation';

const navigation = [
  { id: 'dashboard', nameKey: 'nav.dashboard', icon: BarChart3 },
  { id: 'contacts', nameKey: 'nav.contacts', icon: Users },
  { id: 'companies', nameKey: 'nav.companies', icon: Building2 },
  { id: 'deals', nameKey: 'nav.deals', icon: Handshake },
  { id: 'quotes', nameKey: 'nav.quotes', icon: FileText },
  { id: 'pipeline', nameKey: 'nav.pipeline', icon: TrendingUp },
  { id: 'reports', nameKey: 'nav.reports', icon: PieChart },
];

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url: string | null;
  } | null;
}

export function Header({ activeSection, onSectionChange, user }: HeaderProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/Logo modular CRM.svg" 
              alt="Modular CRM" 
              className="h-8 w-8"
            />
            <span className="font-semibold text-lg text-foreground">Modular CRM</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => onSectionChange(item.id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {t(item.nameKey)}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            {/* User info */}
            {user && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {user.firstName.charAt(0)}
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors text-left ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t(item.nameKey)}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}