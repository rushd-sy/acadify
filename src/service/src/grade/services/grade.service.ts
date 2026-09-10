import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { GradeRepository } from '../data/grade.repository';
import { GradeMapper } from '../mappers/grade.mapper';
import { CreateGradeDto, GradeDto } from 'dtos';

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

  async findByName(name: string): Promise<GradeDto> {
    const gradeDomain = await this.repository.findByName(name);

    if (!gradeDomain) {
      throw new NotFoundException(`Grade with name ${name} does not exist.`);
    }

    return this.mapper.toDto(gradeDomain);
  }

  async findAll(): Promise<GradeDto[]> {
    const gradesDomain = await this.repository.findAll();
    return this.mapper.toDtoList(gradesDomain);
  }
}
