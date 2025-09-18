import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Camera, Save, X, Edit, Building2 } from 'lucide-react';
import { fetchMyOrganizations, updateOrganization, type Organization } from '../../utils/org';
import { supabase } from '../../lib/supabase';

interface ProfilePageProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url?: string | null;
  } | null;
  onBack: () => void;
}

export function ProfilePage({ user, onBack }: ProfilePageProps) {
  console.log('ProfilePage renderizado con usuario:', user);
  
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No se pudo cargar la información del perfil</p>
        </div>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [orgData, setOrgData] = useState({
    name: '',
    organization_type: 'Empresa'
  });

  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: '+52 55 1234 5678',
    position: 'Gerente de Ventas',
    location: 'Ciudad de México, México',
    bio: 'Especialista en gestión de relaciones con clientes y desarrollo de estrategias de ventas.',
    joinDate: '15 de Enero, 2024',
    avatar: user.avatar_url
  });

  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  // Cargar organización al montar componente
  useEffect(() => {
    console.log('useEffect ejecutándose para cargar organización...');
    const loadOrganization = async () => {
      try {
        setIsLoadingOrg(true);
        console.log('Iniciando carga de organizaciones...');
        
        const orgs = await fetchMyOrganizations();
        console.log('Organizaciones recibidas:', orgs);
        
        if (orgs && orgs.length > 0) {
          const org = orgs[0];
          console.log('Primera organización:', org);
          console.log('Nombre de la organización:', org.name);
          
          setOrganization(org);
          setOrgData({
            name: org.name,
            organization_type: org.organization_type || 'Empresa'
          });
          console.log('Estado actualizado con organización:', org.name);
        } else {
          console.log('No se encontraron organizaciones para el usuario');
        }
      } catch (error) {
        console.error('ERROR cargando organización:', error);
      } finally {
        setIsLoadingOrg(false);
        console.log('Carga de organización finalizada');
      }
    };
    
    loadOrganization();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (file: File | null) => {
    setNewAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewAvatar(null);
    }
  };

  const handleSave = async () => {
    console.log('Guardar perfil:', profileData);
    
    try {
      let avatarUrl = profileData.avatar;
      
      // Upload new avatar if selected
      if (newAvatar && user) {
        const fileExt = newAvatar.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        console.log('Subiendo avatar:', fileName);
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, newAvatar, {
            upsert: true
          });

        if (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          alert('Error al subir la imagen. Intenta de nuevo.');
          return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        avatarUrl = urlData.publicUrl;
        console.log('Avatar URL:', avatarUrl);

        // Update profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            email: profileData.email,
            phone: profileData.phone,
            position: profileData.position,
            location: profileData.location,
            bio: profileData.bio,
            avatar_url: avatarUrl
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          alert('Error al actualizar el perfil. Intenta de nuevo.');
          return;
        }
      }
      
      // Update local state
      setProfileData(prev => ({ ...prev, avatar: avatarUrl }));
      
      // Also save organization data
      if (organization) {
        await handleOrgSave();
      }
      
      setIsEditing(false);
      setNewAvatar(null);
      setPreviewAvatar(null);
      
      console.log('Perfil guardado exitosamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil. Intenta de nuevo.');
    }
  };

  const handleOrgSave = async () => {
    if (!organization) return;
    
    try {
      await updateOrganization(organization.id, {
        name: orgData.name,
        organization_type: orgData.organization_type
      });
      
      // Actualizar estado local
      const updatedOrg = {
        ...organization, 
        name: orgData.name,
        organization_type: orgData.organization_type
      };
      setOrganization(updatedOrg);
      console.log('Organización actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando organización:', error);
      alert('Error al actualizar la organización. Por favor intenta de nuevo.');
    }
  };

  const handleCancel = () => {
    setProfileData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: '+52 55 1234 5678',
      position: 'Gerente de Ventas',
      location: 'Ciudad de México, México',
      bio: 'Especialista en gestión de relaciones con clientes y desarrollo de estrategias de ventas.',
      joinDate: '15 de Enero, 2024',
      avatar: user?.avatar_url
    });
    // Reset organization data
    if (organization) {
      setOrgData({
        name: organization.name,
        organization_type: organization.organization_type || 'Empresa'
      });
    }
    setIsEditing(false);
    setNewAvatar(null);
    setPreviewAvatar(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
            Mi Perfil
          </h1>
          <p className="text-sm text-gray-600">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-6 py-3 text-base bg-[#FF6200] text-white hover:bg-orange-600 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Perfil
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-[#FF6200] text-white hover:bg-orange-600 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tarjeta de Perfil */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-orange-100 flex items-center justify-center overflow-hidden">
                  {previewAvatar || profileData.avatar ? (
                    <img 
                      src={previewAvatar || profileData.avatar || undefined} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-[#FF6200]">
                      {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <input
                      type="file"
                      id="avatar"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleAvatarChange(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer text-white hover:text-gray-200 transition-colors"
                    >
                      <Camera className="w-6 h-6" />
                    </label>
                  </div>
                )}
              </div>

              {/* Información básica */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apellido
                        </label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                        placeholder="Tu cargo o posición"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Biografía
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                        placeholder="Describe tu experiencia y habilidades..."
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-lg text-gray-600 mb-3">{profileData.position}</p>
                    <p className="text-sm text-gray-600">{profileData.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center mr-4 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6200] focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-blue-600">{profileData.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 flex items-center justify-center mr-4 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Teléfono</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6200] focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-green-600">{profileData.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center mr-4 rounded-lg">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Ubicación</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6200] focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{profileData.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tarjeta de Organización */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-[#FF6200]" />
              <h3 className="text-lg font-semibold text-gray-900">Mi Organización</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Organización
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {isLoadingOrg ? 'Cargando...' : (organization?.name || 'ERROR: No se cargó el nombre')}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={orgData.name}
                    onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                    placeholder="Nombre de la organización"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Organización
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {organization?.organization_type || 'Empresa'}
                  </p>
                ) : (
                  <select
                    value={orgData.organization_type}
                    onChange={(e) => setOrgData({ ...orgData, organization_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6200] focus:border-transparent bg-white z-50 shadow-sm"
                  >
                    <option value="Empresa">Empresa</option>
                    <option value="Persona">Persona</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Cambiar Contraseña */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seguridad</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-md">
                Cambiar Contraseña
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-md">
                Autenticación de Dos Factores
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors rounded-md">
                Desactivar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}