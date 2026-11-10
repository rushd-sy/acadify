import { Injectable } from '@nestjs/common';
import { Curriculum } from '@prisma/client';
import { CurriculumDomain } from '../domain/curriculum.domain';
import { CreateCurriculumDto, CurriculumDto } from 'dtos';

@Injectable()
export class CurriculumMapper {
  toDomain(curriculum: Curriculum): CurriculumDomain {
    return CurriculumDomain.fromPersistence({
      id: curriculum.id,
      name: curriculum.name,
      description:
        curriculum.description === null ? undefined : curriculum.description,
      createdBy: curriculum.createdBy ?? undefined,
      createdAt: curriculum.createdAt,
      updatedBy: curriculum.updatedBy ?? undefined,
      updatedAt: curriculum.updatedAt,
      archivedAt: curriculum.archivedAt ?? undefined,
    });
  }

  toDto(curriculumDomain: CurriculumDomain): CurriculumDto {
    return {
      id: curriculumDomain.id,
      name: curriculumDomain.name,
      description: curriculumDomain.description,
      createdBy: curriculumDomain.createdBy ?? undefined,
      createdAt: curriculumDomain.createdAt,
      updatedBy: curriculumDomain.updatedBy ?? undefined,
      updatedAt: curriculumDomain.updatedAt,
      archivedAt: curriculumDomain.archivedAt ?? undefined,
    };
  }

  toDtoList(curriculums: CurriculumDomain[]): CurriculumDto[] {
    return curriculums.map((curriculum) => this.toDto(curriculum));
  }

  toDomainFromCreateDto(
    createCurriculumDto: CreateCurriculumDto,
    actionById?: number,
  ): CurriculumDomain {
    return CurriculumDomain.create(
      {
        name: createCurriculumDto.name,
        description: createCurriculumDto.description,
      },
      actionById,
    );
  }
}
