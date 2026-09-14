import { Module } from '@nestjs/common';
import { CurriculumRepository } from './data/curriculum.repository';
import { CurriculumMapper } from './mappers/curriculum.mapper';
import { CurriculumController } from './api/curriculum.controller';
import { CurriculumService } from './services/curriculum.service';

@Module({
  controllers: [CurriculumController],
  providers: [CurriculumRepository, CurriculumMapper, CurriculumService],
})
export class CurriculumModule {}
