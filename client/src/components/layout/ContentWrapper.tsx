import React from 'react';
import { useSidebar } from '../../context/SidebarContext';

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div className={`transition-all duration-300 ease-smooth ${isOpen ? 'ml-64' : 'ml-16'}`}>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </div>
  );
};

export default ContentWrapper;