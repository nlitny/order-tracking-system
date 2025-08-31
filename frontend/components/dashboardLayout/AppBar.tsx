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
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";

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
  const { user } = useUser();
  const router = useRouter();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const { unreadCount } = useNotifications();

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

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleMyProfileClick = () => {
    router.push("/dashboard/profile");
  };

  const handleSettingsClick = () => {
    router.push("/dashboard/profile");
  };

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
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
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={onNotificationToggle}
                sx={{
                  p: { xs: 1, sm: 1, md: 1.2 },
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
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                      minWidth: { xs: 18, sm: 18, md: 20 },
                      height: { xs: 18, sm: 18, md: 20 },
                    },
                  }}
                >
                  <NotificationsIcon
                    sx={{ fontSize: { xs: 26, sm: 28, md: 28 } }}
                  />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Avatar */}
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
                  src={user?.profilePicture}
                >
                  {user?.firstName?.charAt(0) + " " + user?.lastName?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <ProfileMenu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        version="v2.1.0"
        onProfileClick={handleMyProfileClick}
        onSettingsClick={handleSettingsClick}
      />
    </>
  );
}
