import { Module } from '@nestjs/common';
import { HealthCheckController } from './HealthCheck.controller';
import { PrismaService } from './prisma/prisma.service';
import { StudentService } from './student/student.service';
import { StudentController } from './student/student.controller';
import { StudentMapper } from './student/student.mapper';
@Module({
  imports: [],
  controllers: [HealthCheckController, StudentController],
  providers: [StudentService, StudentMapper, PrismaService],
})
export class AppModule {}
