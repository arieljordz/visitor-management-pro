import React from "react";
import { useSidebar } from "@/contexts/SidebarContext";

const Footer: React.FC = () => {
  const { isOpen } = useSidebar();

  return (
    <footer
      className={`
        fixed bottom-0 z-50 border-t bg-card px-6 py-4 transition-all duration-300 ease-smooth
        w-full left-0 
        ${isOpen ? "md:left-64 md:w-[calc(100%-16rem)]" : "md:left-16 md:w-[calc(100%-4rem)]"}
      `}
    >
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          © {new Date().getFullYear()} AdminLTE Dashboard. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span>Version 3.2.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
