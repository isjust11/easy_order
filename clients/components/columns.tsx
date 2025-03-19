import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FoodItem } from "@/types/food-item"
import { deleteFoodItem } from "@/services/manager-api"
import { toast } from "sonner"


export const columns: ColumnDef<FoodItem>[] = [
  {
    accessorKey: "name",
    header: "Tên món",
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price)
      return formatted
    },
  },
  {
    accessorKey: "category",
    header: "Danh mục",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className={`capitalize ${status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
          {status === 'active' ? 'Đang bán' : 'Ngừng bán'}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const foodItem = row.original
      const handleDelete = async (id: number) => {
        try {
          await deleteFoodItem(id);
          toast.success('Món ăn đã được xóa thành công');
        } catch (error) {
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