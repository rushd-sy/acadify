import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { GradeRepository } from '../data/grade.repository';
import { GradeMapper } from '../mappers/grade.mapper';
import { CreateGradeDto, GradeDto, UpdateGradeDto } from 'dtos';

@Injectable()
export class GradeService {
  constructor(
    private readonly repository: GradeRepository,
    private readonly mapper: GradeMapper,
  ) {}

  async create(createGradeDto: CreateGradeDto): Promise<GradeDto> {
    const existingGrade = await this.repository.findByName(createGradeDto.name);

    if (existingGrade) {
      throw new ConflictException(
        `Grade with name ${createGradeDto.name} already esists.`,
      );
    }
    const gradeDomain = await this.repository.create(createGradeDto);
    return this.mapper.toDto(gradeDomain);
  }

  async findById(id: number): Promise<GradeDto> {
    const gradeDomain = await this.repository.findById(id);

    if (!gradeDomain) {
      throw new NotFoundException(`Grade with id ${id} does not exist.`);
    }

    return this.mapper.toDto(gradeDomain);
  }

  async findAll(): Promise<GradeDto[]> {
    const gradesDomain = await this.repository.findAll();
    return this.mapper.toDtoList(gradesDomain);
  }

  async updateById(id: number, data: UpdateGradeDto): Promise<GradeDto> {
    const isExisting = await this.repository.findById(id);

    if (!isExisting) {
      throw new NotFoundException(`Grade with id ${id} not found`);
    }
    if (data.name !== isExisting.name) {
      const nameConflict = await this.repository.findByName(data.name);
      if (nameConflict) {
        throw new ConflictException('Grade with name already exists');
      }
    }

    const updatedDomain = await this.repository.updateById(id, data);
    return this.mapper.toDto(updatedDomain);
  }

  async deleteById(id: number): Promise<void> {
    const isExisting = await this.repository.findById(id);

    if (!isExisting) {
      throw new NotFoundException(`Grade with id ${id} not found`);
    }
    await this.repository.deleteById(id);
  }
}
