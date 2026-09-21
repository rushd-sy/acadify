import { api } from '@/lib/api-client';

import type { TeacherDetailsDto, TeacherDto } from 'dtos';

class TeacherService {
  private readonly baseUrl = '/api/teacher';

  async getAllTeachers(): Promise<TeacherDto[]> {
    const response = await api.get<TeacherDto[]>(this.baseUrl);

    return response.data;
  }

  async getTeacherById(id: number): Promise<TeacherDetailsDto> {
    const response = await api.get<TeacherDetailsDto>(`${this.baseUrl}/${id}`);

    return response.data;
  }

  async deleteTeacher(userId: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${userId}`);
  }
}

export const teacherService = new TeacherService();
