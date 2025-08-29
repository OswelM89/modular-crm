import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageSelector } from '../UI/LanguageSelector';

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

  const handleLogout = async () => {
    // Mock logout - just reload the page
    window.location.reload();
    setShowProfileDropdown(false);
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
    <div className="bg-teal-primary text-white shadow-lg">
      {/* Top Header */}
      <div className="px-6 py-4">
        <div className="max-w-[1150px] mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/Logo modular CRM.svg" 
                alt="Modular CRM" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">TalentaSync</span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
               className="pl-10 pr-4 py-2 bg-white bg-opacity-20 border-0 rounded-lg focus:ring-2 focus:ring-white focus:bg-opacity-30 text-white placeholder-gray-200 w-48 lg:w-64"
              />
            </div>
            
            {/* Search icon for mobile */}
            <button className="sm:hidden p-2 text-gray-300 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            <button className="relative p-1 sm:p-2 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6200] rounded-full"></span>
            </button>
            
            <div 
              className="relative profile-dropdown"
            >
              <div 
                className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-white hover:bg-opacity-10 px-2 sm:px-3 py-2 rounded-lg transition-colors"
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
                    <span className="text-xs font-medium text-white">
                      {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-white">
                    {user?.firstName || 'Usuario'} {user?.lastName || ''}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-300 hidden sm:block" />
              </div>
              
              {showProfileDropdown && (
               <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.firstName || 'Usuario'} {user?.lastName || ''}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email || ''}</div>
                  </div>
                  <button 
                    onClick={() => onSectionChange('profile')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Perfil
                  </button>
                  <button 
                    onClick={() => onSectionChange('settings')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {t('profile.settings')}
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    {t('profile.logout')}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden mobile-menu-button p-2 text-gray-300 hover:text-white transition-colors"
              onClick={toggleMobileMenu}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-teal-secondary px-6 hidden lg:block">
        <nav className="max-w-[1150px] mx-auto flex items-center justify-center">
          <div className="flex space-x-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg ${
                  activeSection === item.id
                    ? 'text-white bg-white bg-opacity-20'
                    : 'text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {t(item.nameKey)}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-teal-secondary mobile-menu">
          <nav className="px-6 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-white bg-white bg-opacity-20'
                      : 'text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {t(item.nameKey)}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}