import React, { useState } from 'react';
import { X, Target, FileText, Building2, User, DollarSign, Calendar, UserCheck, Users, Flag, MessageSquare } from 'lucide-react';

interface DealFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dealData: DealFormData) => void;
}

export interface DealFormData {
  title: string;
  description: string;
  pipeline: string;
  companyId: string;
  contactId: string;
  estimatedValue: number;
  estimatedCloseDate: string;
  responsible: string;
  dealType: string;
  priority: string;
  notes: string;
}

export function DealForm({ isOpen, onClose, onSubmit }: DealFormProps) {
  const [formData, setFormData] = useState<DealFormData>({
    title: '',
    description: '',
    pipeline: '',
    companyId: '',
    contactId: '',
    estimatedValue: 0,
    estimatedCloseDate: '',
    responsible: '',
    dealType: '',
    priority: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<DealFormData>>({});

  // Bloquear scroll del body cuando el modal está abierto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field: keyof DealFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DealFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.pipeline) {
      newErrors.pipeline = 'Debe seleccionar un pipeline';
    }

    if (!formData.companyId && !formData.contactId) {
      newErrors.companyId = 'Debe seleccionar una empresa o contacto';
      newErrors.contactId = 'Debe seleccionar una empresa o contacto';
    }

    if (!formData.estimatedValue || formData.estimatedValue <= 0) {
      newErrors.estimatedValue = 'El valor estimado debe ser mayor a 0';
    }

    if (!formData.estimatedCloseDate) {
      newErrors.estimatedCloseDate = 'La fecha de cierre es requerida';
    }

    if (!formData.dealType) {
      newErrors.dealType = 'Debe seleccionar el tipo de negocio';
    }

    if (!formData.priority) {
      newErrors.priority = 'Debe seleccionar la prioridad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        pipeline: '',
        companyId: '',
        contactId: '',
        estimatedValue: 0,
        estimatedCloseDate: '',
        responsible: '',
        dealType: '',
        priority: '',
        notes: '',
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      pipeline: '',
      companyId: '',
      contactId: '',
      estimatedValue: 0,
      estimatedCloseDate: '',
      responsible: '',
      dealType: '',
      priority: '',
      notes: '',
    });
    setErrors({});
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 inset-y-0 w-full sm:w-96 bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Negocio</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Título del negocio"
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descripción del negocio"
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Pipeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pipeline *
              </label>
              <select
                value={formData.pipeline}
                onChange={(e) => handleInputChange('pipeline', e.target.value)}
                className={`w-full px-3 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                  errors.pipeline ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar pipeline...</option>
                <option value="ventas">Pipeline de Ventas</option>
                <option value="marketing">Pipeline de Marketing</option>
                <option value="soporte">Pipeline de Soporte</option>
              </select>
              {errors.pipeline && (
                <p className="mt-1 text-sm text-red-600">{errors.pipeline}</p>
              )}
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={formData.companyId}
                  onChange={(e) => handleInputChange('companyId', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.companyId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar empresa...</option>
                  <option value="1">TechCorp Solutions</option>
                  <option value="2">Innovate Marketing</option>
                </select>
              </div>
              {errors.companyId && (
                <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>
              )}
            </div>

            {/* Contacto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacto *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={formData.contactId}
                  onChange={(e) => handleInputChange('contactId', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.contactId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar contacto...</option>
                  <option value="1">María González</option>
                  <option value="2">Carlos Rodríguez</option>
                  <option value="3">Ana López</option>
                </select>
              </div>
              {errors.contactId && (
                <p className="mt-1 text-sm text-red-600">{errors.contactId}</p>
              )}
            </div>

            {/* Valor Estimado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Estimado *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.estimatedValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.estimatedValue && (
                <p className="mt-1 text-sm text-red-600">{errors.estimatedValue}</p>
              )}
            </div>

            {/* Fecha de Cierre Estimada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Cierre Estimada *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={formData.estimatedCloseDate}
                  onChange={(e) => handleInputChange('estimatedCloseDate', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.estimatedCloseDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.estimatedCloseDate && (
                <p className="mt-1 text-sm text-red-600">{errors.estimatedCloseDate}</p>
              )}
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsable
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={formData.responsible}
                  onChange={(e) => handleInputChange('responsible', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                >
                  <option value="">Yo (por defecto)</option>
                  <option value="juan">Juan Pérez</option>
                  <option value="maria">María García</option>
                  <option value="carlos">Carlos López</option>
                </select>
              </div>
            </div>

            {/* Tipo de Negocio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Negocio *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={formData.dealType}
                  onChange={(e) => handleInputChange('dealType', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.dealType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="nuevo">Cliente Nuevo</option>
                  <option value="existente">Cliente Existente</option>
                </select>
              </div>
              {errors.dealType && (
                <p className="mt-1 text-sm text-red-600">{errors.dealType}</p>
              )}
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad *
              </label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-[#FF6200] focus:border-transparent ${
                    errors.priority ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar prioridad...</option>
                  <option value="alta">🔴 Alta</option>
                  <option value="media">🟡 Media</option>
                  <option value="baja">🟢 Baja</option>
                </select>
              </div>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
              )}
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="Notas adicionales sobre el negocio..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#FF6200] text-white hover:bg-orange-600 transition-colors"
              >
                Crear Negocio
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}