import axios from 'axios';
import { Table } from '@/types/table';

const API_URL = 'http://localhost:4000';

export const getTables = async (): Promise<Table[]> => {
  try {
    console.log('API_URL', API_URL);
    const response = await axios.get(`${API_URL}/tables`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
};

export const createTable = async (tableData: any): Promise<Table> => {
  try {
    const response = await axios.post(`${API_URL}/tables`, tableData);
    return response.data;
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
};

export const updateTable = async (id: number, tableData: any): Promise<Table> => {
  try {
    const response = await axios.put(`${API_URL}/tables/${id}`, tableData);
    return response.data;
  } catch (error) {
    console.error('Error updating table:', error);
    throw error;
  }
};

export const deleteTable = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/tables/${id}`);
  } catch (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
}; 