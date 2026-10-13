import { Injectable } from '@nestjs/common';
import { SectionDomain } from '../domain/section.domain';
import { CreateSectionDto } from 'dtos';

@Injectable()
export class SectionDomainMapper {
  toDomainFromCreateDto(createDto: CreateSectionDto): SectionDomain {
    return SectionDomain.create({
      name: createDto.name,
      academicYear: createDto.academicYear,
      gradeId: createDto.gradeId,
    });
  }
}
