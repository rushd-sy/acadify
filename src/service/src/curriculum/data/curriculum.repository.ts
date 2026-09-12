import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CurriculumDomain } from '../domain/curriculum.domain';
import { CurriculumMapper } from '../mappers/curriculum.mapper';
import { Curriculum } from '@prisma/client';
import { UpdateCurriculumDto } from 'dtos';

@Injectable()
export class CurriculumRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: CurriculumMapper,
  ) {}

  async findAll(): Promise<CurriculumDomain[]> {
    const curriculums = await this.prisma.curriculum.findMany();
    return curriculums.map(
      (curriculum: Curriculum): CurriculumDomain =>
        this.mapper.toDomain(curriculum),
    );
  }

  async findById(id: number): Promise<CurriculumDomain | null> {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
    });
    return curriculum ? this.mapper.toDomain(curriculum) : null;
  }

  async findByName(name: string): Promise<CurriculumDomain | null> {
    const curriculum = await this.prisma.curriculum.findFirst({
      where: { name },
    });
    return curriculum ? this.mapper.toDomain(curriculum) : null;
  }

  async create(curriculumDomain: CurriculumDomain): Promise<CurriculumDomain> {
    const curriculum = await this.prisma.curriculum.create({
      data: {
        name: curriculumDomain.name,
        description: curriculumDomain.description,
      },
    });
    return this.mapper.toDomain(curriculum);
  }

  async update(
    id: number,
    updateData: UpdateCurriculumDto,
  ): Promise<CurriculumDomain> {
    const curriculum = await this.prisma.curriculum.update({
      where: { id },
      data: updateData,
    });
    return this.mapper.toDomain(curriculum);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.curriculum.delete({ where: { id } });
  }
}
