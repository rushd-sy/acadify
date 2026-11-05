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
    id: number,
    updateSection: UpdateSectionDto,
  ): Promise<SectionDto> {
    const response = await api.put<SectionDto>(
      `${this.baseUrl}/${id}`,
      updateSection,
    );

    return response.data;
  }

  async deleteSection(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async addTeacher(sectionId: number, teacherId: number): Promise<SectionDto> {
    const response = await api.post<SectionDto>(
      `${this.baseUrl}/${sectionId}/teachers`,
      { teacherId },
    );
    return response.data;
  }

  async removeTeacher(
    sectionId: number,
    teacherId: number,
  ): Promise<SectionDto> {
    const response = await api.delete<SectionDto>(
      `${this.baseUrl}/${sectionId}/teachers/${teacherId}`,
    );
    return response.data;
  }
}

export const sectionService = new SectionService();
