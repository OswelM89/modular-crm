import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthContext } from './AuthProvider';

interface SupabaseLoginPageProps {
  onBack?: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password';

export function SupabaseLoginPage({ onBack }: SupabaseLoginPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  const { signIn, signUp, resetPassword } = useAuthContext();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const validateForm = () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage({ type: 'error', text: 'Por favor ingresa un email válido' });
      return false;
    }

    if (mode !== 'forgot-password') {
      if (!formData.password || formData.password.length < 6) {
        setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
        return false;
      }

      if (mode === 'register') {
        if (!formData.firstName || !formData.lastName) {
          setMessage({ type: 'error', text: 'Nombre y apellido son requeridos' });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setMessage({ type: 'error', text: error.message });
        }
      } else if (mode === 'register') {
        const { error } = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.' 
          });
        }
      } else if (mode === 'forgot-password') {
        const { error } = await resetPassword(formData.email);
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Se ha enviado un enlace de recuperación a tu email.' 
          });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ocurrió un error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setMessage(null);
    setFormData({
      email: formData.email, // Mantener email
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: ''
    });
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Iniciar Sesión';
      case 'register': return 'Crear Cuenta';
      case 'forgot-password': return 'Recuperar Contraseña';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Accede a tu cuenta de Modular CRM';
      case 'register': return 'Únete a Modular CRM hoy mismo';
      case 'forgot-password': return 'Te enviaremos un enlace para restablecer tu contraseña';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-6 left-6 text-white hover:text-[#FF6200] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {getTitle()}
          </h1>
          <p className="text-gray-300">
            {getSubtitle()}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8">
          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      placeholder="Nombre"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                    placeholder="Apellido"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {mode !== 'forgot-password' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6200] text-white py-3 hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : (
                mode === 'login' ? 'Iniciar Sesión' : 
                mode === 'register' ? 'Crear Cuenta' : 
                'Enviar Enlace'
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'login' && (
              <>
                <p className="text-gray-600">
                  ¿No tienes cuenta?
                  <button
                    onClick={() => switchMode('register')}
                    className="ml-2 text-[#FF6200] hover:text-orange-600 font-medium transition-colors"
                    disabled={loading}
                  >
                    Crear cuenta
                  </button>
                </p>
                <button
                  onClick={() => switchMode('forgot-password')}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={loading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </>
            )}

            {mode === 'register' && (
              <p className="text-gray-600">
                ¿Ya tienes cuenta?
                <button
                  onClick={() => switchMode('login')}
                  className="ml-2 text-[#FF6200] hover:text-orange-600 font-medium transition-colors"
                  disabled={loading}
                >
                  Iniciar sesión
                </button>
              </p>
            )}

            {mode === 'forgot-password' && (
              <p className="text-gray-600">
                ¿Recordaste tu contraseña?
                <button
                  onClick={() => switchMode('login')}
                  className="ml-2 text-[#FF6200] hover:text-orange-600 font-medium transition-colors"
                  disabled={loading}
                >
                  Iniciar sesión
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>© 2024 Modular CRM. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}