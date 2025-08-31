// components/orders/OrderCardSkeleton.tsx
import React from "react";
import {
  Card,
  CardContent,
  Skeleton,
  Box,
  alpha,
  useTheme,
} from "@mui/material";

const OrderCardSkeleton: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: "1px solid",
        borderColor: alpha(theme.palette.grey[300], 0.5),
        position: "relative",
        overflow: "hidden",
        background: "white",
      }}
    >
      {/* Top gradient bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: alpha(theme.palette.grey[300], 0.3),
        }}
      />

      <CardContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box sx={{ p: 3, pb: 0 }}>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}>
            <Box sx={{ flex: 1, pr: 2 }}>
              <Skeleton 
                variant="text" 
                width="85%" 
                height={28} 
                sx={{ mb: 1, borderRadius: 1 }} 
              />
              <Skeleton 
                variant="text" 
                width="40%" 
                height={20} 
                sx={{ borderRadius: 1 }} 
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Skeleton 
                variant="rectangular" 
                width={90} 
                height={32} 
                sx={{ borderRadius: 1 }} 
              />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>

          {/* Progress Section */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              mb: 1.5 
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width={80} height={20} />
              </Box>
              <Skeleton variant="text" width={30} height={20} />
            </Box>
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={6} 
              sx={{ borderRadius: 1 }} 
            />
          </Box>
        </Box>

        {/* Customer Section */}
        <Box sx={{ 
          px: 3, 
          py: 2,
          backgroundColor: alpha(theme.palette.grey[50], 0.5),
          borderTop: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 0.5 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton variant="text" width="30%" height={16} />
              </Box>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Skeleton variant="text" width={50} height={16} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={60} height={14} />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCardSkeleton;
