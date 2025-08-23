import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { signUp, signIn } from '../../lib/supabase';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onBack?: () => void;
}

type AuthMode = 'login' | 'register';

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    organizationName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (mode === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'El nombre es requerido';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'El apellido es requerido';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
      
      if (!formData.organizationName) {
        newErrors.organizationName = 'El nombre de la organización es requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      if (mode === 'register') {
        const { data, error } = await signUp(
          formData.email,
          formData.password,
          formData.organizationName,
          formData.firstName,
          formData.lastName
        );
        
        if (error) {
          console.error('Registration error:', error);
          
          // Manejar diferentes tipos de errores de registro
          if (error.message?.includes('User already registered') || 
              error.message?.includes('already been registered')) {
            setErrors({ email: 'Este email ya está registrado. Intenta iniciar sesión.' });
          } else if (error.message?.includes('Invalid email')) {
            setErrors({ email: 'Email inválido. Verifica el formato.' });
          } else if (error.message?.includes('Password') || error.message?.includes('password')) {
            setErrors({ password: 'La contraseña debe tener al menos 6 caracteres.' });
          } else if (error.message?.includes('signup is disabled')) {
            setErrors({ email: 'El registro está deshabilitado. Contacta al administrador.' });
          } else {
            setErrors({ email: `Error de registro: ${error.message || 'Error desconocido'}` });
          }
          setLoading(false);
          return;
        }
        
        // Show success message - registration was successful
        if (data?.user && !data.user.email_confirmed_at) {
          alert('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
          setMode('login');
          setFormData({
            email: formData.email, // Keep email for login
            password: '',
            firstName: '',
            lastName: '',
            confirmPassword: '',
            organizationName: ''
          });
        } else {
          // User is already confirmed, they should be logged in automatically
          console.log('User registered and confirmed automatically');
        }
      } else {
        const { data, error } = await signIn(formData.email, formData.password);
        
        if (error) {
          console.error('Login error:', error);
          
          // Manejar diferentes tipos de errores de login
          if (error.message?.includes('Invalid login credentials')) {
            setErrors({ email: 'Email o contraseña incorrectos.' });
          } else if (error.message?.includes('Email not confirmed')) {
            setErrors({ email: 'Debes confirmar tu email antes de iniciar sesión.' });
          } else if (error.message?.includes('Too many requests')) {
            setErrors({ email: 'Demasiados intentos. Espera unos minutos.' });
          } else {
            setErrors({ email: `Error: ${error.message || 'Error desconocido en el login'}` });
          }
          setLoading(false);
          return;
        }
        
        // The AuthContext will handle the login automatically
        // No need to call onLogin manually
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrors({ email: `Error de conexión: ${error.message || 'Verifica tu conexión a internet'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    // Simular autenticación con Google
    setTimeout(() => {
      const user = {
        id: '1',
        email: 'usuario@gmail.com',
        firstName: 'Usuario',
        lastName: 'Google',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      };
      
      onLogin(user);
      setLoading(false);
    }, 1500);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
      organizationName: ''
    });
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
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-gray-300">
            {mode === 'login' 
              ? 'Accede a tu cuenta de Modular CRM' 
              : 'Únete a Modular CRM hoy mismo'
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Conectando...' : `Continuar con Google`}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">o</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Organización *
                  </label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    className={`w-full px-4 py-3 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                      errors.organizationName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mi Empresa S.A."
                  />
                  {errors.organizationName && (
                    <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>
                  )}
                </div>

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
                        className={`w-full pl-10 pr-4 py-3 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nombre"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Apellido"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
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
                  className={`w-full pl-10 pr-4 py-3 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

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
                  className={`w-full pl-10 pr-12 py-3 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6200] text-white py-3 hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={switchMode}
                className="ml-2 text-[#FF6200] hover:text-orange-600 font-medium transition-colors"
              >
                {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </p>
          </div>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-orange-100 text-sm">
          <p className="text-gray-400">© 2024 Modular CRM. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}