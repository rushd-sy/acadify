import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExamDomain } from '../domain/exam.domain';
import { ExamMapper } from '../mappers/exam.mapper';
import { Prisma } from '@prisma/client';

const PRISMA_RECORD_NOT_FOUND_ERROR = 'P2025';

@Injectable()
export class ExamRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ExamMapper,
  ) {}

  async findAll(): Promise<ExamDomain[]> {
    const exams = await this.prisma.exam.findMany({
      orderBy: {
        title: 'asc',
      },
    });

    return exams.map((exam) => this.mapper.toDomain(exam));
  }

  async deleteById(id: number): Promise<boolean> {
    try {
      await this.prisma.exam.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_RECORD_NOT_FOUND_ERROR) {
          return false;
        }
      }
      throw error;
    }
  }

  async create(examDomain: ExamDomain): Promise<ExamDomain> {
    const exam = await this.prisma.exam.create({
      data: {
        examTemplateId: examDomain.examTemplateId,
        title: examDomain.title,
        date: examDomain.date,
        documentUrl: examDomain.documentUrl,
        minScore: examDomain.minScore,
        maxScore: examDomain.maxScore,
      },
    });
    return this.mapper.toDomain(exam);
  }

  async findByTitleCurriculumAndTemplate(
    title: string,
    curriculumId?: number,
    examTemplateId?: number,
  ): Promise<ExamDomain | null> {
    const exam = await this.prisma.exam.findFirst({
      where: {
        title,
        curriculumId: curriculumId ?? null,
        examTemplateId: examTemplateId ?? null,
      },
    });

    return exam ? this.mapper.toDomain(exam) : null;
  }
}
