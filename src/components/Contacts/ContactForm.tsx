import React, { useState } from 'react';
import { X, User, Building2, Mail, Phone, Briefcase, Upload, File } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { createContact, type ContactFormData } from '../../utils/contacts';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactData: import('../../utils/contacts').Contact) => void;
}

interface ContactFormErrors {
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  companyId?: string;
  position?: string;
  email?: string;
  phone?: string;
  taxDocument?: string;
}

export function ContactForm({ isOpen, onClose, onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    idNumber: '',
    companyId: '',
    position: '',
    email: '',
    phone: '',
    taxDocument: null,
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
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

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
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
    const newErrors: ContactFormErrors = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('contacts.form.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('contacts.form.lastNameRequired');
    }

    // ID Number validation - required and format check
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'Cédula/RUT es requerido';
    } else if (formData.idNumber.length < 8) {
      newErrors.idNumber = 'Cédula/RUT debe tener al menos 8 caracteres';
    }

    // Company selection validation - optional

    // Position validation - optional

    // Email validation - optional but format check if provided
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contacts.form.invalidEmail');
    }

    // Phone validation - optional but format check if provided
    if (formData.phone.trim() && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    // Tax document validation - optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const newContact = await createContact(formData);
        onSubmit(newContact);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          idNumber: '',
          companyId: '',
          position: '',
          email: '',
          phone: '',
          taxDocument: null,
        });
        onClose();
      } catch (error) {
        console.error('Error creating contact:', error);
        alert('Error al crear el contacto. Por favor intenta de nuevo.');
      }
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
       idNumber: '',
      companyId: '',
      position: '',
      email: '',
      phone: '',
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
            <h2 className="text-xl font-semibold text-gray-900">{t('contacts.form.title')}</h2>
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
              {/* Nombre */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contacts.form.firstName')} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                     className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('contacts.form.firstNamePlaceholder')}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contacts.form.lastName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                   className={`w-full px-4 py-2 border focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('contacts.form.lastNamePlaceholder')}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Cédula de Identidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contacts.form.idNumber')} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                     className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.idNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('contacts.form.idNumberPlaceholder')}
                  />
                </div>
                {errors.idNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
                )}
              </div>

              {/* Empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contacts.form.company')}
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.companyId}
                    onChange={(e) => handleInputChange('companyId', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                      errors.companyId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre de la empresa (opcional)"
                  />
                </div>
                {errors.companyId && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>
                )}
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contacts.form.position')}
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                      errors.position ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('contacts.form.positionPlaceholder')}
                  />
                </div>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contacts.form.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                   className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('contacts.form.emailPlaceholder')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contacts.form.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('contacts.form.phonePlaceholder')}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Documento Fiscal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contacts.form.taxDocument')}
                </label>
                <div className={`border-2 border-dashed p-4 hover:border-primary transition-colors ${
                  errors.taxDocument ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <input
                    type="file"
                    id="taxDocument"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label
                    htmlFor="taxDocument"
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
                          <p className="text-sm font-medium text-gray-900">
                            {t('contacts.form.uploadDocument')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t('contacts.form.fileTypes')}
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                  {formData.taxDocument && (
                    <button
                      type="button"
                      onClick={() => handleFileChange(null)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 transition-colors"
                    >
                      {t('contacts.form.removeFile')}
                    </button>
                  )}
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
                  className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-semibold rounded-lg"
                >
                  {t('contacts.form.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md font-semibold rounded-lg"
                >
                  {t('contacts.form.create')}
                </button>
              </div>
            </div>
          </form>
      </div>
    </div>
  );
}