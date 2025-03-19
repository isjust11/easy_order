import { Order } from '@/types/order';
import axiosApi from './base/api';
import { CreateFoodItemDto, FoodItem } from '@/types/food-item';
import { CreateOrderDto } from '@/types/dto/CreateOrderDto';

// todo: api manager fooditem
export const getAllFoods = async (): Promise<FoodItem[]> => {
  try {
    const response = await axiosApi.get(`/food-items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching food item:', error);
    return [];
  }
};

export const createFoodItem = async (data: CreateFoodItemDto): Promise<FoodItem> => {
  try {
    const response = await axiosApi.post(`/food-items`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating foodItem:', error);
    throw error; 
  }
};

export const updateFoodItem = async (id: number, data: any): Promise<FoodItem> => {
  try {
    const response = await axiosApi.patch(`/food-items/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating table:', error);
    throw error;
  }
};

export const deleteFoodItem = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/food-items/${id}`);
  } catch (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
};

export const getFoodItem = async (id: number): Promise<FoodItem> => {
  try {
    const response = await axiosApi.get(`/food-items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching food item:', error);
    throw error;
  }
}; 

// todo: api manager order
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await axiosApi.get(`/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
  try {
    const response = await axiosApi.post(`/orders`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id: number, data: any): Promise<Order> => {
  try {
    const response = await axiosApi.put(`/orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};


