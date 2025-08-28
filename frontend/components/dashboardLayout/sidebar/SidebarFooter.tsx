// components/layout/sidebar/SidebarFooter.tsx
"use client";
import React from "react";
import { Box, Typography, alpha } from "@mui/material";
import { brandColors } from "./constants";

interface SidebarFooterProps {
  collapsed: boolean;
  isMobile: boolean;
}

export default function SidebarFooter({
  collapsed,
  isMobile,
}: SidebarFooterProps) {
  if (collapsed && !isMobile) return null;

  return (
    <Box
      sx={{
        p: 2,
        borderTop: `1px solid ${alpha(brandColors.teal, 0.15)}`,
        backgroundColor: alpha(brandColors.navy, 0.03),
      }}
    >
      <Typography
        variant="caption"
        color={brandColors.teal}
        align="center"
        sx={{
          fontSize: "0.75rem",
          display: "block",
          fontWeight: 500,
        }}
      >
        © 2025 Dashboard v1.0
      </Typography>
    </Box>
  );
}
