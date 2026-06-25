import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { LIVE_DEMO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "GoalOS AI — Turn screen time into goal time",
  description:
    "AI-powered productivity operating system that helps you align mobile usage with your goals.",
  metadataBase: new URL(LIVE_DEMO_URL),
  openGraph: {
    title: "GoalOS AI — Turn screen time into goal time",
    description:
      "AI-powered productivity OS — align screen time with your goals. Open source, local-first.",
    url: LIVE_DEMO_URL,
    siteName: "GoalOS AI",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GoalOS AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#06070d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
