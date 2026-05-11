import { Controller, Get, Param } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from '@prisma/client';

@Controller('/api/student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  getStudents(): Promise<Student[]> {
    return this.studentService.getStudents();
  }

  @Get(':id')
  getStudentById(@Param(':id') id: number): Promise<Student> {
    return this.studentService.getStudentById(parseInt(id.toString()));
  }
}
