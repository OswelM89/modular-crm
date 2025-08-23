import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 ${className}`}></div>
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
    <div className="bg-white border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="h-10 bg-gray-200 animate-pulse"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 bg-gray-200 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5].map((col) => (
                  <td key={col} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 animate-pulse"></div>
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
        <div key={i} className="bg-white border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200"></div>
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-gray-200"></div>
                <div className="w-4 h-4 bg-gray-200"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200"></div>
              <div className="h-4 bg-gray-200"></div>
              <div className="h-4 bg-gray-200"></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="h-3 bg-gray-200 w-1/3"></div>
              <div className="h-4 bg-gray-200 w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}