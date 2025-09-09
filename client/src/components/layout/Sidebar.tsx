import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt, // Dashboard
  faUsers,         // Users
  faUserFriends,   // Visitors
  faCalendarAlt,   // Appointments
  faChartLine,     // Analytics
  faFileAlt,       // Reports
  faCog,           // Settings
} from "@fortawesome/free-solid-svg-icons";
import { Building2 } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: faTachometerAlt,
    path: "/dashboard",
  },
  { id: "users", label: "Users", icon: faUsers, path: "/users" },
  { id: "visitors", label: "Visitors", icon: faUserFriends, path: "/visitors" },
  { id: "appointments", label: "Appointments", icon: faCalendarAlt, path: "/appointments" },
  {
    id: "analytics",
    label: "Analytics",
    icon: faChartLine,
    path: "/analytics",
  },
  { id: "reports", label: "Reports", icon: faFileAlt, path: "/reports" },
  { id: "settings", label: "Settings", icon: faCog, path: "/settings" },
];

const Sidebar: React.FC = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggle}
      />

      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-admin-sidebar transition-all duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:w-16"}
          w-64
        `}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-16 items-center justify-center border-b border-admin-sidebar-hover px-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-indigo-600 " />
              <span
                className={`ml-3 text-lg font-semibold text-admin-sidebar-foreground hidden md:block transition-all duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                VMS Pro
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-admin-sidebar-active text-white"
                          : "text-admin-sidebar-foreground hover:bg-admin-sidebar-hover"
                      }`
                    }
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`h-5 w-5 ${isOpen ? "mr-3" : "mx-auto"}`}
                    />
                    {/* Show label only when expanded OR on mobile */}
                    <span
                      className={`transition-all duration-200 ${
                        isOpen ? "opacity-100" : "opacity-0 md:hidden"
                      }`}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer (desktop only when expanded) */}
          <div
            className={`border-t border-admin-sidebar-hover p-4 hidden md:block transition-all duration-200 ${
              isOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <div className="text-xs text-admin-sidebar-foreground opacity-75">
              AdminLTE v3.2.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
