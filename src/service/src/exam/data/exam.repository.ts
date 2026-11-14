import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExamDomain } from '../domain/exam.domain';
import { ExamMapper } from '../mappers/exam.mapper';
import { UpdateExamDto } from 'dtos';

@Injectable()
export class ExamRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ExamMapper,
  ) {}

  async findAll(): Promise<ExamDomain[]> {
    const exams = await this.prisma.exam.findMany({
      where: {
        archivedAt: null,
      },
      orderBy: {
        title: 'asc',
      },
    });

    return exams.map((exam) => this.mapper.toDomain(exam));
  }

  async findById(id: number): Promise<ExamDomain | null> {
    const exam = await this.prisma.exam.findFirst({
      where: {
        id,
        archivedAt: null,
      },
    });

    return exam ? this.mapper.toDomain(exam) : null;
  }

  async deleteById(id: number, actionById: number): Promise<boolean> {
    const result = await this.prisma.exam.updateMany({
      where: {
        id,
        archivedAt: null,
      },
      data: {
        archivedAt: new Date(),
        updatedBy: actionById,
      },
    });
    return result.count > 0;
  }

  async create(
    examDomain: ExamDomain,
    actionById: number,
  ): Promise<ExamDomain> {
    const exam = await this.prisma.exam.create({
      data: {
        examTemplateId: examDomain.examTemplateId,
        title: examDomain.title,
        date: examDomain.date,
        documentUrl: examDomain.documentUrl,
        curriculumId: examDomain.curriculumId,
        minScore: examDomain.minScore,
        maxScore: examDomain.maxScore,
        createdBy: actionById,
      },
    });
    return this.mapper.toDomain(exam);
  }

  async update(
    id: number,
    data: UpdateExamDto,
    actionById: number,
  ): Promise<ExamDomain> {
    const { date, ...rest } = data;
    const exam = await this.prisma.exam.update({
      where: { id },
      data: {
        ...rest,
        ...(date !== undefined ? { date: new Date(date) } : {}),
        updatedBy: actionById,
      },
    });

    return this.mapper.toDomain(exam);
  }

  async findByTitleCurriculumAndTemplate(
    title: string,
    curriculumId?: number | null,
    examTemplateId?: number | null,
  ): Promise<ExamDomain | null> {
    const exam = await this.prisma.exam.findFirst({
      where: {
        title,
        curriculumId: curriculumId ?? null,
        examTemplateId: examTemplateId ?? null,
        archivedAt: null,
      },
    });

    return exam ? this.mapper.toDomain(exam) : null;
  }
}
