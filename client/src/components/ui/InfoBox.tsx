import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface InfoBoxProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  color?: 'primary' | 'success' | 'warning' | 'info';
  progress?: number;
  description?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  progress,
  description 
}) => {
  const colorClasses = {
    primary: 'border-l-primary text-primary',
    success: 'border-l-success text-success',
    warning: 'border-l-warning text-warning',
    info: 'border-l-info text-info'
  };

  const progressColorClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info'
  };

  return (
    <div className={`rounded-lg border-l-4 bg-card p-6 shadow-sm ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className={`rounded-lg p-3 ${color === 'primary' ? 'bg-primary/10' : color === 'success' ? 'bg-success/10' : color === 'warning' ? 'bg-warning/10' : 'bg-info/10'}`}>
          <FontAwesomeIcon icon={icon} className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-card-foreground">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${progressColorClasses[color]}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoBox;