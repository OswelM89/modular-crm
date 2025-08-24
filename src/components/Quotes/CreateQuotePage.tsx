import React, { useState } from 'react';
import { ArrowLeft, Save, Send, Plus, Trash2, Calculator, Building2, User, Globe, DollarSign, FileText, Info } from 'lucide-react';
import { mockCompanies, mockContacts } from '../../data/mockData';

interface CreateQuotePageProps {
  onBack: () => void;
}

interface QuoteItem {
  id: string;
  description: string;
  detailedDescription?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

interface QuoteFormData {
  title: string;
  currency: string;
  description: string;
  contactId: string;
  companyId: string;
  formalMessage: string;
  items: QuoteItem[];
  showTax: boolean;
  taxRate: number;
  showDiscount: boolean;
  discountRate: number;
  legalInfo: string;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    taxId: string;
    website: string;
  };
}

export function CreateQuotePage({ onBack }: CreateQuotePageProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    title: '',
    currency: 'MXN',
    description: '',
    contactId: '',
    companyId: '',
    formalMessage: 'Estimado cliente,\n\nNos complace presentarle la siguiente cotización para los servicios solicitados.',
    items: [
      {
        id: '1',
        description: '',
        detailedDescription: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        notes: '',
      }
    ],
    showTax: true,
    taxRate: 16,
    showDiscount: false,
    discountRate: 0,
    legalInfo: 'Esta cotización es válida por 30 días. Los precios están sujetos a cambios sin previo aviso. Se requiere el 50% de anticipo para iniciar el proyecto.',
    companyInfo: {
      name: 'Modular CRM',
      address: 'Tu dirección comercial, Ciudad, País',
      phone: '+52 55 1234 5678',
      email: 'contacto@modularcrm.com',
      taxId: 'RFC123456789',
      website: 'www.modularcrm.com'
    }
  });

  const currencies = [
    { value: 'MXN', label: 'Peso Mexicano (MXN)', symbol: '$' },
    { value: 'USD', label: 'Dólar Americano (USD)', symbol: '$' },
    { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
    { value: 'GBP', label: 'Libra Esterlina (GBP)', symbol: '£' }
  ];

  const selectedCurrency = currencies.find(c => c.value === formData.currency) || currencies[0];
  const selectedContact = mockContacts.find(c => c.id === formData.contactId);
  const selectedCompany = mockCompanies.find(c => c.id === formData.companyId);

  const handleInputChange = (field: keyof QuoteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyInfoChange = (field: keyof QuoteFormData['companyInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }));
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      detailedDescription: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      notes: '',
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  // Cálculos
  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = formData.showDiscount ? subtotal * (formData.discountRate / 100) : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = formData.showTax ? subtotalAfterDiscount * (formData.taxRate / 100) : 0;
  const total = subtotalAfterDiscount + taxAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: formData.currency,
    }).format(amount);
  };

  const handleSave = () => {
    console.log('Guardar cotización:', formData);
    // Aquí iría la lógica para guardar
  };

  const handleSend = () => {
    console.log('Enviar cotización:', formData);
    // Aquí iría la lógica para enviar
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
            Crear Cotización
          </h1>
          <p className="text-sm text-gray-600">
            Genera una cotización profesional para tus clientes
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Borrador
          </button>
          <button
            onClick={handleSend}
            className="inline-flex items-center px-4 py-2 bg-[#FF6200] text-white hover:bg-orange-600 transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Cotización
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información General */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Cotización *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="Ej: Desarrollo de Sistema CRM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                placeholder="Descripción general de la cotización..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <select
                  value={formData.companyId}
                  onChange={(e) => handleInputChange('companyId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                >
                  <option value="">Seleccionar empresa...</option>
                  {mockCompanies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacto
                </label>
                <select
                  value={formData.contactId}
                  onChange={(e) => handleInputChange('contactId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                >
                  <option value="">Seleccionar contacto...</option>
                  {mockContacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mensaje Formal */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensaje Formal</h3>
            <textarea
              rows={4}
              value={formData.formalMessage}
              onChange={(e) => handleInputChange('formalMessage', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
              placeholder="Mensaje de introducción para el cliente..."
            />
          </div>

          {/* Items de la Cotización */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Items de la Cotización</h3>
              <button
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 bg-[#FF6200] text-white hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  {/* Título del Item */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-900">Item #{index + 1}</h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Nombre/Título del Item */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Item/Producto *
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      placeholder="Ej: Tablero para sistema de presión constante con variadores de velocidad Inomax Max500"
                    />
                  </div>

                  {/* Descripción Detallada */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción Detallada
                    </label>
                    <textarea
                      rows={6}
                      value={item.detailedDescription || ''}
                      onChange={(e) => updateItem(item.id, 'detailedDescription', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      placeholder="Especificaciones detalladas:&#10;• Tablero de 3 x 4 eléctrico&#10;• Variadores Inomax Max500 x 2&#10;• Interruptores termomagnéticos&#10;• Contactores principales&#10;• Etc..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Especifica todos los componentes y características técnicas del item
                    </p>
                  </div>

                  {/* Cantidad, Precio y Total en una fila */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cantidad *
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                        min="0"
                        step="1"
                        placeholder="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Unitario *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          {selectedCurrency.symbol}
                        </span>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total
                      </label>
                      <div className="px-3 py-2 bg-white border border-gray-300 text-gray-900 font-semibold rounded">
                        {formatCurrency(item.total)}
                      </div>
                    </div>

                    <div className="flex items-end">
                      <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-center">
                        <span className="text-xs text-gray-500">Item #{index + 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notas adicionales del item */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas Adicionales
                    </label>
                    <textarea
                      rows={2}
                      value={item.notes || ''}
                      onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      placeholder="Tiempo de entrega, garantías, condiciones especiales, etc."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información Legal */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Info className="w-5 h-5 inline mr-2" />
              Información Legal
            </h3>
            <textarea
              rows={4}
              value={formData.legalInfo}
              onChange={(e) => handleInputChange('legalInfo', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
              placeholder="Términos y condiciones, información legal..."
            />
          </div>

          {/* Datos de la Empresa */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Building2 className="w-5 h-5 inline mr-2" />
              Datos de la Empresa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={formData.companyInfo.name}
                  onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RFC / Tax ID
                </label>
                <input
                  type="text"
                  value={formData.companyInfo.taxId}
                  onChange={(e) => handleCompanyInfoChange('taxId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.companyInfo.email}
                  onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.companyInfo.phone}
                  onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio Web
                </label>
                <input
                  type="url"
                  value={formData.companyInfo.website}
                  onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.companyInfo.address}
                  onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Totalizador */}
        <div className="space-y-6">
          {/* Resumen de Cliente */}
          {(selectedCompany || selectedContact) && (
            <div className="bg-white border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Cliente</h4>
              
              {selectedCompany && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">{selectedCompany.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedCompany.sector}</p>
                </div>
              )}
              
              {selectedContact && (
                <div>
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedContact.position}</p>
                  <p className="text-sm text-gray-600">{selectedContact.email}</p>
                </div>
              )}
            </div>
          )}

          {/* Totalizador */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Calculator className="w-5 h-5 text-[#FF6200] mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">Totalizador</h4>
            </div>
            
            <div className="space-y-4">
              {/* Opciones de IVA y Descuento */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showDiscount}
                    onChange={(e) => handleInputChange('showDiscount', e.target.checked)}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Aplicar descuento</span>
                </label>

                {formData.showDiscount && (
                  <div className="ml-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={formData.discountRate}
                        onChange={(e) => handleInputChange('discountRate', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 text-center text-sm"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                )}

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showTax}
                    onChange={(e) => handleInputChange('showTax', e.target.checked)}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Incluir IVA</span>
                </label>

                {formData.showTax && (
                  <div className="ml-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={formData.taxRate}
                        onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 text-center text-sm"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cálculos */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                
                {formData.showDiscount && discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Descuento ({formData.discountRate}%):</span>
                    <span className="font-medium text-red-600">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                
                {formData.showTax && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA ({formData.taxRate}%):</span>
                    <span className="font-medium text-gray-900">{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-[#FF6200]">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}