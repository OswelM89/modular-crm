import React from 'react';

export function LoadingScreen() {
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 300); // Más rápido

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-[#FF6200] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <h2 className="text-lg font-semibold text-white mb-1">Accediendo{dots}</h2>
        <p className="text-gray-400 text-sm">Un momento por favor</p>
      </div>
    </div>
  );
}