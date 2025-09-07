import React from 'react';
import { useSidebar } from '../../contexts/SidebarContext';

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  const { isOpen } = useSidebar();

   return (
    <main
      className={`flex-1 transition-all duration-300 ease-smooth ${
        isOpen ? 'ml-64' : 'ml-16'
      }`}
    >
      <div className="min-h-[calc(100vh-4rem)]">{children}</div>
    </main>
  );
};

export default ContentWrapper;