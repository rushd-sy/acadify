import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExamDomain } from '../domain/exam.domain';
import { ExamMapper } from '../mappers/exam.mapper';
import { UpdateExamDto } from 'dtos';
import { ExamSectionMapper } from '../mappers/exam-section.mapper';
import { ExamSection } from '../domain/exam-section.entity';

@Injectable()
export class ExamRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ExamMapper,
    private readonly examSectionMapper: ExamSectionMapper,
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
    examTemplateId?: number,
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

  async addSectionsToExam(sections: ExamSection[]): Promise<ExamSection[]> {
    return this.prisma.$transaction(async (tx) => {
      const createdSections = await Promise.all(
        sections.map((section) =>
          tx.examSection.create({
            data: this.examSectionMapper.toPersistence(section),
            include: {
              section: true,
            },
          }),
        ),
      );

      return createdSections.map((section) =>
        this.examSectionMapper.toDomain(section),
      );
    });
  }

  async findAssignedSectionsByExamId(examId: number): Promise<ExamSection[]> {
    const examSections = await this.prisma.examSection.findMany({
      where: {
        examId,
        archivedAt: null,
        section: {
          archivedAt: null,
        },
      },
      include: {
        section: true,
      },
      orderBy: [
        { section: { name: 'asc' } },
        { section: { academicYear: 'asc' } },
        { id: 'asc' },
      ],
    });

    return examSections.map((examSection) =>
      this.examSectionMapper.toDomain(examSection),
    );
  }
}
