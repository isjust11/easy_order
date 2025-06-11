'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';
import { CategoryType } from '@/types/category-type';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { DataTable } from '@/components/DataTable';
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { getCategoryTypes, deleteCategoryType, createCategoryType, updateCategoryType } from '@/services/manager-api';
import { Action } from '@/types/actions';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/ui/modal';
import { CategoryTypeForm } from './components/CategoryTypeForm';
import Badge from '@/components/ui/badge/Badge';
import { unicodeToEmoji } from '@/lib/utils';
import { IconType } from '@/enums/icon-type.enum';
import { Icon } from '@/components/ui/icon';



export default function CategoryTypesManagement() {
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryType, setSelectedCategoryType] = useState<CategoryType>();
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const listAction: Action[] = [
    {
      icon: <Plus className="w-4 h-4 mr-2" />,
      onClick: () => {
        setSelectedCategoryType(undefined);
        openModal();
      },
      title: "Thêm loại danh mục mới",
      className: "hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md transition-colors text-blue-500",
    },
  ]
  const columns: ColumnDef<CategoryType>[] = [
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
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã loại
            {column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        )
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên loại
            {column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Mô tả",
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("isActive") as boolean
        return (
          <Badge variant="light" color={status === true ? 'success' : 'error'} >
           {status == true ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Badge>
        )
      },
    },
    {
      accessorKey: "iconType",
      header: "Loại icon",
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => {
        const iconUnicode = row.getValue("icon") as string;
        const iconType = row.getValue("iconType") as IconType;
        if (iconType === IconType.emoji) {
          const icon = unicodeToEmoji(iconUnicode);
          return (
            <div>
              {icon}
            </div>
          );
        } else {
          return (
            <div>
              <Icon name={iconUnicode} size={20} />
            </div>
          );
        }
      },
    },
    {
      id: "actions",
      header: 'Thao tác',
      cell: ({ row }) => {
        const categoryType = row.original
        const handleDelete = async (id: string) => {
          try {
            await deleteCategoryType(id);
            toast.success('Loại danh mục đã được xóa thành công');
            try {
              const typesData = await getCategoryTypes();
              setCategoryTypes(typesData);
            } catch (error) {
              console.error('Error fetching data:', error);
              toast.error('Có lỗi xảy ra khi tải dữ liệu');
            } finally {
              setLoading(false);
            }
          } catch (_error) {
            toast.error('Có lỗi xảy ra khi xóa loại danh mục');
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
                  onClick={() => {
                    setSelectedCategoryType(categoryType);
                    openModal();
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 flex flex-start px-4 py-2 cursor-pointer hover:bg-gray-300/20" onClick={() => handleDelete(categoryType.id)}>
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const typesData = await getCategoryTypes();
        setCategoryTypes(typesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (values: any) => {
    try {
      setLoading(true)
      console.log(values)
      if (selectedCategoryType) {
        await updateCategoryType(selectedCategoryType.id, values);
         toast.success('Cập nhật loại danh mục thành công');
      } else {
        await createCategoryType(values);
        toast.success('Tạo loại danh mục thành công');
      }
      closeModal();
      // Refresh data
      const typesData = await getCategoryTypes();
      setCategoryTypes(typesData);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu dữ liệu');
    }finally{
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Danh sách loại danh mục" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách loại danh mục" listAction={listAction}>
          <DataTable columns={columns} data={categoryTypes} />
          <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-[600px] p-5 lg:p-10"
          >
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
              {selectedCategoryType ? 'Cập nhật loại danh mục' : 'Thêm loại danh mục mới'}
            </h4>
            <CategoryTypeForm
              initialData={selectedCategoryType}
              onSubmit={handleSave}
              onCancel={closeModal}
            />
          </Modal>
        </ComponentCard>
      </div>
    </div>
  );
} 