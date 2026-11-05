import { api } from '../lib/api-client';
import type { ExamDto, CreateExamDto } from 'dtos';

class ExamService {
  private readonly baseUrl = '/api/exams';

  async getAllExams(): Promise<ExamDto[]> {
    const response = await api.get<ExamDto[]>(this.baseUrl);
    return response.data;
  }

  async deleteExamById(id: number): Promise<void> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createExam(data: CreateExamDto): Promise<ExamDto> {
    const response = await api.post<ExamDto>(this.baseUrl, data);
    return response.data;
  }
}

export const examService = new ExamService();
