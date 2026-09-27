import { api } from '../lib/api-client';
import type { SectionDto, CreateSectionDto, UpdateSectionDto } from 'dtos';

class SectionService {
  private readonly baseUrl = '/api/sections';

  async getAllSections(): Promise<SectionDto[]> {
    const response = await api.get<SectionDto[]>(this.baseUrl);
    return response.data;
  }

  async createSection(data: CreateSectionDto): Promise<SectionDto> {
    const response = await api.post<SectionDto>(this.baseUrl, data);
    return response.data;
  }

    async getSectionById(id: number): Promise<SectionDto> {
    const response = await api.get<SectionDto>(`${this.baseUrl}/${id}`);

    return response.data;
  }

  async updateSection(
    id: number | string,
    updateSection: UpdateSectionDto,
  ): Promise<SectionDto> {
    const respone = await api.put<SectionDto>(
      `${this.baseUrl}/${id}`,
      updateSection,
    );

    return respone.data;
  }

}



export const sectionService = new SectionService();
