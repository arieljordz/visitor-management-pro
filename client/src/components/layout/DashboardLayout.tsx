// DashboardLayout.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardLayout() {
  const { isAuthenticated } = useUserStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setCollapsed={setSidebarCollapsed}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          {/* Burger button always visible */}
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground"
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setSidebarCollapsed((prev) => !prev); // Desktop collapse
              } else {
                setMobileSidebarOpen((prev) => !prev); // Mobile open/close
              }
            }}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
