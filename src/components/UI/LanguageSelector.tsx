import { useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  es: {
    // Header
    'search.placeholder': 'Buscar...',
    'profile.settings': 'Configuración',
    'profile.logout': 'Salir',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.contacts': 'Contactos',
    'nav.companies': 'Empresas',
    'nav.deals': 'Negocios',
    'nav.quotes': 'Cotizaciones',
    'nav.pipeline': 'Pipeline',
    'nav.reports': 'Novedades',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalContacts': 'Total Contactos',
    'dashboard.companies': 'Empresas',
    'dashboard.activeDeals': 'Negocios Activos',
    'dashboard.pendingQuotes': 'Cotizaciones Pendientes',
    'dashboard.monthlyRevenue': 'Ingresos del Mes',
    'dashboard.wonDeals': 'Negocios Ganados',
    'dashboard.recentDeals': 'Negocios Recientes',
    'dashboard.recentQuotes': 'Cotizaciones Recientes',
    
    // Contacts
    'contacts.title': 'Contactos',
    'contacts.subtitle': 'Gestiona todos tus contactos de clientes',
    'contacts.new': 'Nuevo Contacto',
    'contacts.search': 'Buscar contactos...',
    'contacts.selected': 'seleccionado(s)',
    'contacts.download': 'Descargar',
    'contacts.delete': 'Eliminar',
    'contacts.form.title': 'Nuevo Contacto',
    'contacts.form.firstName': 'Nombre',
    'contacts.form.lastName': 'Apellido',
    'contacts.form.idNumber': 'Cédula de Identidad',
    'contacts.form.company': 'Empresa',
    'contacts.form.position': 'Cargo',
    'contacts.form.email': 'Email',
    'contacts.form.phone': 'Teléfono',
    'contacts.form.taxDocument': 'Documento Fiscal',
    'contacts.form.selectCompany': 'Seleccionar empresa...',
    'contacts.form.searchCompany': 'Buscar empresa...',
    'contacts.form.noCompany': 'Sin empresa',
    'contacts.form.noCompaniesFound': 'No se encontraron empresas',
    'contacts.form.uploadDocument': 'Subir documento fiscal',
    'contacts.form.fileTypes': 'PDF, JPG, PNG, DOC (máx. 10MB)',
    'contacts.form.removeFile': 'Remover archivo',
    'contacts.form.cancel': 'Cancelar',
    'contacts.form.create': 'Crear Contacto',
    'contacts.form.firstNameRequired': 'El nombre es requerido',
    'contacts.form.lastNameRequired': 'El apellido es requerido',
    'contacts.form.invalidEmail': 'Email inválido',
    'contacts.form.firstNamePlaceholder': 'Nombre',
    'contacts.form.lastNamePlaceholder': 'Apellido',
    'contacts.form.idNumberPlaceholder': 'Número de cédula',
    'contacts.form.positionPlaceholder': 'Cargo o posición',
    'contacts.form.emailPlaceholder': 'correo@ejemplo.com',
    'contacts.form.phonePlaceholder': '+52 55 1234 5678',
    
    // Companies
    'companies.title': 'Empresas',
    'companies.subtitle': 'Administra tu cartera de clientes empresariales',
    'companies.new': 'Nueva Empresa',
    'companies.search': 'Buscar empresas...',
    'companies.form.title': 'Nueva Empresa',
    'companies.form.name': 'Nombre de la empresa',
    'companies.form.nit': 'NIT',
    'companies.form.sector': 'Sector',
    'companies.form.website': 'Sitio Web',
    'companies.form.email': 'Email Principal',
    'companies.form.phone': 'Teléfono Principal',
    'companies.form.address': 'Dirección Principal',
    'companies.form.city': 'Ciudad Principal',
    'companies.form.country': 'País',
    'companies.form.cancel': 'Cancelar',
    'companies.form.create': 'Crear Empresa',
    'companies.form.nameRequired': 'El nombre de la empresa es requerido',
    'companies.form.nitRequired': 'El NIT es requerido',
    'companies.form.invalidEmail': 'Email inválido',
    'companies.form.invalidWebsite': 'El sitio web debe comenzar con http:// o https://',
    'companies.form.namePlaceholder': 'Nombre de la empresa',
    'companies.form.nitPlaceholder': 'Número de identificación tributaria',
    'companies.form.sectorPlaceholder': 'Ej: Tecnología, Manufactura, Servicios',
    'companies.form.websitePlaceholder': 'https://www.empresa.com',
    'companies.form.emailPlaceholder': 'info@empresa.com',
    'companies.form.phonePlaceholder': '+52 55 1234 5678',
    'companies.form.addressPlaceholder': 'Dirección completa de la empresa',
    'companies.form.cityPlaceholder': 'Ciudad donde opera',
    'companies.form.countryPlaceholder': 'País de operación',
    
    // Deals
    'deals.title': 'Negocios',
    'deals.subtitle': 'Administra tu pipeline de ventas',
    'deals.new': 'Nuevo Negocio',
    'deals.search': 'Buscar negocios...',
    'deals.form.title': 'Nuevo Negocio',
    'deals.form.dealTitle': 'Título',
    'deals.form.description': 'Descripción',
    'deals.form.pipeline': 'Pipeline',
    'deals.form.company': 'Empresa',
    'deals.form.contact': 'Contacto',
    'deals.form.estimatedValue': 'Valor Estimado',
    'deals.form.estimatedCloseDate': 'Fecha de Cierre Estimada',
    'deals.form.responsible': 'Responsable',
    'deals.form.dealType': 'Tipo de Negocio',
    'deals.form.priority': 'Prioridad',
    'deals.form.notes': 'Notas',
    'deals.form.cancel': 'Cancelar',
    'deals.form.create': 'Crear Negocio',
    'deals.form.titleRequired': 'El título es requerido',
    'deals.form.descriptionRequired': 'La descripción es requerida',
    'deals.form.pipelineRequired': 'Debe seleccionar un pipeline',
    'deals.form.companyOrContactRequired': 'Debe seleccionar una empresa o contacto',
    'deals.form.valueRequired': 'El valor estimado debe ser mayor a 0',
    'deals.form.dateRequired': 'La fecha de cierre es requerida',
    'deals.form.typeRequired': 'Debe seleccionar el tipo de negocio',
    'deals.form.priorityRequired': 'Debe seleccionar la prioridad',
    'deals.form.titlePlaceholder': 'Título del negocio',
    'deals.form.descriptionPlaceholder': 'Descripción del negocio',
    'deals.form.selectPipeline': 'Seleccionar pipeline...',
    'deals.form.selectCompany': 'Seleccionar empresa...',
    'deals.form.selectContact': 'Seleccionar contacto...',
    'deals.form.searchCompany': 'Buscar empresa...',
    'deals.form.searchContact': 'Buscar contacto...',
    'deals.form.noCompaniesFound': 'No se encontraron empresas',
    'deals.form.noContactsFound': 'No se encontraron contactos',
    'deals.form.defaultResponsible': 'Yo (por defecto)',
    'deals.form.selectType': 'Seleccionar tipo...',
    'deals.form.newClient': 'Cliente Nuevo',
    'deals.form.existingClient': 'Cliente Existente',
    'deals.form.selectPriority': 'Seleccionar prioridad...',
    'deals.form.highPriority': '🔴 Alta',
    'deals.form.mediumPriority': '🟡 Media',
    'deals.form.lowPriority': '🟢 Baja',
    'deals.form.notesPlaceholder': 'Notas adicionales sobre el negocio...',
    
    // Quotes
    'quotes.title': 'Cotizaciones',
    'quotes.subtitle': 'Crea y gestiona cotizaciones profesionales',
    'quotes.new': 'Nueva Cotización',
    'quotes.search': 'Buscar cotizaciones...',
    
    // Common
    'common.actions': 'Acciones',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.loading': 'Cargando...',
    'common.noData': 'No hay datos disponibles',
    'common.required': 'requerido',
    'common.optional': 'opcional',
  },
  en: {
    // Header
    'search.placeholder': 'Search...',
    'profile.settings': 'Settings',
    'profile.logout': 'Logout',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.contacts': 'Contacts',
    'nav.companies': 'Companies',
    'nav.deals': 'Deals',
    'nav.quotes': 'Quotes',
    'nav.pipeline': 'Pipeline',
    'nav.reports': 'Reports',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalContacts': 'Total Contacts',
    'dashboard.companies': 'Companies',
    'dashboard.activeDeals': 'Active Deals',
    'dashboard.pendingQuotes': 'Pending Quotes',
    'dashboard.monthlyRevenue': 'Monthly Revenue',
    'dashboard.wonDeals': 'Won Deals',
    'dashboard.recentDeals': 'Recent Deals',
    'dashboard.recentQuotes': 'Recent Quotes',
    
    // Contacts
    'contacts.title': 'Contacts',
    'contacts.subtitle': 'Manage all your client contacts',
    'contacts.new': 'New Contact',
    'contacts.search': 'Search contacts...',
    'contacts.selected': 'selected',
    'contacts.download': 'Download',
    'contacts.delete': 'Delete',
    'contacts.form.title': 'New Contact',
    'contacts.form.firstName': 'First Name',
    'contacts.form.lastName': 'Last Name',
    'contacts.form.idNumber': 'ID Number',
    'contacts.form.company': 'Company',
    'contacts.form.position': 'Position',
    'contacts.form.email': 'Email',
    'contacts.form.phone': 'Phone',
    'contacts.form.taxDocument': 'Tax Document',
    'contacts.form.selectCompany': 'Select company...',
    'contacts.form.searchCompany': 'Search company...',
    'contacts.form.noCompany': 'No company',
    'contacts.form.noCompaniesFound': 'No companies found',
    'contacts.form.uploadDocument': 'Upload tax document',
    'contacts.form.fileTypes': 'PDF, JPG, PNG, DOC (max. 10MB)',
    'contacts.form.removeFile': 'Remove file',
    'contacts.form.cancel': 'Cancel',
    'contacts.form.create': 'Create Contact',
    'contacts.form.firstNameRequired': 'First name is required',
    'contacts.form.lastNameRequired': 'Last name is required',
    'contacts.form.invalidEmail': 'Invalid email',
    'contacts.form.firstNamePlaceholder': 'First name',
    'contacts.form.lastNamePlaceholder': 'Last name',
    'contacts.form.idNumberPlaceholder': 'ID number',
    'contacts.form.positionPlaceholder': 'Position or role',
    'contacts.form.emailPlaceholder': 'email@example.com',
    'contacts.form.phonePlaceholder': '+1 555 123 4567',
    
    // Companies
    'companies.title': 'Companies',
    'companies.subtitle': 'Manage your business client portfolio',
    'companies.new': 'New Company',
    'companies.search': 'Search companies...',
    'companies.form.title': 'New Company',
    'companies.form.name': 'Company Name',
    'companies.form.nit': 'Tax ID',
    'companies.form.sector': 'Sector',
    'companies.form.website': 'Website',
    'companies.form.email': 'Primary Email',
    'companies.form.phone': 'Primary Phone',
    'companies.form.address': 'Primary Address',
    'companies.form.city': 'Primary City',
    'companies.form.country': 'Country',
    'companies.form.cancel': 'Cancel',
    'companies.form.create': 'Create Company',
    'companies.form.nameRequired': 'Company name is required',
    'companies.form.nitRequired': 'Tax ID is required',
    'companies.form.invalidEmail': 'Invalid email',
    'companies.form.invalidWebsite': 'Website must start with http:// or https://',
    'companies.form.namePlaceholder': 'Company name',
    'companies.form.nitPlaceholder': 'Tax identification number',
    'companies.form.sectorPlaceholder': 'e.g: Technology, Manufacturing, Services',
    'companies.form.websitePlaceholder': 'https://www.company.com',
    'companies.form.emailPlaceholder': 'info@company.com',
    'companies.form.phonePlaceholder': '+1 555 123 4567',
    'companies.form.addressPlaceholder': 'Complete company address',
    'companies.form.cityPlaceholder': 'Operating city',
    'companies.form.countryPlaceholder': 'Operating country',
    
    // Deals
    'deals.title': 'Deals',
    'deals.subtitle': 'Manage your sales pipeline',
    'deals.new': 'New Deal',
    'deals.search': 'Search deals...',
    'deals.form.title': 'New Deal',
    'deals.form.dealTitle': 'Title',
    'deals.form.description': 'Description',
    'deals.form.pipeline': 'Pipeline',
    'deals.form.company': 'Company',
    'deals.form.contact': 'Contact',
    'deals.form.estimatedValue': 'Estimated Value',
    'deals.form.estimatedCloseDate': 'Estimated Close Date',
    'deals.form.responsible': 'Responsible',
    'deals.form.dealType': 'Deal Type',
    'deals.form.priority': 'Priority',
    'deals.form.notes': 'Notes',
    'deals.form.cancel': 'Cancel',
    'deals.form.create': 'Create Deal',
    'deals.form.titleRequired': 'Title is required',
    'deals.form.descriptionRequired': 'Description is required',
    'deals.form.pipelineRequired': 'Must select a pipeline',
    'deals.form.companyOrContactRequired': 'Must select a company or contact',
    'deals.form.valueRequired': 'Estimated value must be greater than 0',
    'deals.form.dateRequired': 'Close date is required',
    'deals.form.typeRequired': 'Must select deal type',
    'deals.form.priorityRequired': 'Must select priority',
    'deals.form.titlePlaceholder': 'Deal title',
    'deals.form.descriptionPlaceholder': 'Deal description',
    'deals.form.selectPipeline': 'Select pipeline...',
    'deals.form.selectCompany': 'Select company...',
    'deals.form.selectContact': 'Select contact...',
    'deals.form.searchCompany': 'Search company...',
    'deals.form.searchContact': 'Search contact...',
    'deals.form.noCompaniesFound': 'No companies found',
    'deals.form.noContactsFound': 'No contacts found',
    'deals.form.defaultResponsible': 'Me (default)',
    'deals.form.selectType': 'Select type...',
    'deals.form.newClient': 'New Client',
    'deals.form.existingClient': 'Existing Client',
    'deals.form.selectPriority': 'Select priority...',
    'deals.form.highPriority': '🔴 High',
    'deals.form.mediumPriority': '🟡 Medium',
    'deals.form.lowPriority': '🟢 Low',
    'deals.form.notesPlaceholder': 'Additional notes about the deal...',
    
    // Quotes
    'quotes.title': 'Quotes',
    'quotes.subtitle': 'Create and manage professional quotes',
    'quotes.new': 'New Quote',
    'quotes.search': 'Search quotes...',
    
    // Common
    'common.actions': 'Actions',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
    'common.required': 'required',
    'common.optional': 'optional',
  }
};

export function useTranslation() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return { t, language, changeLanguage };
}

export function LanguageSelector() {
  const { language, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'es', name: 'CO Español', flag: '🇨🇴' },
    { code: 'en', name: 'US English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="text-sm font-medium text-gray-700">{currentLanguage.name}</span>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 transition-colors text-sm ${
                  language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}