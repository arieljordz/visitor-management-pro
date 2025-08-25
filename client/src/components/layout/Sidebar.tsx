import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  Building2,
  QrCode,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { LogoutModal } from "@/components/common/LogoutModal";
import { SidebarProps, NavItemProps } from "@/types/layout";


export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  setCollapsed,
  setMobileOpen,
}) => {
  const location = useLocation();
  const { user } = useUserStore();
  const role = user?.role || "user";

  const navItems: NavItemProps[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin"] },
    { name: "Visitors", href: "/visitors", icon: Users, roles: ["user"] },
    { name: "Appointments", href: "/appointments", icon: Calendar, roles: ["admin", "user"] },
    { name: "Reports", href: "/reports", icon: FileText, roles: ["admin", "staff"] },
    { name: "Scan QR", href: "/scan-qr", icon: QrCode, roles: ["staff"] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
  ];

  const allowedNavItems = navItems.filter((item) => item.roles.includes(role));

  const renderNavLink = (item: NavItemProps) => {
    const isActive = location.pathname === item.href;
    return (
      <NavLink
        key={item.name}
        to={item.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded mb-1 px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        }`}
      >
        <item.icon className="h-5 w-5" />
        {!collapsed && item.name}
      </NavLink>
    );
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border">
      <div className="flex items-center gap-2">
        <Building2 className="h-8 w-8 text-sidebar-primary" />
        {!collapsed && (
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">VMS Pro</h1>
            <p className="text-xs text-sidebar-foreground/60">Visitor Management</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderFooter = (mobile = false) => (
    <div className={`border-t border-sidebar-border px-4 py-4 flex flex-col items-center`}>
      {!collapsed && !mobile && (
        <div className="mb-3 text-center">
          <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
          <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
        </div>
      )}
      <LogoutModal
        onConfirm={() => useUserStore.getState().logout()}
        iconOnly={collapsed && !mobile}
      />
    </div>
  );

  const sidebarClasses = collapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${sidebarClasses} hidden lg:flex`}
      >
        {renderHeader()}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {allowedNavItems.map(renderNavLink)}
        </nav>
        {renderFooter()}
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full"
        } lg:hidden`}
      >
        {renderHeader()}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-sidebar-foreground hover:text-sidebar-primary"
        >
          ✕
        </button>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {allowedNavItems.map(renderNavLink)}
        </nav>
        {renderFooter(true)}
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
};
