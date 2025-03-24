'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get('message') || 'Đăng nhập thất bại';
    toast.error(message);
    
    // Chuyển hướng về trang đăng nhập sau 2 giây
    const timeout = setTimeout(() => {
      router.push('/login');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [searchParams, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Đăng nhập thất bại</h1>
        <p className="text-gray-600 mb-4">Đang chuyển hướng về trang đăng nhập...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      </div>
    </div>
  );
} 