"use client";
import { createTheme } from "@mui/material/styles";

const palette = {
  primary: {
    main: "#27445D", // Dark Navy Blue
    light: "#497D74", // Medium Blue-Green
    dark: "#1a2f42", // Darker Navy
    contrastText: "#EFE9D5", // Cream
  },
  secondary: {
    main: "#71BBB2", // Light Teal
    light: "#8ac7be", // Lighter Teal
    dark: "#5a9690", // Darker Teal
    contrastText: "#27445D", // Dark Navy
  },
  tertiary: {
    main: "#497D74", // Medium Blue-Green
    light: "#5e968b", // Lighter Blue-Green
    dark: "#3a645d", // Darker Blue-Green
    contrastText: "#EFE9D5", // Cream
  },
  success: {
    main: "#71BBB2", // Using your teal for success
    light: "#8ac7be",
    dark: "#5a9690",
    contrastText: "#27445D",
  },
  warning: {
    main: "#D4A574", // Complementary warm tone
    light: "#e0b689",
    dark: "#c19960",
    contrastText: "#27445D",
  },
  error: {
    main: "#B85450", // Muted red that fits the palette
    light: "#c76f6b",
    dark: "#a34541",
    contrastText: "#EFE9D5",
  },
  info: {
    main: "#497D74", // Using your medium tone for info
    light: "#5e968b",
    dark: "#3a645d",
    contrastText: "#EFE9D5",
  },
  background: {
    default: "#EFE9D5", // Cream background
    paper: "#FEFCF7", // Slightly warmer white
  },
  text: {
    primary: "#27445D", // Dark Navy for primary text
    secondary: "#497D74", // Medium tone for secondary text
    disabled: "#8B9B96", // Muted tone for disabled text
  },
  divider: "#D0C5A9", // Muted cream for dividers
  grey: {
    50: "#FEFCF7",
    100: "#F7F3E8",
    200: "#EFE9D5",
    300: "#D0C5A9",
    400: "#A89B7E",
    500: "#71BBB2",
    600: "#497D74",
    700: "#3A645D",
    800: "#27445D",
    900: "#1A2F42",
  },
};

// Custom color definitions for TypeScript
declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}

export const theme = createTheme({
  palette,
  typography: {
    fontFamily:
      '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3rem",
      fontWeight: 800,
      lineHeight: 1.1,
      color: palette.text.primary,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      color: palette.text.primary,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.3,
      color: palette.text.primary,
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: palette.text.primary,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.5,
      color: palette.text.primary,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.6,
      color: palette.text.primary,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: palette.text.primary,
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: palette.text.secondary,
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: "1.125rem",
      lineHeight: 1.6,
      color: palette.text.primary,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "1rem",
      lineHeight: 1.5,
      color: palette.text.secondary,
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      color: palette.text.secondary,
      fontWeight: 400,
    },
    overline: {
      fontSize: "0.75rem",
      lineHeight: 2,
      color: palette.text.secondary,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 24px",
          boxShadow: "none",
          fontSize: "1rem",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(39, 68, 93, 0.15)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.tertiary.main} 100%)`,
          color: palette.primary.contrastText,
          "&:hover": {
            background: `linear-gradient(135deg, ${palette.primary.dark} 0%, ${palette.tertiary.dark} 100%)`,
            boxShadow: "0 8px 25px rgba(39, 68, 93, 0.25)",
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${palette.secondary.main} 0%, ${palette.secondary.light} 100%)`,
          color: palette.secondary.contrastText,
          "&:hover": {
            background: `linear-gradient(135deg, ${palette.secondary.dark} 0%, ${palette.secondary.main} 100%)`,
          },
        },
        outlinedPrimary: {
          borderColor: palette.primary.main,
          color: palette.primary.main,
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: `${palette.primary.main}08`,
            borderColor: palette.primary.dark,
          },
        },
        textPrimary: {
          color: palette.primary.main,
          "&:hover": {
            backgroundColor: `${palette.primary.main}08`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 2px 12px rgba(39, 68, 93, 0.08)",
          border: `1px solid ${palette.grey[200]}`,
          backgroundColor: palette.background.paper,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 40px rgba(39, 68, 93, 0.12)",
            borderColor: palette.secondary.main,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: palette.background.paper,
            transition: "all 0.3s ease",
            "&:hover fieldset": {
              borderColor: palette.secondary.main,
              borderWidth: 2,
            },
            "&.Mui-focused fieldset": {
              borderColor: palette.primary.main,
              borderWidth: 2,
              boxShadow: `0 0 0 3px ${palette.primary.main}20`,
            },
          },
          "& .MuiInputLabel-root": {
            color: palette.text.secondary,
            "&.Mui-focused": {
              color: palette.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 500,
          fontSize: "0.875rem",
          height: 32,
        },
        colorPrimary: {
          background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.tertiary.main} 100%)`,
          color: palette.primary.contrastText,
        },
        colorSecondary: {
          background: `linear-gradient(135deg, ${palette.secondary.main} 0%, ${palette.secondary.light} 100%)`,
          color: palette.secondary.contrastText,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${palette.grey[200]}`,
          backgroundColor: palette.background.paper,
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(39, 68, 93, 0.08)",
        },
        elevation2: {
          boxShadow: "0 4px 16px rgba(39, 68, 93, 0.10)",
        },
        elevation3: {
          boxShadow: "0 8px 24px rgba(39, 68, 93, 0.12)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${palette.primary.main}F5 0%, ${palette.tertiary.main}F5 100%)`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${palette.grey[200]}`,
          boxShadow: "0 1px 20px rgba(39, 68, 93, 0.08)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${palette.grey[200]}`,
          background: `${palette.background.paper}F8`,
          backdropFilter: "blur(20px)",
          borderRadius: 0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: "4px 12px",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: `${palette.secondary.main}15`,
            transform: "translateX(4px)",
          },
          "&.Mui-selected": {
            // backgroundColor: `${palette.primary.main}15`,
            // borderLeft: `4px solid ${palette.primary.main}`,
            "&:hover": {
              backgroundColor: `${palette.primary.main}20`,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
          minHeight: 48,
          color: palette.text.secondary,
          "&.Mui-selected": {
            color: palette.primary.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.secondary.main} 100%)`,
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(39, 68, 93, 0.15)",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiSnackbarContent-root": {
            borderRadius: 12,
            fontWeight: 500,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: palette.grey[200],
        },
        bar: {
          background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.secondary.main} 100%)`,
          borderRadius: 8,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: palette.primary.main,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: palette.secondary.main,
            "& + .MuiSwitch-track": {
              backgroundColor: palette.secondary.main,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: palette.text.secondary,
          "&.Mui-checked": {
            color: palette.primary.main,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: palette.text.secondary,
          "&.Mui-checked": {
            color: palette.primary.main,
          },
        },
      },
    },
  },
});

// Export individual colors for use in components
export const brandColors = {
  navy: "#27445D",
  teal: "#497D74",
  lightTeal: "#71BBB2",
  cream: "#EFE9D5",
} as const;
