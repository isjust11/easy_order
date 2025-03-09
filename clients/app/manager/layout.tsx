import { ReactNode } from 'react';

interface ManagerLayoutProps {
  children: ReactNode;
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản lý hệ thống</h1>
      </div>
      {children}
    </div>
  );
} 