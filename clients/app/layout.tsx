import { Inter } from 'next/font/google';
import './globals.css';
import { toast } from 'sonner';

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
          <Toaster
            position="top-center"
            duration={4000}
            richColors
            theme="light"
            className="toast-wrapper"
            toastOptions={{
              className: 'toast',
              // style: {
              //   background: '#fff',
              //   color: '#333',
              //   border: '1px solid #e5e7eb',
              // },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}