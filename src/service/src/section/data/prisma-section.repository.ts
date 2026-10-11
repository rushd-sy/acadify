import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SectionRepository } from '../domaine/section.repository';
import { Section } from '../domaine/section.aggregate';
import { SectionPersistenceMapper } from './section-persistence-mapper';
import { SectionNameTakenError } from '../domaine/section.errors';
import { Prisma } from '@prisma/client';

const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002';
const PRISMA_RECORD_NOT_FOUND_ERROR = 'P2025';

@Injectable()
export class PrismaSectionRepository implements SectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Section | null> {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: { teacherCurriculums: true },
    });
    return section ? SectionPersistenceMapper.toDomain(section) : null;
  }
  async findAll(): Promise<Section[]> {
    const sections = await this.prisma.section.findMany({
      orderBy: { name: 'asc' },
      include: { teacherCurriculums: true },
    });
    return sections.map((section) =>
      SectionPersistenceMapper.toDomain(section),
    );
  }

  async existsByName(name: string): Promise<boolean> {
    const section = await this.prisma.section.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });
    return !!section;
  }

  async save(section: Section): Promise<Section> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const savedSectionId = await this.upsertSection(tx, section);
        await this.syncAssignments(tx, savedSectionId, section);

        const completeSection = await tx.section.findUnique({
          where: { id: savedSectionId },
          include: { teacherCurriculums: true },
        });

        return SectionPersistenceMapper.toDomain(completeSection!);
      });
    } catch (error) {
      this.handlePrismaError(error, section.name);
      throw error;
    }
  }

  private async upsertSection(
    tx: Prisma.TransactionClient,
    section: Section,
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

  private async syncAssignments(
    tx: Prisma.TransactionClient,
    sectionId: number,
    section: Section,
  ): Promise<void> {
    const newAssignments = section.assignments.filter(
      (assignment) => assignment.id === null,
    );
    const existingAssignments = section.assignments.filter(
      (assignment) => assignment.id !== null,
    );
    const existingAssignmentIds = existingAssignments.map(
      (assignment) => assignment.id as number,
    );

    await tx.teacherCurriculum.deleteMany({
      where: {
        sectionId: sectionId,
        id:
          existingAssignmentIds.length > 0
            ? { notIn: existingAssignmentIds }
            : undefined,
      },
    });

    if (newAssignments.length > 0) {
      await tx.teacherCurriculum.createMany({
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
        await tx.teacherCurriculum.deleteMany({ where: { sectionId: id } });
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
