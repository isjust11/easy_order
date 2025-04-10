import { Order } from '../types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/api/orders`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_URL}/api/orders/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }
    return response.json();
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    return response.json();
  },

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    return response.json();
  },
}; 