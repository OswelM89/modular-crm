import React from 'react';
import { Plus, Mail, Phone, Building2, Trash2 } from 'lucide-react';
import { SkeletonHeader, SkeletonTable } from '../UI/SkeletonLoader';
import { ContactForm } from './ContactForm';
import { ContactDetail } from './ContactDetail';
import { useTranslation } from '../../hooks/useTranslation';
import { fetchContacts, deleteContact, type Contact } from '../../utils/contacts';

export function ContactList() {
  const [loading, setLoading] = React.useState(true);
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [responsibleFilter, setResponsibleFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showContactForm, setShowContactForm] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = React.useState<string[]>([]);
  const { t } = useTranslation();

  const ITEMS_PER_PAGE = 20;

  // Load contacts from database
  React.useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const contactsData = await fetchContacts();
        setContacts(contactsData);
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResponsible = responsibleFilter === 'all' || contact.user_id === responsibleFilter;
    return matchesSearch && matchesResponsible;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  // Get unique responsible users
  const uniqueResponsible = React.useMemo(() => {
    const responsibleUsers = contacts.reduce((acc, contact) => {
      if (!acc.some(user => user.id === contact.user_id)) {
        acc.push({
          id: contact.user_id,
          name: `Usuario ${contact.user_id.slice(-5).toUpperCase()}`
        });
      }
      return acc;
    }, [] as { id: string; name: string }[]);
    return responsibleUsers;
  }, [contacts]);

  const handleCreateContact = (newContact: Contact) => {
    setContacts(prev => [newContact, ...prev]);
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(paginatedContacts.map(contact => contact.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar ${selectedContacts.length} contacto(s)?`
    );
    
    if (confirmDelete) {
      try {
        // Delete from database
        await Promise.all(selectedContacts.map(id => deleteContact(id)));
        // Update local state
        setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
        setSelectedContacts([]);
      } catch (error) {
        console.error('Error deleting contacts:', error);
        alert('Error al eliminar los contactos. Por favor intenta de nuevo.');
      }
    }
  };

  const handleDownloadSelected = () => {
    if (selectedContacts.length === 0) return;
    
    const selectedContactsData = contacts.filter(contact => 
      selectedContacts.includes(contact.id)
    );
    
    // Crear CSV
    const headers = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Empresa', 'Cargo', 'Cédula'];
    const csvContent = [
      headers.join(','),
      ...selectedContactsData.map(contact => [
        contact.first_name,
        contact.last_name,
        contact.email || '',
        contact.phone || '',
        '', // company name - not available in current structure
        contact.position || '',
        contact.id_number || ''
      ].join(','))
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contactos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleBackToList = () => {
    setSelectedContact(null);
  };

  const handleUpdateContact = async (updatedContact: Contact) => {
    try {
      // Solo actualizar el estado local ya que la actualización en BD se hizo en ContactDetail
      setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
      setSelectedContact(updatedContact);
    } catch (error) {
      console.error('Error updating contact in list:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      setContacts(prev => prev.filter(c => c.id !== contactId));
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error al eliminar el contacto. Por favor intenta de nuevo.');
    }
  };

  // Si hay un contacto seleccionado, mostrar la vista de detalle
  if (selectedContact) {
    return (
      <ContactDetail
        contact={selectedContact}
        onBack={handleBackToList}
        onUpdate={handleUpdateContact}
        onDelete={handleDeleteContact}
      />
    );
  }

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
          <h1 className="text-gray-900 mb-0" style={{ fontSize: '1.875rem', fontWeight: '700' }}>{t('contacts.title')}</h1>
          <p className="text-gray-600" style={{ fontSize: '18px' }}>{t('contacts.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedContacts.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedContacts.length} {t('contacts.selected')}
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
            onClick={() => setShowContactForm(true)}
            className="inline-flex items-center px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md font-semibold rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('contacts.new')}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder={t('contacts.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <select
              value={responsibleFilter}
              onChange={(e) => setResponsibleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos los responsables</option>
              {uniqueResponsible.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
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
                    checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                    onChange={handleSelectAll}
                   className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posición
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                     className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#FF6200]">
                          {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleContactClick(contact)}
                          className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors cursor-pointer"
                        >
                          {contact.first_name} {contact.last_name}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">-</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{contact.position || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {contact.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {contact.phone}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {startIndex + 1} - {Math.min(endIndex, filteredContacts.length)} de {filteredContacts.length} contactos
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current page
                const showPage = pageNum === 1 || 
                                pageNum === totalPages || 
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                
                if (!showPage && pageNum === 2 && currentPage > 4) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                if (!showPage && pageNum === totalPages - 1 && currentPage < totalPages - 3) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                if (!showPage) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <ContactForm
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        onSubmit={handleCreateContact}
      />
    </div>
  );
}