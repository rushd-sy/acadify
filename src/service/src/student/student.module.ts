import { Module } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { StudentController } from './api/student.controller';
import { StudentMapper } from './mappers/student.mapper';
import { StudentRepository } from './data/student.repository';

@Module({
  controllers: [StudentController],
  providers: [StudentService, StudentMapper, StudentRepository],
  exports: [StudentMapper],
})
export class StudentModule {}
