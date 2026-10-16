import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExamDomain } from '../domain/exam.domain';
import { ExamMapper } from '../mappers/exam.mapper';

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
}
