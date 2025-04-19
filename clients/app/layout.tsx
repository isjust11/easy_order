
import { Inter } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500','600', '700'],
  variable: '--font-inter',
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}
