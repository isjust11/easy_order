import axios from 'axios';
import { Table } from '@/types/table';
import axiosApi from './base/api';


export const getTables = async (): Promise<Table[]> => {
  try {
    const response = await axiosApi.get(`/table`);
    return response.data;
  } catch (_error) {
    console.error('Error fetching tables:', _error);
    return [];
  }
};

export const createTable = async (tableData: any): Promise<Table> => {
  try {
    const response = await axiosApi.post(`/table`, tableData);
    return response.data;
  } catch (_error) {
    console.error('Error creating table:', _error);
    throw _error;
  }
};

export const updateTable = async (id: number, tableData: any): Promise<Table> => {
  try {
    const response = await axiosApi.put(`/table/${id}`, tableData);
    return response.data;
  } catch (_error) {
    console.error('Error updating table:', _error);
    throw _error;
  }
};

export const deleteTable = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/table/${id}`);
  } catch (_error) {
    console.error('Error deleting table:', _error);
    throw _error;
  }
}; 