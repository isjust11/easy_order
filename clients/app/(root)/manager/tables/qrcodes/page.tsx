'use client';

import { useEffect, useState } from 'react';
import { getTables } from '@/services/table-api';
import { Table } from '@/types/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import Link from 'next/link';

export default function TableQRCodesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tablesData = await getTables();
        setTables(tablesData);
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">QR Codes des Tables</h1>
        <div className="flex gap-2">
          <Button onClick={handlePrintAll}>In tất cả mã QR</Button>
          <Link href="/manager/tables">
            <Button variant="outline">Quản lý bàn</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <Card key={table.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-center">Table {table.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <QRCodeGenerator 
                tableId={table.id} 
                tableName={table.name} 
                showPrintButton={false}
              />
            </CardContent>
            <CardFooter className="flex justify-center border-t bg-slate-50 py-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    const baseUrl = window.location.origin;
                    const orderUrl = `${baseUrl}/order?tableId=${table.id}&tableName=${encodeURIComponent(table.name)}`;
                    
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>QR Code - Table ${table.name}</title>
                          <style>
                            body {
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              justify-content: center;
                              height: 100vh;
                              padding: 20px;
                              font-family: Arial, sans-serif;
                            }
                            .qr-container {
                              padding: 20px;
                              background: white;
                              border-radius: 10px;
                              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                              text-align: center;
                            }
                            h2 {
                              margin-bottom: 10px;
                            }
                            p {
                              margin-top: 20px;
                              color: #666;
                            }
                            @media print {
                              .qr-container {
                                box-shadow: none;
                              }
                            }
                          </style>
                          <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
                          <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
                          <script src="https://unpkg.com/react-qr-code@2.0.0/lib/index.js"></script>
                        </head>
                        <body>
                          <div class="qr-container">
                            <h2>Table ${table.name}</h2>
                            <div id="qrcode"></div>
                            <p>Scannez ce code pour commander</p>
                          </div>
                          <script>
                            const qrCode = React.createElement(QRCode, {
                              value: "${orderUrl}",
                              size: 256,
                              level: "H"
                            });
                            ReactDOM.render(qrCode, document.getElementById('qrcode'));
                            setTimeout(() => {
                              window.print();
                              window.close();
                            }, 500);
                          </script>
                        </body>
                      </html>
                    `);
                  }
                }}
              >
                Imprimer QR Code
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 