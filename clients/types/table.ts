export interface Table {
  id: number;
  name: string;
  capacity: number;
  description: string;
  status: 'available' | 'occupied' | 'reserved';
  qrCodeUrl?: string;
  // Thêm các trường khác nếu cần
} 