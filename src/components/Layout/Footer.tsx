import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0D1117] text-white mt-12">
      <div className="px-6 py-8">
        <div className="max-w-[1150px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 CotizaLow.co. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#FF6200] transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF6200] transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}