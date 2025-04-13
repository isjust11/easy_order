import { Role } from "./role";

export interface Navigator {
    id: number;
    icon: string;
    label: string;
    link?: string;
    parentId?: number;
    children?: Navigator[];
    roles?: Role[];
    isActive: boolean;
    order?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
