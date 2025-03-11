import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Easy Order - Restaurant Management",
  description: "Restaurant table and order management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-6 py-8">
                {children}
                <Toaster/>
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
