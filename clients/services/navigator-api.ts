import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const getNavigators = async () => {
  try {
    console.log('API_URL', API_URL);
    const response = await axios.get(`${API_URL}/navigator`);
    return response.data;
  } catch (error) {
    console.error('Error fetching navigators:', error);
    return [];
  }
};

export const createNavigator = async (navigatorData: any) => {
  try {
    const response = await axios.post(`${API_URL}/navigator`, navigatorData);
    return response.data;
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
};

export const updateNavigator = async (id: number, navigatorData: any) => {
  try {
    const response = await axios.put(`${API_URL}/navigator/${id}`, navigatorData);
    return response.data;
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
};

export const deleteNavigator = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/navigator/${id}`);
  } catch (error) {
    console.error('Error deleting navigator:', error);
    throw error;
  }
}; 