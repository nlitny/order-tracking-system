"use client";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { Home, Search, ArrowBack } from "@mui/icons-material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EFE9D5 0%, #FEFCF7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Illustration/Icon */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: { xs: 200, md: 300 },
                  height: { xs: 200, md: 300 },
                  background:
                    "linear-gradient(135deg, #27445D 0%, #497D74 100%)",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 8px 32px rgba(39, 68, 93, 0.2)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -10,
                    left: -10,
                    right: -10,
                    bottom: -10,
                    background:
                      "linear-gradient(135deg, #71BBB2 0%, #497D74 100%)",
                    borderRadius: 1,
                    zIndex: -1,
                    opacity: 0.3,
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "4rem", md: "6rem" },
                    fontWeight: 800,
                    color: "#EFE9D5",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  404
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                maxWidth: 500,
                mx: { xs: "auto", md: 0 },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 700,
                  color: "#27445D",
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Page Not Found
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#497D74",
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Oops! Something went wrong
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#27445D",
                  mb: 4,
                  opacity: 0.8,
                  lineHeight: 1.6,
                }}
              >
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Button
                  component={Link}
                  href="/"
                  variant="contained"
                  startIcon={<Home />}
                  sx={{
                    minWidth: 160,
                    height: 48,
                    borderRadius: 1,
                    background:
                      "linear-gradient(135deg, #27445D 0%, #497D74 100%)",
                    color: "#EFE9D5",
                    fontWeight: 600,
                    fontSize: "1rem",
                    boxShadow: "0 4px 16px rgba(39, 68, 93, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(39, 68, 93, 0.4)",
                      background:
                        "linear-gradient(135deg, #1a2f42 0%, #3a645d 100%)",
                    },
                  }}
                >
                  Go Home
                </Button>

                <Button
                  onClick={() => window.history.back()}
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  sx={{
                    minWidth: 160,
                    height: 48,
                    borderRadius: 1,
                    borderColor: "#27445D",
                    color: "#27445D",
                    borderWidth: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      borderWidth: 2,
                      backgroundColor: "rgba(39, 68, 93, 0.08)",
                      borderColor: "#1a2f42",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Go Back
                </Button>
              </Box>

              {/* Search Suggestion */}
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  background: "#FEFCF7",
                  borderRadius: 1,
                  border: "1px solid #D0C5A9",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Search sx={{ color: "#71BBB2", fontSize: 24 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#27445D", fontWeight: 600, mb: 0.5 }}
                  >
                    Suggestion
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#497D74", fontSize: "0.875rem" }}
                  >
                    Try using the main menu or search to find what you're
                    looking for
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
