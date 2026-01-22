import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PhantomProvider } from "@/components/phantom";
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
  title: "Phantom Connect Kit",
  description: "Build Solana apps with Phantom Connect in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <PhantomProvider>{children}</PhantomProvider>
      </body>
    </html>
  );
}
