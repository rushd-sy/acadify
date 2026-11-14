import { Injectable } from '@nestjs/common';
import { ExamSection as PrismaExamSection } from '@prisma/client';
import { ExamSectionDto } from 'dtos';
import { ExamSection } from '../domain/exam-section.entity';

@Injectable()
export class ExamSectionMapper {
  toDomain(examSection: PrismaExamSection): ExamSection {
    return ExamSection.fromPersistence({
      id: examSection.id,
      examId: examSection.examId,
      sectionId: examSection.sectionId,
      startAt: examSection.startAt,
      duration: examSection.duration,
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
      id: examSection.id!,
      examId: examSection.examId,
      sectionId: examSection.sectionId,
      startAt: examSection.startAt,
      duration: examSection.duration,
    };
  }
}
