import { Injectable } from '@nestjs/common';
import { Exam, Prisma } from '@prisma/client';
import { AssignSectionsDto, CreateExamDto, ExamDto } from 'dtos';
import { ExamDomain } from '../domain/exam.domain';
import { ExamSection } from '../domain/exam-section.entity';
import { ExamSectionMapper } from './exam-section.mapper';

type ExamWithSections = Prisma.ExamGetPayload<{
  include: {
    examSections: {
      include: {
        section: true;
      };
    };
  };
}>;

@Injectable()
export class ExamMapper {
  constructor(private readonly examSectionMapper: ExamSectionMapper) {}
  toDomain(exam: Exam | ExamWithSections): ExamDomain {
    const examSections =
      'examSections' in exam
        ? exam.examSections.map((section) =>
            this.examSectionMapper.toDomain(section),
          )
        : [];

    return ExamDomain.fromPersistence({
      id: exam.id,
      examTemplateId: exam.examTemplateId ?? undefined,
      title: exam.title,
      date: exam.date,
      documentUrl: exam.documentUrl ?? undefined,
      curriculumId: exam.curriculumId ?? undefined,
      minScore: exam.minScore,
      maxScore: exam.maxScore,
      examSections,
      createdBy: exam.createdBy,
      createdAt: exam.createdAt,
      updatedBy: exam.updatedBy ?? undefined,
      updatedAt: exam.updatedAt ?? undefined,
      archivedAt: exam.archivedAt ?? undefined,
    });
  }

  toDto(examDomain: ExamDomain): ExamDto {
    return {
      id: examDomain.id,
      examTemplateId: examDomain.examTemplateId,
      title: examDomain.title,
      date: examDomain.date,
      documentUrl: examDomain.documentUrl,
      curriculumId: examDomain.curriculumId,
      minScore: examDomain.minScore,
      maxScore: examDomain.maxScore,
    };
  }

  toDtoList(exams: ExamDomain[]): ExamDto[] {
    return exams.map((exam): ExamDto => this.toDto(exam));
  }

  toDomainFromCreateDto(
    createExam: CreateExamDto,
    actionById: number,
  ): ExamDomain {
    return ExamDomain.create(
      {
        examTemplateId: createExam.examTemplateId,
        title: createExam.title,
        date: new Date(createExam.date),
        documentUrl: createExam.documentUrl,
        curriculumId: createExam.curriculumId,
        minScore: createExam.minScore,
        maxScore: createExam.maxScore,
      },
      actionById,
    );
  }

  toExamSectionsFromAssignDto(
    examId: number,
    assignSectionsDto: AssignSectionsDto,
    actionById: number,
  ): ExamSection[] {
    return assignSectionsDto.sections.map((section) =>
      ExamSection.create({
        examId,
        sectionId: section.sectionId,
        startAt: new Date(section.startAt),
        duration: section.duration,
        createdBy: actionById,
      }),
    );
  }
}
