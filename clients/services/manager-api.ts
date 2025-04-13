import { Order } from '@/types/order';
import axiosApi from './base/api';
import { CreateFoodItemDto, FoodItem } from '@/types/food-item';
import { CreateOrderDto } from '@/types/dto/CreateOrderDto';
import { error } from 'console';
import { Permission } from '@/types/permission';
import { Navigator } from '@/types/navigator';

// todo: api manager fooditem
export const getAllFoods = async (): Promise<FoodItem[]> => {
  try {
    const response = await axiosApi.get(`/food-items`);
    return response.data;
  } catch (_error) {
    console.error('Error fetching food item:', _error);
    return [];
  }
};

export const createFoodItem = async (data: CreateFoodItemDto): Promise<FoodItem> => {
  try {
    const response = await axiosApi.post(`/food-items`, data);
    return response.data;
  } catch (_error) {
    console.error('Error creating foodItem:', _error);
    throw _error; 
  }
};

export const updateFoodItem = async (id: number, data: any): Promise<FoodItem> => {
  try {
    const response = await axiosApi.patch(`/food-items/${id}`, data);
    return response.data;
  } catch (_error) {
    console.error('Error updating table:', _error);
    throw _error;
  }
};

export const deleteFoodItem = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/food-items/${id}`);
  } catch (_error) {
    console.error('Error deleting table:', _error);
    throw _error;
  }
};

export const getFoodItem = async (id: number): Promise<FoodItem> => {
  try {
    const response = await axiosApi.get(`/food-items/${id}`);
    return response.data;
  } catch (_error) {
    console.error('Error fetching food item:', _error);
    throw _error;
  }
}; 

// todo: api manager order
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await axiosApi.get(`/orders`);
    return response.data;
  } catch (_error) {
    console.error('Error fetching orders:', _error);
    throw _error;
  }
};

export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
  try {
    const response = await axiosApi.post(`/orders`, data);
    return response.data;
  } catch (_error) {
    console.error('Error creating order:', _error);
    throw _error;
  }
};

export const updateOrder = async (id: number, data: any): Promise<Order> => {
  try {
    const response = await axiosApi.put(`/orders/${id}`, data);
    return response.data;
  } catch (_error) {
    console.error('Error updating order:', _error);
    throw _error;
  }
};


// todo: api manager navigator
export const getNavigators = async (): Promise<Navigator[]> => {
  try {
    const response = await axiosApi.get(`/navigator`);
    return response.data;
  } catch (_error) {
    console.error('Error fetching navigator:', _error);
    throw _error;
  }
};

export const createNavigator = async (data: any): Promise<Navigator> => {
  try {
    const response = await axiosApi.post(`/navigator`, data);
    return response.data;
  } catch (_error) {
    console.error('Error creating navigator:', _error);
    throw _error;
  }
};

export const updateNavigator = async (id: number, data: any): Promise<Navigator> => {
  try {
    const response = await axiosApi.put(`/navigator/${id}`, data);
    return response.data;
  } catch (_error) {
    console.error('Error updating navigator:', _error);
    throw _error;
  }
};

export const deleteNavigator = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/navigator/${id}`);
  } catch (_error) {
    console.error('Error deleting navigator:', _error);
    throw _error;
  }
};

export const assignPermissions = async (id: number, data: any): Promise<void> => {
  try {
    await axiosApi.post(`/navigator/${id}/permissions`, data);
  } catch (_error) {
    console.error('Error assigning permissions:', _error);
    throw _error;
  }
};

export const removePermissions = async (id: number, data: any): Promise<void> => {
  try {
    await axiosApi.delete(`/navigator/${id}/permissions`, data);
  } catch (_error) {
    console.error('Error removing permissions:', _error);
    throw _error;
  }
};

export const getNavigatorPermissions = async (id: number): Promise<Permission[]> => {
  try {
    const response = await axiosApi.get(`/navigator/${id}/permissions`);
    return response.data;
  } catch (_error) {
    console.error('Error fetching navigator permissions:', _error);
    throw _error;
  }
};