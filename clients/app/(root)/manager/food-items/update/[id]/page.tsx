'use client'

import { FoodItem } from '@/types/food-item'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getFoodItem, updateFoodItem } from '@/services/manager-api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import ComponentCard from '@/components/common/ComponentCard'
import {Action} from '@/types/actions'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

import { Save, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

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

    const handleSubmit = async () => {
      console.log(foodItem);
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
    const listAction: Action[] = [
      {
        icon: <X className="h-4 w-4" />,
        onClick: () => {
          router.back();
        },
        title: "Hủy",
        className: "hover:bg-gray-100 dark:hover:bg-gray-500 rounded-md transition-colors text-gray-300",
        variant: 'outline'
      },
      {
        icon: <Save className="h-4 w-4" />,
        onClick: () => handleSubmit(),
        title: "Cập nhật",
        className: "hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md transition-colors text-blue-500",
        isLoading: loading
      },
    ];

    return (
        <div>
        <PageBreadcrumb pageTitle="Cập nhật món ăn" />
        <div className="space-y-2">
          <ComponentCard title="Cập nhật món ăn" listAction={listAction} >
            <div className="max-w-3xl mx-auto">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên món</Label>
                  <Input
                    id="name"
                    name="name"
                    className='input-focus'
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
                     className='input-focus'
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
                     className='input-focus'
                    value={foodItem?.category}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Hình ảnh URL</Label>
                  <Input
                    id="image"
                    name="image"
                     className='input-focus'
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

              </form>
            </div>
          </ComponentCard>
        </div>
      </div>
    )
}

export default UpdateFoodItemPage