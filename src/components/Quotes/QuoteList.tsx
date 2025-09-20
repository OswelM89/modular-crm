import { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, User, Building2, Edit, Trash2, Eye } from 'lucide-react';
import { Quote } from '../../types';
import { SkeletonHeader, SkeletonTable } from '../UI/SkeletonLoader';
import { SubscriptionModal } from '../UI/SubscriptionModal';
// import { mockQuotes } from '../../data/mockData'; // Removed mock data
import { useTranslation } from '../../hooks/useTranslation';
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck';
import { CreateQuotePage } from './CreateQuotePage';

export function QuoteList() {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterResponsible, setFilterResponsible] = useState<string>('all');
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { t } = useTranslation();
  const { showSubscriptionModal, setShowSubscriptionModal, checkSubscription } = useSubscriptionCheck();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterResponsible]);

  // Si está en modo crear cotización, mostrar esa página
  if (showCreateQuote) {
    return <CreateQuotePage onBack={() => setShowCreateQuote(false)} />;
  }

  const statuses = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'draft', label: 'Borrador' },
    { value: 'sent', label: 'Enviado' },
    { value: 'accepted', label: 'Aceptado' },
    { value: 'rejected', label: 'Rechazado' },
    { value: 'expired', label: 'Vencido' },
  ];

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    const matchesResponsible = filterResponsible === 'all' || 
                              (quote.contact && `${quote.contact.firstName} ${quote.contact.lastName}` === filterResponsible);
    return matchesSearch && matchesStatus && matchesResponsible;
  });

  // Get unique responsible persons
  const responsibleOptions = [
    { value: 'all', label: 'Todos los responsables' },
    ...Array.from(new Set(quotes
      .filter(quote => quote.contact)
      .map(quote => `${quote.contact!.firstName} ${quote.contact!.lastName}`)))
      .map(name => ({ value: name, label: name }))
  ];

  // Pagination logic
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotes = filteredQuotes.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuotes.length === paginatedQuotes.length && paginatedQuotes.length > 0) {
      setSelectedQuotes(prev => prev.filter(id => !paginatedQuotes.map(quote => quote.id).includes(id)));
    } else {
      setSelectedQuotes(prev => [...new Set([...prev, ...paginatedQuotes.map(quote => quote.id)])]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedQuotes.length === 0) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar ${selectedQuotes.length} cotización(es)?`
    );
    
    if (confirmDelete) {
      setQuotes(prev => prev.filter(quote => !selectedQuotes.includes(quote.id)));
      setSelectedQuotes([]);
    }
  };

  const handleDownloadSelected = () => {
    if (selectedQuotes.length === 0) return;
    
    const selectedQuotesData = quotes.filter(quote => 
      selectedQuotes.includes(quote.id)
    );
    
    // Crear CSV
    const headers = ['Número', 'Título', 'Cliente', 'Contacto', 'Estado', 'Total', 'Válida hasta'];
    const csvContent = [
      headers.join(','),
      ...selectedQuotesData.map(quote => [
        quote.quoteNumber,
        quote.title,
        quote.company?.name || '',
        `${quote.contact?.firstName} ${quote.contact?.lastName}`,
        getStatusLabel(quote.status),
        quote.total,
        quote.validUntil.toLocaleDateString('es-MX')
      ].join(','))
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cotizaciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'expired': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'draft': 'Borrador',
      'sent': 'Enviado',
      'accepted': 'Aceptado',
      'rejected': 'Rechazado',
      'expired': 'Vencido',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonHeader />
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-0" style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('quotes.title')}</h1>
          <p className="text-gray-600" style={{ fontSize: '18px' }}>{t('quotes.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedQuotes.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedQuotes.length} {t('contacts.selected')}
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
                <Trash2 className="w-4 h-4 mr-2" />
                {t('contacts.delete')}
              </button>
            </>
          )}
          <button 
            onClick={() => checkSubscription(() => setShowCreateQuote(true))}
            className="inline-flex items-center px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md font-semibold rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('quotes.new')}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder={t('quotes.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              value={filterResponsible}
              onChange={(e) => setFilterResponsible(e.target.value)}
              className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {responsibleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
                    checked={paginatedQuotes.length > 0 && paginatedQuotes.every(quote => selectedQuotes.includes(quote.id))}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cotización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Válida hasta
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedQuotes.includes(quote.id)}
                      onChange={() => handleSelectQuote(quote.id)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary hover:text-primary/70 transition-colors cursor-pointer">
                      {quote.quoteNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#FF6200]">
                          {quote.title.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{quote.title}</div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          {quote.contact?.firstName} {quote.contact?.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {quote.company ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <Building2 className="w-4 h-4 mr-2" />
                          {quote.company.name}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-900">
                          <User className="w-4 h-4 mr-2" />
                          {quote.contact?.firstName} {quote.contact?.lastName}
                          <span className="ml-2 text-xs text-gray-500">(Independiente)</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(quote.total)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {quote.validUntil.toLocaleDateString('es-MX')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100 shadow-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-primary hover:text-primary/70 transition-colors rounded-lg bg-primary/10 hover:bg-primary/20 shadow-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-900 transition-colors rounded-lg bg-red-50 hover:bg-red-100 shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredQuotes.length)} de {filteredQuotes.length} resultados
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
}