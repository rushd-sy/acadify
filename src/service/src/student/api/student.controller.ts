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
  Req,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import type { StudentDto, StudentDetailsDto } from 'dtos';
import { CreateStudentDto, UpdateStudentDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../auth/api/types/authenticated-request.type';

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
  createStudent(
    @Body() newStudent: CreateStudentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<StudentDto> {
    return this.studentService.createStudent(newStudent, req.user.id);
  }
  @Delete(':id')
  deleteStudent(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.studentService.deleteStudent(id, req.user.id);
  }
  @Put(':id')
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedStudent: UpdateStudentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<StudentDetailsDto> {
    return this.studentService.updateStudent(id, updatedStudent, req.user.id);
  }
}
