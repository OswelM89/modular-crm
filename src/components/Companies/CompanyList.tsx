import React, { useState, useEffect } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { SkeletonHeader } from '../UI/SkeletonLoader';
import { CompanyForm } from './CompanyForm';
import { CompanyDropdown } from './CompanyDropdown';
import { SubscriptionModal } from '../UI/SubscriptionModal';
import { CompanyFormData } from '../../utils/companies';
import { useTranslation } from '../../hooks/useTranslation';
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck';
import { fetchCompanies, createCompany, deleteCompany, type Company } from '../../utils/companies';
import { supabase } from '../../integrations/supabase/client';

export function CompanyList() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [userProfiles, setUserProfiles] = useState<{[key: string]: {first_name: string, last_name: string}}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const { t } = useTranslation();
  const { showSubscriptionModal, setShowSubscriptionModal, checkSubscription } = useSubscriptionCheck();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const companiesData = await fetchCompanies();
      setCompanies(companiesData);
      
      // Get unique user IDs and fetch their profiles
      const uniqueUserIds = [...new Set(companiesData.map(company => company.user_id))];
      if (uniqueUserIds.length > 0) {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', uniqueUserIds);
        
        if (!error && profiles) {
          const profilesMap = profiles.reduce((acc, profile) => {
            acc[profile.id] = {
              first_name: profile.first_name || '',
              last_name: profile.last_name || ''
            };
            return acc;
          }, {} as {[key: string]: {first_name: string, last_name: string}});
          setUserProfiles(profilesMap);
        }
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      alert('Error al cargar las empresas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.sector && company.sector.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesResponsible = responsibleFilter === 'all' || company.user_id === responsibleFilter;
    return matchesSearch && matchesResponsible;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Get unique responsible users
  const uniqueResponsible = React.useMemo(() => {
    const responsibleUsers = companies.reduce((acc, company) => {
      if (!acc.some(user => user.id === company.user_id)) {
        const profile = userProfiles[company.user_id];
        const displayName = profile 
          ? `${profile.first_name} ${profile.last_name}`.trim() || `Usuario ${company.user_id.slice(-5).toUpperCase()}`
          : `Usuario ${company.user_id.slice(-5).toUpperCase()}`;
        
        acc.push({
          id: company.user_id,
          name: displayName
        });
      }
      return acc;
    }, [] as { id: string; name: string }[]);
    return responsibleUsers;
  }, [companies, userProfiles]);

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === paginatedCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(paginatedCompanies.map(company => company.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCompanies.length === 0) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar ${selectedCompanies.length} empresa(s)?`
    );
    
    if (confirmDelete) {
      try {
        await Promise.all(selectedCompanies.map(id => deleteCompany(id)));
        setCompanies(prev => prev.filter(company => !selectedCompanies.includes(company.id)));
        setSelectedCompanies([]);
      } catch (error) {
        console.error('Error deleting companies:', error);
        alert('Error al eliminar empresas. Por favor intenta de nuevo.');
      }
    }
  };

  const handleDownloadSelected = () => {
    if (selectedCompanies.length === 0) return;
    
    const selectedCompaniesData = companies.filter(company => 
      selectedCompanies.includes(company.id)
    );
    
    // Crear CSV
    const headers = ['Nombre', 'NIT', 'Sector', 'Website', 'Email', 'Teléfono', 'Dirección', 'Ciudad', 'País'];
    const csvContent = [
      headers.join(','),
      ...selectedCompaniesData.map(company => [
        company.name,
        company.nit,
        company.sector || '',
        company.website || '',
        company.email || '',
        company.phone || '',
        company.address || '',
        company.city || '',
        company.country || ''
      ].join(','))
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `empresas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateCompany = async (companyData: CompanyFormData) => {
    try {
      const newCompany = await createCompany(companyData);
      setCompanies(prev => [newCompany, ...prev]);
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Error al crear la empresa. Por favor intenta de nuevo.');
    }
  };

  if (loading) {
    return <div className="space-y-6">
        <SkeletonHeader />
        <div className="rounded-xl">
          <div className="p-6 border border-gray-200 bg-white rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-4 pt-6 bg-transparent">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right min-w-[120px]">
                      <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="text-right min-w-[120px]">
                      <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="text-right min-w-[120px]">
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="text-right min-w-[120px]">
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="text-right min-w-[80px]">
                      <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-0" style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('companies.title')}</h1>
          <p className="text-gray-600" style={{ fontSize: '18px' }}>{t('companies.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCompanies.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedCompanies.length} {t('contacts.selected')}
              </span>
              <button
                onClick={handleDownloadSelected}
                className="inline-flex items-center px-4 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('contacts.download')}
              </button>
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('contacts.delete')}
              </button>
            </>
          )}
          <button 
            onClick={() => checkSubscription(() => setShowCompanyForm(true))}
            className="inline-flex items-center px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md font-semibold rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('companies.new')}
          </button>
        </div>
      </div>

      <div className="rounded-xl">
        <div className="p-6 border border-gray-200 bg-white rounded-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCompanies.length === paginatedCompanies.length && paginatedCompanies.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-gray-600">Seleccionar todo</span>
              </label>
              <input
                type="text"
                placeholder={t('companies.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={responsibleFilter}
              onChange={(e) => setResponsibleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos los responsables</option>
              {uniqueResponsible.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4 pt-6 bg-transparent">
          {/* Company Cards */}
          {paginatedCompanies.map(company => (
            <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                {/* Checkbox section */}
                <div className="flex items-center space-x-4 w-1/4">
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company.id)}
                    onChange={() => handleSelectCompany(company.id)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2 flex-shrink-0"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {company.sector || 'Sin sector especificado'}
                    </p>
                  </div>
                </div>

                {/* Email section */}
                <div className="w-1/6 text-left">
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="text-sm text-gray-900">
                    {company.email || 'Sin email'}
                  </div>
                </div>
                
                {/* Phone section */}
                <div className="w-1/6 text-left">
                  <div className="text-xs text-gray-500 mb-1">Teléfono</div>
                  <div className="text-sm text-gray-900">
                    {company.phone || 'Sin teléfono'}
                  </div>
                </div>
                
                {/* Responsible section */}
                <div className="w-1/5 text-left">
                  <div className="text-xs text-gray-500 mb-1">Responsable</div>
                  <div className="text-sm text-gray-900">
                    {userProfiles[company.user_id] 
                      ? `${userProfiles[company.user_id].first_name} ${userProfiles[company.user_id].last_name}`.trim()
                      : `Usuario ${company.user_id.slice(-5).toUpperCase()}`}
                  </div>
                </div>

                {/* Creation date section */}
                <div className="w-1/6 text-left">
                  <div className="text-xs text-gray-500 mb-1">Fecha de Creación</div>
                  <div className="text-sm text-gray-900">
                    {new Date(company.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
                
                {/* Menu button with dropdown */}
                <div className="w-12 flex justify-end relative">
                  <CompanyDropdown 
                    company={company}
                    onEdit={(companyId) => {
                      // TODO: Implement edit functionality
                      console.log('Edit company:', companyId);
                    }}
                    onDelete={async (companyId) => {
                      const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta empresa?');
                      if (confirmDelete) {
                        try {
                          await deleteCompany(companyId);
                          setCompanies(prev => prev.filter(c => c.id !== companyId));
                        } catch (error) {
                          console.error('Error deleting company:', error);
                          alert('Error al eliminar la empresa. Por favor intenta de nuevo.');
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Mobile details - only show on small screens */}
              <div className="mt-4 grid grid-cols-2 gap-4 sm:hidden border-t border-gray-100 pt-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="text-sm text-gray-900 truncate">
                    {company.email || 'Sin email'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Teléfono</div>
                  <div className="text-sm text-gray-900">
                    {company.phone || 'Sin teléfono'}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Responsable</div>
                  <div className="text-sm text-gray-900">
                    {userProfiles[company.user_id] 
                      ? `${userProfiles[company.user_id].first_name} ${userProfiles[company.user_id].last_name}`.trim()
                      : `Usuario ${company.user_id.slice(-5).toUpperCase()}`}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Fecha de Creación</div>
                  <div className="text-sm text-gray-900">
                    {new Date(company.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {paginatedCompanies.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empresas</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || responsibleFilter !== 'all'
                  ? 'No se encontraron empresas con los filtros aplicados.'
                  : 'Comienza agregando tu primera empresa.'}
              </p>
              {!searchTerm && responsibleFilter === 'all' && (
                <button
                  onClick={() => checkSubscription(() => setShowCompanyForm(true))}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Empresa
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {startIndex + 1} - {Math.min(endIndex, filteredCompanies.length)} de {filteredCompanies.length} empresas
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current page
                const showPage = pageNum === 1 || 
                                pageNum === totalPages || 
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                
                if (!showPage && pageNum === 2 && currentPage > 4) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                if (!showPage && pageNum === totalPages - 1 && currentPage < totalPages - 3) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                if (!showPage) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <CompanyForm
        isOpen={showCompanyForm}
        onClose={() => setShowCompanyForm(false)}
        onSubmit={handleCreateCompany}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
}