import React, { useState } from 'react';
import { BarChart3, Building2, Users, Handshake, FileText, TrendingUp, PieChart, Bell, ChevronDown } from 'lucide-react';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar
} from "./UI/sidebar";
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../lib/utils';
import { Button } from './ui/button';

const navigation = [
  { id: 'dashboard', nameKey: 'nav.dashboard', icon: BarChart3 },
  { id: 'contacts', nameKey: 'nav.contacts', icon: Users },
  { id: 'companies', nameKey: 'nav.companies', icon: Building2 },
  { id: 'deals', nameKey: 'nav.deals', icon: Handshake },
  { id: 'quotes', nameKey: 'nav.quotes', icon: FileText },
  { id: 'pipeline', nameKey: 'nav.pipeline', icon: TrendingUp },
  { id: 'reports', nameKey: 'nav.reports', icon: PieChart },
];

interface AppSidebarProps {
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

export function AppSidebar({ activeSection, onSectionChange, user }: AppSidebarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { t } = useTranslation();
  const { collapsed } = useSidebar();
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
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-border p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="/Logo modular CRM.svg" 
            alt="Modular CRM" 
            className={`transition-all ${collapsed ? 'h-6 w-6' : 'h-8 w-auto'}`}
          />
          {!collapsed && (
            <span className="font-semibold text-sidebar-foreground">CRM</span>
          )}
        </div>

        {/* Profile Section */}
        <div className="relative profile-dropdown">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent px-2 py-2 rounded-md transition-colors"
            onClick={toggleProfileDropdown}
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
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
            {!collapsed && (
              <>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-sidebar-foreground">
                    {user?.firstName || 'Usuario'} {user?.lastName || ''}
                  </div>
                  <div className="text-xs text-sidebar-muted-foreground truncate">
                    {user?.email || ''}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-sidebar-muted-foreground flex-shrink-0" />
              </>
            )}
          </div>
          
          {showProfileDropdown && !collapsed && (
            <div className="absolute left-0 top-full mt-2 w-full bg-sidebar-background border border-sidebar-border shadow-lg rounded-md py-2 z-50 animate-scale-in">
              <Button 
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                Perfil
              </Button>
              <Button 
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                {t('profile.settings')}
              </Button>
              <hr className="my-1 border-sidebar-border" />
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                {t('profile.logout')}
              </Button>
            </div>
          )}

          {/* Notification indicator for collapsed state */}
          {collapsed && (
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 text-sidebar-muted-foreground hover:text-sidebar-foreground"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground font-semibold">
            {!collapsed && "Navegación"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={isActive}
                      tooltip={collapsed ? t(item.nameKey) : undefined}
                      className={`${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="group-data-[collapsible=icon]:sr-only">{t(item.nameKey)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}