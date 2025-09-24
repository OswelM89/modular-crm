import React from 'react';
import { Plus, Building2, Trash2, MoreVertical } from 'lucide-react';
import { SkeletonHeader, SkeletonTable } from '../UI/SkeletonLoader';
import { ContactForm } from './ContactForm';
import { ContactDetail } from './ContactDetail';
import { SubscriptionModal } from '../UI/SubscriptionModal';
import { useTranslation } from '../../hooks/useTranslation';
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck';
import { fetchContacts, deleteContact, type Contact } from '../../utils/contacts';
import { supabase } from '../../integrations/supabase/client';

export function ContactList() {
  const [loading, setLoading] = React.useState(true);
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [userProfiles, setUserProfiles] = React.useState<{[key: string]: {first_name: string, last_name: string}}>({});
  const [searchTerm, setSearchTerm] = React.useState('');
  const [responsibleFilter, setResponsibleFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showContactForm, setShowContactForm] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = React.useState<string[]>([]);
  const { t } = useTranslation();
  const { showSubscriptionModal, setShowSubscriptionModal, checkSubscription } = useSubscriptionCheck();

  const ITEMS_PER_PAGE = 20;

  // Load contacts from database
  React.useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const contactsData = await fetchContacts();
        setContacts(contactsData);
        
        // Get unique user IDs and fetch their profiles
        const uniqueUserIds = [...new Set(contactsData.map(contact => contact.user_id))];
        if (uniqueUserIds.length > 0) {
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', uniqueUserIds);
          
          if (!error && profiles) {
            const profilesMap = profiles.reduce((acc, profile) => {
              acc[profile.id] = {
                first_name: profile.first_name || '',
                last_name: profile.last_name || ''
              };
              return acc;
            }, {} as {[key: string]: {first_name: string, last_name: string}});
            setUserProfiles(profilesMap);
          }
        }
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
        const profile = userProfiles[contact.user_id];
        const displayName = profile 
          ? `${profile.first_name} ${profile.last_name}`.trim() || `Usuario ${contact.user_id.slice(-5).toUpperCase()}`
          : `Usuario ${contact.user_id.slice(-5).toUpperCase()}`;
        
        acc.push({
          id: contact.user_id,
          name: displayName
        });
      }
      return acc;
    }, [] as { id: string; name: string }[]);
    return responsibleUsers;
  }, [contacts, userProfiles]);

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
            onClick={() => checkSubscription(() => setShowContactForm(true))}
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
            <div className="flex items-center space-x-4 flex-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-gray-600">Seleccionar todo</span>
              </label>
              <input
                type="text"
                placeholder={t('contacts.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
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

        <div className="space-y-4">
          {/* Contact Cards */}
          {paginatedContacts.map((contact) => (
            <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                {/* Left section with checkbox and main info */}
                <div className="flex items-center space-x-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <button
                          onClick={() => handleContactClick(contact)}
                          className="text-lg font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer block mb-1"
                        >
                          {contact.first_name} {contact.last_name}
                        </button>
                        <p className="text-sm text-gray-600">
                          {contact.position || 'Sin cargo'} at {userProfiles[contact.user_id] ? 
                            `${userProfiles[contact.user_id].first_name} ${userProfiles[contact.user_id].last_name}`.trim() : 
                            'Empresa no especificada'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right section with contact details */}
                <div className="flex items-center space-x-6">
                  <div className="text-right min-w-[120px]">
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <div className="text-sm text-gray-900">{contact.email}</div>
                  </div>
                  
                  <div className="text-right min-w-[120px]">
                    <div className="text-sm text-gray-500 mb-1">Phone</div>
                    <div className="text-sm text-gray-900">{contact.phone || 'No disponible'}</div>
                  </div>
                  
                  <div className="text-right min-w-[120px]">
                    <div className="text-sm text-gray-500 mb-1">Responsable</div>
                    <div className="text-sm text-gray-900">
                      {userProfiles[contact.user_id] ? 
                        `${userProfiles[contact.user_id].first_name} ${userProfiles[contact.user_id].last_name}`.trim() : 
                        `Usuario ${contact.user_id.slice(-5).toUpperCase()}`}
                    </div>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {paginatedContacts.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contactos</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || responsibleFilter !== 'all' 
                  ? 'No se encontraron contactos con los filtros aplicados.' 
                  : 'Comienza agregando tu primer contacto.'}
              </p>
              {!searchTerm && responsibleFilter === 'all' && (
                <button 
                  onClick={() => checkSubscription(() => setShowContactForm(true))}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Contacto
                </button>
              )}
            </div>
          )}
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

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
}