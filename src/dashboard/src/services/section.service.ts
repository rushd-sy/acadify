import { api } from '../lib/api-client';
import { SectionDto, type CreateSectionDto } from 'dtos';

class SectionService {
  private readonly baseUrl = '/api/sections';

  async createSection(data: CreateSectionDto): Promise<SectionDto> {
    const response = await api.post<SectionDto>(this.baseUrl, data);
    return response.data;
  }
}

export const sectionService = new SectionService();
