'use client'

import { FoodItem } from '@/types/food-item'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getFoodItem, updateFoodItem } from '@/services/manager-api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { Switch } from '@radix-ui/react-switch'
import { title } from 'process'

const UpdateFoodItemPage = () => {
    const params = useParams()
    const router = useRouter()
    const [foodItem, setFoodItem] = useState<FoodItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const isEditing = params.id != null;
    useEffect(() => {
        const fetchFoodItem = async () => {
            try {
                setLoading(true)
                const response = await getFoodItem(parseInt(params.id as string))
                setFoodItem(response)
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Không thể tải thông tin món ăn')
                toast.error('Không thể tải thông tin món ăn')
            } finally {
                setLoading(false)
            }
        }
        fetchFoodItem()
    }, [params.id])
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!foodItem) return
        const { name, value } = e.target
        setFoodItem(prev => ({
            ...prev!,
            [name]: value
        }))
    }
    const changeDescription = (description: string)=>{
        setFoodItem(prev => ({
            ...prev!,
            description:description
        }))
    }
    const handleSwitchChange = (checked: boolean) => {
        setFoodItem(prev => {
            if (!prev) return null;
            return {
                ...prev,
                isAvailable: checked
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!foodItem) return

        try {
            setLoading(true)
            await updateFoodItem(foodItem.id, foodItem)
            toast.success('Cập nhật món ăn thành công')
            router.push('/manager/food-items')
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Không thể cập nhật món ăn')
            toast.error('Không thể cập nhật món ăn')
        } finally {
            setLoading(false)
        }
    }

    if (loading && !foodItem) {
        return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">Lỗi: {error}</div>
    }

    return (
        <div>
        <PageBreadcrumb pageTitle="Thêm mới món ăn" />
        <div className="space-y-2">
          <ComponentCard title={title}>
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên món</Label>
                  <Input
                    id="name"
                    name="name"
                    value={foodItem?.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <div className="ring-1 ring-gray-100/5 rounded-md shadow-sm p-2">
                    <SimpleEditor initialContent={foodItem?.description??''}
                     onContentChange={(content)=>changeDescription(content)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Giá</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={foodItem?.price}
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
                    value={foodItem?.category}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Hình ảnh URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={foodItem?.image}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAvailable"
                    checked={foodItem?.isAvailable}
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
    )
}

export default UpdateFoodItemPage