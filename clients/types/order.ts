import { Guest } from "./guest";
import { OrderItem } from "./order-item";
import { User } from "./user";

export interface Order {
    id: number;
    tableId: number;
    status: 'pending' | 'processing' | 'completed';
    totalAmount: number;
    note?: string;
    userId?: number;
    guestId?: number;
    user?: User;
    guest?: Guest;
    orderItems: OrderItem[];
    createdAt: string;
    updatedAt: string;
}
