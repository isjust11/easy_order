import axiosApi from './base/api';

// Type pour les données de connexion
interface LoginData {
  username: string;
  password: string;
}

// Type pour les données d'inscription
interface RegisterData {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
}

// Type pour la réponse d'authentification
interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    username: string;
    fullName?: string;
    isAdmin: boolean;
  };
}

// đăng nhập người dùng
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosApi.post(`/auth/login`, data);
    // lưu trữ token vào localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    throw error;
  }
};

// Inscription utilisateur
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosApi.post(`/auth/register`, data);
    // lưu trữ token vào localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    throw error;
  }
};

// login with google
export const loginWithGoogle = async (): Promise<AuthResponse> => {
  const response = await axiosApi.get(`/auth/google`);
  return response.data;
};

// login with facebook
export const loginWithFacebook = async (): Promise<AuthResponse> => {
  const response = await axiosApi.get(`/auth/facebook`);
  return response.data;
};



// đăng xuất người dùng
export const logout = (): void => {
  console.log('logout 2');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// kiểm tra xem người dùng có đăng nhập không
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('accessToken') !== null;
};

// lấy thông tin người dùng đã đăng nhập
export const getCurrentUser = (): any => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// lấy token xác thực
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};
