import { api } from '../lib/api-client';
import type { TeacherDto } from 'dtos';

class TeacherService {
  private readonly baseUrl = '/api/teacher';

  async getAllTeachers(): Promise<TeacherDto[]> {
    const response = await api.get<TeacherDto[]>(this.baseUrl);

    return response.data;
  }
}

export const teacherService = new TeacherService();
