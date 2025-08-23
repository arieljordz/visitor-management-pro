// Sidebar.tsx
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Building2,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { LogoutModal } from "@/components/common/LogoutModal";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Visitors", href: "/visitors", icon: Users },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({
  collapsed,
  mobileOpen,
  setCollapsed,
  setMobileOpen,
}: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useUserStore();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          hidden lg:flex
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-sidebar-primary" />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">
                  VMS Pro
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Visitor Management
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-4 py-4">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                {user?.email}
              </p>
            </div>
          )}
          <LogoutModal onConfirm={logout} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full"}
          lg:hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-sidebar-primary" />
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">
                VMS Pro
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Visitor Management
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-sidebar-foreground hover:text-sidebar-primary"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-4 py-4">
          <div className="mb-3">
            <p className="text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
          </div>
          <LogoutModal onConfirm={logout} />
        </div>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
