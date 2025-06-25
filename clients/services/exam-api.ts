import { axiosInstance } from '@/lib/axios';
import { Exam } from '@/types/exam';


export interface ExamDto {
  title: string;
  content: string;
  thumbnail?: string;
  description?: string;
  status?: string;
}


export const getExams = async (params?: PaginationParams): Promise<PaginatedResponse<Exam>> => {
  try {
    const response = await axiosInstance.get('/exam', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Exams:', error);
     return { data: [], total: 0, page: 0, size: 10, totalPages: 0 };
  }
};

export const getAllExam = async (): Promise<Exam[]> => {
  const response = await axiosInstance.get(`/exam`);
  return response.data;
};

export const getExam = async (id: string): Promise<Exam> => {
  const response = await axiosInstance.get(`/exam/${id}`);
  return response.data;
};

export const createExam = async (data: ExamDto): Promise<Exam> => {
  const response = await axiosInstance.post('/exam', data);
  return response.data;
};

export const updateExam = async (id?: string, data?: ExamDto): Promise<Exam> => {
  const response = await axiosInstance.put(`/exam/${id}`, data);
  return response.data;
};

export const deleteExam = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/exam/${id}`);
};
 