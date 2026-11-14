import { api } from '../lib/api-client';
import type { ExamDto, CreateExamDto, UpdateExamDto } from 'dtos';

class ExamService {
  private readonly baseUrl = '/api/exams';

  async getAllExams(): Promise<ExamDto[]> {
    const response = await api.get<ExamDto[]>(this.baseUrl);
    return response.data;
  }

  async getExamById(id: number): Promise<ExamDto> {
    const response = await api.get<ExamDto>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createExam(data: CreateExamDto): Promise<ExamDto> {
    const response = await api.post<ExamDto>(this.baseUrl, data);
    return response.data;
  }

  async updateExamById(id: number, data: UpdateExamDto): Promise<ExamDto> {
    const response = await api.put<ExamDto>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteExamById(id: number): Promise<void> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const examService = new ExamService();
