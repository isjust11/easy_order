'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CreateFoodItemDto, FoodItem } from '@/types/food-item';
import { createFoodItem, updateFoodItem, getFoodItem } from '@/services/manager-api';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function CreateFoodItem() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CreateFoodItemDto>({
    name: '',
    description: '',
    price: 0,
    category: '',
    isAvailable: true,
  });

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setIsEditing(true);
      loadFoodItem(parseInt(id));
    }
  }, [searchParams]);

  const loadFoodItem = async (id: number) => {
    try {
      const foodItem = await getFoodItem(id);
      setFormData({
        name: foodItem.name,
        description: foodItem.description,
        price: foodItem.price,
        category: foodItem.category || '',
        image: foodItem.image,
        isAvailable: foodItem.isAvailable,
      });
    } catch (_error) {
      toast.error('Không thể tải thông tin món ăn');
      router.push('/manager/food-items');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const id = parseInt(searchParams.get('id') || '0');
        await updateFoodItem(id, formData);
        toast.success('Món ăn đã được cập nhật thành công');
      } else {
        await createFoodItem(formData);
        toast.success('Món ăn đã được thêm thành công');
      }
      router.push('/manager/food-items');
    } catch (_error) {
      toast.error(isEditing ? 'Có lỗi xảy ra khi cập nhật món ăn' : 'Có lỗi xảy ra khi thêm món ăn');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isAvailable: checked,
    }));
  };

  return (
      <div>
        <PageBreadcrumb pageTitle="Danh sách món ăn" />
        <div className="space-y-6">
          <ComponentCard title="Danh sách món ăn">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên món</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Giá</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Hình ảnh URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isAvailable">Còn phục vụ</Label>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (isEditing ? 'Đang cập nhật...' : 'Đang thêm...') : (isEditing ? 'Cập nhật món' : 'Thêm món')}
                  </Button>
                </div>
              </form>
            </div>
          </ComponentCard>
        </div>
      </div>

      );
} 