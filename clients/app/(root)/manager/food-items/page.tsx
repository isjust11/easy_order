'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { columns } from '@/components/columns'
import { DataTable } from '@/components/DataTable'
import { getAllFoods } from '@/services/manager-api'
import { FoodItem } from '@/types/food-item'
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'

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
    <div>
      <PageBreadcrumb pageTitle="Danh sách món ăn" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách món ăn">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Quản lý món ăn</h1>
              <Button className='flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600' onClick={() => router.push('/manager/food-items/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm món mới
              </Button>
            </div>
            <DataTable columns={columns} data={foodItems} />
          </div>
        </ComponentCard>
      </div>

    </div>

  )
}

export default FoodItemsPage