import axios from 'axios';
import { Table } from '@/types/table';
import axiosApi from './base/api';


export const getTables = async (): Promise<Table[]> => {
  try {
    const response = await axiosApi.get(`/tables`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
};

export const createTable = async (tableData: any): Promise<Table> => {
  try {
    const response = await axiosApi.post(`$/tables`, tableData);
    return response.data;
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
};

export const updateTable = async (id: number, tableData: any): Promise<Table> => {
  try {
    const response = await axiosApi.put(`/tables/${id}`, tableData);
    return response.data;
  } catch (error) {
    console.error('Error updating table:', error);
    throw error;
  }
};

export const deleteTable = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/tables/${id}`);
  } catch (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
}; 