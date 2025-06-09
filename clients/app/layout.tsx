'use client'

import { Inter } from 'next/font/google';
import './globals.css';
import { toast } from 'sonner';
import { Provider } from 'react-redux';
import { store } from '@/store';

import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'sonner';
import Loading from '@/components/ui/loading';

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
        <Provider store={store}>
          <ThemeProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
            <Toaster
              position="top-center"
              duration={4000}
              richColors
              theme="light"
              className="toast-wrapper"
              toastOptions={{
                className: 'toast',
              }}
            />
            <Loading />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}