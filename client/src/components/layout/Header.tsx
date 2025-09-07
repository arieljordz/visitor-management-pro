import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars,
  faSearch,
  faBell,
  faUser,
  faMoon,
  faSun,
  faSignOutAlt,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { useSidebar } from '../../context/SidebarContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Header: React.FC = () => {
  const { toggle } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-admin-header px-4 shadow-sm">
      {/* Left section */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="mr-4 text-admin-header-foreground hover:bg-muted"
        >
          <FontAwesomeIcon icon={faBars} className="h-4 w-4" />
        </Button>

        {/* Search */}
        <div className="relative w-64">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="text-admin-header-foreground hover:bg-muted"
        >
          <FontAwesomeIcon 
            icon={theme === 'dark' ? faSun : faMoon} 
            className="h-4 w-4"
          />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative text-admin-header-foreground hover:bg-muted"
            >
              <FontAwesomeIcon icon={faBell} className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3">
              <h4 className="font-medium">Notifications</h4>
              <p className="text-sm text-muted-foreground">You have 3 new notifications</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium">New user registered</span>
                <span className="text-sm text-muted-foreground">2 minutes ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium">Server backup completed</span>
                <span className="text-sm text-muted-foreground">1 hour ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium">System update available</span>
                <span className="text-sm text-muted-foreground">3 hours ago</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-admin-header-foreground hover:bg-muted"
            >
              <FontAwesomeIcon icon={faUserCircle} className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;