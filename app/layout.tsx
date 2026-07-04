import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "7-Week Tracker",
  description: "Personal habit tracker",
  manifest: "/manifest.json", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tracker",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <head>
  <script dangerouslySetInnerHTML={{
    __html: `
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    `
  }} />
</head>
      <body 
        // Added dark:bg-black and dark:text-white to fix global contrast
        className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100 antialiased overflow-x-hidden`}
      >
        {/* Adjusted padding to clear the newly padded bottom nav */}
        <main className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))]">
          {children}
        </main>
        
        <BottomNav />
      </body>
    </html>
    
  );
}