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

// Connexion utilisateur
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosApi.post(`/auth/login`, data);
    // Stocker le token dans le localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

// Inscription utilisateur
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosApi.post(`/auth/register`, data);
    // Stocker le token dans le localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    throw error;
  }
};

// Déconnexion utilisateur
export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('accessToken') !== null;
};

// Récupérer l'utilisateur connecté
export const getCurrentUser = (): any => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Récupérer le token d'authentification
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};
