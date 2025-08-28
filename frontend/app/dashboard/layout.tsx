// app/dashboard/layout.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import AppBarComponent from "@/components/dashboardLayout/AppBar";
import SidebarComponent from "@/components/dashboardLayout/Sidebar";
import NotificationDrawer from "@/components/dashboardLayout/NotificationDrawer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 64;
const APPBAR_HEIGHT = 64;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Initialize sidebar state based on screen size
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setSidebarCollapsed(false);
      setMobileOpen(false);
    } else {
      setSidebarOpen(true);
      setSidebarCollapsed(false);
    }
  }, [isMobile]);

  // Handle sidebar toggle - only two states
  const handleSidebarToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      if (sidebarCollapsed) {
        // از collapsed به باز
        setSidebarCollapsed(false);
        setSidebarOpen(true);
      } else {
        // از باز به collapsed
        setSidebarCollapsed(true);
        setSidebarOpen(true);
      }
    }
  };

  const handleNotificationToggle = () => {
    setNotificationOpen(!notificationOpen);
  };

  const currentDrawerWidth = sidebarCollapsed
    ? COLLAPSED_DRAWER_WIDTH
    : DRAWER_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", borderRadius: 0 }}>
      {/* App Bar */}
      <AppBarComponent
        onSidebarToggle={handleSidebarToggle}
        onNotificationToggle={handleNotificationToggle}
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        drawerWidth={DRAWER_WIDTH}
        collapsedWidth={COLLAPSED_DRAWER_WIDTH}
        isMobile={isMobile}
        appBarHeight={APPBAR_HEIGHT}
      />

      {/* Sidebar */}
      <SidebarComponent
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        drawerWidth={DRAWER_WIDTH}
        collapsedWidth={COLLAPSED_DRAWER_WIDTH}
        appBarHeight={APPBAR_HEIGHT}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            md: sidebarOpen ? `calc(100% - ${currentDrawerWidth}px)` : "100%",
          },
          // ml: {
          //   xs: 0,
          //   md: sidebarOpen ? `${currentDrawerWidth}px` : 0,
          // },
          mt: `${APPBAR_HEIGHT}px`,
          minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`,
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          p: {
            xs: 1.5,
            sm: 2,
            md: 3,
            lg: 4,
          },
          position: "relative",
        }}
      >
        {children}
      </Box>

      {/* Notification Drawer */}
      <NotificationDrawer
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        appBarHeight={APPBAR_HEIGHT}
      />
    </Box>
  );
}
