'use client'
import { getTables } from '@/services/table-api';
import { Table } from '@/types/table';
import { Plus, Utensils } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';

const TablesPage = () => {
    const [tables, setTables] = useState<Table[]>([]);

    useEffect(() => {
        const fetchTables = async () => {
            const data = await getTables();
            setTables(data);
        };
        fetchTables();
    }, []);
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách bàn" />
            <div className="space-y-6">
                <ComponentCard title="Danh sách bàn">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tables.map((table) => (
                            <div key={table.id} className="p-6 bg-card text-card-foreground rounded-lg border 
                            border-border hover:border-primary/50 transition-colors shadow-sm">
                                <div className="flex items-center justify-between mb-4 ">
                                    <h2 className="text-xl font-semibold">{table.name}</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm ${table.status === 'available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {table?.status??'Đang sử dụng'}
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-4">{table.description}</p>
                                <Link href={`/tables/${table.id}/order`}>
                                    <Button className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 text-white">
                                        <Utensils className="mr-2" size={16} />
                                        Đặt món
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </ComponentCard>
            </div>
        </div>
    )
}

export default TablesPage