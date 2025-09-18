import React, { useState } from 'react';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../lib/utils';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url?: string | null;
  } | null;
}

const navigation = [
  { id: 'dashboard', nameKey: 'nav.dashboard' },
  { id: 'contacts', nameKey: 'nav.contacts' },
  { id: 'companies', nameKey: 'nav.companies' },
  { id: 'deals', nameKey: 'nav.deals' },
  { id: 'quotes', nameKey: 'nav.quotes' },
  { id: 'pipeline', nameKey: 'nav.pipeline' },
  { id: 'reports', nameKey: 'nav.reports' },
];

export function Header({ activeSection, onSectionChange, user }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      setShowProfileDropdown(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMobileMenu]);
  return (
    <div className="bg-secondary text-secondary-foreground">
      {/* Top Header */}
      <div className="px-6 py-4">
        <div className="max-w-[1150px] mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <img 
                src="/Logo modular CRM.svg" 
                alt="Modular CRM" 
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            
            <div 
              className="relative profile-dropdown"
            >
              <div 
                className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-muted px-2 sm:px-3 py-2 rounded-md transition-colors"
                onClick={toggleProfileDropdown}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={`${user?.firstName} ${user?.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-primary-foreground">
                      {getInitials(user?.firstName, user?.lastName)}
                    </span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-foreground">
                    {user?.firstName || 'Usuario'} {user?.lastName || ''}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </div>
              
              {showProfileDropdown && (
               <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border shadow-lg rounded-md py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2 border-b border-border">
                    <div className="text-sm font-medium text-card-foreground">
                      {user?.firstName || 'Usuario'} {user?.lastName || ''}
                    </div>
                    <div className="text-xs text-muted-foreground">{user?.email || ''}</div>
                  </div>
                  <Button 
                    onClick={() => onSectionChange('profile')}
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-card-foreground hover:bg-muted"
                  >
                    Perfil
                  </Button>
                  <Button 
                    onClick={() => onSectionChange('settings')}
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-card-foreground hover:bg-muted"
                  >
                    {t('profile.settings')}
                  </Button>
                  <hr className="my-1 border-border" />
                  <Button 
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    {t('profile.logout')}
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost"
              size="icon"
              className="lg:hidden mobile-menu-button text-muted-foreground hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-muted px-6 hidden lg:block border-t border-border">
        <nav className="max-w-[1150px] mx-auto flex items-center justify-center">
          <div className="flex space-x-8">
            {navigation.map((item) => (
              <Button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                variant="ghost"
                className={`py-4 px-2 text-sm font-medium transition-all duration-200 border-b-2 rounded-none ${
                  activeSection === item.id
                    ? 'text-primary border-primary bg-primary/5'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50'
                }`}
              >
                {t(item.nameKey)}
              </Button>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-muted mobile-menu border-t border-border animate-slide-in-right">
          <nav className="px-6 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setShowMobileMenu(false);
                  }}
                  variant="ghost"
                  className={`w-full justify-start py-3 px-4 text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {t(item.nameKey)}
                </Button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}