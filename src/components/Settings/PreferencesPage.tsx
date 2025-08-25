import React, { useState } from 'react';
import { ArrowLeft, Save, X, Globe, Bell, Eye, Moon, Sun, Monitor } from 'lucide-react';

interface PreferencesPageProps {
  onBack: () => void;
}

export function PreferencesPage({ onBack }: PreferencesPageProps) {
  const [preferences, setPreferences] = useState({
    language: 'es',
    theme: 'light',
    timezone: 'America/Mexico_City',
    dateFormat: 'DD/MM/YYYY',
    currency: 'MXN',
    notifications: {
      email: true,
      push: true,
      deals: true,
      quotes: true,
      reminders: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      dataSharing: false
    },
    display: {
      density: 'comfortable',
      sidebarCollapsed: false,
      showAvatars: true,
      animationsEnabled: true
    }
  });

  const languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'pt', label: 'Português' }
  ];

  const themes = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor }
  ];

  const timezones = [
    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
    { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
    { value: 'Europe/London', label: 'Londres (GMT+0)' }
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: '31/12/2024' },
    { value: 'MM/DD/YYYY', label: '12/31/2024' },
    { value: 'YYYY-MM-DD', label: '2024-12-31' },
    { value: 'DD MMM YYYY', label: '31 Dic 2024' }
  ];

  const currencies = [
    { value: 'MXN', label: 'Peso Mexicano (MXN)' },
    { value: 'USD', label: 'Dólar Americano (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'Libra Esterlina (GBP)' }
  ];

  const densityOptions = [
    { value: 'compact', label: 'Compacto' },
    { value: 'comfortable', label: 'Cómodo' },
    { value: 'spacious', label: 'Espacioso' }
  ];

  const handlePreferenceChange = (section: string, field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...((prev as any)[section] || {}),
        [field]: value
      }
    }));
  };

  const handleDirectChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Guardar preferencias:', preferences);
    // Aquí iría la lógica para guardar las preferencias
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
            Preferencias
          </h1>
          <p className="text-sm text-gray-600">
            Personaliza tu experiencia en el sistema
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuración General */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración General</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Idioma
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handleDirectChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona Horaria
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => handleDirectChange('timezone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato de Fecha
              </label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => handleDirectChange('dateFormat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
              >
                {dateFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda Predeterminada
              </label>
              <select
                value={preferences.currency}
                onChange={(e) => handleDirectChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tema y Apariencia */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tema y Apariencia</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tema
              </label>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <label
                      key={theme.value}
                      className={`flex flex-col items-center p-4 border cursor-pointer ${
                        preferences.theme === theme.value
                          ? 'border-[#FF6200] bg-orange-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={theme.value}
                        checked={preferences.theme === theme.value}
                        onChange={(e) => handleDirectChange('theme', e.target.value)}
                        className="sr-only"
                      />
                      <Icon className="w-6 h-6 mb-2 text-gray-600" />
                      <span className="text-sm font-medium">{theme.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Densidad de la Interfaz
              </label>
              <select
                value={preferences.display.density}
                onChange={(e) => handlePreferenceChange('display', 'density', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
              >
                {densityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.display.showAvatars}
                  onChange={(e) => handlePreferenceChange('display', 'showAvatars', e.target.checked)}
                  className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Mostrar avatares de usuario</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.display.animationsEnabled}
                  onChange={(e) => handlePreferenceChange('display', 'animationsEnabled', e.target.checked)}
                  className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Habilitar animaciones</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.display.sidebarCollapsed}
                  onChange={(e) => handlePreferenceChange('display', 'sidebarCollapsed', e.target.checked)}
                  className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Contraer barra lateral por defecto</span>
              </label>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <Bell className="w-5 h-5 inline mr-2" />
            Notificaciones
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Métodos de Notificación</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Notificaciones por email</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.push}
                    onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Notificaciones push</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Tipos de Notificación</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.deals}
                    onChange={(e) => handlePreferenceChange('notifications', 'deals', e.target.checked)}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Actualizaciones de negocios</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.quotes}
                    onChange={(e) => handlePreferenceChange('notifications', 'quotes', e.target.checked)}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Estado de cotizaciones</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.reminders}
                    onChange={(e) => handlePreferenceChange('notifications', 'reminders', e.target.checked)}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Recordatorios y tareas</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.marketing}
                    onChange={(e) => handlePreferenceChange('notifications', 'marketing', e.target.checked)}
                    className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Noticias y actualizaciones del producto</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Privacidad */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <Eye className="w-5 h-5 inline mr-2" />
            Privacidad
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.privacy.profileVisible}
                onChange={(e) => handlePreferenceChange('privacy', 'profileVisible', e.target.checked)}
                className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Perfil visible para otros usuarios</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.privacy.activityVisible}
                onChange={(e) => handlePreferenceChange('privacy', 'activityVisible', e.target.checked)}
                className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar actividad reciente</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.privacy.dataSharing}
                onChange={(e) => handlePreferenceChange('privacy', 'dataSharing', e.target.checked)}
                className="w-4 h-4 text-[#FF6200] bg-gray-100 border-gray-300 focus:ring-[#FF6200] focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Compartir datos para mejorar el producto</span>
            </label>
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
            Guardar Preferencias
          </button>
        </div>
      </form>
    </div>
  );
}