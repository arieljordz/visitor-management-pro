import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt,
  faUsers,
  faCog,
  faChartLine,
  faDatabase,
  faFileAlt,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { useSidebar } from '../../context/SidebarContext';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: faTachometerAlt,
    path: '/dashboard'
  },
  {
    id: 'users',
    label: 'Users',
    icon: faUsers,
    path: '/users'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: faChartLine,
    path: '/analytics'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: faFileAlt,
    path: '/reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: faCog,
    path: '/settings'
  }
];

const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();

  return (
    <aside className={`fixed left-0 top-0 z-40 h-screen bg-admin-sidebar transition-all duration-300 ease-smooth ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="flex h-16 items-center justify-center border-b border-admin-sidebar-hover px-4">
          <div className="flex items-center">
            <FontAwesomeIcon 
              icon={faHome} 
              className="text-2xl text-admin-sidebar-active"
            />
            {isOpen && (
              <span className="ml-3 text-lg font-semibold text-admin-sidebar-foreground">
                AdminLTE
              </span>
            )}
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
                        ? 'bg-admin-sidebar-active text-white'
                        : 'text-admin-sidebar-foreground hover:bg-admin-sidebar-hover'
                    }`
                  }
                >
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    className={`h-5 w-5 ${isOpen ? 'mr-3' : 'mx-auto'}`}
                  />
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="border-t border-admin-sidebar-hover p-4">
            <div className="text-xs text-admin-sidebar-foreground opacity-75">
              AdminLTE v3.2.0
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;