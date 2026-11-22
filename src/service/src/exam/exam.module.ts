import { Module } from '@nestjs/common';
import { ExamController } from './api/exam.controller';
import { ExamService } from './services/exam.service';
import { ExamRepository } from './data/exam.repository';
import { ExamMapper } from './mappers/exam.mapper';
import { ExamSectionMapper } from './mappers/exam-section.mapper';
import { SectionModule } from 'src/section/section.module';

@Module({
  imports: [SectionModule],
  controllers: [ExamController],
  providers: [ExamService, ExamRepository, ExamMapper, ExamSectionMapper],
})
export class ExamModule {}
