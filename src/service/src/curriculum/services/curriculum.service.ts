import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CurriculumRepository } from '../data/curriculum.repository';
import { CreateCurriculumDto, UpdateCurriculumDto, CurriculumDto } from 'dtos';
import { CurriculumMapper } from '../mappers/curriculum.mapper';
import { CurriculumDomain } from '../domain/curriculum.domain';

@Injectable()
export class CurriculumService {
  constructor(
    private readonly repository: CurriculumRepository,
    private readonly mapper: CurriculumMapper,
  ) {}

  async findAll(): Promise<CurriculumDto[]> {
    const domains = await this.repository.findAll();
    return this.mapper.toDtoList(domains);
  }

  async findById(id: number): Promise<CurriculumDto> {
    const curriculumDomain = await this.repository.findById(id);

    if (!curriculumDomain) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    return this.mapper.toDto(curriculumDomain);
  }

  async create(createDto: CreateCurriculumDto): Promise<CurriculumDto> {
    const existing = await this.repository.findByName(createDto.name);
    if (existing) {
      throw new ConflictException('Curriculum with this name already exists');
    }

    const newDomain = CurriculumDomain.create({
      name: createDto.name,
      description: createDto.description,
    });

    const curriculumDomain = await this.repository.create(newDomain);
    return this.mapper.toDto(curriculumDomain);
  }

  async update(
    id: number,
    updateDto: UpdateCurriculumDto,
  ): Promise<CurriculumDto> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    const newCurriculumName =
      updateDto.name && updateDto.name !== existing.name;
    if (newCurriculumName) {
      const nameConflict = await this.repository.findByName(updateDto.name!);
      if (nameConflict) {
        throw new ConflictException('Curriculum with this name already exists');
      }
    }

    const updatedDomain = await this.repository.update(id, updateDto);
    return this.mapper.toDto(updatedDomain);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
