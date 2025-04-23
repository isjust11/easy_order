import { Category } from "./category";

export interface CategoryType {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}