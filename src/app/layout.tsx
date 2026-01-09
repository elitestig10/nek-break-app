import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEK_VAULT | Break Calculators for Soccer Cards",
  description: "Checklist-based odds calculators for box, case, and product breaks. Built for transparency, speed, and accuracy.",
  keywords: ["soccer cards", "break calculator", "trading cards", "odds calculator", "NEK VAULT", "Topps Dynasty"],
  authors: [{ name: "NEK_VAULT" }],
  openGraph: {
    title: "NEK_VAULT | Break Calculators for Soccer Cards",
    description: "Checklist-based odds calculators for box, case, and product breaks. Built for transparency, speed, and accuracy.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
