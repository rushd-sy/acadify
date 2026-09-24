import { Injectable, ConflictException } from '@nestjs/common';
import { SectionRepository } from '../data/section.repository';
import { SectionMapper } from '../mappers/section.mapper';
import { CreateSectionDto, SectionDto } from 'dtos';

@Injectable()
export class SectionService {
  constructor(
    private readonly repository: SectionRepository,
    private readonly mapper: SectionMapper,
  ) {}
  async createSection(createSection: CreateSectionDto): Promise<SectionDto> {
    const existingSection = await this.repository.findByName(
      createSection.name,
    );

    if (existingSection) {
      throw new ConflictException(
        `Section with name ${createSection.name} already exists`,
      );
    }
    const sectionDomain = this.mapper.toDokmainFromCreateDto(createSection);
    const createdSection = await this.repository.create(sectionDomain);
    return this.mapper.toDto(createdSection);
  }
}
