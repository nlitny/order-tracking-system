// components/profile/ProfileSkeleton.tsx
import React from "react";
import { Box, Card, CardContent, Skeleton, Stack, Grid } from "@mui/material";

export const ProfileSkeleton: React.FC = () => {
  return (
    <Box>
      {/* Header with Avatar */}
      <Stack direction="row" spacing={3} alignItems="center" mb={4}>
        <Skeleton variant="circular" width={120} height={120} />
        <Box>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={150} height={24} />
          <Skeleton
            variant="rectangular"
            width={80}
            height={24}
            sx={{ borderRadius: 1, mt: 1 }}
          />
        </Box>
      </Stack>

      {/* Profile Form Card */}
      <Card sx={{ borderRadius: 1, mb: 3 }}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton
              variant="rectangular"
              width={80}
              height={36}
              sx={{ borderRadius: 1 }}
            />
          </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Skeleton
                variant="rectangular"
                height={56}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Skeleton
                variant="rectangular"
                height={56}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Skeleton
                variant="rectangular"
                height={56}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Skeleton
                variant="rectangular"
                height={56}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Password Form Card */}
      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Skeleton variant="text" width={150} height={24} sx={{ mb: 3 }} />
          <Stack spacing={3}>
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              height={100}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              height={40}
              sx={{ borderRadius: 1 }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
