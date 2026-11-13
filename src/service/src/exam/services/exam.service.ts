import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExamRepository } from '../data/exam.repository';
import { ExamMapper } from '../mappers/exam.mapper';
import { CreateExamDto, ExamDto, UpdateExamDto } from 'dtos';

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

  async getById(id: number): Promise<ExamDto> {
    const examDomain = await this.repository.findById(id);
    if (!examDomain) {
      throw new NotFoundException(`Exam with ID: ${id} not found`);
    }
    return this.mapper.toDto(examDomain);
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

  async update(
    id: number,
    updateExamDto: UpdateExamDto,
    actionById: number,
  ): Promise<ExamDto> {
    const existingExam = await this.repository.findById(id);
    if (!existingExam) {
      throw new NotFoundException(`Exam with ID: ${id} not found`);
    }

    const effectiveTitle = updateExamDto.title ?? existingExam.title;
    const effectiveCurriculumId =
      updateExamDto.curriculumId !== undefined
        ? updateExamDto.curriculumId
        : existingExam.curriculumId;
    const effectiveExamTemplateId =
      updateExamDto.examTemplateId !== undefined
        ? updateExamDto.examTemplateId
        : existingExam.examTemplateId;

    const conflictingExam =
      await this.repository.findByTitleCurriculumAndTemplate(
        effectiveTitle,
        effectiveCurriculumId,
        effectiveExamTemplateId,
      );

    if (conflictingExam && conflictingExam.id !== id) {
      throw new ConflictException(
        'An exam with the same title, curriculum, and template already exists',
      );
    }

    const minScore = updateExamDto.minScore ?? existingExam.minScore;
    const maxScore = updateExamDto.maxScore ?? existingExam.maxScore;
    if (minScore < 0 || maxScore <= 0 || maxScore <= minScore) {
      throw new BadRequestException(
        `Invalid exam score range: minimum score (${minScore}) must be equal to or greater than 0, maximum score (${maxScore}) must be greater than 0, and minimum score must be less than maximum score.`,
      );
    }

    const updatedExam = await this.repository.update(
      id,
      updateExamDto,
      actionById,
    );
    return this.mapper.toDto(updatedExam);
  }
}
