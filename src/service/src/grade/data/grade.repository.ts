import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GradeDomain } from '../domain/grade.domain';
import { GradeMapper } from '../mappers/grade.mapper';
import { UpdateGradeDto } from 'dtos';

@Injectable()
export class GradeRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: GradeMapper,
  ) {}

  async findByName(name: string): Promise<GradeDomain | null> {
    const grade = await this.prisma.grade.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
    return grade ? this.mapper.toDomain(grade) : null;
  }

  async findById(id: number): Promise<GradeDomain | null> {
    const grade = await this.prisma.grade.findUnique({
      where: { id },
    });
    return grade ? this.mapper.toDomain(grade) : null;
  }

  async create(
    gradeDomain: GradeDomain,
    actionById: number,
  ): Promise<GradeDomain> {
    const grade = await this.prisma.grade.create({
      data: {
        name: gradeDomain.name,
        createdBy: actionById,
      },
    });
    return this.mapper.toDomain(grade);
  }

  async findAll(): Promise<GradeDomain[]> {
    const grades = await this.prisma.grade.findMany();
    return grades.map((grade) => this.mapper.toDomain(grade));
  }

  async deleteById(id: number, actionById?: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const grade = this.findById(id);
      if (grade !== null) {
        const now = new Date();
        await tx.grade.update({
          where: { id },
          data: {
            archivedAt: now,
            updatedBy: actionById,
          },
        });
      }
    });
  }

  async updateById(
    id: number,
    data: UpdateGradeDto,
    actionById?: number,
  ): Promise<GradeDomain | null> {
    const grade = this.findById(id);
    if (grade === null) {
      return null;
    }
    const newGrade = await this.prisma.grade.update({
      where: { id },
      data: {
        data,
        updatedBy: actionById,
      },
    });

    return this.mapper.toDomain(newGrade);
  }
}
