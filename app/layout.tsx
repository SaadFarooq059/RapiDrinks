import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SplashScreen from "@/components/splash-screen";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rapid Drinks | Premium Wholesale Beverage Supplier in Belgium",
  description:
    "Belgium's trusted wholesale drinks supplier. Premium wines, spirits, beers, and non-alcoholic beverages for restaurants, bars, hotels, and retailers.",
  keywords: [
    "wholesale drinks",
    "beverage supplier",
    "Belgium",
    "wine distributor",
    "beer wholesale",
    "spirits supplier",
  ],
  icons: {
    icon: "/logo.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f3d3e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <SplashScreen />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
