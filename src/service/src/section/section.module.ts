import { Module } from '@nestjs/common';
import { SectionController } from './api/section.controller';
import { SectionService } from './services/section.service';
import { SectionDomainMapper } from './mappers/section.domain.mapper';
import { SectionDtoMapper } from './mappers/section.dto.mapper';
import { SectionPersistenceMapper } from './mappers/section.persistence.mapper';
import { SectionRepository } from './data/section.repository';

@Module({
  controllers: [SectionController],
  providers: [
    SectionDomainMapper,
    SectionPersistenceMapper,
    SectionDtoMapper,
    SectionRepository,
    SectionService,
  ],
})
export class SectionModule {}
