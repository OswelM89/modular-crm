import { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, User, Building2, Edit, Trash2, Eye } from 'lucide-react';
import { Quote } from '../../types';
import { SkeletonHeader, SkeletonTable } from '../UI/SkeletonLoader';
import { mockQuotes } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';
import { CreateQuotePage } from './CreateQuotePage';

export function QuoteList() {
  const [loading, setLoading] = useState(true);
  const [quotes] = useState<Quote[]>(mockQuotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);


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
    return matchesSearch && matchesStatus;
  });

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
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowCreateQuote(true)}
            className="inline-flex items-center px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md font-semibold rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('quotes.new')}
          </button>
          
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder={t('quotes.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.quoteNumber}</div>
                      <div className="text-sm text-gray-600">{quote.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-2" />
                        {quote.company?.name}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        {quote.contact?.firstName} {quote.contact?.lastName}
                      </div>
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
      </div>
    </div>
  );
}