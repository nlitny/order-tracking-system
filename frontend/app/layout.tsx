import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "../theme/theme";
import "./globals.css";
import { ToastProvider } from "@/lib/toast/toast";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Order Status Tracking System | Professional Order Management",
    template: "%s | Order Tracking System",
  },
  description:
    "Advanced order status tracking system with real-time updates, media management, and comprehensive notification system. Built with Next.js, TypeScript, and modern technologies for seamless customer experience.",

  keywords: [
    "order tracking system",
    "status management",
    "customer portal",
    "order management",
    "real-time tracking",
    "media management",
    "notification system",
    "customer dashboard",
    "research orders",
    "order status",
    "progress tracking",
    "digital delivery",
    "order history",
    "customer service",
    "order fulfillment",
  ],

  authors: [{ name: "hadafdevs Team", url: "https://hadafdevs.com" }],

  creator: "hadafdevs Development Team",
  publisher: "hadafdevs",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://ordertracking.com"
  ),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Order Status Tracking System",
    title: "Order Status Tracking System | Professional Order Management",
    description:
      "Advanced order status tracking system with real-time updates, media management, and comprehensive notification system. Track your orders from queue to completion.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Order Status Tracking System - Professional Order Management Dashboard",
      },
      {
        url: "/og-image-square.jpg",
        width: 1200,
        height: 1200,
        alt: "Order Status Tracking System Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@hadafdevs",
    creator: "@hadafdevs",
    title: "Order Status Tracking System | Professional Order Management",
    description:
      "Advanced order status tracking system with real-time updates, media management, and notification system. Built with modern technologies.",
    images: ["/twitter-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },

  category: "Technology",

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "theme-color": "#27445D",
    "color-scheme": "light",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#27445D" },
    { media: "(prefers-color-scheme: dark)", color: "#EFE9D5" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* Favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />

        {/* Web App Manifest */}
        {/* <link rel="manifest" href="/site.webmanifest" /> */}

        {/* Additional meta tags for better SEO */}
        <meta name="application-name" content="Order Tracking System" />
        <meta name="apple-mobile-web-app-title" content="Order Tracker" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#27445D" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Performance and optimization */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />

        {/* Content Security Policy (adjust as needed) */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; media-src 'self' https: blob:; connect-src 'self' https: wss:;"
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastProvider
              defaultOptions={{
                duration: 5000,
                position: "top-right",
                variant: "glass",
                showProgressBar: true,
              }}
            >
              {children}
            </ToastProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
