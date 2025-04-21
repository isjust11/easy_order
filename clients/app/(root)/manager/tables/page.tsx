'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';
import { deleteTable, getTables } from '@/services/table-api';
import { Table, Table as TableType } from '@/types/table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { DataTable } from '@/components/DataTable';
import { deleteFoodItem } from '@/services/manager-api';
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Table>[] = [
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
          Tên bàn
          {column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
        </Button>
      )
    },
  },
  {
    accessorKey: "capacity",
    header:"Số người",
  },
  {
    accessorKey: "description",
    header:"Mô tả",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className={`capitalize ${status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
          {status === 'active' ? 'Sẵn sàng' : 'Ngừng phục vụ'}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: 'Thao tác',
    cell: ({ row }) => {
      const foodItem = row.original
      const handleDelete = async (id: number) => {
        try {
          await deleteFoodItem(id);
          toast.success('Món ăn đã được xóa thành công');
        } catch (_error) {
          toast.error('Có lỗi xảy ra khi xóa món ăn');
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
              onClick={() => window.location.href = `/manager/food-items/update/${foodItem.id}`}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(foodItem.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 
export default function TablesManagement() {
  const [tables, setTables] = useState<TableType[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchTables = async () => {
      const data = await getTables();
      setTables(data);
    };

    fetchTables();
  }, []);

  const handleDelete = async (tableId: number) => {
    try {
      await deleteTable(tableId);
      setTables(tables.filter(table => table.id !== tableId));
      toast.success('Bàn đã được xóa thành công');
    } catch (_error) {
      toast.error('Có lỗi xảy ra khi xóa bàn');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Danh sách bàn" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách bàn">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Quản lý bàn</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/manager/tables/qrcodes')}
              >
                QR Codes
              </Button>
              <Button className='bg-blue-500 text-white ' onClick={() => router.push('/manager/tables/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm bàn mới
              </Button>
            </div>
          </div>
         <DataTable columns={columns} data={tables}/>

        </ComponentCard>
      </div>

    </div>

  );
} 