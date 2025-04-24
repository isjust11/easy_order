'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowUp, MoreHorizontal, Pencil, Plus, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import { deleteFoodItem, getAllFoods } from '@/services/manager-api'
import { FoodItem } from '@/types/food-item'
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import Badge from '@/components/ui/badge/Badge'
import { Action } from '@/types/actions'
import { Checkbox } from '@/components/ui/checkbox'


const FoodItemsPage = () => {
  const router = useRouter()
  const columns: ColumnDef<FoodItem>[] = [
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
          aria-label="Select row"
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
            Tên món
            {column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        )
      },
      cell:({row})=>{
        const name = row.getValue('name') as string;
        return (
          <div className='font-bold'>
            {name}
          </div>
        )
      }
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Giá
            {column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        )
      },
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
      accessorKey: "isAvailable",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("isAvailable") as boolean
        return (
          <Badge className={status?'ring-green-400': 'ring-red-400'} variant="light" color={status ? 'success' : 'error'} >
            {status ? 'Đang bán' : 'Ngừng bán'}
          </Badge>
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
          <div className="p-2 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Mở menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className='bg-white shadow-sm rounded-xs '>
                <DropdownMenuItem className='flex flex-start px-4 py-2 cursor-pointer hover:bg-gray-300/20'
                  onClick={() => router.push(`/manager/food-items/update/${foodItem.id}`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 flex flex-start px-4 py-2 cursor-pointer hover:bg-gray-300/20" onClick={() => handleDelete(foodItem.id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  useEffect(() => {
    const fetchFoodItems = async () => {
      const items = await getAllFoods()
      setFoodItems(items)
    }
    fetchFoodItems()
  }, [])
  const lstActions:Action[]=[
    {
      icon: <Plus className="w-4 h-4 mr-2" />,
      onClick: () => {
        router.push('/manager/food-items/create')
      },
      title: "Thêm món mới",
      className: "hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md transition-colors text-blue-500",
    },
  ]
  return (
    <div>
      <PageBreadcrumb pageTitle="Danh sách món ăn" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách món ăn" listAction={lstActions}>
          <div className="container mx-auto">
            <DataTable columns={columns} data={foodItems} />
          </div>
        </ComponentCard>
      </div>

    </div>

  )
}

export default FoodItemsPage