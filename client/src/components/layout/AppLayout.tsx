import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import ContentWrapper from "./ContentWrapper";
// ---------------- Layout ----------------
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>; // Auth pages (login/register) don’t need sidebar/footer
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 transition-all duration-300 ease-smooth">
          <ContentWrapper>
            <Header />
            <main className="flex-1 pb-8">{children}</main>
          </ContentWrapper>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
