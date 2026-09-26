import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SectionRepository } from '../data/section.repository';
import { SectionMapper } from '../mappers/section.mapper';
import { CreateSectionDto, SectionDto, UpdateSectionDto } from 'dtos';

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

  async findById(id: number): Promise<SectionDto> {
    const sectionDomain = await this.repository.findById(id);

    if (!sectionDomain) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return this.mapper.toDto(sectionDomain);
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

  async updateSectionById(
    id: number,
    data: UpdateSectionDto,
  ): Promise<SectionDto> {
    const sectionDomain = await this.repository.findById(id);

    if (!sectionDomain) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    if (data.name) {
      const existingSection = await this.repository.findByName(data.name);

      if (existingSection && existingSection.id !== id) {
        throw new ConflictException(
          `Section with name "${data.name}" already exists`,
        );
      }
    }
    const updatedSection = await this.repository.updateSectionById(id, data);

    return this.mapper.toDto(updatedSection);
  }
}
