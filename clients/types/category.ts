import { CategoryType } from "./category-type";

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  icon: string;
  createBy: string;
  type: CategoryType;
  createdAt: string;
  updatedAt: string;
} 