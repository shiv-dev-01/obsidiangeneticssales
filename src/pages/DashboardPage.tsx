import React from 'react';
import { BarChart3, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const stats = [
  { name: 'Total Orders', value: '0', icon: ShoppingCart },
  { name: 'Active Customers', value: '0', icon: Users },
  { name: 'Revenue', value: '$0', icon: TrendingUp },
  { name: 'Conversion Rate', value: '0%', icon: BarChart3 },
];

export function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here's what's happening with your orders today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}