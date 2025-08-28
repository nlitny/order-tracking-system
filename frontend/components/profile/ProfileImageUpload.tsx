// components/profile/ProfileImageUpload.tsx
import React, { useRef } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Badge,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

interface ProfileImageUploadProps {
  src?: string;
  alt: string;
  uploading: boolean;
  onImageSelect: (file: File) => void;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  src,
  alt,
  uploading,
  onImageSelect,
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
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
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "white",
              width: 32,
              height: 32,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
              "&:disabled": {
                bgcolor: alpha(theme.palette.primary.main, 0.5),
              },
            }}
          >
            {uploading ? (
              <CircularProgress size={16} sx={{ color: "white" }} />
            ) : (
              <PhotoCamera sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        }
      >
        <Avatar
          src={src}
          alt={alt}
          sx={{
            width: 120,
            height: 120,
            fontSize: "2rem",
            fontWeight: 600,
            bgcolor: theme.palette.primary.main,
            border: `4px solid ${theme.palette.background.paper}`,
            boxShadow: theme.shadows[4],
          }}
        >
          {!src && getInitials(alt)}
        </Avatar>
      </Badge>
    </Box>
  );
};
