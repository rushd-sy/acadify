import { Module } from '@nestjs/common';
import { GradeController } from './api/grade.controller';
import { GradeService } from './services/grade.service';

@Module({
  controllers: [GradeController],
  providers: [GradeService],
})
export class GradeModule {}
