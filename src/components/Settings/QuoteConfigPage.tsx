import React, { useState } from 'react';
import { ArrowLeft, FileText, Save, X, Upload, Building2, Mail, Phone, MapPin } from 'lucide-react';

interface QuoteConfigPageProps {
  onBack: () => void;
}

export function QuoteConfigPage({ onBack }: QuoteConfigPageProps) {
  const [config, setConfig] = useState({
    companyInfo: {
      name: 'Modular CRM',
      address: 'Tu dirección comercial',
      phone: '+52 55 1234 5678',
      email: 'contacto@modularcrm.com',
      website: 'www.modularcrm.com',
      taxId: 'RFC123456789'
    },
    quoteSettings: {
      prefix: 'COT',
      startNumber: 1,
      validityDays: 30,
      currency: 'MXN',
      taxRate: 16,
      showTax: true,
      showDiscount: false,
      autoSend: false
    },
    template: {
      headerColor: '#FF6200',
      showLogo: true,
      footerText: 'Gracias por su confianza',
      termsAndConditions: 'Cotización válida por 30 días. Precios sujetos a cambios sin previo aviso.'
    }
  });

  const [logo, setLogo] = useState<File | null>(null);

  const handleCompanyInfoChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }));
  };

  const handleQuoteSettingsChange = (field: string, value: string | number | boolean) => {
    setConfig(prev => ({
      ...prev,
      quoteSettings: {
        ...prev.quoteSettings,
        [field]: value
      }
    }));
  };

  const handleTemplateChange = (field: string, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      template: {
        ...prev.template,
        [field]: value
      }
    }));
  };

  const handleLogoChange = (file: File | null) => {
    setLogo(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Guardar configuración:', config);
    // Aquí iría la lógica para guardar la configuración
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
            Configurar Cotización
          </h1>
          <p className="text-sm text-gray-600">
            Personaliza plantillas y configuración de cotizaciones
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de la Empresa */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Empresa</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={config.companyInfo.name}
                  onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="Nombre de tu empresa"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RFC / Tax ID
              </label>
              <input
                type="text"
                value={config.companyInfo.taxId}
                onChange={(e) => handleCompanyInfoChange('taxId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                placeholder="RFC123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={config.companyInfo.email}
                  onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="contacto@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  value={config.companyInfo.phone}
                  onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="+52 55 1234 5678"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <textarea
                rows={3}
                value={config.companyInfo.address}
                onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                placeholder="Dirección completa de la empresa"
              />
            </div>
          </div>
        </div>

        {/* Configuración de Cotizaciones */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Cotizaciones</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prefijo
              </label>
              <input
                type="text"
                value={config.quoteSettings.prefix}
                onChange={(e) => handleQuoteSettingsChange('prefix', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                placeholder="COT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número Inicial
              </label>
              <input
                type="number"
                value={config.quoteSettings.startNumber}
                onChange={(e) => handleQuoteSettingsChange('startNumber', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validez (días)
              </label>
              <input
                type="number"
                value={config.quoteSettings.validityDays}
                onChange={(e) => handleQuoteSettingsChange('validityDays', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select
                value={config.quoteSettings.currency}
                onChange={(e) => handleQuoteSettingsChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
              >
                <option value="MXN">Peso Mexicano (MXN)</option>
                <option value="USD">Dólar Americano (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Impuesto (%)
              </label>
              <input
                type="number"
                value={config.quoteSettings.taxRate}
                onChange={(e) => handleQuoteSettingsChange('taxRate', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.quoteSettings.showTax}
                onChange={(e) => handleQuoteSettingsChange('showTax', e.target.checked)}
                className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar impuestos en cotizaciones</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.quoteSettings.showDiscount}
                onChange={(e) => handleQuoteSettingsChange('showDiscount', e.target.checked)}
                className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Permitir descuentos</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.quoteSettings.autoSend}
                onChange={(e) => handleQuoteSettingsChange('autoSend', e.target.checked)}
                className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Envío automático por email</span>
            </label>
          </div>
        </div>

        {/* Plantilla y Diseño */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plantilla y Diseño</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo de la Empresa
              </label>
              <div className="border-2 border-dashed border-gray-300 p-4">
                <input
                  type="file"
                  id="logo"
                  accept=".png,.jpg,.jpeg,.svg"
                  onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="logo"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  {logo ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm font-medium">{logo.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          Subir logo
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, SVG (máx. 2MB)
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color del Encabezado
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.template.headerColor}
                  onChange={(e) => handleTemplateChange('headerColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300"
                />
                <input
                  type="text"
                  value={config.template.headerColor}
                  onChange={(e) => handleTemplateChange('headerColor', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="#FF6200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto del Pie de Página
              </label>
              <input
                type="text"
                value={config.template.footerText}
                onChange={(e) => handleTemplateChange('footerText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                placeholder="Gracias por su confianza"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Términos y Condiciones
              </label>
              <textarea
                rows={4}
                value={config.template.termsAndConditions}
                onChange={(e) => handleTemplateChange('termsAndConditions', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                placeholder="Términos y condiciones de la cotización..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700"
          >
            <X className="w-4 h-4 mr-2 inline" />
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#FF6200] text-white"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  );
}