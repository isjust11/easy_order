import { API_URL, API_TIMEOUT } from "@/config/const";
import axios from "axios";

export const getAuthToken = (): string | null => {
  // Kiểm tra xem có đang ở môi trường browser không
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Déconnexion utilisateur
export const logout = (): void => {
  if (typeof window !== 'undefined') {
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

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default axiosApi;

