import React from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { Shield } from "@mui/icons-material";
import { PasswordStrength as PasswordStrengthType } from "../utils/types";

interface PasswordStrengthProps {
  strength: PasswordStrengthType;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ strength }) => {
  const theme = useTheme();

  if (!strength.label) return null;

  return (
    <Box
      sx={{
        p: 2.5,
        backgroundColor: alpha(theme.palette.grey[50], 0.8),
        border: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`,
        borderRadius: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
        <Shield sx={{ fontSize: 18, color: strength.color }} />
        <Typography variant="body2" fontWeight={600} color="text.primary">
          Password Strength:
        </Typography>
        <Chip
          label={strength.label}
          size="small"
          sx={{
            backgroundColor: strength.color,
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      </Stack>
      <LinearProgress
        variant="determinate"
        value={strength.score}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.grey[300], 0.5),
          "& .MuiLinearProgress-bar": {
            backgroundColor: strength.color,
            borderRadius: 3,
          },
        }}
      />
      {strength.suggestions.length > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Suggestions: {strength.suggestions.slice(0, 2).join(", ")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PasswordStrength;
