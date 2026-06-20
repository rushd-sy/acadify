import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import type { CreateStudentDto, StudentDetailsDto, StudentDto } from 'dtos';
import { Student } from '@prisma/client';
@Controller('/api/student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  getStudents(): Promise<StudentDto[]> {
    return this.studentService.getStudents();
  }

  @Get(':id')
  getStudentById(@Param('id') id: number): Promise<StudentDetailsDto> {
    return this.studentService.getStudentById(parseInt(id.toString()));
  }

  @Post()
  createStudent(@Body() newStudent: CreateStudentDto): Promise<StudentDto> {
    return this.studentService.createStudent(newStudent);
  }
  @Delete(':id')
  deleteStudent(@Param('id') id: number): Promise<void> {
    return this.studentService.deleteStudent(parseInt(id.toString()));
  }
}
