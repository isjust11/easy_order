'use client';

import { useEffect, useState } from 'react';
import { getTables } from '@/services/table-api';
import { Table } from '@/types/table';
import { Plus } from 'lucide-react';

export default function Home() {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      const data = await getTables();
      setTables(data);
    };

    fetchTables();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white-1">
          Chào mừng đến với easy order
        </h1>
      </div>
    </div>
  );
}
