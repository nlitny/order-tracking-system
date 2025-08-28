// // tailwind.config.js
// import { fontFamily } from "tailwindcss/defaultTheme";

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   corePlugins: {
//     preflight: false,
//   },
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ["var(--font-inter)", ...fontFamily.sans],
//       },
//       colors: {
//         // Custom Brand Colors from your palette
//         brand: {
//           navy: {
//             50: "#f1f3f7",
//             100: "#e0e4ec",
//             200: "#c5cede",
//             300: "#9dabc5",
//             400: "#6f84a7",
//             500: "#52658c",
//             600: "#425275",
//             700: "#374460",
//             800: "#2f3951",
//             900: "#131842", // Main navy
//             950: "#0b0e20",
//           },
//           coral: {
//             50: "#fef4f2",
//             100: "#fee7e2",
//             200: "#fdd4ca",
//             300: "#fbb7a6",
//             400: "#f68e73",
//             500: "#E68369", // Main coral
//             600: "#d85a3d",
//             700: "#b94a2f",
//             800: "#993f29",
//             900: "#7d3927",
//             950: "#431a11",
//           },
//           beige: {
//             50: "#fdfcf9",
//             100: "#FBF6E2", // Main light beige
//             200: "#f7efc5",
//             300: "#f1e394",
//             400: "#e9d45a",
//             500: "#e0c132",
//             600: "#d0a424",
//             700: "#ad851f",
//             800: "#8c6820",
//             900: "#74551f",
//             950: "#ECCEAE", // Main dark beige
//           },
//         },
//         // Status colors using the palette
//         status: {
//           queue: "#E68369", // Coral for waiting
//           progress: "#131842", // Navy for active
//           completed: "#4ade80", // Fresh green for success
//         },
//         // Semantic colors
//         success: {
//           50: "#f0fdf4",
//           100: "#dcfce7",
//           200: "#bbf7d0",
//           300: "#86efac",
//           400: "#4ade80",
//           500: "#22c55e",
//           600: "#16a34a",
//           700: "#15803d",
//           800: "#166534",
//           900: "#14532d",
//         },
//         warning: {
//           50: "#fef4f2",
//           100: "#fee7e2",
//           200: "#fdd4ca",
//           300: "#fbb7a6",
//           400: "#f68e73",
//           500: "#E68369",
//           600: "#d85a3d",
//           700: "#b94a2f",
//           800: "#993f29",
//           900: "#7d3927",
//         },
//         error: {
//           50: "#fef2f2",
//           100: "#fee2e2",
//           200: "#fecaca",
//           300: "#fca5a5",
//           400: "#f87171",
//           500: "#ef4444",
//           600: "#dc2626",
//           700: "#b91c1c",
//           800: "#991b1b",
//           900: "#7f1d1d",
//         },
//       },
//       animation: {
//         "fade-in": "fadeIn 0.8s ease-out",
//         "slide-up": "slideUp 0.7s ease-out",
//         "slide-in-right": "slideInRight 0.6s ease-out",
//         "float": "float 6s ease-in-out infinite",
//         "pulse-gentle": "pulseGentle 4s ease-in-out infinite",
//         "scale-in": "scaleIn 0.5s ease-out",
//       },
//       keyframes: {
//         fadeIn: {
//           "0%": { opacity: "0", transform: "translateY(20px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         slideUp: {
//           "0%": { transform: "translateY(30px)", opacity: "0" },
//           "100%": { transform: "translateY(0)", opacity: "1" },
//         },
//         slideInRight: {
//           "0%": { transform: "translateX(30px)", opacity: "0" },
//           "100%": { transform: "translateX(0)", opacity: "1" },
//         },
//         float: {
//           "0%, 100%": { transform: "translateY(0px)" },
//           "50%": { transform: "translateY(-10px)" },
//         },
//         pulseGentle: {
//           "0%, 100%": { opacity: "1" },
//           "50%": { opacity: "0.8" },
//         },
//         scaleIn: {
//           "0%": { transform: "scale(0.95)", opacity: "0" },
//           "100%": { transform: "scale(1)", opacity: "1" },
//         },
//       },
//       boxShadow: {
//         'soft': "0 2px 8px rgba(19, 24, 66, 0.08)",
//         'medium': "0 4px 16px rgba(19, 24, 66, 0.12)",
//         'large': "0 8px 24px rgba(19, 24, 66, 0.15)",
//         'xl': "0 12px 32px rgba(19, 24, 66, 0.18)",
//         'warm': "0 4px 16px rgba(230, 131, 105, 0.15)",
//         'warm-lg': "0 8px 24px rgba(230, 131, 105, 0.20)",
//         'inner-soft': "inset 0 2px 4px rgba(19, 24, 66, 0.06)",
//       },
//       backdropBlur: {
//         xs: "2px",
//       },
//       backgroundImage: {
//         'gradient-warm': 'linear-gradient(135deg, #FBF6E2 0%, #ECCEAE 100%)',
//         'gradient-coral': 'linear-gradient(135deg, #E68369 0%, #d85a3d 100%)',
//         'gradient-navy': 'linear-gradient(135deg, #131842 0%, #2f3951 100%)',
//         'gradient-hero': 'linear-gradient(135deg, #131842 0%, #374460 50%, #E68369 100%)',
//       },
//     },
//   },
//   plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
// };
