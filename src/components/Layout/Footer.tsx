import { useTranslation } from '../../hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0D1117] text-white mt-12">
      <div className="px-6 py-8">
        <div className="max-w-[1150px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#FF6200] transition-colors text-sm">
                  Términos de Servicio
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FF6200] transition-colors text-sm">
                  Política de Privacidad
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}