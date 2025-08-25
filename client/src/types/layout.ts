// types/layout.ts
export interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export interface NavItemProps {
  name: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  roles: string[];
}
