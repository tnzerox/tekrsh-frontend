
import React from 'react';
import { Card } from 'antd';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={cn(
        "bg-gradient-to-r p-4 rounded-lg text-white",
        color
      )}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white/90">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
          <div className="text-3xl opacity-80">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};
