import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SectionRepository } from '../data/section.repository';
import { SectionMapper } from '../mappers/section.mapper';
import { CreateSectionDto, SectionDto } from 'dtos';

@Injectable()
export class SectionService {
  constructor(
    private readonly repository: SectionRepository,
    private readonly mapper: SectionMapper,
  ) {}

  async getAllSections(): Promise<SectionDto[]> {
    const sections = await this.repository.findAll();

    return this.mapper.toDtoList(sections);
  }

  async createSection(createSection: CreateSectionDto): Promise<SectionDto> {
    const existingSection = await this.repository.findByName(
      createSection.name,
    );

    if (existingSection) {
      throw new ConflictException(
        `Section with name ${createSection.name} already exists`,
      );
    }

    const sectionDomain = this.mapper.toDomainFromCreateDto(createSection);

    const createdSection = await this.repository.create(sectionDomain);

    return this.mapper.toDto(createdSection);
  }

  async deleteSection(id: number): Promise<void> {
    const deletedSection = await this.repository.deleteById(id);

    if (!deletedSection) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
  }
}
