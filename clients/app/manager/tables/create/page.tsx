'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { createTable } from "@/services/table-api";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Tên bàn không được để trống"),
  capacity: z.string().transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, "Sức chứa phải là số dương"),
  description: z.string().optional(),
});

export default function CreateTable() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createTable({
        ...values,
        status: 'available'
      });
      toast.success("Thêm bàn mới thành công");
      router.push("/manager/tables");
      router.refresh();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm bàn mới");
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Thêm bàn mới</h1>
        <p className="text-muted-foreground">Điền thông tin để thêm bàn mới</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên bàn</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên bàn" {...field} />
                </FormControl>
                <FormDescription>
                  Tên bàn dùng để phân biệt các bàn với nhau
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sức chứa</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nhập sức chứa của bàn"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Số lượng người có thể ngồi tại bàn
                </FormDescription>
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
                  <Textarea
                    placeholder="Nhập mô tả về bàn (không bắt buộc)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit">Thêm bàn</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
