import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, User, Building2, Edit, Trash2 } from 'lucide-react';
import { Deal } from '../../types';
import { SkeletonTable } from '../UI/SkeletonLoader';
import { mockDeals } from '../../data/mockData';

export function DealList() {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const stages = [
    { value: 'all', label: 'Todas las etapas' },
    { value: 'prospecting', label: 'Prospección' },
    { value: 'qualification', label: 'Calificación' },
    { value: 'proposal', label: 'Propuesta' },
    { value: 'negotiation', label: 'Negociación' },
    { value: 'closed-won', label: 'Ganado' },
    { value: 'closed-lost', label: 'Perdido' },
  ];

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || deal.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'prospecting': 'bg-gray-100 text-gray-800',
      'qualification': 'bg-blue-100 text-blue-800',
      'proposal': 'bg-yellow-100 text-yellow-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed-won': 'bg-green-100 text-green-800',
      'closed-lost': 'bg-red-100 text-red-800',
    };
    return colors[stage as keyof typeof colors] || colors.prospecting;
  };

  const getStageLabel = (stage: string) => {
    const labels = {
      'prospecting': 'Prospección',
      'qualification': 'Calificación',
      'proposal': 'Propuesta',
      'negotiation': 'Negociación',
      'closed-won': 'Ganado',
      'closed-lost': 'Perdido',
    };
    return labels[stage as keyof typeof labels] || stage;
  };

  const handleSelectDeal = (dealId: string) => {
    setSelectedDeals(prev => 
      prev.includes(dealId) 
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDeals.length === filteredDeals.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(filteredDeals.map(deal => deal.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDeals.length === 0) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar ${selectedDeals.length} negocio(s)?`
    );
    
    if (confirmDelete) {
      setDeals(prev => prev.filter(deal => !selectedDeals.includes(deal.id)));
      setSelectedDeals([]);
    }
  };

  const handleDownloadSelected = () => {
    if (selectedDeals.length === 0) return;
    
    const selectedDealsData = deals.filter(deal => 
      selectedDeals.includes(deal.id)
    );
    
    // Crear CSV
    const headers = ['Título', 'Empresa', 'Contacto', 'Etapa', 'Valor', 'Probabilidad', 'Cierre'];
    const csvContent = [
      headers.join(','),
      ...selectedDealsData.map(deal => [
        deal.title,
        deal.company?.name || '',
        `${deal.contact?.firstName} ${deal.contact?.lastName}`,
        getStageLabel(deal.stage),
        deal.value,
        deal.probability + '%',
        deal.expectedCloseDate.toLocaleDateString('es-MX')
      ].join(','))
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `negocios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Negocios</h3>
            <p className="text-sm text-gray-600">Administra tu pipeline de ventas</p>
          </div>
          <button className="inline-flex items-center px-6 py-3 text-base bg-[#FF6200] text-white hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Negocio
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
          <h3 className="text-lg font-semibold text-gray-900">Negocios</h3>
          <p className="text-sm text-gray-600">Administra tu pipeline de ventas</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedDeals.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedDeals.length} seleccionado(s)
              </span>
              <button
                onClick={handleDownloadSelected}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar
              </button>
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </button>
            </>
          )}
          <button className="inline-flex items-center px-6 py-3 text-base bg-[#FF6200] text-white hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Negocio
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar negocios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
            />
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
            >
              {stages.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDeals.length === filteredDeals.length && filteredDeals.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 rounded focus:ring-[#FF6200] focus:ring-2"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Negocio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etapa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cierre
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDeals.includes(deal.id)}
                      onChange={() => handleSelectDeal(deal.id)}
                      className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 rounded focus:ring-[#FF6200] focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#FF6200]">
                          {deal.title.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 hover:text-[#FF6200] transition-colors cursor-pointer">
                          {deal.title}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          {deal.contact?.firstName} {deal.contact?.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{deal.company?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(deal.stage)}`}>
                      {getStageLabel(deal.stage)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {formatCurrency(deal.value)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {deal.probability}% probabilidad
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {deal.expectedCloseDate.toLocaleDateString('es-MX')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}