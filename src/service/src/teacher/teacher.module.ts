import { Module } from '@nestjs/common';

import { TeacherController } from './api/teacher.controller';
import { TeacherService } from './services/teacher.service';
import { TeacherRepository } from './data/teacher.repository';
import { TeacherMapper } from './mappers/teacher.mapper';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, TeacherRepository, TeacherMapper],
})
export class TeacherModule {}
