import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MainContent } from "@/components/layout/MainContent";
import { HydrationGuard } from "@/components/providers/HydrationGuard";
import { NavigationGuard } from "@/components/providers/NavigationGuard";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{window.open=function(){return null;};for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i);if(k&&k.indexOf("wave-")===0)localStorage.removeItem(k);}if("serviceWorker"in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister();});});}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-wave-bg text-white antialiased`}
        style={{ backgroundColor: "#0a0a0a", color: "#ffffff", margin: 0 }}
        suppressHydrationWarning
      >
        <HydrationGuard />
        <NavigationGuard />
        <Navbar />
        <MainContent>{children}</MainContent>
        <Footer />
      </body>
    </html>
  );
}
