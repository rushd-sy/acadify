import { api } from '../lib/api-client';
import type { SectionDto } from 'dtos';

class SectionService {
  private readonly baseUrl = '/api/sections';

  async getAllSections(): Promise<SectionDto[]> {
    const response = await api.get<SectionDto[]>(this.baseUrl);
    return response.data;
  }
}

export const sectionService = new SectionService();
