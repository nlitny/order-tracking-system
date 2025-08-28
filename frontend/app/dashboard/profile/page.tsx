// app/profile/page.tsx
"use client";

import React from "react";
import { Container, Typography, Stack, Box } from "@mui/material";
import { useProfile } from "@/hooks/useProfile";
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { useUserData } from "@/context/UserContext";

export default function ProfilePage() {
  const { user, loading } = useUserData(); // از context استفاده کن
  const {
    updating,
    changingPassword,
    uploadingImage,
    updateProfile,
    changePassword,
    uploadProfileImage,
  } = useProfile();

  if (loading || !user) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ProfileSkeleton />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Profile Settings
      </Typography>

      {/* Profile Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems={{ xs: "center", sm: "flex-start" }}
        mb={4}
      >
        <ProfileImageUpload
          src={user.profileImage}
          alt={`${user.firstName} ${user.lastName}`}
          uploading={uploadingImage}
          onImageSelect={uploadProfileImage}
        />

        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Typography variant="h5" fontWeight={600}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={1}>
            {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Member since{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </Typography>
        </Box>
      </Stack>

      {/* Profile Form - حذف user prop */}
      <Box mb={3}>
        <ProfileForm updating={updating} onUpdate={updateProfile} />
      </Box>

      {/* Password Change Form */}
      <PasswordChangeForm
        changing={changingPassword}
        onPasswordChange={changePassword}
      />
    </Container>
  );
}
