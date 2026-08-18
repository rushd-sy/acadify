import { Module } from '@nestjs/common';
import { HealthCheckController } from './HealthCheck.controller';
import { PrismaService } from './prisma/prisma.service';
import { StudentService } from './student/services/student.service';
import { StudentController } from './student/api/student.controller';
import { StudentMapper } from './student/mappers/student.mapper';
import { AuthModule } from './auth/auth.module';
import { StudentRepository } from './student/data/student.repository';
@Module({
  imports: [AuthModule],
  controllers: [HealthCheckController, StudentController],
  providers: [StudentService, StudentMapper, PrismaService, StudentRepository],
})
export class AppModule {}
