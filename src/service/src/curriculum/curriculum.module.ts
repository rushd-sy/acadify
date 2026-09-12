import { Module } from '@nestjs/common';
import { CurriculumController } from './api/curriculum.controller';
import { CurriculumService } from './services/curriculum.service';
import { CurriculumRepository } from './data/curriculum.repository';
import { CurriculumMapper } from './mappers/curriculum.mapper';

@Module({
  controllers: [CurriculumController],
  providers: [CurriculumService, CurriculumRepository, CurriculumMapper],
})
export class CurriculumModule {}
