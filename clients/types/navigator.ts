export interface Navigator {
    id: number;
    icon: string;
    label: string;
    link?: string;
    parentId?: number;
    children?: Navigator[];
}
