'use client';

import { useEffect, useState } from 'react';
import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import { getTables } from '@/services/api';
import { Table } from '@/types/table';

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
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-9'>
        <h1 className='text-4xl font-bold text-white-1'>
          Tables Management
        </h1>
        <div className="tables_grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold">Table {table.name}</h2>
              <p>Status: {table.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
