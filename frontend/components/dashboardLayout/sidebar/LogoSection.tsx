// components/layout/sidebar/LogoSection.tsx
"use client";
import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { brandColors } from "./constants";

interface LogoSectionProps {
  collapsed: boolean;
  isMobile: boolean;
  appBarHeight: number;
  onClose: () => void;
}

export default function LogoSection({
  collapsed,
  isMobile,
  appBarHeight,
  onClose,
}: LogoSectionProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed && !isMobile ? "center" : "space-between",
        px: collapsed && !isMobile ? 1 : 3,
        py: 2,
        borderBottom: `1px solid ${alpha(brandColors.teal, 0.15)}`,
        background: `linear-gradient(135deg, 
          ${alpha(brandColors.navy, 0.05)} 0%, 
          ${alpha(brandColors.teal, 0.03)} 100%)`,
        position: "relative",
        minHeight: appBarHeight,
      }}
    >
      {/* دکمه بستن موبایل */}
      {isMobile && (
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            color: brandColors.navy,
            "&:hover": {
              color: brandColors.teal,
              backgroundColor: alpha(brandColors.lightTeal, 0.12),
            },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}

      {/* محتوای لوگو */}
      {!collapsed || isMobile ? (
        <Tooltip
          title="Visit Landing Page - Order Status Tracking System"
          placement="bottom"
          arrow
        >
          <Link href="/">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                pr: isMobile ? 5 : 0,
                cursor: "pointer",
                "&:hover": {
                  "& .logo-avatar": {
                    transform: "scale(1.05)",
                  },
                  "& .logo-text": {
                    transform: "translateX(2px)",
                  },
                },
                transition: theme.transitions.create(["transform"]),
              }}
            >
              <Box sx={{ position: "relative", mr: 2 }}>
                <Avatar
                  className="logo-avatar"
                  sx={{
                    width: 55,
                    height: 55,
                    color: brandColors.cream,
                    background: "none",
                    transition: theme.transitions.create(["transform"]),
                  }}
                >
                  <Image
                    src="/images/minilogo.png"
                    alt="Order Status Tracking System Logo"
                    width={70}
                    height={50}
                    priority
                  />
                </Avatar>
              </Box>

              <Box
                className="logo-text"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  transition: theme.transitions.create(["transform"]),
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    overflow: "hidden",
                    fontSize: "1.25rem",
                    background: `linear-gradient(45deg, 
                    ${brandColors.navy} 30%, 
                    ${brandColors.teal} 90%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textOverflow: "ellipsis",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Order Status
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: brandColors.teal,
                    fontSize: "0.75rem",
                    display: "block",
                    textAlign: "center",
                    fontWeight: 500,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  Tracking System
                </Typography>
              </Box>
            </Box>
          </Link>
        </Tooltip>
      ) : (
        <Tooltip
          title="Order Status Tracking System - Click to visit landing page"
          placement="right"
          arrow
        >
          <Link href="/">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                cursor: "pointer",
                "&:hover .logo-avatar": {
                  transform: "scale(1.1) rotate(5deg)",
                },
              }}
            >
              <Avatar
                className="logo-avatar"
                sx={{
                  width: 50,
                  height: 50,
                  background: "none",
                  color: brandColors.cream,
                  transition: theme.transitions.create(["transform"], {
                    duration: 300,
                  }),
                }}
              >
                <Image
                  src="/images/minilogo.png"
                  alt="Order Status Tracking System Logo"
                  width={50}
                  height={50}
                  priority
                />
              </Avatar>
            </Box>
          </Link>
        </Tooltip>
      )}
    </Box>
  );
}
