import { API_URL, API_TIMEOUT } from "@/config/const";
import axios from "axios";

export const getAuthToken = (): string | null => {
  // Kiểm tra xem có đang ở môi trường browser không
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// 
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    console.log('logout 1');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};


const axiosApi = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // 'X-API-Version': API_VERSION
  }
});

axiosApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Đảm bảo headers đã được khởi tạo
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosApi;

