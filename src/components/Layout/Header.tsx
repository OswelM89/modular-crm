import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'contacts', name: 'Contactos' },
  { id: 'companies', name: 'Empresas' },
  { id: 'deals', name: 'Negocios' },
  { id: 'quotes', name: 'Cotizaciones' },
  { id: 'pipeline', name: 'Pipeline' },
  { id: 'reports', name: 'Novedades' },
];

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    <div className="bg-[#0D1117] text-white">
      {/* Top Header */}
      <div className="px-6 py-4">
        <div className="max-w-[1150px] mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <img 
                src="/Logo modular CRM.svg" 
                alt="Modular CRM" 
                className="h-6 w-auto"
                style={{ height: '1.5rem' }}
                onError={(e) => {
                  console.log('Error loading logo:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-[#21262d] border border-gray-600 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent text-white placeholder-gray-400 w-48 lg:w-64"
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
                className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-[#21262d] px-2 sm:px-3 py-2 transition-colors"
                onClick={toggleProfileDropdown}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#FF6200] flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-white">Juan Pérez</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-300 hidden sm:block" />
              </div>
              
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">Juan Pérez</div>
                    <div className="text-xs text-gray-500">Org: #123456</div>
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
                    Configuración
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Salir
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
      <div className="bg-[#212830] px-6 hidden lg:block">
        <nav className="max-w-[1150px] mx-auto flex items-center justify-center">
          <div className="flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`py-4 px-2 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeSection === item.id
                    ? 'text-white border-white'
                    : 'text-gray-300 border-transparent hover:text-white hover:border-gray-400'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-[#212830] mobile-menu">
          <nav className="px-6 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left py-3 px-4 text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-white bg-gray-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}