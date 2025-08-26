interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
}

// Skeleton para headers con título y descripción
export function SkeletonHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>
  );
}

// Skeleton para búsqueda y filtros
export function SkeletonSearch() {
  return (
    <div className="bg-white border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-200"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse flex-1"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-40"></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <tr key={row}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </td>
                {[1, 2, 3, 4].map((col) => (
                  <td key={col} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton específico para páginas completas
export function SkeletonPage() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para dashboard stats
export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}