import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StudentService } from './student/student.service'; 
import { StudentController } from './student/student.controller';
@Module({
  imports: [],
  providers: [StudentService],  
  controllers: [AppController,StudentController],
})
export class AppModule {}
