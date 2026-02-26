import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import NoiseOverlay from "@/components/NoiseOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GSD Club — AI-Powered Development Agency",
  description:
    "We build websites, web apps, mobile apps, internal tools, and automations — powered by AI. Faster. Sharper. Affordable.",
  keywords: [
    "AI development agency",
    "web development",
    "mobile app development",
    "AI automation",
    "software agency",
  ],
  openGraph: {
    title: "GSD Club — AI-Powered Development Agency",
    description:
      "We build your product with AI. Faster. Sharper. Affordable.",
    type: "website",
    url: "https://gsdclub.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "GSD Club — AI-Powered Development Agency",
    description:
      "We build your product with AI. Faster. Sharper. Affordable.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/models/model.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <SmoothScroll>
          <CustomCursor />
          <NoiseOverlay />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
