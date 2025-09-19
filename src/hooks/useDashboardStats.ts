import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalContacts: number;
  totalCompanies: number;
  totalMembers: number;
  organizationName: string;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats(): DashboardStats {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalCompanies: 0,
    totalMembers: 0,
    organizationName: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Get user's organization first
        const { data: memberData, error: memberError } = await supabase
          .from('organization_members')
          .select('organization_id, organizations(name)')
          .eq('user_id', user.id)
          .single();

        if (memberError) {
          console.error('Error fetching organization:', memberError);
          setStats(prev => ({ ...prev, error: 'Error al obtener la organización', loading: false }));
          return;
        }

        const organizationId = memberData.organization_id;
        const organizationName = (memberData.organizations as any)?.name || '';

        // Fetch all stats in parallel
        const [contactsResult, companiesResult, membersResult] = await Promise.all([
          // Total contacts in organization
          supabase
            .from('contacts')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', organizationId),
          
          // Total companies in organization
          supabase
            .from('companies')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', organizationId),
          
          // Total members in organization
          supabase
            .from('organization_members')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', organizationId),
        ]);

        const totalContacts = contactsResult.count || 0;
        const totalCompanies = companiesResult.count || 0;
        const totalMembers = membersResult.count || 0;

        setStats({
          totalContacts,
          totalCompanies,
          totalMembers,
          organizationName,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({ 
          ...prev, 
          error: 'Error al cargar las métricas', 
          loading: false 
        }));
      }
    };

    fetchStats();
  }, [user]);

  return stats;
}