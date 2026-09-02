import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import type {
  CreateStudentDto,
  StudentDetailsDto,
  StudentDto,
  UpdateStudentDto,
} from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
  @Put(':id')
  updateStudent(
    @Param('id') id: number,
    @Body() updatedStudent: UpdateStudentDto,
  ): Promise<StudentDetailsDto> {
    return this.studentService.updateStudent(
      parseInt(id.toString()),
      updatedStudent,
    );
  }
}
