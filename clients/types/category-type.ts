import { Category } from "./category";

export interface CategoryType {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  icon?: string;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}