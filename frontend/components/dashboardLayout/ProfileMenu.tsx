// components/layout/ProfileMenu.tsx
import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
    lastLogin?: string;
  };
  version?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  anchorEl,
  open,
  onClose,
  user = {
    name: "Admin User",
    email: "admin@dashboard.com",
    role: "Administrator",
    lastLogin: "Today 09:30 AM",
  },
  version = "v2.1.0",
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}) => {
  const theme = useTheme();

  const handleMenuItemClick = (callback?: () => void) => {
    onClose();
    callback?.();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClose}
      disableAutoFocusItem
      PaperProps={{
        elevation: 0,
        sx: {
          mt: 1.5,
          minWidth: { xs: 260, sm: 280, md: 300 },
          maxWidth: { xs: "90vw", sm: 320 },
          borderRadius: 0.75,
          overflow: "visible",
          background: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          backdropFilter: "blur(20px)",
          boxShadow: theme.shadows[8],
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: -1,
            right: { xs: 20, sm: 24, md: 28 },
            width: 14,
            height: 14,
            background: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            borderBottom: "none",
            borderRight: "none",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 1,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      MenuListProps={{
        sx: {
          py: 0,
          "&:focus": {
            outline: "none",
          },
        },
      }}
    >
      {/* Profile Header */}
      <Box
        sx={{
          position: "relative",
          px: { xs: 2.5, sm: 3, md: 3.5 },
          py: { xs: 2.5, sm: 3 },
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.05)} 0%, 
            ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          {/* Avatar with Online Status */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={user.avatar}
              sx={{
                width: { xs: 48, sm: 52, md: 56 },
                height: { xs: 48, sm: 52, md: 56 },
                background: `linear-gradient(135deg, 
                  ${theme.palette.primary.main} 0%, 
                  ${theme.palette.secondary.main} 100%)`,
                border: `3px solid ${theme.palette.background.paper}`,
                boxShadow: theme.shadows[4],
                color: theme.palette.primary.contrastText,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                fontWeight: 700,
              }}
            >
              {!user.avatar && getInitials(user.name)}
            </Avatar>

            {/* Online Status Indicator */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: 2, sm: 4 },
                right: { xs: 2, sm: 4 },
                width: { xs: 12, sm: 14, md: 16 },
                height: { xs: 12, sm: 14, md: 16 },
                bgcolor: "#4CAF50",
                borderRadius: "50%",
                border: `3px solid ${theme.palette.background.paper}`,
                boxShadow: `0 2px 6px ${alpha("#4CAF50", 0.3)}`,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": {
                    boxShadow: `0 0 0 0 ${alpha("#4CAF50", 0.7)}`,
                  },
                  "70%": {
                    boxShadow: `0 0 0 6px ${alpha("#4CAF50", 0)}`,
                  },
                  "100%": {
                    boxShadow: `0 0 0 0 ${alpha("#4CAF50", 0)}`,
                  },
                },
              }}
            />
          </Box>

          {/* User Information */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                fontWeight: 700,
                color: theme.palette.text.primary,
                lineHeight: 1.2,
                mb: 0.5,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                color: theme.palette.text.secondary,
                fontWeight: 500,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                opacity: 0.9,
              }}
            >
              {user.email}
            </Typography>

            {/* Role Badge */}
            <Box
              sx={{
                mt: 1,
                display: "inline-flex",
                alignItems: "center",
                px: 1.5,
                py: 0.5,
                borderRadius: 20,
                background: `linear-gradient(45deg, 
                  ${alpha(theme.palette.primary.main, 0.15)} 0%, 
                  ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {user.role}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <Box sx={{ py: 1 }}>
        {/* Profile Menu Item */}
        <MenuItem
          onClick={() => handleMenuItemClick(onProfileClick)}
          sx={{
            py: { xs: 1.2, sm: 1.5 },
            px: { xs: 2.5, sm: 3, md: 3.5 },
            mx: 1,
            my: 0.5,
            borderRadius: 1,
            color: theme.palette.text.primary,
            transition: theme.transitions.create(
              ["background-color", "transform", "box-shadow"],
              {
                duration: 200,
              }
            ),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              transform: "translateX(4px)",
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
            },
            "&:active": {
              transform: "translateX(4px) scale(0.98)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: { xs: 36, sm: 40 },
              color: theme.palette.primary.main,
            }}
          >
            <PersonIcon
              sx={{
                fontSize: { xs: 20, sm: 22 },
                transition: "transform 0.2s ease",
                ".MuiMenuItem-root:hover &": {
                  transform: "scale(1.1)",
                },
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary="My Profile"
            secondary="View and edit profile"
            primaryTypographyProps={{
              fontSize: { xs: "0.85rem", sm: "0.9rem" },
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
            secondaryTypographyProps={{
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              color: theme.palette.text.secondary,
              fontWeight: 400,
            }}
          />
        </MenuItem>

        {/* Settings Menu Item */}
        <MenuItem
          onClick={() => handleMenuItemClick(onSettingsClick)}
          sx={{
            py: { xs: 1.2, sm: 1.5 },
            px: { xs: 2.5, sm: 3, md: 3.5 },
            mx: 1,
            my: 0.5,
            borderRadius: 1,
            color: theme.palette.text.primary,
            transition: theme.transitions.create(
              ["background-color", "transform", "box-shadow"],
              {
                duration: 200,
              }
            ),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              transform: "translateX(4px)",
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
            },
            "&:active": {
              transform: "translateX(4px) scale(0.98)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: { xs: 36, sm: 40 },
              color: theme.palette.primary.main,
            }}
          >
            <SettingsIcon
              sx={{
                fontSize: { xs: 20, sm: 22 },
                transition: "transform 0.2s ease",
                ".MuiMenuItem-root:hover &": {
                  transform: "rotate(90deg)",
                },
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Account Settings"
            secondary="Privacy and security"
            primaryTypographyProps={{
              fontSize: { xs: "0.85rem", sm: "0.9rem" },
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
            secondaryTypographyProps={{
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              color: theme.palette.text.secondary,
              fontWeight: 400,
            }}
          />
        </MenuItem>

        {/* Divider */}
        <Divider
          sx={{
            mx: 2,
            my: 1.5,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${alpha(theme.palette.divider, 0.5)} 50%, 
              transparent 100%)`,
            height: 1,
            borderRadius: 1,
          }}
        />

        {/* Logout Menu Item */}
        <MenuItem
          onClick={() => handleMenuItemClick(onLogoutClick)}
          sx={{
            py: { xs: 1.2, sm: 1.5 },
            px: { xs: 2.5, sm: 3, md: 3.5 },
            mx: 1,
            my: 0.5,
            borderRadius: 1,
            color: "#d32f2f",
            transition: theme.transitions.create(
              ["background-color", "transform", "box-shadow"],
              {
                duration: 200,
              }
            ),
            "&:hover": {
              backgroundColor: alpha("#d32f2f", 0.08),
              transform: "translateX(4px)",
              boxShadow: `0 2px 8px ${alpha("#d32f2f", 0.15)}`,
            },
            "&:active": {
              transform: "translateX(4px) scale(0.98)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: { xs: 36, sm: 40 },
              color: "inherit",
            }}
          >
            <LogoutIcon
              sx={{
                fontSize: { xs: 20, sm: 22 },
                transition: "transform 0.2s ease",
                ".MuiMenuItem-root:hover &": {
                  transform: "translateX(2px)",
                },
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            secondary="Logout from account"
            primaryTypographyProps={{
              fontSize: { xs: "0.85rem", sm: "0.9rem" },
              fontWeight: 600,
            }}
            secondaryTypographyProps={{
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              color: alpha("#d32f2f", 0.7),
              fontWeight: 400,
            }}
          />
        </MenuItem>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3, md: 3.5 },
          py: { xs: 1.5, sm: 2 },
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.8)} 0%, 
            ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          borderRadius: "0 0 8px 8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Last login: {user.lastLogin}
          </Typography>

          {/* Version Info */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1,
              py: 0.25,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: "0.65rem", sm: "0.7rem" },
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              {version}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Menu>
  );
};

export default ProfileMenu;
