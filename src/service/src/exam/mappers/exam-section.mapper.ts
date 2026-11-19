import { Injectable } from '@nestjs/common';
import { ExamSection as PrismaExamSection } from '@prisma/client';
import { ExamSectionDto } from 'dtos';
import { ExamSection } from '../domain/exam-section.entity';

export type PrismaExamSectionWithSection = PrismaExamSection & {
  section: {
    name: string;
    academicYear: string;
    gradeId: number;
  };
};

@Injectable()
export class ExamSectionMapper {
  toDomain(examSection: PrismaExamSectionWithSection): ExamSection {
    return ExamSection.fromPersistence({
      id: examSection.id,
      examId: examSection.examId,
      sectionId: examSection.sectionId,
      startAt: examSection.startAt,
      duration: examSection.duration,
      sectionName: examSection.section.name,
      academicYear: examSection.section.academicYear,
      gradeId: examSection.section.gradeId,
      createdAt: examSection.createdAt,
      createdBy: examSection.createdBy,
      updatedAt: examSection.updatedAt ?? undefined,
      updatedBy: examSection.updatedBy ?? undefined,
      archivedAt: examSection.archivedAt ?? undefined,
    });
  }

  toPersistence(
    examSection: ExamSection,
  ): Omit<PrismaExamSection, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      examId: examSection.examId,
      sectionId: examSection.sectionId,
      startAt: examSection.startAt,
      duration: examSection.duration,
      createdBy: examSection.createdBy,
      updatedBy: examSection.updatedBy ?? null,
      archivedAt: examSection.archivedAt ?? null,
    };
  }

  toDto(examSection: ExamSection): ExamSectionDto {
    return {
      id: examSection.id,
      examId: examSection.examId,
      sectionId: examSection.sectionId,
      sectionName: examSection.sectionName,
      academicYear: examSection.academicYear,
      gradeId: examSection.gradeId,
      startAt: examSection.startAt,
      duration: examSection.duration,
    };
  }

  toDtoList(examSections: ExamSection[]): ExamSectionDto[] {
    return examSections.map((section) => this.toDto(section));
  }
}
