export interface Category {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  type: 'food' | 'drink' | 'other';
  createdAt: string;
  updatedAt: string;
} 