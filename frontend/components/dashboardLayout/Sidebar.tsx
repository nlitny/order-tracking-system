// components/layout/Sidebar.tsx
"use client";
import React from "react";
import { Drawer, Box, useTheme, alpha } from "@mui/material";
import { usePathname } from "next/navigation";

// Import components
import LogoSection from "./sidebar/LogoSection";
import DropdownMenu from "./sidebar/DropdownMenu";
import MenuItems from "./sidebar/MenuItems";
import SidebarFooter from "./sidebar/SidebarFooter";

// Import types and constants
import {
  SidebarComponentProps,
  DropdownState,
  MenuItem,
} from "@/types/dashboardLayout";
import { brandColors } from "./sidebar/constants";
import { getSidebarColors } from "./sidebar/utils";

export default function SidebarComponent({
  open,
  collapsed,
  mobileOpen,
  onClose,
  drawerWidth,
  collapsedWidth,
  appBarHeight,
  isMobile,
}: SidebarComponentProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  // State برای dropdown در حالت collapse
  const [dropdownOpen, setDropdownOpen] = React.useState<DropdownState>({
    open: false,
    anchorEl: null,
    item: null,
  });

  const handleExpandClick = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle dropdown برای حالت collapse
  const handleDropdownClick = (
    event: React.MouseEvent<HTMLElement>,
    item: MenuItem
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (collapsed && !isMobile && item.children) {
      setDropdownOpen({
        open: true,
        anchorEl: event.currentTarget,
        item: item,
      });
    } else if (item.children) {
      handleExpandClick(item.id);
    }
  };

  const handleDropdownClose = () => {
    setDropdownOpen({
      open: false,
      anchorEl: null,
      item: null,
    });
  };

  const isActive = (path: string) => pathname === path;
  const isParentActive = (children: MenuItem[]) =>
    children.some((child) => child.path && isActive(child.path));

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...getSidebarColors(),
        overflow: "hidden",
        borderRadius: 0,
      }}
    >
      <LogoSection
        collapsed={collapsed}
        isMobile={isMobile}
        appBarHeight={appBarHeight}
        onClose={onClose}
      />

      {/* Navigation Menu */}
      <Box
        sx={{
          flexGrow: 1,
          py: 2,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: alpha(brandColors.cream, 0.3),
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(brandColors.teal, 0.4),
            borderRadius: "3px",
            "&:hover": {
              background: alpha(brandColors.teal, 0.6),
            },
          },
        }}
      >
        <MenuItems
          collapsed={collapsed}
          isMobile={isMobile}
          expandedItems={expandedItems}
          onExpandClick={handleExpandClick}
          onDropdownClick={handleDropdownClick}
          isActive={isActive}
          isParentActive={isParentActive}
        />
      </Box>

      <SidebarFooter collapsed={collapsed} isMobile={isMobile} />

      {/* Dropdown Menu */}
      <DropdownMenu
        dropdownOpen={dropdownOpen}
        onClose={handleDropdownClose}
        isActive={isActive}
      />
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: Math.min(drawerWidth, window.innerWidth * 0.9),
            maxWidth: "90vw",
            backgroundImage: "none",
            top: 0,
            height: "100vh",
            zIndex: theme.zIndex.drawer + 2,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: currentWidth,
        borderRadius: 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: currentWidth,
          boxSizing: "border-box",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundImage: "none",
          zIndex: theme.zIndex.drawer,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
