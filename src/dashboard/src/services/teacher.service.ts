import { api } from '@/lib/api-client';

import type {
  CreateTeacherDto,
  TeacherDetailsDto,
  TeacherDto,
  UpdateTeacherDto,
} from 'dtos';

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

  async updateTeacherById(
    id: number | string,
    updateTeacher: UpdateTeacherDto,
  ): Promise<TeacherDetailsDto> {
    const response = await api.put<TeacherDetailsDto>(
      `${this.baseUrl}/${id}`,
      updateTeacher,
    );
    return response.data;
  }

  async createTeacher(teacher: CreateTeacherDto): Promise<TeacherDto> {
    const response = await api.post<TeacherDto>(this.baseUrl, teacher);
    return response.data;
  }
}

export const teacherService = new TeacherService();
