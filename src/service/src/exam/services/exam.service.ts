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

  async deleteExam(id: number, actionById: number): Promise<void> {
    const isDeleted = await this.repository.deleteById(id, actionById);
    if (!isDeleted) {
      throw new NotFoundException(`Exam with ID: ${id} not found`);
    }
  }

  async createExam(
    createExamDto: CreateExamDto,
    actionById: number,
  ): Promise<ExamDto> {
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

    const examDomain = this.mapper.toDomainFromCreateDto(
      createExamDto,
      actionById,
    );
    const createdExam = await this.repository.create(examDomain, actionById);

    return this.mapper.toDto(createdExam);
  }
}
