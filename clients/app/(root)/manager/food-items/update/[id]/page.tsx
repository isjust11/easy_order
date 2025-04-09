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

const UpdateFoodItemPage = () => {
    const params = useParams()
    const router = useRouter()
    const [foodItem, setFoodItem] = useState<FoodItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFoodItem = async () => {
            try {
                setLoading(true)
                const response = await getFoodItem(parseInt(params.id as string))
                setFoodItem(response)
            } catch (_error) {
                setError(error as string)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!foodItem) return

        try {
            setLoading(true)
            await updateFoodItem(foodItem.id, foodItem)
            toast.success('Cập nhật món ăn thành công')
            router.push('/manager/food-items')
        } catch (_error) {
            setError(error as string)
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
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Cập nhật món ăn</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Tên món</Label>
                    <Input
                        id="name"
                        name="name"
                        value={foodItem?.name || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={foodItem?.description || ''}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Giá</Label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        value={foodItem?.price || ''}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">URL hình ảnh</Label>
                    <Input
                        id="image"
                        name="image"
                        value={foodItem?.image || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/manager/food-items')}
                    >
                        Hủy
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default UpdateFoodItemPage