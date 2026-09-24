import { Module } from '@nestjs/common';
import { SectionController } from './api/section.controller';
import { SectionService } from './services/section.service';
import { SectionMapper } from './mappers/section.mapper';
import { SectionRepository } from './data/section.repository';

@Module({
  controllers: [SectionController],
  providers: [SectionMapper, SectionRepository, SectionService],
})
export class SectionModule {}
