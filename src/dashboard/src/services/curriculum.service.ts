import { api } from '../lib/api-client';
import type {
  CurriculumDto,
  CreateCurriculumDto,
  UpdateCurriculumDto,
} from 'dtos';

class CurriculumService {
  private readonly baseUrl = '/api/curriculums';

  async getAllCurriculums(): Promise<CurriculumDto[]> {
    const response = await api.get<CurriculumDto[]>(this.baseUrl);
    return response.data;
  }

  async getCurriculumById(id: number): Promise<CurriculumDto> {
    const response = await api.get<CurriculumDto>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createCurriculum(data: CreateCurriculumDto): Promise<CurriculumDto> {
    const response = await api.post<CurriculumDto>(this.baseUrl, data);
    return response.data;
  }

  async updateCurriculumById(
    id: number,
    data: UpdateCurriculumDto,
  ): Promise<CurriculumDto> {
    const response = await api.put<CurriculumDto>(
      `${this.baseUrl}/${id}`,
      data,
    );
    return response.data;
  }

  async deleteCurriculumById(id: number): Promise<void> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const curriculumService = new CurriculumService();
