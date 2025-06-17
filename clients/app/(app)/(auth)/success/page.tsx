'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AppConstants } from '@/constants';
import { Suspense } from 'react';
import { getFeaturesByRole, getTokenInfo } from '@/services/auth-api';

function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window == undefined) {
      return;
    }
    const fetchData = async () => {
      const tempToken = searchParams.get('token');
      if (tempToken) {
        try {
          // Lấy thông tin user và access token từ server
          const userInfo = await getTokenInfo(tempToken);

          // Lưu thông tin vào localStorage
          localStorage.setItem(AppConstants.AccessToken, userInfo.accessToken);
          localStorage.setItem(AppConstants.RefreshToken, userInfo.refreshToken);
          localStorage.setItem(AppConstants.User, JSON.stringify(userInfo.user));
          const roleId = userInfo.user.roles[0].id;
          const feature = await getFeaturesByRole(roleId);
          localStorage.setItem(AppConstants.Feature, JSON.stringify(feature));
          toast.success('Đăng nhập thành công');
          router.push('/');
        } catch (error) {
          console.error('Error fetching token info:', error);
          toast.error('Có lỗi xảy ra khi xử lý đăng nhập');
          router.push('/login');
        }
      } else {
        toast.error('Không tìm thấy token đăng nhập');
        router.push('/login');
      }
    };
    fetchData();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Đang xử lý đăng nhập...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <AuthSuccessPage />
    </Suspense>
  );
}