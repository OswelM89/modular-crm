import React, { useState } from 'react';
import { Plus, Globe, MapPin, Phone, Users, Mail, Building2 } from 'lucide-react';
import { Company } from '../../types';
import { SkeletonTable } from '../UI/SkeletonLoader';
import { mockCompanies } from '../../data/mockData';
import { CompanyForm, CompanyFormData } from './CompanyForm';
import { useTranslation } from '../../hooks/useTranslation';

export function CompanyList() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1300);
    return () => clearTimeout(timer);
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === filteredCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(filteredCompanies.map(company => company.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCompanies.length === 0) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar ${selectedCompanies.length} empresa(s)?`
    );
    
    if (confirmDelete) {
      setCompanies(prev => prev.filter(company => !selectedCompanies.includes(company.id)));
      setSelectedCompanies([]);
    }
  };

  const handleDownloadSelected = () => {
    if (selectedCompanies.length === 0) return;
    
    const selectedCompaniesData = companies.filter(company => 
      selectedCompanies.includes(company.id)
    );
    
    // Crear CSV
    const headers = ['Nombre', 'Sector', 'NIT', 'Tamaño', 'Website', 'Teléfono', 'Email', 'Dirección', 'Ciudad', 'País'];
    const csvContent = [
      headers.join(','),
      ...selectedCompaniesData.map(company => [
        company.name,
        company.sector,
        company.taxId || '',
        company.size,
        company.website || '',
        company.phone || '',
        company.email || '',
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

  const handleCreateCompany = (companyData: CompanyFormData) => {
    const newCompany: Company = {
      id: Math.random().toString(36).substr(2, 9),
      organizationId: 'org1', // TODO: Get from current user's organization
      name: companyData.name,
      sector: companyData.sector,
      taxId: companyData.nit,
      size: 'No especificado',
      website: companyData.website,
      address: companyData.address,
      city: companyData.city,
      country: companyData.country,
      phone: companyData.phone,
      email: companyData.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCompanies(prev => [newCompany, ...prev]);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('companies.title')}</h1>
            <p className="text-sm text-gray-600">{t('companies.subtitle')}</p>
          </div>
          <button 
            onClick={() => setShowCompanyForm(true)}
            className="inline-flex items-center px-6 py-3 text-base bg-[#FF6200] text-white hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('companies.new')}
          </button>
        </div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('companies.title')}</h1>
          <p className="text-sm text-gray-600">{t('companies.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCompanies.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedCompanies.length} {t('contacts.selected')}
              </span>
              <button
                onClick={handleDownloadSelected}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('contacts.download')}
              </button>
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('contacts.delete')}
              </button>
            </>
          )}
          <button 
            onClick={() => setShowCompanyForm(true)}
            className="inline-flex items-center px-6 py-3 text-base bg-[#FF6200] text-white hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('companies.new')}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder={t('companies.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
                    onChange={handleSelectAll}
                   className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company.id)}
                      onChange={() => handleSelectCompany(company.id)}
                     className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#FF6200]">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 hover:text-[#FF6200] transition-colors cursor-pointer">
                          {company.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe className="w-4 h-4 mr-1" />
                          {company.website}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{company.sector}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{company.size}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {company.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {company.phone}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CompanyForm
        isOpen={showCompanyForm}
        onClose={() => setShowCompanyForm(false)}
        onSubmit={handleCreateCompany}
      />
    </div>
  );
}