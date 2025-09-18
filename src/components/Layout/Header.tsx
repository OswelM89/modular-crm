import React, { useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../lib/utils';
import { SidebarTrigger } from '../UI/sidebar';

interface HeaderProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url?: string | null;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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
  return (
    <div className="bg-secondary text-secondary-foreground">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="max-w-[1150px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
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
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-card-foreground hover:bg-muted"
                  >
                    Perfil
                  </Button>
                  <Button 
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
          </div>
        </div>
      </div>
    </div>
  );
}