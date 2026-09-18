import { api } from '@/lib/api-client';
import type { TeacherDetailsDto } from 'dtos';

class TeacherService {
  private readonly baseUrl = '/api/teacher';

  async getTeacherById(id: number): Promise<TeacherDetailsDto> {
    const response = await api.get<TeacherDetailsDto>(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const teacherService = new TeacherService();
