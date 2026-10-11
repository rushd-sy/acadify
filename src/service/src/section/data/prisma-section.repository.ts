import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SectionRepository } from '../domaine/section.repository';
import { Section } from '../domaine/section.aggregate';
import { SectionPersistenceMapper } from './section-persistence-mapper';
import { SectionNameTakenError } from '../domaine/section.errors';
import { Prisma } from '@prisma/client';

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
    return sections.map((a) => SectionPersistenceMapper.toDomain(a));
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

        const newAssignments = section.assignments.filter((a) => a.id === null);
        const existingAssignments = section.assignments.filter(
          (a) => a.id !== null,
        );
        const existingAssignmentIds = existingAssignments.map(
          (a) => a.id as number,
        );

        if (savedSection.id) {
          await tx.teacherCurriculum.deleteMany({
            where: {
              sectionId: savedSection.id,
              id:
                existingAssignmentIds.length > 0
                  ? { notIn: existingAssignmentIds }
                  : undefined,
            },
          });
        }

        if (newAssignments.length > 0) {
          await tx.teacherCurriculum.createMany({
            data: newAssignments.map((a) => ({
              sectionId: savedSection.id,
              userId: a.teacherId,
              curriculumId: a.curriculumId,
            })),
          });
        }

        const completeSection = await tx.section.findUnique({
          where: { id: savedSection.id },
          include: { teacherCurriculums: true },
        });

        return SectionPersistenceMapper.toDomain(completeSection!);
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const target = error.meta?.target as string[] | undefined;
        if (error.code === 'P2002' && target?.includes('name')) {
          throw new SectionNameTakenError(section.name);
        }
      }
      throw error;
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
        if (error.code === 'P2025') {
          return false;
        }
      }
      throw error;
    }
  }
}
