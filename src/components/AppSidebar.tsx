import { BarChart3, Building2, Users, Handshake, FileText, TrendingUp, PieChart } from 'lucide-react';
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
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { t } = useTranslation();
  const { collapsed } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r" style={{ backgroundColor: '#FF6200' }}>
      <SidebarHeader className="border-b p-6" style={{ borderColor: '#CC4E00', backgroundColor: '#FF6200' }}>
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img 
            src="/Logo modular CRM.svg" 
            alt="Modular CRM" 
            className={`transition-all ${collapsed ? 'h-8 w-8' : 'h-10 w-auto'}`}
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-4" style={{ backgroundColor: '#FF6200' }}>
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'white' }}>
            {!collapsed && "Navegación"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={isActive}
                      tooltip={collapsed ? t(item.nameKey) : undefined}
                      className={`h-12 px-4 rounded-lg transition-all duration-200 text-white hover:bg-white hover:bg-opacity-20 ${
                        isActive 
                          ? 'bg-white bg-opacity-20 font-semibold shadow-sm' 
                          : 'hover:text-white'
                      }`}
                      style={{ 
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                        color: 'white'
                      }}
                    >
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      <span className={`group-data-[collapsible=icon]:sr-only text-base font-medium ml-1 ${
                        isActive ? 'font-semibold' : ''
                      }`}>
                        {t(item.nameKey)}
                      </span>
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