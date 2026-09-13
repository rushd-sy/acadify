import { Module } from '@nestjs/common';
import { CurriculumRepository } from './data/curriculum.repository';
import { CurriculumMapper } from './mappers/curriculum.mapper';

@Module({
  controllers: [],
  providers: [CurriculumRepository, CurriculumMapper],
})
export class CurriculumModule {}
