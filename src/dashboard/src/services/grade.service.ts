import { api } from '@/lib/api-client';
import type { CreateGradeDto, GradeDto, UpdateGradeDto } from 'dtos';

class GradeService {
  private readonly baseUrl = '/grades';

  async getAllGrades(): Promise<GradeDto[]> {
    const response = await api.get<GradeDto[]>(this.baseUrl);
    return response.data;
  }

  async createGrade(data: CreateGradeDto): Promise<GradeDto> {
    const response = await api.post<GradeDto>(this.baseUrl, data);
    return response.data;
  }

  async updateGrade(id: number, data: UpdateGradeDto): Promise<GradeDto> {
    const response = await api.patch<GradeDto>(`${this.baseUrl}/${id}`, data);

    return response.data;
  }

  async deleteGrade(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

export const gradeService = new GradeService();
