"use client";
import React from "react";
import {
  Popper,
  Paper,
  ClickAwayListener,
  Fade,
  MenuList,
  MenuItem,
  Box,
  Typography,
  ListItemIcon,
  ListItemText,
  Badge,
  useTheme,
  alpha,
} from "@mui/material";
import { Circle as CircleIcon } from "@mui/icons-material";
import Link from "next/link";
import { DropdownState } from "@/types/dashboardLayout";
import { brandColors } from "./constants";

interface DropdownMenuProps {
  dropdownOpen: DropdownState;
  onClose: () => void;
  isActive: (path: string) => boolean;
}

export default function DropdownMenu({
  dropdownOpen,
  onClose,
  isActive,
}: DropdownMenuProps) {
  const theme = useTheme();

  return (
    <Popper
      open={dropdownOpen.open}
      anchorEl={dropdownOpen.anchorEl}
      placement="right-start"
      transition
      disablePortal={false}
      style={{ zIndex: theme.zIndex.tooltip + 1 }}
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, -8],
          },
        },
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
            padding: 8,
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={200}>
          <Paper
            elevation={12}
            sx={{
              minWidth: 200,
              maxWidth: 280,
              backgroundColor: brandColors.cream,
              border: `1px solid ${alpha(brandColors.teal, 0.2)}`,
              borderRadius: 1,
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              boxShadow: `0 8px 32px ${alpha(brandColors.navy, 0.15)}`,
            }}
          >
            <ClickAwayListener onClickAway={onClose}>
              <Box>
                {/* Header */}
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    backgroundColor: alpha(brandColors.teal, 0.08),
                    borderBottom: `1px solid ${alpha(brandColors.teal, 0.15)}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {dropdownOpen.item?.icon && (
                    <Box
                      sx={{
                        color: brandColors.teal,
                        display: "flex",
                        alignItems: "center",
                        "& svg": { fontSize: 18 },
                      }}
                    >
                      {dropdownOpen.item.icon}
                    </Box>
                  )}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: brandColors.navy,
                      fontSize: "0.9rem",
                    }}
                  >
                    {dropdownOpen.item?.title}
                  </Typography>
                </Box>

                {/* Menu Items */}
                <MenuList sx={{ py: 1 }}>
                  {dropdownOpen.item?.children?.map((child) => (
                    <Link
                      key={child.id}
                      href={child.path || "#"}
                      style={{ textDecoration: "none" }}
                      onClick={onClose}
                    >
                      <MenuItem
                        selected={child.path ? isActive(child.path) : false}
                        sx={{
                          mx: 1,
                          borderRadius: 1,
                          mb: 0.5,
                          py: 1,
                          "&:hover": {
                            backgroundColor: alpha(brandColors.lightTeal, 0.12),
                            transform: "translateX(4px)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: alpha(brandColors.lightTeal, 0.2),
                            borderLeft: `3px solid ${brandColors.teal}`,
                            "&:hover": {
                              backgroundColor: alpha(
                                brandColors.lightTeal,
                                0.25
                              ),
                            },
                          },
                          transition: theme.transitions.create([
                            "background-color",
                            "transform",
                          ]),
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 32,
                            color:
                              child.path && isActive(child.path)
                                ? brandColors.navy
                                : brandColors.teal,
                            "& svg": { fontSize: 16 },
                          }}
                        >
                          {child.icon || <CircleIcon sx={{ fontSize: 8 }} />}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.title}
                          primaryTypographyProps={{
                            fontSize: "0.85rem",
                            fontWeight:
                              child.path && isActive(child.path) ? 600 : 400,
                            color: brandColors.navy,
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
                      </MenuItem>
                    </Link>
                  ))}
                </MenuList>
              </Box>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
