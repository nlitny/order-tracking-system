// components/layout/sidebar/MenuItems.tsx
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
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Circle as CircleIcon,
  ChevronRight as ChevronRightIcon,
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
} from "@mui/icons-material";
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

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: <AnalyticsIcon />,
      path: "/dashboard/analytics",
      badge: 3,
    },
    {
      id: "ecommerce",
      title: "E-Commerce",
      icon: <ShoppingCartIcon />,
      children: [
        {
          id: "products",
          title: "Products",
          icon: <InventoryIcon />,
          path: "/dashboard/products",
        },
        {
          id: "orders",
          title: "Orders",
          icon: <ReceiptIcon />,
          path: "/dashboard/orders",
          badge: 12,
        },
        {
          id: "customers",
          title: "Customers",
          icon: <PeopleIcon />,
          path: "/dashboard/customers",
        },
      ],
    },
    {
      id: "users",
      title: "User Management",
      icon: <AdminIcon />,
      path: "/dashboard/users",
    },
    {
      id: "support",
      title: "Support",
      icon: <SupportIcon />,
      path: "/dashboard/support",
    },
    {
      id: "settings",
      title: "Settings",
      icon: <SettingsIcon />,
      path: "/dashboard/settings",
    },
  ];
  return (
    <List sx={{ px: collapsed && !isMobile ? 1 : 0 }}>
      {menuItems.map((item) => (
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

                  {/* نشانگر dropdown برای collapsed mode */}
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
                            {child.badge && (
                              <Badge
                                badgeContent={
                                  child.badge > 99 ? "99+" : child.badge
                                }
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
                            )}
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
                      {item.badge && (
                        <Badge
                          badgeContent={item.badge > 99 ? "99+" : item.badge}
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
                      )}
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
