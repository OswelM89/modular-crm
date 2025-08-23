import React, { useState } from 'react';
import { Plus, Mail, Phone, Building2, Edit, Trash2 } from 'lucide-react';
import { Contact } from '../../types';
import { SkeletonTable } from '../UI/SkeletonLoader';
import { mockContacts } from '../../data/mockData';
import { ContactForm, ContactFormData } from './ContactForm';
import { ContactDetail } from './ContactDetail';

export function ContactList() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateContact = (contactData: ContactFormData) => {
    const newContact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone,
      position: contactData.position,
      company: contactData.company ? {
        id: Math.random().toString(36).substr(2, 9),
        name: contactData.company,
        industry: '',
        size: '',
        website: '',
        address: '',
        phone: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } : undefined,
      idNumber: contactData.idNumber,
      taxDocument: contactData.taxDocument?.name || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
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
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedContacts.length === 0) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar ${selectedContacts.length} contacto(s)?`
    );
    
    if (confirmDelete) {
      setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
      setSelectedContacts([]);
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
        contact.firstName,
        contact.lastName,
        contact.email || '',
        contact.phone || '',
        contact.company?.name || '',
        contact.position || '',
        contact.idNumber || ''
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

  const handleEditContact = () => {
    // TODO: Implementar edición de contacto
    console.log('Editar contacto:', selectedContact);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    setSelectedContact(null);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Contactos</h3>
            <p className="text-sm text-gray-600">Gestiona todos tus contactos de clientes</p>
          </div>
          <button 
            onClick={() => setShowContactForm(true)}
            className="inline-flex items-center px-4 py-2 bg-[#FF6200] text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Contacto
          </button>
        </div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Contactos</h3>
          <p className="text-sm text-gray-600">Gestiona todos tus contactos de clientes</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedContacts.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedContacts.length} seleccionado(s)
              </span>
              <button
                onClick={handleDownloadSelected}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar
              </button>
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </button>
            </>
          )}
          <button 
            onClick={() => setShowContactForm(true)}
            className="inline-flex items-center px-4 py-2 bg-[#FF6200] text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Contacto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 rounded focus:ring-[#FF6200] focus:ring-2"
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
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                      className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 rounded focus:ring-[#FF6200] focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#FF6200]">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleContactClick(contact)}
                          className="text-sm font-medium text-gray-900 hover:text-[#FF6200] transition-colors cursor-pointer"
                        >
                          {contact.firstName} {contact.lastName}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{contact.company?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{contact.position}</span>
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
      </div>

      <ContactForm
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        onSubmit={handleCreateContact}
      />
    </div>
  );
}