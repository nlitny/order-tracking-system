// components/layout/sidebar/utils.ts
import { alpha } from "@mui/material";
import { brandColors } from "./constants";

export const getSidebarColors = () => ({
  background: `linear-gradient(180deg, 
    ${brandColors.cream} 0%, 
    ${alpha(brandColors.lightTeal, 0.1)} 30%,
    ${alpha(brandColors.teal, 0.05)} 70%,
    ${brandColors.cream} 100%)`,
  borderRight: `1px solid ${alpha(brandColors.teal, 0.2)}`,
  backdropFilter: "blur(20px)",
  boxShadow: `4px 0 12px ${alpha(brandColors.navy, 0.08)}`,
  borderRadius: 0,
});
