import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExamRepository } from '../data/exam.repository';
import { ExamMapper } from '../mappers/exam.mapper';
import { CreateExamDto, ExamDto } from 'dtos';

@Injectable()
export class ExamService {
  constructor(
    private readonly repository: ExamRepository,
    private readonly mapper: ExamMapper,
  ) {}

  async findAll(): Promise<ExamDto[]> {
    const examsDomain = await this.repository.findAll();
    return this.mapper.toDtoList(examsDomain);
  }

  async deleteExam(id: number): Promise<void> {
    const isDeleted = await this.repository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`Exam with ID: ${id} not found`);
    }
  }

  async createExam(createExamDto: CreateExamDto): Promise<ExamDto> {
    const existingExam = await this.repository.findByTitleCurriculumAndTemplate(
      createExamDto.title,
      createExamDto.curriculumId,
      createExamDto.examTemplateId,
    );

    if (existingExam) {
      throw new ConflictException(
        'An exam with the same title, curriculum, and template already exists',
      );
    }

    const examDomain = this.mapper.toDomainFromCreateDto(createExamDto);
    const createdExam = await this.repository.create(examDomain);

    return this.mapper.toDto(createdExam);
  }
}
