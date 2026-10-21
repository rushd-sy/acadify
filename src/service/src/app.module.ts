import { Module } from '@nestjs/common';
import { HealthCheckController } from './HealthCheck.controller';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { GradeModule } from './grade/grade.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { TeacherModule } from './teacher/teacher.module';
import { SectionModule } from './section/section.module';
import { ExamModule } from './exam/exam.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    AuthModule,
    StudentModule,
    GradeModule,
    CurriculumModule,
    TeacherModule,
    SectionModule,
    ExamModule,
  ],
  controllers: [HealthCheckController],
  providers: [PrismaService],
})
export class AppModule {}
