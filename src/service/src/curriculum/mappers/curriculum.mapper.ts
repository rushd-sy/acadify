import { Injectable } from '@nestjs/common';
import { Curriculum } from '@prisma/client';
import { CurriculumDomain } from '../domain/curriculum.domain';
import { CurriculumDto } from 'dtos';

@Injectable()
export class CurriculumMapper {
  toDomain(curriculum: Curriculum): CurriculumDomain {
    return CurriculumDomain.fromPersistence({
      id: curriculum.id,
      name: curriculum.name,
      description: curriculum.description,
    });
  }

  toDto(curriculumDomain: CurriculumDomain): CurriculumDto {
    return {
      id: curriculumDomain.id as number,
      name: curriculumDomain.name,
      description: curriculumDomain.description,
    };
  }

  toDtoList(curriculums: CurriculumDomain[]): CurriculumDto[] {
    return curriculums.map((curriculum) => this.toDto(curriculum));
  }
}
