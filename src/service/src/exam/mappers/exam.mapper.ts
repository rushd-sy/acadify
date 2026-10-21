import { Injectable } from '@nestjs/common';
import { Exam } from '@prisma/client';
import { ExamDto } from 'dtos';
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
      minScore: examDomain.minScore,
      maxScore: examDomain.maxScore,
    };
  }

  toDtoList(exams: ExamDomain[]): ExamDto[] {
    return exams.map((exam): ExamDto => this.toDto(exam));
  }
}
