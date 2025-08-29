import React from 'react';
import { Users, Building2, Target, FileText } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { WelcomeSection } from './WelcomeSection';
import { SkeletonStats } from '../UI/SkeletonLoader';

interface DashboardProps {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url?: string | null;
  } | null;
  onSectionChange?: (section: string) => void;
}

export function Dashboard({ user, onSectionChange }: DashboardProps) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Mensaje de bienvenida skeleton */}
        <div className="mb-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-36 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <SkeletonStats />
        
        {/* Recent sections skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Articles section skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-6 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded ml-4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeSection 
        userName={user?.firstName || 'Usuario'} 
        onSectionChange={onSectionChange || (() => {})}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value="310"
          icon={Users}
          color="primary"
          trend={{ value: 3.12, isPositive: true }}
        />
        <StatsCard
          title="Total Applicants"
          value="1,244"
          icon={Building2}
          color="success"
          trend={{ value: 3.00, isPositive: true }}
        />
        <StatsCard
          title="New Employees"
          value="1,298K"
          icon={Target}
          color="warning"
          trend={{ value: 3.12, isPositive: true }}
        />
        <StatsCard
          title="Resigned Employees"
          value="1,298K"
          icon={FileText}
          color="info"
          trend={{ value: 3.12, isPositive: true }}
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 font-medium">Add new widget</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-gray-900">24</div>
            <div className="text-sm text-gray-500">Jobs</div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">PD</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Senior Product Designer</div>
                  <div className="text-xs text-gray-500">On-Site</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">ND</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">NodeJs Developer</div>
                  <div className="text-xs text-gray-500">Remote</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Interviews Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-500">Interviews</div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Bjorn Phillips</div>
                  <div className="text-xs text-gray-500">UX/UI Designer • Mon 12, 2023 - 10:00 AM</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Emery Donin</div>
                  <div className="text-xs text-gray-500">Product Manager • Mon 12, 2023 - 10:00 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Status Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Employment Status</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-500 mb-2">Total Employees</div>
            <div className="text-3xl font-bold text-gray-900">3109</div>
            <div className="space-y-2 mt-4">
              {[
                { label: 'Permanent Employees', count: '3109' },
                { label: 'Contract Employees', count: '3109' },
                { label: 'Temporary Employees', count: '3109' },
                { label: 'Freelancers', count: '3109' },
                { label: 'Interns', count: '3109' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}