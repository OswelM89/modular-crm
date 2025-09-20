import { useState } from 'react';
import { Plus, DollarSign, User, Building2, Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Deal } from '../../types';
import { mockDeals } from '../../data/mockData';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  isFixed: boolean;
}

interface NewStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

function NewStageModal({ isOpen, onClose, onSave }: NewStageModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('bg-blue-500');

  const colors = [
    { value: 'bg-blue-500', label: 'Azul', class: 'bg-blue-500' },
    { value: 'bg-green-500', label: 'Verde', class: 'bg-green-500' },
    { value: 'bg-purple-500', label: 'Morado', class: 'bg-purple-500' },
    { value: 'bg-orange-500', label: 'Naranja', class: 'bg-orange-500' },
    { value: 'bg-pink-500', label: 'Rosa', class: 'bg-pink-500' },
    { value: 'bg-indigo-500', label: 'Índigo', class: 'bg-indigo-500' },
  ];

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), color);
      setName('');
      setColor('bg-blue-500');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nueva Etapa</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Etapa
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Propuesta, Negociación..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => setColor(colorOption.value)}
                  className={`w-8 h-8 rounded-lg ${colorOption.class} ${
                    color === colorOption.value ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                  }`}
                  title={colorOption.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Crear Etapa
          </button>
        </div>
      </div>
    </div>
  );
}

export function Pipeline() {
  const [showNewStageModal, setShowNewStageModal] = useState(false);
  
  // Etapas fijas y dinámicas
  const [stages, setStages] = useState<PipelineStage[]>([
    { id: 'nuevo', name: 'Nuevo', color: 'bg-blue-500', isFixed: true },
    { id: 'ganado', name: 'Ganado', color: 'bg-green-500', isFixed: true },
    { id: 'perdido', name: 'Perdido', color: 'bg-red-500', isFixed: true },
  ]);

  // Mock deals - normalmente vendrían de la API
  const [deals] = useState<Deal[]>(mockDeals);

  const handleCreateStage = (name: string, color: string) => {
    const newStage: PipelineStage = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color,
      isFixed: false,
    };
    
    // Insertar la nueva etapa antes de "Ganado" y "Perdido"
    const newStages = [...stages];
    const insertIndex = newStages.length - 2; // Antes de las dos últimas (Ganado y Perdido)
    newStages.splice(insertIndex, 0, newStage);
    setStages(newStages);
  };

  const handleDeleteStage = (stageId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta etapa?')) {
      setStages(stages.filter(stage => stage.id !== stageId));
    }
  };

  const getDealsForStage = (stageId: string) => {
    // Mapear las etapas del deal a las etapas del pipeline
    const stageMapping: { [key: string]: string[] } = {
      'nuevo': ['prospecting', 'qualification'],
      'ganado': ['closed-won'],
      'perdido': ['closed-lost'],
    };

    const mappedStages = stageMapping[stageId] || [];
    return deals.filter(deal => mappedStages.includes(deal.stage));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getTotalValue = (stageId: string) => {
    const stageDeals = getDealsForStage(stageId);
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-0" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
            Pipeline de Ventas
          </h1>
          <p className="text-gray-600" style={{ fontSize: '18px' }}>
            Administra tu pipeline de ventas y negocios
          </p>
        </div>
        <button
          onClick={() => setShowNewStageModal(true)}
          className="inline-flex items-center px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Etapa
        </button>
      </div>

      {/* Pipeline Board */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]" style={{ scrollbarWidth: 'thin' }}>
          {stages.map((stage) => {
            const stageDeals = getDealsForStage(stage.id);
            const totalValue = getTotalValue(stage.id);

            return (
              <div key={stage.id} className="bg-gray-50 rounded-xl p-4 min-w-[300px] flex-shrink-0">
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  
                  {!stage.isFixed && (
                    <div className="relative group">
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                          <Edit className="w-3 h-3" />
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteStage(stage.id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stage Total */}
                <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>
                </div>

                {/* Deals */}
                <div className="space-y-3 max-h-[450px] overflow-y-auto">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                        {deal.title}
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">{deal.company?.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          <span className="truncate">
                            {deal.contact?.firstName} {deal.contact?.lastName}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{deal.expectedCloseDate.toLocaleDateString('es-MX')}</span>
                          </div>
                          
                          <div className="text-sm font-semibold text-primary">
                            {formatCurrency(deal.value)}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {deal.probability}% probabilidad
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageDeals.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No hay negocios en esta etapa</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Scroll indicator */}
        <div className="text-center text-xs text-gray-500 mt-2">
          ← Desliza horizontalmente para ver más etapas →
        </div>
      </div>

      {/* New Stage Modal */}
      <NewStageModal
        isOpen={showNewStageModal}
        onClose={() => setShowNewStageModal(false)}
        onSave={handleCreateStage}
      />
    </div>
  );
}