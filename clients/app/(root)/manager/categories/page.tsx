'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { DataTable } from '@/components/DataTable';
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { createCategory, deleteCategory, getCategories, getCategoryTypes, updateCategory } from '@/services/manager-api';
import { CategoryType } from '@/types/category-type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from '@/types/category';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import { CategoryForm } from './components/CategoryForm';
import { Action } from '@/types/actions';
import { unicodeToEmoji } from '@/lib/utils';
import Badge from '@/components/ui/badge/Badge';



export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterByType, setFilterByType] = useState<Category[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<CategoryType>();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>();
  const { isOpen, openModal, closeModal } = useModal();
  const columns: ColumnDef<Category>[] = [
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
      header: "Mô tả",
    },
    {
      accessorKey: "type",
      header: "Loại danh mục",
      cell: ({ row }) => {
        const type = row.getValue("type") as CategoryType
        if (!type) return null;
        return <div className="capitalize">{type.name}</div>
      },
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
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => {
        const iconUnicode = row.getValue("icon") as string;
        const icon = unicodeToEmoji(iconUnicode);
        return (
          <div >
            {icon}
          </div>
        )
      },
    },

    {
      id: "actions",
      header: 'Thao tác',
      cell: ({ row }) => {
        const category = row.original as Category;
        const handleDelete = async (id: string) => {
          try {
            await deleteCategory(id);
            toast.success('Danh mục đã được xóa thành công');
            // Refresh data
            const categoryData = await getCategories();
            setCategories(categoryData);
            setFilters(categoryData);
          } catch (_error) {
            toast.error('Có lỗi xảy ra khi xóa danh mục');
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
                    console.log(category)
                    setSelectedCategory(category);
                    openModal();
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 flex flex-start px-4 py-2 cursor-pointer hover:bg-gray-300/20"
                  onClick={() => handleDelete(category?.id!)}>
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
        const [categoriesData, typesData] = await Promise.all([
          getCategories(),
          getCategoryTypes()
        ]);
        setCategories(categoriesData);
        setFilters(categoriesData);
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

  const setFilters = (categories: Category[]) => {
    if (selectedType) {
      const filters = categories.filter((category) => category.type.id === selectedType.id)
      setFilterByType(filters);
    }
    else { 
      setFilterByType(categories);
    }
  }

  const handleSave = async (values: any) => {
    try {
      setLoading(true)
      console.log(values)
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, values);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await createCategory(values);
        toast.success('Tạo danh mục thành công');
      }
      closeModal();
      // Refresh data
      const categoryData = await getCategories();
      setCategories(categoryData);
      setFilters(categoryData);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  }
  const handleChangeType = async (id: string) => {
    console.log(id)
    if (id === 'all') {
      setFilterByType(categories);
      setSelectedType(undefined);
      return;
    }
    const filters = categories.filter((category) => category.type.id === id)
    setFilterByType(filters);
    setSelectedType(categoryTypes.find(type => type.id === id));
  }
  const listAction: Action[] = [
    {
      title: 'Thêm danh mục',
      icon: <Plus className="mr-2 h-4 w-4" />,
      onClick: () => {
        setSelectedCategory(null);
        openModal();
      },
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
      variant: 'primary',
    },
  ]
  return (
    <div>
      <PageBreadcrumb pageTitle="Danh sách danh mục" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách danh mục" listAction={listAction}>
          <div className="mb-4">
            <Select value={selectedType?.id} onValueChange={(value) => handleChangeType(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn loại danh mục" />
              </SelectTrigger>
              <SelectContent className="w-[200px] bg-white" >
                <SelectItem value="all">Tất cả</SelectItem>
                {categoryTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex flex-start items-center">
                      <span className="text-2xl mr-2"> {type.icon && unicodeToEmoji(type.icon)}</span>
                      <span className="text-sm text-gray-500">{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DataTable columns={columns} data={filterByType} />
          <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-[600px] p-5 lg:p-10"
          >
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
              {selectedCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
            </h4>
            <CategoryForm
              initialData={selectedCategory}
              onSubmit={handleSave}
              onCancel={closeModal}
              categoryTypes={categoryTypes} />
          </Modal>
        </ComponentCard>
      </div>
    </div>
  );
}