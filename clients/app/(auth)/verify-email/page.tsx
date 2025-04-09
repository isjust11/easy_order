'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { verifyEmail } from '@/services/auth-api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const handleVerifyEmail = async () => {
    try {
      await verifyEmail(token || '');
      toast.success('Xác thực email thành công');
      router.push('/login');
    } catch (error: any) {
      toast.error('Xác thực email thất bại: ' + error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Xác thực Email</h1>
      <p className="text-gray-600 mb-6">
        Vui lòng nhấn nút bên dưới để xác thực email của bạn
      </p>
      <Button onClick={handleVerifyEmail}>Xác thực Email</Button>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 