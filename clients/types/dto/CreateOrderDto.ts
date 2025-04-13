import { Guest } from "../guest";
import { OrderItem } from "../order-item";
import { User } from "../user";

export interface CreateOrderDto {
    tableId: number;
    userId: number;
    guestId: number;
    totalAmount: number;
    note: string;
    orderItems: OrderItem[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    guest: Guest;
}
