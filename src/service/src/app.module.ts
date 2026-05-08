import { Module } from '@nestjs/common';
import { HealthCheckController } from './HealthCheck.controller';
import { PrismaService } from './prisma/prisma.service';
import { StudentService } from './student/student.service'; 
import { StudentController } from './student/student.controller';
@Module({
  imports: [],
  controllers: [HealthCheckController, StudentController],
  providers: [PrismaService,StudentService,PrismaService],
})
export class AppModule {}
