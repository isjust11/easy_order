import { axiosInstance } from '@/lib/axios';

export interface Article {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleDto {
  title: string;
  content: string;
  thumbnail?: string;
  description?: string;
  status?: string;
}

export interface ArticleResponse {
  data: Article[];
  total: number;
  page: number;
  size: number;
}

export interface ArticleParams {
  page?: number;
  size?: number;
  search?: string;
}

export const getArticles = async (params: ArticleParams = {}): Promise<ArticleResponse> => {
  try {
    const response = await axiosInstance.get('/article', { params });
    return {
      data: response.data?.data || [],
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      size: response.data?.size || 10
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      size: 10
    };
  }
};

export const getArticle = async (id: number): Promise<Article> => {
  const response = await axiosInstance.get(`/article/${id}`);
  return response.data;
};

export const createArticle = async (data: ArticleDto): Promise<Article> => {
  const response = await axiosInstance.post('/article', data);
  return response.data;
};

export const updateArticle = async (id: number, data: ArticleDto): Promise<Article> => {
  const response = await axiosInstance.put(`/article/${id}`, data);
  return response.data;
};

export const deleteArticle = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/article/${id}`);
};
 