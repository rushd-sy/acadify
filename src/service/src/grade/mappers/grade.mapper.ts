import { Injectable } from '@nestjs/common';
import { Grade } from '@prisma/client';
import { GradeDomain } from '../domain/grade.domain';
import { GradeDto } from 'dtos';

@Injectable()
export class GradeMapper {
  toDomain(grade: Grade): GradeDomain {
    return GradeDomain.fromPersistence({
      id: grade.id,
      name: grade.name,
    });
  }

  toDto(gradeDomain: GradeDomain): GradeDto {
    return {
      id: gradeDomain.id!,
      name: gradeDomain.name,
    };
  }

  toDtoList(grades: GradeDomain[]): GradeDto[] {
    return grades.map((grade): GradeDto => this.toDto(grade));
  }
}
