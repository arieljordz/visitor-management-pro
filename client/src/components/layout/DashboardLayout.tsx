import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardLayout() {
  const { isAuthenticated } = useUserStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Listen to window resize to adjust mobile vs desktop behavior
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setCollapsed={setSidebarCollapsed}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${isMobile && mobileSidebarOpen ? "overflow-hidden" : "overflow-auto"}
        `}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main
          className={`
            flex-1 transition-all duration-300 p-6
            ${isMobile && mobileSidebarOpen ? "blur-sm pointer-events-none" : ""}
          `}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile backdrop */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}
