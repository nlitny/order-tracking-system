// components/layout/AppBar.tsx
"use client";
import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import ProfileMenu from "./ProfileMenu";

interface AppBarComponentProps {
  onSidebarToggle: () => void;
  onNotificationToggle: () => void;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  drawerWidth: number;
  collapsedWidth: number;
  isMobile: boolean;
  appBarHeight: number;
}

export default function AppBarComponent({
  onSidebarToggle,
  onNotificationToggle,
  sidebarOpen,
  sidebarCollapsed,
  drawerWidth,
  collapsedWidth,
  isMobile,
  appBarHeight,
}: AppBarComponentProps) {
  const theme = useTheme();
  const [profileAnchorEl, setProfileAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [moreAnchorEl, setMoreAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  // ریسپانسیو بریک پوینت‌ها
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setProfileAnchorEl(null);
    setMoreAnchorEl(null);
  };

  // 🔥 اضافه کردن handler functions جدید
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleMyProfileClick = () => {
    console.log("My Profile clicked");
    // Navigate to profile page
    // router.push('/profile');
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    // Navigate to settings page
    // router.push('/settings');
  };

  const handleLogoutClick = () => {
    console.log("Logout clicked");
    // Handle logout logic
    // Example:
    // localStorage.removeItem('authToken');
    // router.push('/login');
  };

  // محاسبه عرض و margin صحیح AppBar
  const getAppBarStyles = () => {
    if (isMobile) {
      return {
        width: "100%",
        ml: 0,
      };
    }

    if (!sidebarOpen) {
      return {
        width: "100%",
        ml: 0,
      };
    }

    const marginLeft = sidebarCollapsed ? collapsedWidth : drawerWidth;
    return {
      width: `calc(100% - ${marginLeft}px)`,
      ml: `${marginLeft}px`,
    };
  };

  // رنگ‌بندی مشابه sidebar
  const appBarStyles = {
    background: `linear-gradient(145deg, 
      ${theme.palette.background.paper} 0%, 
      ${alpha(theme.palette.primary.main, 0.02)} 50%,
      ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    backdropFilter: "blur(20px)",
    boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.12)}`,
    borderRadius: 0,
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ...getAppBarStyles(),
          height: { xs: 56, sm: 64, md: appBarHeight },
        //   zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin-left"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...appBarStyles,
          backgroundImage: "none",
        }}
      >
        <Toolbar
          sx={{
            height: "100%",
            minHeight: { xs: 56, sm: 64, md: appBarHeight },
            px: { xs: 2, sm: 3, md: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left Section - Menu Button & Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* Menu Button */}
            <Tooltip title="Toggle Sidebar">
              <IconButton
                color="inherit"
                aria-label="toggle drawer"
                onClick={onSidebarToggle}
                edge="start"
                sx={{
                  p: { xs: 1, sm: 1.2 },
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    transform: "scale(1.05)",
                  },
                  transition: theme.transitions.create([
                    "background-color",
                    "transform",
                  ]),
                }}
              >
                <MenuIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              </IconButton>
            </Tooltip>

            {/* Logo/Title */}
            {/* <Typography
              variant={isXs ? "h6" : "h5"}
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                background: `linear-gradient(45deg, 
                  ${theme.palette.primary.main} 30%, 
                  ${theme.palette.secondary.main} 90%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Customer Dashboard
            </Typography> */}
          </Box>

          {/* Right Section - Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            {/* Desktop Actions */}
            {!isXs && (
              <>
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton
                    color="inherit"
                    onClick={onNotificationToggle}
                    sx={{
                      p: { sm: 1, md: 1.2 },
                      borderRadius: 1,
                      color: theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.08
                        ),
                        transform: "scale(1.05)",
                      },
                      transition: theme.transitions.create([
                        "background-color",
                        "transform",
                      ]),
                    }}
                  >
                    <Badge
                      badgeContent={4}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: { sm: "0.7rem", md: "0.75rem" },
                          minWidth: { sm: 16, md: 18 },
                          height: { sm: 16, md: 18 },
                        },
                      }}
                    >
                      <NotificationsIcon
                        sx={{ fontSize: { sm: 20, md: 30 } }}
                      />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </>
            )}

            {/* Profile Menu */}
            <Tooltip title="Account Settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  p: { xs: 0.5, sm: 0.8 },
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    transform: "scale(1.05)",
                  },
                  transition: theme.transitions.create([
                    "background-color",
                    "transform",
                  ]),
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 32, sm: 36, md: 40 },
                    height: { xs: 32, sm: 36, md: 40 },
                    background: `linear-gradient(45deg, 
                      ${theme.palette.primary.main} 30%, 
                      ${theme.palette.secondary.main} 90%)`,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 600,
                    boxShadow: theme.shadows[2],
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  JD
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Mobile More Menu */}
            {isXs && (
              <Tooltip title="More Options">
                <IconButton
                  color="inherit"
                  onClick={handleMoreMenuOpen}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <MoreVertIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu Component */}
      <ProfileMenu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        version="v2.1.0"
        onProfileClick={handleMyProfileClick}
        onSettingsClick={handleSettingsClick}
      />

      {/* Mobile More Options Menu */}
      <Menu
        anchorEl={moreAnchorEl}
        open={Boolean(moreAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 1,
            overflow: "visible",
            filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.15))",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onNotificationToggle();
          }}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <Badge
              badgeContent={4}
              color="error"
              sx={{ "& .MuiBadge-badge": { fontSize: "0.7rem" } }}
            >
              <NotificationsIcon fontSize="small" />
            </Badge>
          </ListItemIcon>
          <ListItemText
            primary="Notifications"
            primaryTypographyProps={{ fontSize: "0.9rem" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
