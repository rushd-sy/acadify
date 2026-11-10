import { Injectable } from '@nestjs/common';
import { Grade } from '@prisma/client';
import { GradeDomain } from '../domain/grade.domain';
import { CreateGradeDto, GradeDto } from 'dtos';

@Injectable()
export class GradeMapper {
  toDomain(grade: Grade): GradeDomain {
    return GradeDomain.fromPersistence({
      id: grade.id,
      name: grade.name,
      createdBy: grade.createdBy ?? undefined,
      createdAt: grade.createdAt,
      updatedBy: grade.updatedBy ?? undefined,
      updatedAt: grade.updatedAt,
      archivedAt: grade.archivedAt ?? undefined,
    });
  }

  toDto(gradeDomain: GradeDomain): GradeDto {
    return {
      id: gradeDomain.id,
      name: gradeDomain.name,
      createdBy: gradeDomain.createdBy ?? undefined,
      createdAt: gradeDomain.createdAt,
      updatedBy: gradeDomain.updatedBy ?? undefined,
      updatedAt: gradeDomain.updatedAt,
      archivedAt: gradeDomain.archivedAt ?? undefined,
    };
  }

  toDtoList(grades: GradeDomain[]): GradeDto[] {
    return grades.map((grade): GradeDto => this.toDto(grade));
  }

  toDomainFromCreateDto(
    createGradeDto: CreateGradeDto,
    actionById?: number,
  ): GradeDomain {
    return GradeDomain.create(
      {
        name: createGradeDto.name,
      },
      actionById,
    );
  }
}
