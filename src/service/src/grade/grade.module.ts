import { Module } from '@nestjs/common';
import { GradeController } from './api/grade.controller';
import { GradeService } from './services/grade.service';
import { GradeRepository } from './data/grade.repository';
import { GradeMapper } from './mappers/grade.mapper';

@Module({
  controllers: [GradeController],
  providers: [GradeService, GradeRepository, GradeMapper],
})
export class GradeModule {}
