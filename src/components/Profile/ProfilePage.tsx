import { ArrowLeft } from 'lucide-react';

interface ProfilePageProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url?: string | null;
  } | null;
  onBack: () => void;
}

export function ProfilePage({ user, onBack }: ProfilePageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '1.875rem', fontWeight: '700' }}>
            Mi Perfil
          </h1>
          <p className="text-sm text-gray-600">
            Gestiona tu información personal
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-500 mt-4">Próximamente con Lovable Cloud</p>
        </div>
      </div>
    </div>
  );
}
