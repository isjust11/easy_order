'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AppConstants } from '@/constants';
export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const token = searchParams.get('token');
      if (token) {
        localStorage.setItem(AppConstants.AccessToken, token);
        const data: any = searchParams.get('user');
        if (data) {
          const dataParsed = JSON.parse(data);
          const user = dataParsed.user;
          localStorage.setItem(AppConstants.User, JSON.stringify(user));
        }
        // Lưu token vào localStorage
        toast.success('Đăng nhập thành công');
        router.push('/');
      } else {
        toast.error('Không tìm thấy token đăng nhập');
        router.push('/login');
      }
    };
    fetchData();
  }, [searchParams, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang xử lý đăng nhập...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
   
  );
} 