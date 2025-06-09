'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// import { useSocket } from '@/hooks/useSocket';
import { createNavigator, deleteNavigator, getNavigators, updateNavigator } from '@/services/manager-api';
import { Feature } from '@/types/feature';
import { Role } from '@/types/role';
import { Checkbox } from '@radix-ui/react-checkbox';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ArrowDown, MoreHorizontal, BadgeInfo, Pencil, Trash, Plus } from 'lucide-react';
import { Action } from '@/types/actions';
import Badge from '@/components/ui/badge/Badge';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { DataTable } from '@/components/DataTable';
import ComponentCard from '@/components/common/ComponentCard';
import { Modal } from '@/components/ui/modal';
import { NavigatorForm } from './components/NavigatorForm';
import { useModal } from '@/hooks/useModal';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';
import { buildFeature } from '@/utils/appUtils';
export default function NavigatorPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState({
    icon: '',
    label: '',
    link: '',
    parentId: undefined as number | undefined,
    isActive: true,
    order: 0,
    roles: [] as Role[],
  });
  const { isOpen, openModal, closeModal } = useModal();
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  // const { socket } = useSocket();

  const fetchNavigators = async () => {
    const response = await getNavigators({ page: pageIndex + 1, size: pageSize, search });
    const featureTree = buildFeature(response.data);
    setFeatures(featureTree);
    setPageCount(response.totalPages);
  };

  useEffect(() => {
    fetchNavigators();
  }, [pageIndex, pageSize, search]);

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const handleSearch=(searchValue: string)=>{
    setSearch(searchValue);
  }

  const handleSubmit = async (values: any) => {
    if (selectedFeature) {
      // Cập nhật navigator
      await updateNavigator(selectedFeature.id, values);
      toast.success('Cập nhật chức năng thành công!')
    } else {
      // Thêm navigator mới
      await createNavigator(values);
      toast.success('Thêm mới chức năng thành công!')
    }
    await fetchNavigators()
    closeModal();
  };

  const handleDelete = async (id: any) => {
    await deleteNavigator(id);
    await fetchNavigators()
    closeModal();
    toast.success('Xóa chức năng thành công!')
  };



  const columns: ColumnDef<Feature>[] = [
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
      accessorKey: "label",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên chức năng
            {column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        )
      },
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => {
        const icon = row.getValue("icon") as string
        return (
          <Icon name={icon} size={20} className='text-gray-400'/>
        )
      },
    },
    {
      accessorKey: "link",
      header: "Đường dẫn",
      cell: ({ row }) => {
        const link = row.getValue("link") as string
        return (
          <div className="text-sm text-gray-500">
            <span>{link}</span>
          </div>
        )
      }
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
      accessorKey: "order",
      header: "Thứ tự",
      cell: ({ row }) => {
        const order = row.getValue("order") as number
        return (
          <div className="text-sm text-gray-500">
            {order??'-'}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: 'Thao tác',
      cell: ({ row }) => {
        const feature = row.original
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
                <DropdownMenuItem className="flex flex-start px-4 py-2 cursor-pointer hover:bg-gray-300/20"
                  onClick={() => {
                    setSelectedFeature(feature)
                    openModal();
                  }}>
                  <BadgeInfo className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem className='flex flex-start px-4 py-2 cursor-pointer hover:bg-gray-300/20'
                  onClick={() => {
                    setSelectedFeature(feature)
                    openModal();
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 flex flex-start px-4 py-2 cursor-pointer hover:bg-gray-300/20" onClick={() => handleDelete(feature.id)}>
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
  const lstActions: Action[] = [
    {
      icon: <Plus className="w-4 h-4 mr-2" />,
      onClick: () => {
        setSelectedFeature(null);
        setFormData({
          icon: '',
          label: '',
          link: '',
          parentId: undefined,
          isActive: true,
          order: 0,
          roles: [],
        });
        openModal();
      },
      title: "Thêm chức năng",
      className: "hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md transition-colors text-blue-500",
    },
  ]

  return (
    <div>
    <PageBreadcrumb pageTitle="Danh sách chức năng" />
    <div className="space-y-6">
      <ComponentCard title="Danh sách chức năng" listAction={lstActions}>
        <DataTable 
          columns={columns} 
          data={features}
          pageCount={pageCount}
          onPaginationChange={handlePaginationChange}
          onSearchChange={handleSearch}
          manualPagination={true}
          getRowChildren={(row) => (row as any).children}
        />
         <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-[600px] p-5 lg:p-10"
          >
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
              {selectedFeature ? 'Cập nhật chức năng' : 'Thêm chức năng mới'}
            </h4>
            <NavigatorForm
              initialData={selectedFeature}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              navigatorParents={features} />
          </Modal>
      </ComponentCard>
    </div>
  </div>
  );
} 