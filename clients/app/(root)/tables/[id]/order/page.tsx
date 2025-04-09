'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createOrder, getAllFoods } from '@/services/manager-api'
import { FoodItem } from '@/types/food-item'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { CreateOrderDto } from '@/types/dto/CreateOrderDto'
import { getCurrentUser } from '@/services/auth-api'

interface OrderItem {
  foodItem: FoodItem
  quantity: number
  note?: string
}

export default function OrderPage() {
  const params = useParams()
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFoodItems = async () => {
      const items = await getAllFoods()
      setFoodItems(items)
    }
    fetchFoodItems()
  }, [])

  const handleAddItem = (foodItem: FoodItem) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.foodItem.id === foodItem.id)
      if (existingItem) {
        return prev.map(item =>
          item.foodItem.id === foodItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { foodItem, quantity: 1 }]
    })
  }

  const handleRemoveItem = (foodItem: FoodItem) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.foodItem.id === foodItem.id)
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.foodItem.id === foodItem.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      return prev.filter(item => item.foodItem.id !== foodItem.id)
    })
  }

  const handleUpdateNote = (foodItemId: number, note: string) => {
    setOrderItems(prev =>
      prev.map(item =>
        item.foodItem.id === foodItemId
          ? { ...item, note }
          : item
      )
    )
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.foodItem.price * item.quantity)
    }, 0)
  }

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một món')
      return
    }

    setLoading(true)
    try {
        const user = await getCurrentUser()
        const orderData: CreateOrderDto = {
            tableId: parseInt(params.id as string),
            note,
            orderItems: orderItems.map(item => ({
                foodItemId: item.foodItem.id,
                quantity: item.quantity,
                note: item.note
            })),
            userId: user.id,
            guestId: user.id,
            totalAmount: calculateTotal(),
            status: 'PENDING',
            createdAt: new Date(),
            updatedAt: new Date(),
            user: user,
            guest: user
        }

      await createOrder(orderData)
      toast.success('Đặt món thành công')
      setOrderItems([])
      setNote('')
    } catch (_error) {
      toast.error('Có lỗi xảy ra khi đặt món')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Đặt món - Bàn {params.id}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danh sách món ăn */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodItems.map((foodItem) => (
              <Card key={foodItem.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{foodItem.name}</h3>
                    <p className="text-sm text-muted-foreground">{foodItem.description}</p>
                    <p className="text-primary font-medium mt-2">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(foodItem.price)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem(foodItem)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Giỏ hàng */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Giỏ hàng</h2>
            
            {orderItems.length === 0 ? (
              <p className="text-muted-foreground">Chưa có món nào được chọn</p>
            ) : (
              <>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.foodItem.id} className="border-b pb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.foodItem.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(item.foodItem.price * item.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveItem(item.foodItem)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddItem(item.foodItem)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label htmlFor={`note-${item.foodItem.id}`}>Ghi chú</Label>
                        <Input
                          id={`note-${item.foodItem.id}`}
                          value={item.note || ''}
                          onChange={(e) => handleUpdateNote(item.foodItem.id, e.target.value)}
                          placeholder="Thêm ghi chú cho món này..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Label htmlFor="order-note">Ghi chú đơn hàng</Label>
                  <Textarea
                    id="order-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Thêm ghi chú cho đơn hàng..."
                    className="mt-2"
                  />
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="text-xl font-bold text-primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(calculateTotal())}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSubmitOrder}
                    disabled={loading}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {loading ? 'Đang xử lý...' : 'Đặt món'}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
} 