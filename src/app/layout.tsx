import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MainContent } from "@/components/layout/MainContent";
import { HydrationGuard } from "@/components/providers/HydrationGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Cinejoy — Stream Movies & TV",
  description:
    "Stream thousands of movies and TV shows. Browse by provider — Netflix, Disney+, Prime Video, and more.",
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
            __html: `(function(){try{for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i);if(k&&k.indexOf("wave-")===0)localStorage.removeItem(k);}if("serviceWorker"in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister();});});}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.className} ${montserrat.variable} min-h-screen bg-wave-bg text-white antialiased`}
        style={{ backgroundColor: "#0a0a0a", color: "#ffffff", margin: 0 }}
        suppressHydrationWarning
      >
        <HydrationGuard />
        <Navbar />
        <MainContent>{children}</MainContent>
        <Footer />
      </body>
    </html>
  );
}
