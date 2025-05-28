'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigatorService } from '@/services/navigator-api';
import { Navigator } from '@/types/navigator';
import { Role } from '@/types/role';
const formSchema = z.object({
  name: z.string().min(1, 'Tên vai trò không được để trống'),
  code: z.string().min(1, 'Mã vai trò không được để trống'),
  description: z.string().optional(),
  navigatorIds: z.array(z.string()).optional(),
});

type RoleFormProps = {
  role?: Role | null;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel:() => void;
};

export function RoleForm({ role, onSubmit ,onCancel }: RoleFormProps) {
  const [navigators, setNavigators] = useState<Navigator[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role?.name || '',
      code: role?.code || '',
      description: role?.description || '',
      navigatorIds: role?.navigators!.map(p => p.id) || [],
    },
  });

  useEffect(() => {
    const fetchNavigators = async () => {
      try {
        const data = await navigatorService.getNavigators();
        setNavigators(data);
      } catch (error: any) {
        toast.error('Lỗi khi tải danh sách chức năng: ' + error.message);
      }
    };

    fetchNavigators();
  }, []);

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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="navigatorIds"
          render={() => (
            <FormItem>
              <FormLabel>Chức năng</FormLabel>
              <ScrollArea className="h-[200px] border rounded-md p-4">
                <div className="space-y-4">
                  {navigators.map((navigator) => (
                    <FormField
                      key={navigator.id}
                      control={form.control}
                      name="navigatorIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={navigator.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(navigator.id)}
                                onCheckedChange={(checked: any) => {
                                  return checked
                                    ? field.onChange([...field.value!, navigator.id])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== navigator.id
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                {navigator.label}
                              </FormLabel>
                              {navigator.link && (
                                <p className="text-sm text-muted-foreground">
                                  {navigator.link}
                                </p>
                              )}
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type='submit'>
            {role ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
}