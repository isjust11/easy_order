import { Category } from '@/types/category';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/api/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
}; 