'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';
import { deleteCategory, getCategories } from '@/services/category-api';
import { Category } from '@/types/category';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { DataTable } from '@/components/DataTable';
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    accessorKey: "id",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Chọn tất cả"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Chọn tất cả"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên danh mục
          {column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
        </Button>
      )
    },
  },
  {
    accessorKey: "description",
    header:"Mô tả",
  },
  {
    accessorKey: "type",
    header: "Loại danh mục",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      const typeMap = {
        food: 'Đồ ăn',
        drink: 'Đồ uống',
        other: 'Khác'
      }
      return <div className="capitalize">{typeMap[type as keyof typeof typeMap]}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className={`capitalize ${status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
          {status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: 'Thao tác',
    cell: ({ row }) => {
      const category = row.original
      const handleDelete = async (id: number) => {
        try {
          await deleteCategory(id);
          toast.success('Danh mục đã được xóa thành công');
        } catch (_error) {
          toast.error('Có lỗi xảy ra khi xóa danh mục');
        }
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.location.href = `/manager/categories/update/${category.id}`}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(category.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Danh sách danh mục" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách danh mục">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
            <Button className='bg-blue-500 text-white' onClick={() => router.push('/manager/categories/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm danh mục mới
            </Button>
          </div>
          <DataTable columns={columns} data={categories}/>
        </ComponentCard>
      </div>
    </div>
  );
} 