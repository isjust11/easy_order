import { Navigator } from "./feature";

export interface Role {
   id: string;
  name: string;
  code: string;
  description?: string;
  navigators?: Navigator[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
} 