import { AppConstants } from '@/constants';
import axiosApi from './base/api';
import { CreatePermissionDto, CreateRoleDto, Permission, UpdatePermissionDto, UpdateRoleDto } from '@/types/permission';
import { Role } from '@/types/permission';

// Type pour les données de connexion
interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    fullName?: string;
    isAdmin: boolean;
  };
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Hàm refresh token
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const refreshToken = localStorage.getItem(AppConstants.RefreshToken);
    if (!refreshToken) {
      throw new Error('Không tìm thấy refresh token');
    }

    const response = await axiosApi.post('/auth/refresh-token', {
      refreshToken,
    });

    // Cập nhật token mới vào localStorage
    localStorage.setItem(AppConstants.AccessToken, response.data.accessToken);
    localStorage.setItem(AppConstants.RefreshToken, response.data.refreshToken);

    return response.data;
  } catch (error) {
    console.error('Lỗi refresh token:', error);
    // Nếu refresh token thất bại, đăng xuất người dùng
    logout();
    throw error;
  }
};

// đăng nhập người dùng
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosApi.post(`/auth/login`, data);
    // lưu trữ token vào localStorage
    localStorage.setItem(AppConstants.AccessToken, response.data.accessToken);
    localStorage.setItem(AppConstants.RefreshToken, response.data.refreshToken);
    localStorage.setItem(AppConstants.User, JSON.stringify(response.data.user));
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
    localStorage.setItem(AppConstants.AccessToken, response.data.accessToken);
    localStorage.setItem(AppConstants.RefreshToken, response.data.refreshToken);
    localStorage.setItem(AppConstants.User, JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    throw error;
  }
};

// đăng xuất người dùng
export const logout = (): void => {
  localStorage.removeItem(AppConstants.AccessToken);
  localStorage.removeItem(AppConstants.RefreshToken);
  localStorage.removeItem(AppConstants.User);
};

export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await axiosApi.get(`/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi xác thực email:', error);
    throw error;
  }
};

// kiểm tra xem người dùng có đăng nhập không
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AppConstants.AccessToken) !== null;
};

// lấy thông tin người dùng đã đăng nhập
export const getCurrentUser = (): any => {
  const user = localStorage.getItem(AppConstants.User);
  return user ? JSON.parse(user) : null;
};

// lấy token xác thực
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AppConstants.AccessToken);
};

// get profile
export const getProfile = async (): Promise<AuthResponse> => {
  const response = await axiosApi.get(`/auth/profile`);
  return response.data;
};
// permission and role

export const getRoles = async (): Promise<Role[]> => {
  const response = await axiosApi.get('/roles');
  return response.data;
};

export const getRole = async (id: string): Promise<Role> => {
  const response = await axiosApi.get(`/roles/${id}`);
  return response.data;
};

export const createRole = async (data: CreateRoleDto): Promise<Role> => {
  const response = await axiosApi.post('/roles', data);
  return response.data;
};

export const updateRole = async (id: string, data: UpdateRoleDto): Promise<Role> => {
  const response = await axiosApi.patch(`/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await axiosApi.delete(`/roles/${id}`);
};  


export const getPermissions = async (): Promise<Permission[]> => {
  const response = await axiosApi.get('/permissions');
  return response.data;
};

export const getPermission = async (id: string): Promise<Permission> => {
  const response = await axiosApi.get(`/permissions/${id}`);
  return response.data;
};

export const createPermission = async (data: CreatePermissionDto): Promise<Permission> => {
  const response = await axiosApi.post('/permissions', data);
  return response.data;
};

export const updatePermission = async (id: string, data: UpdatePermissionDto): Promise<Permission> => {
  const response = await axiosApi.patch(`/permissions/${id}`, data);
  return response.data;
};

export const deletePermission = async (id: string): Promise<void> => {
  await axiosApi.delete(`/permissions/${id}`);
}; 