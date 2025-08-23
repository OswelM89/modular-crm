import React from 'react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#FF6200] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Cargando...</h2>
        <p className="text-gray-400">Iniciando Modular CRM</p>
      </div>
    </div>
  );
}