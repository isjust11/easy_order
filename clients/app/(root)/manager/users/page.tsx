'use client';

import React, { useEffect, useState } from 'react';
import { userApi, User, CreateUserDto, UpdateUserDto } from '@/services/user-api';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Pencil, Trash2, Lock, Unlock, Plus } from 'lucide-react';
import { Role } from '@/types/permission';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRoles } from '@/services/auth-api';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    password: '',
    fullName: '',
    email: '',
    isAdmin: false,
    roleIds: [],
  });

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (_error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (_error) {
      toast.error('Không thể tải danh sách quyền');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await userApi.update(selectedUser.id, formData);
        toast.success('Cập nhật người dùng thành công');
      } else {
        await userApi.create(formData);
        toast.success('Tạo người dùng thành công');
      }
      setIsDialogOpen(false);
      fetchUsers();
      resetForm();
    } catch (_error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userApi.delete(id);
        toast.success('Xóa người dùng thành công');
        fetchUsers();
      } catch (_error) {
        toast.error('Có lỗi xảy ra');
      }
    }
  };

  const handleBlock = async (id: number, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await userApi.unblock(id);
        toast.success('Mở khóa tài khoản thành công');
      } else {
        await userApi.block(id);
        toast.success('Khóa tài khoản thành công');
      }
      fetchUsers();
    } catch (_error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      isAdmin: false,
      roleIds: [],
    });
    setSelectedUser(null);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      fullName: user.fullName || '',
      email: user.email || '',
      isAdmin: user.isAdmin,
      roleIds: user.roles?.map(role => Number(role.id)) || [],
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedUser(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled={!!selectedUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  {selectedUser ? 'Mật khẩu mới (để trống nếu không muốn thay đổi)' : 'Mật khẩu'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!selectedUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ tên</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roles">Quyền</Label>
                <Select
                  value={formData.roleIds?.join(',')}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      roleIds: value ? value.split(',').map(Number) : [],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quyền" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isAdmin: checked as boolean })
                  }
                />
                <Label htmlFor="isAdmin">Quyền quản trị viên</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {selectedUser ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên đăng nhập</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Quyền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.roles?.map(role => role.name).join(', ') || 'Không có quyền'}
                {user.isAdmin && ' (Quản trị viên)'}
              </TableCell>
              <TableCell>
                {user.isBlocked ? (
                  <span className="text-red-500">Đã khóa</span>
                ) : (
                  <span className="text-green-500">Hoạt động</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBlock(user.id, user.isBlocked)}
                  >
                    {user.isBlocked ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}