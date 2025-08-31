
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
  Paper,
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
    <Paper
      elevation={0}
      sx={{
        height: appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed && !isMobile ? "center" : "space-between",
        px: collapsed && !isMobile ? 1 : 3,
        py: 2,
        borderBottom: `1px solid ${alpha(brandColors.teal, 0.12)}`,
        background: `linear-gradient(135deg, 
          ${alpha(brandColors.navy, 0.04)} 0%, 
          ${alpha(brandColors.teal, 0.02)} 100%)`,
        position: "relative",
        minHeight: appBarHeight,
        borderRadius: 0,
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background: `linear-gradient(90deg, 
            transparent, 
            ${alpha(brandColors.teal, 0.3)}, 
            transparent)`,
        },
      }}
    >
      {isMobile && (
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            color: brandColors.navy,
            backgroundColor: alpha(brandColors.lightTeal, 0.1),
            border: `1px solid ${alpha(brandColors.teal, 0.2)}`,
            "&:hover": {
              color: brandColors.teal,
              backgroundColor: alpha(brandColors.lightTeal, 0.2),
              transform: "scale(1.05)",
            },
            transition: theme.transitions.create([
              "transform",
              "background-color",
            ]),
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}

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
                borderRadius: 1,
                p: 1,
                transition: theme.transitions.create([
                  "transform",
                  "background-color",
                ]),
                "&:hover": {
                  backgroundColor: alpha(brandColors.teal, 0.05),
                  transform: "translateY(-1px)",
                  "& .logo-avatar": {
                    transform: "scale(1.05) rotate(2deg)",
                  },
                  "& .logo-text": {
                    transform: "translateX(2px)",
                  },
                },
              }}
            >
              <Box sx={{ position: "relative", mr: 2 }}>
                <Avatar
                  className="logo-avatar"
                  sx={{
                    width: 52,
                    height: 52,
                    color: brandColors.cream,
                    background: `linear-gradient(135deg, 
                      ${alpha(brandColors.teal, 0.1)} 0%, 
                      ${alpha(brandColors.navy, 0.05)} 100%)`,
                    border: `2px solid ${alpha(brandColors.teal, 0.2)}`,
                    transition: theme.transitions.create([
                      "transform",
                      "box-shadow",
                    ]),
                    boxShadow: `0 4px 12px ${alpha(brandColors.teal, 0.2)}`,
                  }}
                >
                  <Image
                    src="/images/minilogo.png"
                    alt="Order Status Tracking System Logo"
                    width={35}
                    height={35}
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
                    fontSize: "1.1rem",
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
                    color: alpha(brandColors.teal, 0.8),
                    fontSize: "0.7rem",
                    display: "block",
                    textAlign: "center",
                    fontWeight: 500,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.5px",
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
                borderRadius: 1,
                p: 0.5,
                transition: theme.transitions.create(["background-color"]),
                "&:hover": {
                  backgroundColor: alpha(brandColors.teal, 0.08),
                  "& .logo-avatar": {
                    transform: "scale(1.1) rotate(5deg)",
                    boxShadow: `0 6px 16px ${alpha(brandColors.teal, 0.3)}`,
                  },
                },
              }}
            >
              <Avatar
                className="logo-avatar"
                sx={{
                  width: 42,
                  height: 42,
                  background: `linear-gradient(135deg, 
                    ${alpha(brandColors.teal, 0.1)} 0%, 
                    ${alpha(brandColors.navy, 0.05)} 100%)`,
                  border: `2px solid ${alpha(brandColors.teal, 0.2)}`,
                  color: brandColors.cream,
                  transition: theme.transitions.create(
                    ["transform", "box-shadow"],
                    {
                      duration: 300,
                    }
                  ),
                  boxShadow: `0 4px 12px ${alpha(brandColors.teal, 0.2)}`,
                }}
              >
                <Image
                  src="/images/minilogo.png"
                  alt="Order Status Tracking System Logo"
                  width={28}
                  height={28}
                  priority
                />
              </Avatar>
            </Box>
          </Link>
        </Tooltip>
      )}
    </Paper>
  );
}
