import { useState, useEffect } from 'react';
import { BarChart3, Building2, Users, Handshake, FileText, TrendingUp, Menu, X, ChevronDown } from 'lucide-react';
import { LanguageSelector } from '../UI/LanguageSelector';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
const navigation = [{
  id: 'dashboard',
  nameKey: 'nav.dashboard',
  icon: BarChart3
}, {
  id: 'contacts',
  nameKey: 'nav.contacts',
  icon: Users
}, {
  id: 'companies',
  nameKey: 'nav.companies',
  icon: Building2
}, {
  id: 'deals',
  nameKey: 'nav.deals',
  icon: Handshake
}, {
  id: 'quotes',
  nameKey: 'nav.quotes',
  icon: FileText
}, {
  id: 'pipeline',
  nameKey: 'nav.pipeline',
  icon: TrendingUp
}];
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
export function Header({
  activeSection,
  onSectionChange,
  user
}: HeaderProps) {
  const {
    t
  } = useTranslation();
  const {
    signOut
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userDropdownOpen]);
  const handleLogout = async () => {
    try {
      await signOut();
      setUserDropdownOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  return <header className="border-b border-border shadow-sm bg-gray-950">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg text-white">Modular CRM</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return <div key={item.id} className="relative group">
                  <button onClick={() => onSectionChange(item.id)} className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 ${isActive ? 'bg-[#77ff00] text-black shadow-sm' : 'text-white hover:text-black hover:bg-[#77ff00]/60'}`}>
                    <Icon className="w-5 h-5" />
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {t(item.nameKey)}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>;
          })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            {/* User info */}
            {user && <div className="relative user-dropdown">
                <div className="hidden sm:flex items-center gap-3 cursor-pointer transition-all duration-200" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                  {/* Avatar a la izquierda */}
                  {user.avatar_url ? <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full ring-2 ring-[#77ff00]/40" /> : <div className="w-8 h-8 rounded-full bg-[#77ff00] text-black flex items-center justify-center text-sm font-medium ring-2 ring-[#77ff00]/40">
                      {user.firstName.charAt(0)}
                    </div>}
                  
                  {/* Nombre */}
                  <div className="text-left">
                    <p className="text-sm font-medium text-white leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  
                  {/* Chevron */}
                  <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {/* Dropdown Menu */}
                {userDropdownOpen && <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border shadow-lg rounded-md py-2 z-50 animate-scale-in">
                    <button onClick={() => {
                onSectionChange('profile');
                setUserDropdownOpen(false);
              }} className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors">
                      Perfil
                    </button>
                    <button onClick={() => {
                onSectionChange('settings');
                setUserDropdownOpen(false);
              }} className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors">
                      Configuración
                    </button>
                    <hr className="my-1 border-border" />
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      Salir
                    </button>
                  </div>}
              </div>}

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white hover:text-white/80">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navigation.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return <button key={item.id} onClick={() => {
              onSectionChange(item.id);
              setMobileMenuOpen(false);
            }} className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors text-left ${isActive ? 'bg-[#77ff00] text-black' : 'text-white hover:text-black hover:bg-[#77ff00]/60'}`}>
                    <Icon className="w-4 h-4" />
                    {t(item.nameKey)}
                  </button>;
          })}
            </nav>
          </div>}
      </div>
    </header>;
}