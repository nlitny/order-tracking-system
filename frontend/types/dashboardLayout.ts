export interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  badge?: number;
}

export interface SidebarComponentProps {
  open: boolean;
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  drawerWidth: number;
  collapsedWidth: number;
  appBarHeight: number;
  isMobile: boolean;
}

export interface DropdownState {
  open: boolean;
  anchorEl: HTMLElement | null;
  item: MenuItem | null;
}