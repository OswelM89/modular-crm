import React, { useState } from 'react';
import { Plus, Trash2, Save, Send, Calculator } from 'lucide-react';
import { QuoteItem } from '../../types';
import { SkeletonForm } from '../UI/SkeletonLoader';

export function QuoteBuilder() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
  ]);
  const [taxRate, setTaxRate] = useState(16);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Crear Cotización</h3>
            <p className="text-sm text-gray-600">Genera cotizaciones profesionales</p>
          </div>
          <div className="flex gap-2">
            <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-36 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonForm />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Crear Cotización</h3>
          <p className="text-sm text-gray-600">Genera cotizaciones profesionales</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
            <Save className="w-4 h-4 mr-2" />
            Guardar Borrador
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Send className="w-4 h-4 mr-2" />
            Enviar Cotización
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información General</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Cotización
                </label>
                <input
                  type="text"
                 className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="Ej: Sistema CRM Personalizado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Válida hasta
                </label>
                <input
                  type="date"
                 className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente/Empresa
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent">
                  <option value="">Seleccionar cliente...</option>
                  <option value="1">TechCorp Solutions</option>
                  <option value="2">Innovate Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacto
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent">
                  <option value="">Seleccionar contacto...</option>
                  <option value="1">María González</option>
                  <option value="2">Carlos Rodríguez</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Items de la Cotización</h4>
              <button
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 bg-[#FF6200] text-white hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50">
                  <div className="col-span-12 md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      placeholder="Descripción del producto/servicio"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                     className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      min="0"
                      step="1"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Unitario
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                     className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total
                    </label>
                    <div className="px-3 py-2 bg-gray-100 border border-gray-300 text-gray-900 font-medium">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Calculator className="w-5 h-5 text-[#FF6200] mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">Resumen</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">IVA:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                   className="w-16 px-2 py-1 border border-gray-300 text-center text-xs"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="text-xs text-gray-500">%</span>
                  <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-[#FF6200]">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Notas</h4>
            <textarea
              rows={4}
             className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
              placeholder="Términos y condiciones, notas adicionales..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}