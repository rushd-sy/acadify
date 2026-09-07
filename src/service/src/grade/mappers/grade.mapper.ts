import { Grade } from '@prisma/client';
import { GradeDomain } from '../domain/grade.domain';
import { GradeDto } from 'dtos';

export class GradeMapper {
  static toDomain(grade: Grade): GradeDomain {
    return GradeDomain.fromPersistence({
      id: grade.id,
      name: grade.name,
    });
  }

  static toDto(gradeDomain: GradeDomain): GradeDto {
    return {
      id: gradeDomain.id,
      name: gradeDomain.name,
    };
  }

  static toDtoList(grades: GradeDomain[]): GradeDto[] {
    return grades.map((grade) => this.toDto(grade));
  }
}
