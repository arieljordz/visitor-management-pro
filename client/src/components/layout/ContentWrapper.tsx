import React from "react";
import { useSidebar } from "../../contexts/SidebarContext";

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <main
      className={`flex-1 transition-all duration-300 ease-smooth
        ml-0                       /* always no margin on mobile */
        ${isOpen ? "md:ml-64" : "md:ml-16"} /* only apply margin on desktop */
      `}
    >
      <div className="min-h-[calc(100vh-4rem)]">{children}</div>
    </main>
  );
};

export default ContentWrapper;
