'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout, isAuthenticated, getCurrentUser } from '@/services/auth-api';

// Type pour l'utilisateur
interface User {
  id: number;
  username: string;
  fullName?: string;
  isAdmin: boolean;
}

// Type pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, fullName?: string, email?: string) => Promise<void>;
  logout: () => void;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

// Provider du contexte d'authentification
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('có lỗi trong quá trình thực hiện: ', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Connexion utilisateur
  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await login({ username, password });
      setUser(response.user);
      setIsLoggedIn(true);
      // Gọi lại setupAxiosInterceptors sau khi đăng nhập để đảm bảo token được cập nhật
      // setupAxiosInterceptors();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur de connexion');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Inscription utilisateur
  const handleRegister = async (username: string, password: string, fullName?: string, email?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await register({ username, password, fullName, email });
      setUser(response.user);
      setIsLoggedIn(true);
      // Gọi lại setupAxiosInterceptors sau khi đăng ký để đảm bảo token được cập nhật
      // setupAxiosInterceptors();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Lỗi đăng ký');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion utilisateur
  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    user,
    loading,
    error,
    isLoggedIn,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 