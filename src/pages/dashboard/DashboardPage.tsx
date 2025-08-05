
import React from 'react';
import { StatsCard, UserInfo, PermissionsBadge } from '@/components/dashboard';
import { Users, BarChart3, Settings, Shield } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="1,234"
          description="Active users in the system"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Monthly Reports"
          value="89"
          description="Reports generated this month"
          icon={BarChart3}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Active Sessions"
          value="45"
          description="Currently logged in users"
          icon={Shield}
        />
        <StatsCard
          title="System Health"
          value="99.9%"
          description="Uptime this month"
          icon={Settings}
          trend={{ value: 0.1, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserInfo />
        <PermissionsBadge />
      </div>
    </div>
  );
};
