import { api } from '../lib/api-client';
import type { ExamDto } from 'dtos';

class ExamService {
  private readonly baseUrl = '/api/exams';

  async getAllExams(): Promise<ExamDto[]> {
    const response = await api.get<ExamDto[]>(this.baseUrl);
    return response.data;
  }
}

export const examService = new ExamService();
