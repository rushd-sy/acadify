import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from '@prisma/client';
import { CreateStudentDto } from './Student.dto/create-student.dto';

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

  @Post()
  createStudent(@Body() newStudent: CreateStudentDto): Promise<Student> {
    return this.studentService.createStudent(newStudent);
  }
}
