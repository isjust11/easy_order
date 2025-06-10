import { Feature } from "./feature";

export interface Role {
   id: string;
  name: string;
  code: string;
  description?: string;
  navigators?: Feature[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
} 