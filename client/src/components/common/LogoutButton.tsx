import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import React from "react";

interface LogoutButtonProps {
  to?: string;
  iconOnly?: boolean;
  onClick?: () => void;
}

export const LogoutButton = React.forwardRef<HTMLAnchorElement, LogoutButtonProps>(
  ({ to = "#", iconOnly = false, onClick }, ref) => {
    if (iconOnly) {
      return (
        <NavLink
          to={to}
          onClick={onClick}
          ref={ref}
          className="p-2 rounded hover:bg-sidebar-accent/50"
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-sidebar-foreground" />
        </NavLink>
      );
    }

    return (
      <NavLink
        to={to}
        onClick={onClick}
        ref={ref}
        className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm font-medium text-sidebar-foreground bg-sidebar-accent border border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </NavLink>
    );
  }
);

LogoutButton.displayName = "LogoutButton"; 
