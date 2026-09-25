import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import type { StudentDto, StudentDetailsDto } from 'dtos';
import { CreateStudentDto, UpdateStudentDto } from 'dtos';
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
  getStudentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StudentDetailsDto> {
    return this.studentService.getStudentById(id);
  }

  @Post()
  createStudent(@Body() newStudent: CreateStudentDto): Promise<StudentDto> {
    return this.studentService.createStudent(newStudent);
  }
  @Delete(':id')
  deleteStudent(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.studentService.deleteStudent(id);
  }
  @Put(':id')
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedStudent: UpdateStudentDto,
  ): Promise<StudentDetailsDto> {
    return this.studentService.updateStudent(id, updatedStudent);
  }
}
