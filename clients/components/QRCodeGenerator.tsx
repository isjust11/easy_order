'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';

interface QRCodeGeneratorProps {
  tableId: number;
  tableName: string;
  showPrintButton?: boolean;
  size?: number;
}

export default function QRCodeGenerator({ tableId, tableName, showPrintButton = true, size = 200 }: QRCodeGeneratorProps) {
  // Construire l'URL qui sera encodée dans le QR code
  // Cette URL pointe vers la page de commande pour cette table spécifique
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const orderUrl = `${baseUrl}/order?tableId=${tableId}&tableName=${encodeURIComponent(tableName)}`;
  console.log(orderUrl);
  // Fonction pour imprimer le QR code
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - Table ${tableName}</title>
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
          </head>
          <body>
            <div class="qr-container">
              <h2>Table ${tableName}</h2>
              <div id="qrcode"></div>
              <p>Scannez ce code pour commander</p>
            </div>
            <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
            <script src="https://unpkg.com/react-qr-code@2.0.0/lib/index.js"></script>
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
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-md">
        <QRCode 
          value={orderUrl}
          size={size}
          level="H"
          title={`Table ${tableName}`}
        />
      </div>
      {showPrintButton && (
        <Button onClick={handlePrint} variant="outline" size="sm">
          In mã QR
        </Button>
      )}
    </div>
  );
} 