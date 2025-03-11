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
import { useState } from "react";
import QRCodeGenerator from "@/components/QRCodeGenerator";

const formSchema = z.object({
  name: z.string().min(1, "Tên bàn không được để trống"),
  capacity: z.string().transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, "Sức chứa phải là số dương"),
  description: z.string().optional(),
});

export default function CreateTable() {
  const router = useRouter();
  const [createdTable, setCreatedTable] = useState<{ id: number; name: string } | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  
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
      const newTable = await createTable({
        ...values,
        status: 'available'
      });
      toast.success("Thêm bàn mới thành công");
      
      // Afficher le QR code pour la table nouvellement créée
      setCreatedTable({ id: newTable.id, name: newTable.name });
      setShowForm(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm bàn mới");
    }
  }

  const handleBackToTables = () => {
    router.push("/manager/tables");
    router.refresh();
  };

  const handleCreateAnother = () => {
    form.reset();
    setCreatedTable(null);
    setShowForm(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      {showForm ? (
        <>
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
        </>
      ) : createdTable && (
        <div className="space-y-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Bàn đã được tạo thành công</h1>
            <p className="text-muted-foreground">
              Mã QR code cho bàn {createdTable.name} đã sẵn sàng
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6 bg-slate-50 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Bàn: {createdTable.name}</h2>
              <p className="text-sm text-gray-500">
                Khách hàng có thể quét mã QR này để đặt món
              </p>
            </div>
            
            <QRCodeGenerator 
              tableId={createdTable.id} 
              tableName={createdTable.name} 
              showPrintButton={true}
              size={250}
            />
            
            <p className="text-sm text-gray-500 mt-4 max-w-md text-center">
              Hãy in mã QR này và đặt ở bàn tương ứng để khách hàng có thể quét và đặt món
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={handleCreateAnother}>
              Tạo bàn khác
            </Button>
            <Button onClick={handleBackToTables} variant="outline">
              Quay lại danh sách bàn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
