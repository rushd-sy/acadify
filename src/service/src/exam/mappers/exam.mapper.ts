import { Injectable } from '@nestjs/common';
import { Exam } from '@prisma/client';
import { ExamDomain } from '../domain/exam.domain';
import { ExamDto } from 'dtos';

@Injectable()
export class ExamMapper {
  toDomain(exam: Exam): ExamDomain {
    return ExamDomain.fromPersistence({
      UniqueID: exam.UniqueID,
      examTemplateId: exam.examTemplateId,
      title: exam.title,
      date: exam.date,
    });
  }

  toDto(examDomain: ExamDomain): ExamDto {
    return {
      UniqueID: examDomain.UniqueID,
      examTemplateId: examDomain.examTemplateId,
      title: examDomain.title,
      date: examDomain.date,
    };
  }

  toDtoList(exams: ExamDomain[]): ExamDto[] {
    return exams.map((exam): ExamDto => this.toDto(exam));
  }
}
