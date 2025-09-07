import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface AdminCardProps {
  title: string;
  children: React.ReactNode;
  icon?: IconDefinition;
  className?: string;
  headerActions?: React.ReactNode;
}

const AdminCard: React.FC<AdminCardProps> = ({ 
  title, 
  children, 
  icon, 
  className = '', 
  headerActions 
}) => {
  return (
    <div className={`rounded-lg border bg-card shadow-md ${className}`}>
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center">
          {icon && (
            <FontAwesomeIcon 
              icon={icon} 
              className="mr-2 h-5 w-5 text-primary"
            />
          )}
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        </div>
        {headerActions && (
          <div>{headerActions}</div>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminCard;