import { Module } from '@nestjs/common';

import { ExamController } from './api/exam.controller';
import { ExamRepository } from './data/exam.repository';
import { ExamMapper } from './mappers/exam.mapper';
import { ExamService } from './services/exam.service';

@Module({
  controllers: [ExamController],
  providers: [ExamRepository, ExamMapper, ExamService],
})
export class ExamModule {}
