"use client";
import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
  Badge,
  Box,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Circle as CircleIcon,
  ChevronRight as ChevronRightIcon,
  NotificationAdd,
  NotificationAddSharp,
  Group,
  GroupAdd,
  Groups,
} from "@mui/icons-material";
import Link from "next/link";
import { MenuItem } from "@/types/dashboardLayout";
import { brandColors } from "./constants";
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Support as SupportIcon,
  AdminPanelSettings as AdminIcon,
  PersonAdd as PersonAddIcon,
  Assessment as AssessmentIcon,
  Store as StoreIcon,
  BusinessCenter as BusinessCenterIcon,
  AccountBox as AccountBoxIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FactCheck as FactCheckIcon,
} from "@mui/icons-material";
import { usePageAccess } from "@/hooks/usePageAccess";
import { UserRole } from "@/types/types";
import { useNotifications } from "@/hooks/useNotifications";
import { useUsersManagement } from "@/hooks/useUsersManagement";
import { useCustomerDashboard } from "@/hooks/useCustomerDashboard";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useUser } from "@/context/UserContext";

interface MenuItemsProps {
  collapsed: boolean;
  isMobile: boolean;
  expandedItems: string[];
  onExpandClick: (itemId: string) => void;
  onDropdownClick: (
    event: React.MouseEvent<HTMLElement>,
    item: MenuItem
  ) => void;
  isActive: (path: string) => boolean;
  isParentActive: (children: MenuItem[]) => boolean;
}

interface MenuItemWithRoles extends MenuItem {
  roles?: UserRole[];
  children?: MenuItemWithRoles[];
}

const BadgeSkeleton = () => (
  <Skeleton
    variant="circular"
    width={18}
    height={18}
    sx={{
      bgcolor: alpha(brandColors.lightTeal, 0.3),
    }}
  />
);

const MenuItemSkeleton = ({
  collapsed,
  isMobile,
}: {
  collapsed: boolean;
  isMobile: boolean;
}) => (
  <ListItem disablePadding sx={{ mb: 0.5 }}>
    <ListItemButton
      disabled
      sx={{
        borderRadius: 0.5,
        minHeight: 48,
        mx: !collapsed || isMobile ? 2 : 0,
        justifyContent: collapsed && !isMobile ? "center" : "flex-start",
        px: collapsed && !isMobile ? 0 : 2,
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed && !isMobile ? 0 : 40,
          justifyContent: "center",
        }}
      >
        <Skeleton variant="circular" width={24} height={24} />
      </ListItemIcon>
      {(!collapsed || isMobile) && (
        <ListItemText
          primary={<Skeleton variant="text" width="60%" height={20} />}
        />
      )}
    </ListItemButton>
  </ListItem>
);

