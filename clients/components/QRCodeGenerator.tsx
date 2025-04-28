'use client';

import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';
interface QRCodeGeneratorProps {
  tableId: number;
  tableName: string;
  showPrint?: boolean;
  showDownload?: boolean;
  size?: number;
}

export default function QRCodeGenerator({ tableId, tableName, showPrint = true, showDownload = true, size = 200 }: QRCodeGeneratorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const orderUrl = `${baseUrl}/order?tableId=${tableId}&tableName=${encodeURIComponent(tableName)}`;
  console.log(orderUrl);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context && contentRef.current) {
      const content = contentRef.current;
      const width = content.offsetWidth;
      const height = content.offsetHeight;

      canvas.width = width;
      canvas.height = height;

      // Set white background
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);

      // Draw the content onto the canvas
      const tempCanvas = document.createElement('canvas');
      const tempContext = tempCanvas.getContext('2d');
      if (tempContext) {
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempContext.fillStyle = '#ffffff';
        tempContext.fillRect(0, 0, width, height);
        tempContext.font = '16px Arial';
        tempContext.fillStyle = '#000000';
        tempContext.fillText(`Bàn ${tableName}`, 10, 20);

        const qrCodeElement = content.querySelector('canvas');
        if (qrCodeElement) {
          tempContext.drawImage(qrCodeElement, 0, 40, width, height - 40);
          context.drawImage(tempCanvas, 0, 0, width, height);
        }
      }

      // Convert canvas to PNG and trigger download
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `QRCode-${tableName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={contentRef} className="template-container" >
          <div className="">
            <div className="text-center">Bàn {tableName}</div>
          </div>
          <div className=" flex justify-center py-4" >
            <div className="bg-white p-4 rounded-md" >
              <QRCode
                value={orderUrl}
                size={size}
                level="H"
              />
            </div>
          </div>
      </div>
      <div className="w-full flex justify-center items-center">
        {showPrint && <Button
          variant="outline"
          size="sm"
          title='In QR Code'
          className="flex-8 bg-amber-500 hover:bg-amber-600 text-white"
          onClick={() => handlePrint()}>In QR Code</Button>}
        {showDownload && <Button
          variant="outline"
          size="sm"
          title='Tải QR Code'
          className="flex-2 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => handleDownload()}>
          <Download className="w-4 h-4" />
        </Button>}
      </div>
    </div>
  );
} 