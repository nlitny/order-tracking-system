"use client";
import React, { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import AppBarComponent from "@/components/dashboardLayout/AppBar";
import SidebarComponent from "@/components/dashboardLayout/Sidebar";
import NotificationDrawer from "@/components/dashboardLayout/NotificationDrawer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { NotificationProvider } from "@/context/NotificationContext";


const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 64;
const APPBAR_HEIGHT = 64;

export default  function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallLaptop = useMediaQuery(theme.breakpoints.down("lg"));

  // Initialize sidebar state based on screen size
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setSidebarCollapsed(false);
      setMobileOpen(false);
    } else if (isSmallLaptop) {
      setSidebarOpen(true);
      setSidebarCollapsed(true);
    } else {
      setSidebarOpen(true);
      setSidebarCollapsed(false);
    }
  }, [isMobile, isSmallLaptop]);

  // Handle sidebar toggle - only two states
  const handleSidebarToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      if (sidebarCollapsed) {
        setSidebarCollapsed(false);
        setSidebarOpen(true);
      } else {
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
    <ProtectedRoute requiredRoles={["CUSTOMER", "STAFF", "ADMIN"]}>
      <NotificationProvider>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
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
                md: sidebarOpen
                  ? `calc(100% - ${currentDrawerWidth}px)`
                  : "100%",
              },
              mt: `${APPBAR_HEIGHT}px`,
              minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`,
              backgroundColor: theme.palette.grey[50],
              transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
              p: {
                xs: 1,
                sm: 2,
                md: 2.5,
                lg: 3,
              },
              position: "relative",
              background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.light}, transparent)`,
                opacity: 0.5,
              },
            }}
          >
            <Box
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 1,
                minHeight: `calc(100vh - ${APPBAR_HEIGHT + 48}px)`,
                boxShadow: theme.shadows[1],
                border: `1px solid ${theme.palette.divider}`,
                overflow: "hidden",
              }}
            >
              {children}
            </Box>
          </Box>

          {/* Notification Drawer */}
          <NotificationDrawer
            open={notificationOpen}
            onClose={() => setNotificationOpen(false)}
            appBarHeight={APPBAR_HEIGHT}
          />
        </Box>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
