'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { forgotPassword, login } from '@/services/auth-api';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { decrypt, encrypt } from '@/lib/utils';
import { AppConstants } from '@/constants';

// Schéma de validation
const formSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  remember: z.boolean().optional(),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      remember: false,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      const remember = localStorage.getItem(AppConstants.Remember);
      if (remember) {
        form.setValue('remember', remember === 'true');
        form.setValue('username', localStorage.getItem(AppConstants.Username) || '');
        const password = localStorage.getItem(AppConstants.Password);
        // form.setValue('password', decrypt(password || ''));
      }
    }
    loadData();
  }, [form]);

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);
      const response = await forgotPassword(form.getValues('username'));
      toast.success(response.message);
    } catch (_error) {
      toast.error('Lỗi khi gửi email');
    } finally {
      setIsLoading(false);
    }
  }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      await login({
        username: values.username,
        password: values.password
      });
      if (values.remember) {
        localStorage.setItem(AppConstants.Remember, 'true');
        localStorage.setItem(AppConstants.Username, values.username);
        localStorage.setItem(AppConstants.Password, encrypt(values.password));
      } else {
        localStorage.removeItem(AppConstants.Remember);
        localStorage.removeItem(AppConstants.Username);
        localStorage.removeItem(AppConstants.Password);
      }
      toast.success('Đăng nhập thành công');
      router.push('/');
    } catch (_error) {
      console.error('Lỗi đăng nhập:', _error);
      toast.error('Tên đăng nhập hoặc mật khẩu không chính xác');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // await loginWithGoogle();
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleFacebookLogin = async () => {
    // await loginWithFacebook();
    window.location.href = `${apiUrl}/auth/facebook`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="text-gray-500 mt-2">
            Đăng nhập vào tài khoản Easy Order của bạn
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Đăng nhập với Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleFacebookLogin}
          >
            <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
            Đăng nhập với Facebook
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Hoặc</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên đăng nhập của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu của bạn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <Checkbox id="remember" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <Label htmlFor="remember">Nhớ tài khoản</Label>
              </div>
              <p className={`text-primary font-semibold hover:underline cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
                onClick={() => isLoading ? null : handleForgotPassword()}>
                {isLoading ? 'Đang gửi email...' : 'Quên mật khẩu?'}
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Bạn chưa có tài khoản?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 