export default function MenuItems({
  collapsed,
  isMobile,
  expandedItems,
  onExpandClick,
  onDropdownClick,
  isActive,
  isParentActive,
}: MenuItemsProps) {
  const theme = useTheme();
  const { userRoles, isLoading, shouldWait } = usePageAccess();
  const { unreadCount, hasUnreadNotifications } = useNotifications();
  const { user, loading: userLoading } = useUser();

  const isCustomer = user?.role === "CUSTOMER";
  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";

  const customerHookResult = useCustomerDashboard({
    enabled: isCustomer,
  });

  const adminHookResult = useAdminDashboard({
    enabled: isAdminOrStaff,
  });

  const customerData = isCustomer ? customerHookResult.data : null;
  const customerLoading = isCustomer ? customerHookResult.loading : false;

  const adminData = isAdminOrStaff ? adminHookResult.data : null;
  const adminLoading = isAdminOrStaff ? adminHookResult.loading : false;

  const isBadgeDataLoading = React.useMemo(() => {
    if (userLoading) return true;
    if (isCustomer) return customerLoading;
    if (isAdminOrStaff) return adminLoading;
    return false;
  }, [userLoading, isCustomer, customerLoading, isAdminOrStaff, adminLoading]);

  const hasRole = (roles: UserRole[]): boolean => {
    return roles.some((role) => userRoles.includes(role));
  };

  const renderBadge = (
    badgeValue: number | false | undefined,
    isLoading: boolean = false
  ) => {
    if (isLoading) {
      return <BadgeSkeleton />;
    }

    if (!badgeValue || badgeValue === 0) {
      return null;
    }

    return (
      <Badge
        badgeContent={badgeValue > 99 ? "99+" : badgeValue}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: brandColors.lightTeal,
            color: brandColors.navy,
            fontSize: "0.7rem",
            fontWeight: 600,
            minWidth: 18,
            height: 18,
          },
        }}
      />
    );
  };

  const menuItems: MenuItemWithRoles[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      id: "orders",
      title: "Orders",
      icon: <FactCheckIcon />,
      roles: ["CUSTOMER", "STAFF", "ADMIN"],
      children: [
        {
          id: "orderslist",
          title: "Orders List",
          icon: <ReceiptIcon />,
          path: "/dashboard/orders",
          badge: isCustomer
            ? customerData?.orders?.total
            : adminData?.orders?.total,
          roles: ["CUSTOMER", "STAFF", "ADMIN"],
        },
        {
          id: "neworder",
          title: "Create New Order",
          icon: <PeopleIcon />,
          path: "/dashboard/orders/new",
          roles: ["CUSTOMER"],
        },
      ],
    },
    {
      id: "users",
      title: "Manage Users",
      icon: <Group />,
      roles: ["ADMIN"],
      children: [
        {
          id: "userslist",
          title: "Users",
          icon: <Groups />,
          path: "/dashboard/admin/users",
          badge: adminData?.users?.total,
          roles: ["ADMIN"],
        },
        {
          id: "newadmin",
          title: "Create New Staff/Admin",
          icon: <GroupAdd />,
          path: "/dashboard/admin/register",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <NotificationAddSharp />,
      path: "/dashboard/notifications",
      badge: unreadCount > 0 ? unreadCount : false,
      roles: ["ADMIN", "STAFF", "CUSTOMER"],
    },
    {
      id: "profile",
      title: "Profile",
      icon: <AccountBoxIcon />,
      path: "/dashboard/profile",
      roles: ["ADMIN", "STAFF", "CUSTOMER"],
    },
  ];

  const filterMenuItems = (items: MenuItemWithRoles[]): MenuItemWithRoles[] => {
    return items.filter((item) => {
      if (!item.roles || item.roles.length === 0) {
        return true;
      }

      const hasAccess = hasRole(item.roles);

      if (hasAccess && item.children) {
        const filteredChildren = filterMenuItems(item.children);
        if (filteredChildren.length === 0) {
          return false;
        }
        item.children = filteredChildren;
      }

      return hasAccess;
    });
  };

  const visibleMenuItems = React.useMemo(() => {
    if (isLoading || shouldWait) {
      return [];
    }
    return filterMenuItems([...menuItems]);
  }, [userRoles, isLoading, shouldWait, customerData, adminData, unreadCount]);

  if (isLoading || shouldWait) {
    return (
      <List sx={{ px: collapsed && !isMobile ? 1 : 0 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <MenuItemSkeleton
            key={`skeleton-${index}`}
            collapsed={collapsed}
            isMobile={isMobile}
          />
        ))}
      </List>
    );
  }

  if (visibleMenuItems.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <ListItemText
          primary="No menu items available"
          primaryTypographyProps={{
            variant: "body2",
            color: "text.secondary",
          }}
        />
      </Box>
    );
  }

  return (
    <List sx={{ px: collapsed && !isMobile ? 1 : 0 }}>
      {visibleMenuItems.map((item) => (
        <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
          {item.children ? (
            // Parent with children
            <Box sx={{ width: "100%" }}>
              <Tooltip
                title={collapsed && !isMobile ? item.title : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={(e) => onDropdownClick(e, item)}
                  selected={isParentActive(item.children)}
                  sx={{
                    borderRadius: 0.5,
                    mb: 0.5,
                    mx: !collapsed || isMobile ? 2 : 0,
                    minHeight: 48,
                    justifyContent:
                      collapsed && !isMobile ? "center" : "flex-start",
                    px: collapsed && !isMobile ? 0 : 2,
                    position: "relative",
                    transition: theme.transitions.create([
                      "background-color",
                      "transform",
                      "box-shadow",
                    ]),
                    "&:hover": {
                      transform: "translateX(4px)",
                      backgroundColor: alpha(brandColors.teal, 0.12),
                      boxShadow: `0 4px 12px ${alpha(brandColors.teal, 0.2)}`,
                    },
                    "&.Mui-selected": {
                      backgroundColor:
                        !collapsed || isMobile
                          ? alpha(brandColors.teal, 0.15)
                          : "transparent",
                      mx: !collapsed || isMobile ? 2 : 0,
                      borderLeft:
                        !collapsed || isMobile
                          ? `4px solid ${theme.palette.primary.main}`
                          : "",
                      "&:hover": {
                        backgroundColor: alpha(brandColors.teal, 0.2),
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed && !isMobile ? 0 : 40,
                      justifyContent: "center",
                      color: isParentActive(item.children)
                        ? brandColors.navy
                        : brandColors.teal,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {(!collapsed || isMobile) && (
                    <>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontSize: "0.9rem",
                          fontWeight: isParentActive(item.children) ? 600 : 500,
                          color: isParentActive(item.children)
                            ? brandColors.navy
                            : brandColors.navy,
                        }}
                      />
                      {expandedItems.includes(item.id) ? (
                        <ExpandLess sx={{ color: brandColors.teal }} />
                      ) : (
                        <ExpandMore sx={{ color: brandColors.teal }} />
                      )}
                    </>
                  )}

                  {collapsed && !isMobile && (
                    <ChevronRightIcon
                      sx={{
                        position: "absolute",
                        right: 4,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 16,
                        color: alpha(brandColors.teal, 0.7),
                        opacity: 0,
                        transition: theme.transitions.create(["opacity"]),
                        ".MuiListItemButton-root:hover &": {
                          opacity: 1,
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>

              {(!collapsed || isMobile) && (
                <Collapse
                  in={expandedItems.includes(item.id)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem key={child.id} disablePadding component="div">
                        <Link
                          href={child.path || "#"}
                          style={{ textDecoration: "none", width: "100%" }}
                        >
                          <ListItemButton
                            selected={child.path ? isActive(child.path) : false}
                            sx={{
                              pl: 4,
                              borderRadius: 0.5,
                              ml: 2,
                              mr: 1,
                              mb: 0.5,
                              minHeight: 40,
                              transition: theme.transitions.create([
                                "background-color",
                                "transform",
                              ]),
                              "&:hover": {
                                transform: "translateX(4px)",
                                backgroundColor: alpha(
                                  brandColors.lightTeal,
                                  0.12
                                ),
                              },
                              "&.Mui-selected": {
                                backgroundColor: alpha(
                                  brandColors.lightTeal,
                                  0.2
                                ),
                                borderLeft: `4px solid ${theme.palette.primary.main}`,
                                "&:hover": {
                                  backgroundColor: alpha(
                                    brandColors.lightTeal,
                                    0.25
                                  ),
                                },
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 32,
                                color:
                                  child.path && isActive(child.path)
                                    ? brandColors.navy
                                    : brandColors.teal,
                              }}
                            >
                              <CircleIcon sx={{ fontSize: 8 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={child.title}
                              primaryTypographyProps={{
                                fontSize: "0.85rem",
                                fontWeight:
                                  child.path && isActive(child.path)
                                    ? 600
                                    : 400,
                                color:
                                  child.path && isActive(child.path)
                                    ? brandColors.navy
                                    : brandColors.navy,
                              }}
                            />
                            {renderBadge(child.badge, isBadgeDataLoading)}
                          </ListItemButton>
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ) : (
            // Single item
            <Link
              href={item.path || "#"}
              style={{ textDecoration: "none", width: "100%" }}
            >
              <Tooltip
                title={collapsed && !isMobile ? item.title : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  selected={item.path ? isActive(item.path) : false}
                  sx={{
                    borderRadius: 0.5,
                    minHeight: 48,
                    mx: !collapsed || isMobile ? 2 : 0,
                    justifyContent:
                      collapsed && !isMobile ? "center" : "flex-start",
                    px: collapsed && !isMobile ? 0 : 2,
                    transition: theme.transitions.create([
                      "background-color",
                      "transform",
                      "box-shadow",
                    ]),
                    "&:hover": {
                      transform: "translateX(4px)",
                      backgroundColor: alpha(brandColors.teal, 0.12),
                      boxShadow: `0 4px 12px ${alpha(brandColors.teal, 0.2)}`,
                    },
                    "&.Mui-selected": {
                      backgroundColor:
                        !collapsed || isMobile
                          ? alpha(brandColors.teal, 0.15)
                          : "transparent",
                      mx: !collapsed || isMobile ? 2 : 0,
                      borderLeft:
                        !collapsed || isMobile
                          ? `4px solid ${theme.palette.primary.main}`
                          : "",
                      "&:hover": {
                        backgroundColor: alpha(brandColors.teal, 0.2),
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed && !isMobile ? 0 : 40,
                      justifyContent: "center",
                      color:
                        item.path && isActive(item.path)
                          ? brandColors.navy
                          : brandColors.teal,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {(!collapsed || isMobile) && (
                    <>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontSize: "0.9rem",
                          fontWeight:
                            item.path && isActive(item.path) ? 600 : 500,
                          color:
                            item.path && isActive(item.path)
                              ? brandColors.navy
                              : brandColors.navy,
                        }}
                      />

                      {renderBadge(item.badge, isBadgeDataLoading)}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            </Link>
          )}
        </ListItem>
      ))}
    </List>
  );
}
