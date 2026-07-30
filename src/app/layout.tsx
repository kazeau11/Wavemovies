import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MainContent } from "@/components/layout/MainContent";
import { HydrationGuard } from "@/components/providers/HydrationGuard";
import { StorageSanitizer } from "@/components/providers/StorageSanitizer";
import { ProfileGate } from "@/components/profiles/ProfileGate";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Wave — Stream Movies",
  description:
    "Wave is your modern streaming destination. Discover, watch, and save movies with a polished cinematic experience.",
  icons: {
    icon: "/wave-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-wave-bg text-white antialiased`}
        style={{ backgroundColor: "#0a0a0a", color: "#ffffff", margin: 0 }}
        suppressHydrationWarning
      >
        <StorageSanitizer />
        <HydrationGuard />
        <ProfileGate />
        <Navbar />
        <MainContent>{children}</MainContent>
        <Footer />
      </body>
    </html>
  );
}
