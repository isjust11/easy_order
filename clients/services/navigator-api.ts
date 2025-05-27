import axios from 'axios';
import axiosApi from './base/api';

export const navigatorService = {

  async getNavigators() {
    try {
      const response = await axiosApi.get(`/navigator`);
      return response.data;
    } catch (error) {
      console.error('Error fetching navigators:', error);
      // Ném lỗi để component gọi API có thể xử lý
      throw error;
    }
  },

  async createNavigator(navigatorData: any) {
    try {
      const response = await axiosApi.post(`/navigator`, navigatorData);
      return response.data;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  },
  
  async updateNavigator(id: number, navigatorData: any) {
    try {
      const response = await axiosApi.put(`/navigator/${id}`, navigatorData);
      return response.data;
    } catch (error) {
      console.error('Error updating menu:', error);
      throw error;
    }
  },
  
  async deleteNavigator(id: number) {
    try {
      await axiosApi.delete(`/navigator/${id}`);
    } catch (error) {
      console.error('Error deleting navigator:', error);
      throw error;
    }
  }
}