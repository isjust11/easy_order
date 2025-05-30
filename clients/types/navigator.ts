import { IconType } from "@/enums/icon-type.enum";
import { Role } from "./role";

export interface Navigator {
    id: string;
    icon: string;
    label: string;
    link?: string;
    iconSize: number;
    iconType: IconType;
    className?: string;
    parentId?: number;
    children?: Navigator[];
    roles?: Role[];
    isActive: boolean;
    order?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
