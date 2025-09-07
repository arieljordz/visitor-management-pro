// components/ui/spinner.tsx
import React from 'react';
import { Building2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerSizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className={`flex flex-col items-center space-y-4 ${containerSizeClasses[size]}`}>
        {/* App Icon */}
        <div className="p-3 bg-indigo-600 rounded-full mb-2">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        
        {/* Spinner */}
        <div 
          className={`${sizeClasses[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}
        ></div>
        
        {/* Message */}
        <p className="text-gray-600 font-medium">{message}</p>
        
        {/* App Name */}
        <p className="text-sm text-gray-500">Visitor Management System</p>
      </div>
    </div>
  );
};

export default spinner;