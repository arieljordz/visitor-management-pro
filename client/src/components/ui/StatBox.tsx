import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface StatBoxProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  subtitle 
}) => {
  const colorClasses = {
    primary: 'bg-gradient-primary text-white',
    success: 'bg-gradient-success text-white',
    warning: 'bg-gradient-warning text-white',
    info: 'bg-gradient-info text-white',
    danger: 'bg-gradient-to-br from-destructive to-red-600 text-white'
  };

  const iconColorClasses = {
    primary: 'bg-white/20',
    success: 'bg-white/20',
    warning: 'bg-white/20',
    info: 'bg-white/20',
    danger: 'bg-white/20'
  };

  return (
    <div className={`relative overflow-hidden rounded-lg p-6 shadow-lg ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm opacity-75 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span className={`${trend.isPositive ? 'text-green-200' : 'text-red-200'}`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="ml-1 opacity-75">from last month</span>
            </div>
          )}
        </div>
        <div className={`rounded-full p-4 ${iconColorClasses[color]}`}>
          <FontAwesomeIcon icon={icon} className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default StatBox;