import React from 'react';
import { ArrowLeft, Mail, Phone, Building2, Briefcase, Calendar, User, FileText, MoreVertical, Edit, Trash2, Save, X, Upload, File } from 'lucide-react';
import { updateContact, updateContactWithDocument, type Contact } from '../../utils/contacts';
import { supabase } from '../../lib/supabase';

interface ContactDetailProps {
  contact: Contact;
  onBack: () => void;
  onUpdate: (updatedContact: Contact) => void;
  onDelete: (contactId: string) => void;
}

export function ContactDetail({ contact, onBack, onUpdate, onDelete }: ContactDetailProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [editedContact, setEditedContact] = React.useState<Contact>(contact);
  const [newTaxDocument, setNewTaxDocument] = React.useState<File | null>(null);

  // Debug: Log contact data
  React.useEffect(() => {
    console.log('Contact data in ContactDetail:', contact);
    console.log('Position:', contact.position);
    console.log('Tax document URL:', contact.tax_document_url);
  }, [contact]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-menu')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el contacto ${contact.first_name} ${contact.last_name}?`
    );
    
    if (confirmDelete) {
      onDelete(contact.id);
    }
  };

  const handleSave = async () => {
    try {
      // Convertir Contact a ContactFormData para la función updateContact
      const updateData = {
        firstName: editedContact.first_name,
        lastName: editedContact.last_name,
        idNumber: editedContact.id_number || '',
        companyId: '', // Por ahora siempre vacío
        position: editedContact.position || '',
        email: editedContact.email || '',
        phone: editedContact.phone || '',
        taxDocument: null // Manejado por separado
      };
      
      console.log('Saving contact with new document:', !!newTaxDocument);
      console.log('Update data:', updateData);
      
      // Usar la función que maneja documentos si hay uno nuevo
      const updatedContact = newTaxDocument 
        ? await updateContactWithDocument(editedContact.id, updateData, newTaxDocument)
        : await updateContact(editedContact.id, updateData);
      
      console.log('Updated contact:', updatedContact);
      
      // Actualizar el estado local con los datos actualizados de la base de datos
      setEditedContact(updatedContact);
      
      // Llamar a onUpdate para actualizar la lista
      await onUpdate(updatedContact);
      
      setIsEditing(false);
      setNewTaxDocument(null);
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Error al guardar los cambios. Por favor intenta de nuevo.');
    }
  };

  const handleCancel = () => {
    setEditedContact(contact);
    setNewTaxDocument(null);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Contact, value: string) => {
    setEditedContact(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadDocument = async (urlOrPath: string) => {
    try {
      console.log('Downloading file from:', urlOrPath);
      
      let filePath: string;
      
      // Detectar si es una URL completa o solo un path
      if (urlOrPath.includes('supabase.co/storage')) {
        // Es una URL completa, extraer el path
        const urlParts = urlOrPath.split('/tax-documents/');
        if (urlParts.length < 2) {
          throw new Error('URL de documento inválida');
        }
        filePath = urlParts[1];
      } else {
        // Es solo un path
        filePath = urlOrPath;
      }
      
      console.log('Using file path:', filePath);
      
      // Descargar usando el cliente de Supabase
      const { data, error } = await supabase.storage
        .from('tax-documents')
        .download(filePath);

      if (error) {
        console.error('Supabase storage error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No se pudo obtener el archivo');
      }

      // Crear URL de descarga
      const downloadUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Extraer el nombre del archivo original
      const fileName = filePath.split('/').pop() || `documento-fiscal-${Date.now()}`;
      link.download = fileName;
      
      // Hacer clic automáticamente en el enlace
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error al descargar el documento. Por favor intenta de nuevo.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Detalle del Contacto</h3>
            <p className="text-sm text-gray-600">Información completa del contacto</p>
          </div>
        </div>
        <div className="relative dropdown-menu">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-3" />
                    Editar contacto
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Eliminar contacto
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-white border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">
                {(isEditing ? editedContact : contact).first_name.charAt(0)}{(isEditing ? editedContact : contact).last_name.charAt(0)}
              </span>
            </div>
            <div className="ml-6 flex-1">
              <div className="flex items-start justify-between">
                <div>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={editedContact.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none"
                      placeholder="Nombre"
                    />
                    <input
                      type="text"
                      value={editedContact.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none"
                      placeholder="Apellido"
                    />
                  </div>
                  <input
                    type="text"
                    value={editedContact.position || ''}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="text-lg text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-primary"
                    placeholder="Cargo o posición"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {contact.first_name} {contact.last_name}
                  </h1>
                  {contact.position && (
                    <p className="text-lg text-gray-600 mt-1">{contact.position}</p>
                  )}
                </>
              )}
                </div>
                
                {!isEditing && (
                  <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Crear Negocio
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(isEditing || contact.email) && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center mr-4">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedContact.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="text-sm text-blue-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#FF6200]"
                          placeholder="correo@ejemplo.com"
                        />
                      ) : (
                        <a 
                          href={`mailto:${contact.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {contact.email}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {(isEditing || contact.phone) && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 flex items-center justify-center mr-4">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Teléfono</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedContact.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="text-sm text-green-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#FF6200]"
                          placeholder="+52 55 1234 5678"
                        />
                      ) : (
                        <a 
                          href={`tel:${contact.phone}`}
                          className="text-sm text-green-600 hover:text-green-800 transition-colors"
                        >
                          {contact.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {(isEditing || contact.company_id) && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mr-4">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Empresa</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value=""
                          className="text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#FF6200]"
                          placeholder="Nombre de la empresa"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">-</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Mostrar siempre el cargo */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 flex items-center justify-center mr-4">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cargo</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedContact.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#FF6200]"
                        placeholder="Cargo o posición"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{contact.position || 'No especificado'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            {(isEditing || contact.id_number || contact.tax_document_url) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(isEditing || contact.id_number) && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center mr-4">
                        <User className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cédula de Identidad</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedContact.id_number || ''}
                            onChange={(e) => handleInputChange('id_number', e.target.value)}
                            className="text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#FF6200]"
                            placeholder="Número de cédula"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{contact.id_number}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mostrar siempre el documento fiscal */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 flex items-center justify-center mr-4">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Documento Fiscal</p>
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="border-2 border-dashed border-gray-300 p-3 hover:border-primary transition-colors">
                            <input
                              type="file"
                              id="editTaxDocument"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => setNewTaxDocument(e.target.files?.[0] || null)}
                              className="hidden"
                            />
                            <label
                              htmlFor="editTaxDocument"
                              className="cursor-pointer flex items-center space-x-2"
                            >
                              {newTaxDocument ? (
                                <div className="flex items-center space-x-2 text-green-600">
                                  <File className="w-4 h-4" />
                                  <span className="text-xs font-medium">{newTaxDocument.name}</span>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    {contact.tax_document_url ? 'Cambiar archivo' : 'Subir documento'}
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                          {contact.tax_document_url && !newTaxDocument && (
                            <p className="text-xs text-gray-500">
                              Actual: Documento fiscal
                            </p>
                          )}
                        </div>
                      ) : (
                        <>
                          {contact.tax_document_url ? (
                            <button
                              onClick={() => handleDownloadDocument(contact.tax_document_url!)}
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                            >
                              Descargar documento fiscal
                            </button>
                          ) : (
                            <p className="text-sm text-gray-600">No disponible</p>
                          )}
                        </>
                      )}
                     </div>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer con fechas */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Creado el {formatDate(contact.created_at)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Actualizado el {formatDate(contact.updated_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Secciones adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No hay actividad reciente</p>
          </div>
        </div>

        {/* Negocios Relacionados */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Negocios Relacionados</h3>
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No hay negocios relacionados</p>
          </div>
        </div>
      </div>
    </div>
  );
}