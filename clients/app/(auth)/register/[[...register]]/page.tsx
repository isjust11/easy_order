'use client';

import { useState } from 'react';
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
import { register, resendEmail } from '@/services/auth-api';
import { RegisterCode, RegisterResultDto } from '@/types/dto/RegisterResultDto';


const formSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
  .max(20, 'Tên đăng nhập phải có tối đa 20 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  fullName: z.string().optional(),
  email: z.string().email('Email không hợp lệ').max(50, 'Email phải có tối đa 50 ký tự'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isSendEmail, setIsSendEmail] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const response: RegisterResultDto = await register({
        username: values.username,
        password: values.password,
        fullName: values.fullName || undefined,
        email: values.email || undefined
      });
      if(response.code === RegisterCode.Ok){
        setIsSendEmail(true);
        toast.success(`Đã gửi email xác thực đến email ${values.email} vui lòng kiểm tra email`);
      }else if(response.code === RegisterCode.AccountValidated){
        toast.info(response.message);
        router.push('/login');
      }else if(response.code === RegisterCode.AccountIsExist){
        toast.error(response.message);
        form.setError('username', { message: response.message });
      }else if(response.code === RegisterCode.ExistEmail){
        toast.error(response.message);
        form.setError('email', { message: response.message });
      }else {
        toast.error(response.message);
      }

    } catch (error: any) {
      toast.error('Lỗi đăng ký: ' + error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await resendEmail(form.getValues('email') || '');
      setIsSendEmail(true);
      toast.success(`Đã gửi email xác thực đến email ${form.getValues('email')} vui lòng kiểm tra email`);
    } catch (error: any) {
      toast.error('Lỗi gửi email xác thực: ' + error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        {isSendEmail ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Đã gửi email xác thực</h1>
            <p className="text-gray-500 mt-2">
              Vui lòng kiểm tra email để xác thực tài khoản
            </p>
            <Button disabled={isLoading} onClick={handleResendEmail} className="mt-4 w-full bg-primary text-white">{isLoading ? 'Đang gửi email...' : 'Gửi lại email xác thực'}</Button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
              <p className="text-gray-500 mt-2">
                Đăng ký để sử dụng Easy Order
              </p>
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
                        <Input placeholder="Nhập tên đăng nhập" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên (tùy chọn)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ email" {...field} />
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
                          placeholder="Nhập mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Xác nhận mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
              </form>
            </Form>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 