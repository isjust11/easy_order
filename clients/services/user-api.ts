import axiosApi from './base/api';

export interface User {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  isAdmin: boolean;
  isBlocked: boolean;
}

export interface CreateUserDto {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  isAdmin?: boolean;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  isAdmin?: boolean;
}

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosApi.get('/users');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await axiosApi.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await axiosApi.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await axiosApi.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosApi.delete(`/users/${id}`);
  },

  block: async (id: number): Promise<User> => {
    const response = await axiosApi.put(`/users/${id}/block`);
    return response.data;
  },

  unblock: async (id: number): Promise<User> => {
    const response = await axiosApi.put(`/users/${id}/unblock`);
    return response.data;
  },
}; 