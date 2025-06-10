'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { navigatorService } from '@/services/navigator-api';
import { Feature } from '@/types/feature';
import { Role } from '@/types/role';
import Switch from '@/components/form/switch/Switch';
const formSchema = z.object({
  name: z.string().min(1, 'Tên vai trò không được để trống'),
  code: z.string().min(1, 'Mã vai trò không được để trống'),
  isActive: z.boolean(),
  description: z.string().optional(),
  navigatorIds: z.array(z.string()).optional(),
});

type RoleFormProps = {
  role?: Role | null;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  onFormChange?: (values: z.infer<typeof formSchema>) => void;
};

export function RoleFormInput({ role, onSubmit, onCancel, onFormChange }: RoleFormProps) {
  const [navigators, setNavigators] = useState<Feature[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role?.name || '',
      code: role?.code || '',
      isActive: role?.isActive || true,
      description: role?.description || '',
      navigatorIds: role?.feature!.map(p => p.id) || [],
    },
  });

  useEffect(() => {
    const fetchNavigators = async () => {
      try {
        const data = await navigatorService.getNavigators();
        setNavigators(data.data);
      } catch (error: any) {
        toast.error('Lỗi khi tải danh sách chức năng: ' + error.message);
      }
    };

    fetchNavigators();
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      onFormChange?.(value as z.infer<typeof formSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onFormChange]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên vai trò</FormLabel>
              <FormControl>
                <Input className='input-focus' placeholder="Nhập tên vai trò" {...field} />
              </FormControl>
              <FormMessage className='text-red-500'/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã vai trò</FormLabel>
              <FormControl>
                <Input className='input-focus' disabled={role?.id != null} placeholder="Nhập mã vai trò" {...field} />
              </FormControl>
              <FormMessage className='text-red-500'/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <Switch
                label="Trạng thái"
                defaultChecked={field.value}
                {...field}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea className='input-focus'
                  placeholder="Nhập mô tả cho vai trò này"
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-red-500'/>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}