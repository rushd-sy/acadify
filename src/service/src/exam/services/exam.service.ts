import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExamRepository } from '../data/exam.repository';
import { ExamMapper } from '../mappers/exam.mapper';
import {
  CreateExamDto,
  ExamDto,
  UpdateExamDto,
  AssignSectionsDto,
  ExamSectionDto,
} from 'dtos';
import { ExamSectionMapper } from '../mappers/exam-section.mapper';
import { SectionRepository } from '../../section/data/section.repository';

@Injectable()
export class ExamService {
  constructor(
    private readonly repository: ExamRepository,
    private readonly mapper: ExamMapper,
    private readonly examSectionMapper: ExamSectionMapper,
    private readonly sectionRepository: SectionRepository,
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

  async assignSections(
    examId: number,
    assignSectionsDto: AssignSectionsDto,
    actionById: number,
  ): Promise<ExamSectionDto[]> {
    const exam = await this.repository.findById(examId);

    if (!exam) {
      throw new NotFoundException(`Exam with ID: ${examId} not found`);
    }

    const sectionIds = assignSectionsDto.sections.map(
      (section) => section.sectionId,
    );

    const existingSections = await this.sectionRepository.findByIds(sectionIds);

    if (existingSections.length !== sectionIds.length) {
      throw new NotFoundException('One or more sections were not found');
    }

    const examSections = this.mapper.toExamSectionsFromAssignDto(
      examId,
      assignSectionsDto,
      actionById,
    );

    exam.assignSections(examSections);

    const createdExamSections =
      await this.repository.addSectionsToExam(examSections);

    return createdExamSections.map((examSection) =>
      this.examSectionMapper.toDto(examSection),
    );
  }

  async getAssignedSections(examId: number): Promise<ExamSectionDto[]> {
    const examDomain = await this.repository.findById(examId);

    if (!examDomain) {
      throw new NotFoundException(`Exam with ID: ${examId} not found`);
    }

    const assignedSections =
      await this.repository.findAssignedSectionsByExamId(examId);

    return this.examSectionMapper.toDtoList(assignedSections);
  }
}
