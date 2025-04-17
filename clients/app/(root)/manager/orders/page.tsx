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
import { Plus, Pencil, Trash } from 'lucide-react';
import { deleteTable, getTables } from '@/services/table-api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getOrders } from '@/services/manager-api';
import { Order } from '@/types/order';
import { useSocket } from '@/hooks/useSocket';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const { subscribeToEvent, unsubscribeFromEvent, joinRoom, leaveRoom } = useSocket();

  useEffect(() => {
    // Đăng ký lắng nghe các sự kiện
    const handleOrderCreated = (data: any) => {
      console.log('New order created:', data);
      toast.success('Đơn hàng mới đã được tạo', {
        description: `Đơn hàng #${data.id} đã được thêm vào hệ thống`,
      });
      onGetOrders();
    };

    const handleOrderUpdated = (data: any) => {
      console.log('Order updated:', data);
      toast.info('Thông tin đơn hàng đã được cập nhật', {
        description: `Đơn hàng #${data.id} đã được cập nhật`,
      });
      onGetOrders();
    };

    const onGetOrders = async () => {
      const data = await getOrders();
      setOrders(data);
    };

    // Chỉ đăng ký sự kiện một lần
    subscribeToEvent('newOrder', handleOrderCreated);
    subscribeToEvent('orderUpdated', handleOrderUpdated);

    // Gọi getOrders lần đầu tiên
    onGetOrders();

    // Cleanup khi component unmount
    return () => {
      unsubscribeFromEvent('newOrder', handleOrderCreated);
      unsubscribeFromEvent('orderUpdated', handleOrderUpdated);
    };
  }, []); // Bỏ các dependencies không cần thiết

  // load danh sách món ăn lên modal
  const handleDelete = async (tableId: number) => {
    try {
      await deleteTable(tableId);
      setOrders(orders.filter((table: Order) => table.id !== tableId));
      toast.success('Bàn đã được xóa thành công');
    } catch (_error) {
      toast.error('Có lỗi xảy ra khi xóa bàn');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle='Quản lý danh sách order' />
      <div className="space-y-6">
        <ComponentCard title="Danh sách đặt món">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Quản lý bàn</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/manager/tables/qrcodes')}
              >
                QR Codes
              </Button>
              <Button onClick={() => router.push('/manager/orders/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm bàn mới
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id Bàn</TableHead>

                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((table) => (
                <TableRow key={table.id}>
                  <TableCell>{table.id}</TableCell>
                  <TableCell>{table.status}</TableCell>
                  <TableCell>{table.note}</TableCell>
                  <TableCell>{table.totalAmount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="default"
                      size="icon"
                      title='Chi tiết đơn hàng'
                      onClick={() => router.push(`/manager/orders/${table.id}`)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(table.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ComponentCard>
      </div>
    </div>

  );
} 