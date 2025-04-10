import { Guest } from "./guest";
import { OrderItem } from "./orderItem";
import { User } from "./user";

export interface Order {
    id: string;
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

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
}