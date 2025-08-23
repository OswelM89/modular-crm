import React from 'react';
import { Download, Mail, Printer } from 'lucide-react';
import { Quote } from '../../types';

interface QuoteViewerProps {
  quote: Quote;
  onClose: () => void;
}

export function QuoteViewer({ quote, onClose }: QuoteViewerProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {quote.quoteNumber} - {quote.title}
            </h3>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                Enviar
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">De:</h4>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">CotizaLow.co</p>
                <p>Tu Empresa S.A. de C.V.</p>
                <p>RFC: TUE123456789</p>
                <p>contacto@cotizalow.co</p>
                <p>+52 55 1234 5678</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Para:</h4>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{quote.company?.name}</p>
                <p>{quote.contact?.firstName} {quote.contact?.lastName}</p>
                <p>{quote.contact?.position}</p>
                <p>{quote.contact?.email}</p>
                <p>{quote.contact?.phone}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-900">Descripción</th>
                  <th className="text-center py-3 text-sm font-semibold text-gray-900">Cantidad</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Precio Unit.</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm text-gray-900">{item.description}</td>
                    <td className="py-4 text-sm text-gray-900 text-center">{item.quantity}</td>
                    <td className="py-4 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">{formatCurrency(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA ({quote.taxRate}%):</span>
                <span className="font-medium text-gray-900">{formatCurrency(quote.tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-[#FF6200]">{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {quote.notes && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Notas y Términos:</h5>
              <p className="text-sm text-gray-600">{quote.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}