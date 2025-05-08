'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
// import { useSocket } from '@/hooks/useSocket';
import { getNavigators } from '@/services/manager-api';
import { Navigator } from '@/types/navigator';
import { Role } from '@/types/role';

export default function NavigatorPage() {
  const [navigators, setNavigators] = useState<Navigator[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNavigator, setSelectedNavigator] = useState<Navigator | null>(null);
  const [formData, setFormData] = useState({
    icon: '',
    label: '',
    link: '',
    parentId: undefined as number | undefined,
    isActive: true,
    order: 0,
    roles: [] as Role[],
  });
  // const { socket } = useSocket();

  useEffect(() => {
    const fetchNavigators = async () => {
      const data = await getNavigators();
      setNavigators(data as Navigator[]);  
    };
    fetchNavigators();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNavigator) {
      // Cập nhật navigator
      // socket?.emit('updateNavigator', {
      //   id: selectedNavigator.id,
      //   ...formData,
      // }, (response: any) => {
      //   if (response.success) {
      //     toast.success('Cập nhật navigator thành công');
      //     setIsOpen(false);
      //     setSelectedNavigator(null);
      //     setFormData({
      //       icon: '',
      //       label: '',
      //       link: '',
      //       parentId: undefined,
      //       isActive: true,
      //       order: 0,
      //       roles: [],
      //     });
      //   }
      // });
    } else {
      // Thêm navigator mới
      // socket?.emit('createNavigator', formData, (response: any) => {
      //   if (response.success) {
      //     toast.success('Thêm navigator thành công');
      //     setIsOpen(false);
      //     setFormData({
      //       icon: '',
      //       label: '',
      //       link: '',
      //       parentId: undefined,
      //       isActive: true,
      //       order: 0,
      //       roles: [],
      //     });
      //   }
      // });
    }
  };

  const handleDelete = (id: any) => {
    // socket?.emit('deleteNavigator', { id }, (response: any) => {
    //   if (response.success) {
    //     toast.success('Xóa navigator thành công');
    //   }
    // });
  };

  const handleEdit = (navigator: Navigator) => {
    setSelectedNavigator(navigator);
    setFormData({
      icon: navigator.icon,
      label: navigator.label,
      link: navigator.link || '',
      parentId: navigator.parentId,
      isActive: navigator.isActive,
      order: navigator.order || 0,
      roles: navigator.roles || [],
    });
    setIsOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý Navigator</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedNavigator(null);
              setFormData({
                icon: '',
                label: '',
                link: '',
                parentId: undefined,
                isActive: true,
                order: 0,
                roles: [],
              });
            }}>
              Thêm Navigator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedNavigator ? 'Cập nhật Navigator' : 'Thêm Navigator mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Tên icon (ví dụ: home, settings)"
                  required
                />
              </div>
              <div>
                <Label htmlFor="label">Tên Navigator</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="link">Đường dẫn</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="Ví dụ: /dashboard"
                />
              </div>
              <div>
                <Label htmlFor="parentId">Menu cha</Label>
                <Input
                  id="parentId"
                  type="number"
                  value={formData.parentId || ''}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="ID của menu cha (nếu có)"
                />
              </div>
              <div>
                <Label htmlFor="order">Thứ tự</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <Label htmlFor="isActive">Kích hoạt</Label>
              </div>
              <Button type="submit">
                {selectedNavigator ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Đường dẫn</TableHead>
            <TableHead>Menu cha</TableHead>
            <TableHead>Thứ tự</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {navigators.map((navigator) => (
            <TableRow key={navigator.id}>
              <TableCell>{navigator.icon}</TableCell>
              <TableCell>{navigator.label}</TableCell>
              <TableCell>{navigator.link}</TableCell>
              <TableCell>{navigator.parentId}</TableCell>
              <TableCell>{navigator.order}</TableCell>
              <TableCell>{navigator.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => handleEdit(navigator)}
                  className="mr-2"
                >
                  Sửa
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(navigator.id)}
                  className="text-red-500"
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 