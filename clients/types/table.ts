export interface Table {
  id: number;
  name: string;
  description: string;
  status: 'available' | 'occupied' | 'reserved';
  // Thêm các trường khác nếu cần
} 