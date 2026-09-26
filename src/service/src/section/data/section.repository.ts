import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SectionDomain } from '../domaine/section.domain';
import { SectionMapper } from '../mappers/section.mapper';
import { UpdateSectionDto } from 'dtos';

@Injectable()
export class SectionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: SectionMapper,
  ) {}

  async findByName(name: string): Promise<SectionDomain | null> {
    const section = await this.prisma.section.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    return section ? this.mapper.toDomain(section) : null;
  }

  async findAll(): Promise<SectionDomain[]> {
    const sections = await this.prisma.section.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return sections.map((section) => this.mapper.toDomain(section));
  }

  async create(sectionDomain: SectionDomain): Promise<SectionDomain> {
    const section = await this.prisma.section.create({
      data: {
        name: sectionDomain.name,
        academicYear: sectionDomain.academicYear,
        gradeId: sectionDomain.gradeId,
      },
    });

    return this.mapper.toDomain(section);
  }

  async findById(sectionId: number): Promise<SectionDomain | null> {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
    });
    return section ? this.mapper.toDomain(section) : null;
  }

  async updateSectionById(
    sectionId: number,
    data: UpdateSectionDto,
  ): Promise<SectionDomain> {
    const updatedSection = await this.prisma.section.update({
      where: { id: sectionId },
      data: data,
    });
    return this.mapper.toDomain(updatedSection);
  }
}
