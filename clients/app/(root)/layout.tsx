'use client'
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner"
import LeftSidebar from "@/components/LeftSidebar";
import MobileNav from "@/components/MobileNav";
import RightSidebar from "@/components/RightSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <AuthProvider>
      <main className="relative flex bg-black-3">
      <Sidebar />
        <section className="min-h-screen flex-1 flex-col flex px-4 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4 mt-6">
            <div className="flex flex-col md:pb-14">
              {children}
            </div>
          </div>
        </section>
        <RightSidebar />
      </main>
      </AuthProvider>
    </div>
  );
}
