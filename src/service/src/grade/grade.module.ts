import { Module } from '@nestjs/common';
import { GradeController } from './api/grade.controller';
import { GradeService } from './services/grade.service';
import { GradeRepository } from './data/grade.repository';

@Module({
  controllers: [GradeController],
  providers: [GradeService, GradeRepository],
})
export class GradeModule {}
