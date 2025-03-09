'use client'
import { getTables } from '@/services/table-api';
import { Table } from '@/types/table';
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

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
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Danh sách bàn</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus size={20} />
                    <span>Thêm bàn</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map((table) => (
                    <div key={table.id} className="p-6 bg-card text-card-foreground rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Table {table.name}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm ${table.status === 'available'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {table.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground">{table.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TablesPage