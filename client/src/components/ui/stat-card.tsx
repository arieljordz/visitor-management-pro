import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const variantStyles = {
  default: 'border-card-border bg-gradient-surface',
  success: 'border-success/20 bg-gradient-to-br from-success-muted to-success-muted/50',
  warning: 'border-warning/20 bg-gradient-to-br from-warning-muted to-warning-muted/50',
  destructive: 'border-destructive/20 bg-gradient-to-br from-destructive-muted to-destructive-muted/50'
};

const iconStyles = {
  default: 'text-primary bg-primary-muted',
  success: 'text-success bg-success-muted',
  warning: 'text-warning bg-warning-muted',
  destructive: 'text-destructive bg-destructive-muted'
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      'rounded-lg border p-6 shadow-card transition-all duration-normal hover:shadow-md',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-700 mt-2">
            {value}
          </p>
          {trend && (
            <p className="text-xs text-muted-foreground mt-1">
              <span className={cn(
                'font-medium',
                trend.value > 0 ? 'text-success' : 
                trend.value < 0 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              {' '}{trend.label}
            </p>
          )}
        </div>
        <div className={cn(
          'rounded-lg p-3',
          iconStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}