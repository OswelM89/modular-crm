import React, { useState } from 'react';
import { X, Building2, Hash, Briefcase, Globe, Mail, Phone, MapPin, Map, Upload, File } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { CompanyFormData } from '../../utils/companies';

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyData: CompanyFormData) => Promise<void>;
}

export function CompanyForm({ isOpen, onClose, onSubmit }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    nit: '',
    sector: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    taxDocument: null,
  });

  const [errors, setErrors] = useState<Partial<CompanyFormData & {taxDocument?: string}>>({});
  const { t } = useTranslation();

  // Bloquear scroll del body cuando el modal está abierto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, taxDocument: file }));
    // Clear error when user selects a file
    if (errors.taxDocument) {
      setErrors(prev => ({ ...prev, taxDocument: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CompanyFormData & {taxDocument?: string}> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('companies.form.nameRequired');
    }

    if (!formData.nit.trim()) {
      newErrors.nit = t('companies.form.nitRequired');
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('companies.form.invalidEmail');
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = t('companies.form.invalidWebsite');
    }

    // Tax document validation - optional
    // No validation needed as it's optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(formData);
        // Reset form
        setFormData({
          name: '',
          nit: '',
          sector: '',
          website: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          country: '',
          taxDocument: null,
        });
        onClose();
      } catch (error) {
        console.error('Error creating company:', error);
        alert('Error al crear la empresa. Por favor intenta de nuevo.');
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      nit: '',
      sector: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      taxDocument: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 inset-y-0 w-full sm:w-96 bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900">{t('companies.form.title')}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Nombre de la empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('companies.form.name')} *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('companies.form.namePlaceholder')}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* NIT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('companies.form.nit')} *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.nit}
                    onChange={(e) => handleInputChange('nit', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.nit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('companies.form.nitPlaceholder')}
                  />
                </div>
                {errors.nit && (
                  <p className="mt-1 text-sm text-red-600">{errors.nit}</p>
                )}
              </div>

              {/* Sector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('companies.form.sector')}
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('companies.form.sectorPlaceholder')}
                  />
                </div>
              </div>

              {/* Sitio Web */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('companies.form.website')}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('companies.form.websitePlaceholder')}
                  />
                </div>
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                )}
              </div>

              {/* Email Principal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('companies.form.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('companies.form.emailPlaceholder')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Teléfono Principal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('companies.form.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('companies.form.phonePlaceholder')}
                  />
                </div>
              </div>

              {/* Dirección Principal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('companies.form.address')}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('companies.form.addressPlaceholder')}
                  />
                </div>
              </div>

              {/* Ciudad Principal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('companies.form.city')}
                </label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('companies.form.cityPlaceholder')}
                  />
                </div>
              </div>

              {/* País */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('companies.form.country')}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('companies.form.countryPlaceholder')}
                  />
                </div>
              </div>

              {/* Documento Fiscal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documento Fiscal
                </label>
                <div className={`border-2 border-dashed p-4 hover:border-primary transition-colors ${
                  errors.taxDocument ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <input
                    type="file"
                    id="companyTaxDocument"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label
                    htmlFor="companyTaxDocument"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    {formData.taxDocument ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <File className="w-5 h-5" />
                        <span className="text-sm font-medium">{formData.taxDocument.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">
                            Subir documento fiscal
                          </p>
                          <p className="text-xs text-gray-500">
                            RUT, Certificado de constitución, etc. (Opcional)
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PDF, JPG, PNG, DOC hasta 10MB
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
                {errors.taxDocument && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxDocument}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t('companies.form.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t('companies.form.create')}
                </button>
              </div>
            </div>
          </form>
      </div>
    </div>
  );
}