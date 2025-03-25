'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Token xác thực không hợp lệ');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`);
        
        if (response.ok) {
          setStatus('success');
          setMessage('Email đã được xác thực thành công');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Token xác thực không hợp lệ hoặc đã hết hạn');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Có lỗi xảy ra khi xác thực email');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Xác thực Email</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="text-center">
              <p>Đang xác thực email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <p className="text-green-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500 mb-4">
                Bạn sẽ được chuyển hướng đến trang đăng nhập sau 3 giây...
              </p>
              <Button asChild>
                <Link href="/login">Đăng nhập ngay</Link>
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <p className="text-red-600 mb-4">{message}</p>
              <Button asChild>
                <Link href="/login">Quay lại trang đăng nhập</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 