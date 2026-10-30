import { Injectable } from '@nestjs/common';
import { Exam } from '@prisma/client';
import { CreateExamDto, ExamDto } from 'dtos';
import { ExamDomain } from '../domain/exam.domain';

@Injectable()
export class ExamMapper {
  toDomain(exam: Exam): ExamDomain {
    return ExamDomain.fromPersistence({
      id: exam.id,
      examTemplateId: exam.examTemplateId ?? undefined,
      title: exam.title,
      date: exam.date,
      documentUrl: exam.documentUrl ?? undefined,
      curriculumId: exam.curriculumId ?? undefined,
      minScore: exam.minScore,
      maxScore: exam.maxScore,
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

  toDomainFromCreateDto(createExam: CreateExamDto): ExamDomain {
    return ExamDomain.create({
      examTemplateId: createExam.examTemplateId,
      title: createExam.title,
      date: new Date(createExam.date),
      documentUrl: createExam.documentUrl,
      curriculumId: createExam.curriculumId,
      minScore: createExam.minScore,
      maxScore: createExam.maxScore,
    });
  }
}
