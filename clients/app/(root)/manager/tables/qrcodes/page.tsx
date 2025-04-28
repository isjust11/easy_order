'use client';

import { useEffect, useState } from 'react';
import { getTables } from '@/services/table-api';
import { Table } from '@/types/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import Link from 'next/link';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Action } from '@/types/actions';
import router from 'next/router';
import { List, Printer } from 'lucide-react';
import React from "react";
export default function TableQRCodesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tablesData = await getTables({ page: pageIndex + 1, size: pageSize, search });
        setPageCount(Math.ceil(tablesData.total / pageSize));
        setTables(tablesData.data);
      } catch (_error) {
        console.error('Error fetching tables:', _error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Codes - Toutes les tables</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              .page-break {
                page-break-after: always;
              }
              .qr-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                padding: 20px;
                box-sizing: border-box;
              }
              .qr-card {
                padding: 30px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background: white;
                text-align: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              h2 {
                margin-bottom: 15px;
                font-size: 24px;
              }
              p {
                margin-top: 15px;
                color: #666;
              }
              .qr-placeholder {
                margin: 20px 0;
                width: 200px;
                height: 200px;
                background: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              @media print {
                .qr-card {
                  box-shadow: none;
                  border: 1px solid #ddd;
                }
              }
            </style>
            <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
            <script src="https://unpkg.com/react-qr-code@2.0.0/lib/index.js"></script>
          </head>
          <body>
            ${tables.map((table, index) => {
        const baseUrl = window.location.origin;
        const orderUrl = `${baseUrl}/order?tableId=${table.id}&tableName=${encodeURIComponent(table.name)}`;

        return `
                <div class="qr-container ${index < tables.length - 1 ? 'page-break' : ''}">
                  <div class="qr-card">
                    <h2>Table ${table.name}</h2>
                    <div id="qrcode-${table.id}" class="qr-placeholder">Chargement...</div>
                    <p>Scannez ce code pour commander</p>
                  </div>
                </div>
                <script>
                  const qrCode${table.id} = React.createElement(QRCode, {
                    value: "${orderUrl}",
                    size: 200,
                    level: "H"
                  });
                  console.log(qrCode${table.id});
                  ReactDOM.render(qrCode${table.id}, document.getElementById('qrcode-${table.id}'));
                </script>
              `;
      }).join('')}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 1000);
            </script>
          </body>
        </html>
      `);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">QR Codes des Tables</h1>
          <Link href="/manager/tables">
            <Button variant="outline">Quản lý bàn</Button>
          </Link>
        </div>

        <div className="bg-slate-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Thêm mới bàn</h2>
          <p className="text-gray-500 mb-6">Tạo bàn mới.</p>
          <Link href="/manager/tables/create">
            <Button>Créer une table</Button>
          </Link>
        </div>
      </div>
    );
  }
  const lstActions: Action[] = [
    { title: 'In tất cả mã QR', onClick: handlePrintAll, icon: <Printer className="w-4 h-4" /> },
    { title: 'Quản lý bàn', onClick: () => router.push('/manager/tables'), icon: <List className="w-4 h-4" /> },
  ];

  return (
    <div>

      <PageBreadcrumb pageTitle="Danh sách bàn" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách bàn" listAction={lstActions}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((table) => (
              <div key={table.id} className="overflow-hidden bg-white shadow-md rounded-lg p-4 ring-1 ring-gray-200">
               
                  <QRCodeGenerator
                    tableId={table.id}
                    tableName={table.name}
                    showPrint={true}
                    showDownload={true}
                  />
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>
    </div>
  );
} 