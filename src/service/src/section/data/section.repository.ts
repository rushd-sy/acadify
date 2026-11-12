import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SectionDomain } from '../domain/section.domain';
import { SectionPersistenceMapper } from '../mappers/section.persistence.mapper';
import { SectionNameTakenError } from '../domain/section.errors';
import { Prisma } from '@prisma/client';

const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002';

@Injectable()
export class SectionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: SectionPersistenceMapper,
  ) {}

  async findById(id: number): Promise<SectionDomain | null> {
    const section = await this.prisma.section.findFirst({
      where: {
        id,
        archivedAt: null,
      },
      include: {
        sectionCurriculumTeachers: {
          where: { archivedAt: null },
        },
      },
    });
    return section ? this.mapper.toDomain(section) : null;
  }

  async findAll(): Promise<SectionDomain[]> {
    const sections = await this.prisma.section.findMany({
      where: { archivedAt: null },
      orderBy: { name: 'asc' },
      include: {
        sectionCurriculumTeachers: {
          where: { archivedAt: null },
        },
      },
    });
    return sections.map((section) => this.mapper.toDomain(section));
  }

  async getTeachersBySectionId(sectionId: number) {
    return await this.prisma.sectionCurriculumTeacher.findMany({
      where: {
        sectionId: sectionId,
        archivedAt: null,
        section: { archivedAt: null },
        teacher: {
          archivedAt: null,
          user: { archivedAt: null },
        },
        curriculum: { archivedAt: null },
      },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        curriculum: true,
      },
    });
  }

  async getStudentsBySectionId(sectionId: number) {
    return await this.prisma.studentSection.findMany({
      where: {
        sectionId: sectionId,
        archivedAt: null,
        section: { archivedAt: null },
        student: {
          archivedAt: null,
          user: { archivedAt: null },
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async existsByName(name: string, excludeId?: number): Promise<boolean> {
    const section = await this.prisma.section.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        id: excludeId ? { not: excludeId } : undefined,
        archivedAt: null,
      },
    });
    return !!section;
  }

  async save(
    section: SectionDomain,
    actionById: number,
  ): Promise<SectionDomain> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const savedSectionId = await this.upsertSection(
          tx,
          section,
          actionById,
        );
        await this.upsertAssignments(tx, savedSectionId, section, actionById);

        const completeSection = await tx.section.findUnique({
          where: { id: savedSectionId },
          include: {
            sectionCurriculumTeachers: {
              where: { archivedAt: null },
            },
          },
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
    actionById: number,
  ): Promise<number> {
    const sectionData = {
      name: section.name,
      academicYear: section.academicYear,
      gradeId: section.gradeId,
    };

    const isUpdate = section.id > 0;

    if (isUpdate) {
      const updated = await tx.section.update({
        where: { id: section.id },
        data: {
          ...sectionData,
          updatedBy: actionById,
        },
      });
      return updated.id;
    } else {
      const created = await tx.section.create({
        data: {
          ...sectionData,
          createdBy: actionById,
        },
      });
      return created.id;
    }
  }

  private async upsertAssignments(
    tx: Prisma.TransactionClient,
    sectionId: number,
    section: SectionDomain,
    actionById: number,
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
          createdBy: actionById,
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

  async deleteById(id: number, actionById: number): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const updatedSection = await tx.section.updateMany({
        where: {
          id,
          archivedAt: null,
        },
        data: {
          archivedAt: now,
          updatedBy: actionById,
        },
      });

      if (updatedSection.count === 0) {
        return false;
      }

      await tx.sectionCurriculumTeacher.updateMany({
        where: {
          sectionId: id,
          archivedAt: null,
        },
        data: {
          archivedAt: now,
          updatedBy: actionById,
        },
      });

      return true;
    });
  }
}
