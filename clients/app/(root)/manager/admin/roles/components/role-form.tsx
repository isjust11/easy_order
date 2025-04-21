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
import { Permission, Role } from '@/types/permission';
import { createRole, updateRole } from '@/services/auth-api';
import { getPermissions } from '@/services/auth-api';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(1, 'Tên vai trò không được để trống'),
  code: z.string().min(1, 'Mã vai trò không được để trống'),
  description: z.string().optional(),
  permissionIds: z.array(z.number()).min(1, 'Phải chọn ít nhất một quyền'),
});

type RoleFormProps = {
  role?: Role | null;
  onSuccess: () => void;
};

export function RoleForm({ role, onSuccess }: RoleFormProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role?.name || '',
      code: role?.code || '',
      description: role?.description || '',
      permissionIds: role?.permissions.map(p => p.id) || [],
    },
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getPermissions();
        setPermissions(data);
      } catch (error: any) {
        toast.error('Lỗi khi tải danh sách quyền: ' + error.message);
      }
    };

    fetchPermissions();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (role) {
        await updateRole(role.id, values);
        toast.success('Cập nhật vai trò thành công');
      } else {
        await createRole(values);
        toast.success('Tạo vai trò thành công');
      }
      onSuccess();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Input className='input-focus' placeholder="Nhập mã vai trò" {...field} />
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
          name="permissionIds"
          render={() => (
            <FormItem>
              <FormLabel>Quyền</FormLabel>
              <ScrollArea className="h-[200px] border rounded-md p-4">
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <FormField
                      key={permission.id}
                      control={form.control}
                      name="permissionIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={permission.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(permission.id)}
                                onCheckedChange={(checked: any) => {
                                  return checked
                                    ? field.onChange([...field.value, permission.id])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== permission.id
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                {permission.name}
                              </FormLabel>
                              {permission.description && (
                                <p className="text-sm text-muted-foreground">
                                  {permission.description}
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

        <div className="flex justify-end gap-4">
          <Button type="submit">
            {role ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 