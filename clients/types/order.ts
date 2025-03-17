import { Guest } from "./guest";
import { OrderItem } from "./orderItem";
import { User } from "./user";

export interface Orders {
    id: number;
    tableId: number;
    status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
    totalAmount: number;
    note?: string;
    userId?: number;
    guestId?: number;
    user?: User;
    guest?: Guest;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}