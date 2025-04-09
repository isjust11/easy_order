import { ReactNode } from 'react';

interface TablesLayoutProps {
  children: ReactNode;
}

export default function TablesLayout({ children }: TablesLayoutProps) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
} 