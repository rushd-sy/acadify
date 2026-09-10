import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GradeDomain } from '../domain/grade.domain';
import { GradeMapper } from '../mappers/grade.mapper';

@Injectable()
export class GradeRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: GradeMapper,
  ) {}

  async findByName(name: string): Promise<GradeDomain | null> {
    return this.prisma.grade.findFirst({
      where: { name },
    });
  }

  async create(gradeDomain: GradeDomain): Promise<GradeDomain> {
    const grade = await this.prisma.grade.create({
      data: { name: gradeDomain.name },
    });
    return this.mapper.toDomain(grade);
  }

  async findAll(): Promise<GradeDomain[]> {
    const grades = await this.prisma.grade.findMany();
    return grades.map((grade) => this.mapper.toDomain(grade));
  }
}
