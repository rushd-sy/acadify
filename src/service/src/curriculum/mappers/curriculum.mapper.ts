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
      createdBy: curriculum.createdBy,
      createdAt: curriculum.createdAt,
      updatedBy: curriculum.updatedBy ?? undefined,
      updatedAt: curriculum.updatedAt ?? undefined,
      archivedAt: curriculum.archivedAt ?? undefined,
    });
  }

  toDto(curriculumDomain: CurriculumDomain): CurriculumDto {
    return {
      id: curriculumDomain.id,
      name: curriculumDomain.name,
      description: curriculumDomain.description,
    };
  }

  toDtoList(curriculums: CurriculumDomain[]): CurriculumDto[] {
    return curriculums.map((curriculum) => this.toDto(curriculum));
  }

  toDomainFromCreateDto(
    createCurriculumDto: CreateCurriculumDto,
    actionById: number,
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
