import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Camera, Save, X, Edit, Shield, Bell, Eye, Lock, Building2 } from 'lucide-react';
import { fetchMyOrganizations, updateOrganization, type Organization } from '../../utils/org';

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
  const [isEditingOrg, setIsEditingOrg] = useState(false);
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
    department: 'Ventas',
    location: 'Ciudad de México, México',
    bio: 'Especialista en gestión de relaciones con clientes y desarrollo de estrategias de ventas.',
    joinDate: '15 de Enero, 2024',
    avatar: user.avatar_url
  });

  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  // Cargar organización al montar componente
  useEffect(() => {
    const loadOrganization = async () => {
      try {
        setIsLoadingOrg(true);
        console.log('Cargando organizaciones...');
        const orgs = await fetchMyOrganizations();
        console.log('Organizaciones cargadas:', orgs);
        
        if (orgs.length > 0) {
          const org = orgs[0];
          console.log('Organización seleccionada:', org);
          setOrganization(org);
          setOrgData({
            name: org.name,
            organization_type: org.organization_type || 'Empresa'
          });
        } else {
          console.log('No se encontraron organizaciones');
        }
      } catch (error) {
        console.error('Error loading organization:', error);
      } finally {
        setIsLoadingOrg(false);
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

  const handleSave = () => {
    console.log('Guardar perfil:', profileData);
    if (newAvatar) {
      console.log('Nueva imagen:', newAvatar);
    }
    setIsEditing(false);
    setNewAvatar(null);
    setPreviewAvatar(null);
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
      setIsEditingOrg(false);
      console.log('Organización actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando organización:', error);
      alert('Error al actualizar la organización. Por favor intenta de nuevo.');
    }
  };

  const handleOrgCancel = () => {
    if (organization) {
      setOrgData({
        name: organization.name,
        organization_type: organization.organization_type || 'Empresa'
      });
    }
    setIsEditingOrg(false);
  };

  const handleCancel = () => {
    setProfileData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: '+52 55 1234 5678',
      position: 'Gerente de Ventas',
      department: 'Ventas',
      location: 'Ciudad de México, México',
      bio: 'Especialista en gestión de relaciones con clientes y desarrollo de estrategias de ventas.',
      joinDate: '15 de Enero, 2024',
      avatar: user?.avatar_url
    });
    setIsEditing(false);
    setNewAvatar(null);
    setPreviewAvatar(null);
  };

  const activityData = [
    {
      id: '1',
      type: 'contact',
      action: 'Creó contacto',
      target: 'María González',
      time: 'Hace 2 horas',
      icon: User
    },
    {
      id: '2',
      type: 'deal',
      action: 'Actualizó negocio',
      target: 'Sistema ERP TechCorp',
      time: 'Hace 4 horas',
      icon: Shield
    },
    {
      id: '3',
      type: 'quote',
      action: 'Envió cotización',
      target: 'COT-2024-001',
      time: 'Ayer',
      icon: Mail
    }
  ];

  const statsData = [
    { label: 'Contactos creados', value: '47', color: 'text-blue-600' },
    { label: 'Negocios cerrados', value: '12', color: 'text-green-600' },
    { label: 'Cotizaciones enviadas', value: '23', color: 'text-orange-600' },
    { label: 'Ingresos generados', value: '$125,000', color: 'text-purple-600' }
  ];

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
          {/* Tarjeta de Organización */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#FF6200]" />
                <h3 className="text-lg font-semibold text-gray-900">Mi Organización</h3>
              </div>
              {!isEditingOrg ? (
                <button
                  onClick={() => setIsEditingOrg(true)}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-md"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleOrgCancel}
                    className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-md"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleOrgSave}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-[#FF6200] text-white hover:bg-orange-600 transition-colors rounded-md"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Guardar
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Organización
                </label>
                {!isEditingOrg ? (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {isLoadingOrg ? 'Cargando...' : (organization?.name || 'Sin organización')}
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
                {!isEditingOrg ? (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {organization?.organization_type || 'Empresa'}
                  </p>
                ) : (
                  <select
                    value={orgData.organization_type}
                    onChange={(e) => setOrgData({ ...orgData, organization_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  >
                    <option value="Empresa">Empresa</option>
                    <option value="Corporación">Corporación</option>
                    <option value="Startup">Startup</option>
                    <option value="ONG">ONG</option>
                    <option value="Institución">Institución</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Otro">Otro</option>
                  </select>
                )}
              </div>
            </div>
          </div>

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
                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Biografía
                      </label>
                      <textarea
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-lg text-gray-600 mb-3">{profileData.position}</p>
                    <p className="text-sm text-gray-600 mb-4">{profileData.bio}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      Se unió el {profileData.joinDate}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center mr-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-blue-600">{profileData.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 flex items-center justify-center mr-4">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Teléfono</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-green-600">{profileData.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 flex items-center justify-center mr-4">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Departamento</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{profileData.department}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center mr-4">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Ubicación</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{profileData.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50">
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actividad Reciente */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {activityData.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-gray-600"> {activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configuración Rápida */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración Rápida</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <Bell className="w-4 h-4 text-gray-600 mr-3" />
                  <span className="text-sm text-gray-900">Notificaciones</span>
                </div>
                <div className="w-4 h-4 bg-green-500"></div>
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 text-gray-600 mr-3" />
                  <span className="text-sm text-gray-900">Privacidad</span>
                </div>
                <div className="w-4 h-4 bg-yellow-500"></div>
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 text-gray-600 mr-3" />
                  <span className="text-sm text-gray-900">Seguridad</span>
                </div>
                <div className="w-4 h-4 bg-red-500"></div>
              </button>
            </div>
          </div>

          {/* Cambiar Contraseña */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seguridad</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                Cambiar Contraseña
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                Autenticación de Dos Factores
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                Desactivar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}