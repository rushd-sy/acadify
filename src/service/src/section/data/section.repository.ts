import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SectionDomain } from '../domain/section.domain';
import { SectionPersistenceMapper } from '../mappers/section.persistence.mapper';
import { SectionNameTakenError } from '../domain/section.errors';
import { Prisma } from '@prisma/client';

const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002';
const PRISMA_RECORD_NOT_FOUND_ERROR = 'P2025';

@Injectable()
export class SectionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: SectionPersistenceMapper,
  ) {}

  async findById(id: number): Promise<SectionDomain | null> {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: { sectionCurriculumTeachers: true },
    });
    return section ? this.mapper.toDomain(section) : null;
  }
  async findAll(): Promise<SectionDomain[]> {
    const sections = await this.prisma.section.findMany({
      orderBy: { name: 'asc' },
      include: { sectionCurriculumTeachers: true },
    });
    return sections.map((section) => this.mapper.toDomain(section));
  }

  async existsByName(name: string, excludeId?: number): Promise<boolean> {
    const section = await this.prisma.section.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return !!section;
  }

  async save(section: SectionDomain): Promise<SectionDomain> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const savedSectionId = await this.upsertSection(tx, section);
        await this.upsertAssignments(tx, savedSectionId, section);

        const completeSection = await tx.section.findUnique({
          where: { id: savedSectionId },
          include: { sectionCurriculumTeachers: true },
        });

        return this.mapper.toDomain(completeSection!);
      });
    } catch (error) {
      this.handlePrismaError(error, section.name);
      throw error;
    }
  }

  private async upsertSection(
    tx: Prisma.TransactionClient,
    section: SectionDomain,
  ): Promise<number> {
    const sectionData = {
      name: section.name,
      academicYear: section.academicYear,
      gradeId: section.gradeId,
    };

    const savedSection = section.id
      ? await tx.section.update({
          where: { id: section.id },
          data: sectionData,
        })
      : await tx.section.create({ data: sectionData });

    return savedSection.id;
  }

  private async upsertAssignments(
    tx: Prisma.TransactionClient,
    sectionId: number,
    section: SectionDomain,
  ): Promise<void> {
    const newAssignments = section.sectionCurriculumTeachers.filter(
      (assignment) => assignment.id === null,
    );
    const existingAssignments = section.sectionCurriculumTeachers.filter(
      (assignment) => assignment.id !== null,
    );
    const existingAssignmentIds = existingAssignments.map(
      (assignment) => assignment.id as number,
    );

    await tx.sectionCurriculumTeacher.deleteMany({
      where: {
        sectionId: sectionId,
        id:
          existingAssignmentIds.length > 0
            ? { notIn: existingAssignmentIds }
            : undefined,
      },
    });

    if (newAssignments.length > 0) {
      await tx.sectionCurriculumTeacher.createMany({
        data: newAssignments.map((assignment) => ({
          sectionId: sectionId,
          userId: assignment.teacherId,
          curriculumId: assignment.curriculumId,
        })),
      });
    }
  }

  private handlePrismaError(error, sectionName: string): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const target = error.meta?.target as string[] | undefined;
      if (
        error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR &&
        target?.includes('name')
      ) {
        throw new SectionNameTakenError(sectionName);
      }
    }
  }

  async deleteById(id: number): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.sectionCurriculumTeacher.deleteMany({
          where: { sectionId: id },
        });
        await tx.section.delete({ where: { id } });
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
}
