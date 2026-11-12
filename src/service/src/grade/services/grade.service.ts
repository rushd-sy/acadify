import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { GradeRepository } from '../data/grade.repository';
import { GradeMapper } from '../mappers/grade.mapper';
import { GradeDomain } from '../domain/grade.domain';
import { CreateGradeDto, GradeDto, UpdateGradeDto } from 'dtos';

@Injectable()
export class GradeService {
  constructor(
    private readonly repository: GradeRepository,
    private readonly mapper: GradeMapper,
  ) {}

  async create(
    createGradeDto: CreateGradeDto,
    actionById: number,
  ): Promise<GradeDto> {
    const existingGrade = await this.repository.findByName(createGradeDto.name);

    if (existingGrade) {
      throw new ConflictException(
        `Grade with name ${createGradeDto.name} already exists.`,
      );
    }

    const gradeDomain = GradeDomain.create(
      {
        name: createGradeDto.name,
      },
      actionById,
    );

    const createdGrade = await this.repository.create(gradeDomain, actionById);
    return this.mapper.toDto(createdGrade);
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

  async updateById(
    id: number,
    data: UpdateGradeDto,
    actionById: number,
  ): Promise<GradeDto> {
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

    const updatedDomain = await this.repository.updateById(
      id,
      data,
      actionById,
    );
    if (!updatedDomain) {
      throw new NotFoundException(`Grade with id ${id} not found`);
    }

    return this.mapper.toDto(updatedDomain);
  }

  async deleteById(id: number, actionById: number): Promise<void> {
    const isDeleted = await this.repository.deleteById(id, actionById);

    if (!isDeleted) {
      throw new NotFoundException(`Grade with id ${id} not found`);
    }
  }
}
