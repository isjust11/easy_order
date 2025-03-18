'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { columns } from '@/components/columns'
import { DataTable } from '@/components/DataTable'
import { getAllFoods } from '@/services/manager-api'
import { FoodItem } from '@/types/food-item'

const FoodItemsPage = () => {
  const router = useRouter()
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  useEffect(() => {
    const fetchFoodItems = async () => {
      const items = await getAllFoods()
      setFoodItems(items)
    }
    fetchFoodItems()
  }, [])
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý món ăn</h1>
        <Button onClick={() => router.push('/manager/food-items/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm món mới
        </Button>
      </div>
      <DataTable columns={columns} data={foodItems} />
    </div>
  )
}

export default FoodItemsPage