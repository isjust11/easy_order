import { ExamQuestion } from "./exam-question";


export interface Question {
  id: number;

  content: string;

  skill: string;

  type?: string;

  options?: string[];

  answer?: string;

  explanation?: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

  examQuestions: ExamQuestion[];
} 