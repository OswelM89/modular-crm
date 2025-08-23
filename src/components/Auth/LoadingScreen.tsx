import React from 'react';

export function LoadingScreen() {
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#FF6200] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Cargando{dots}</h2>
        <p className="text-gray-400">Iniciando Modular CRM</p>
        <p className="text-gray-500 text-sm mt-4">Si esto toma mucho tiempo, revisa la consola del navegador</p>
      </div>
    </div>
  );
}