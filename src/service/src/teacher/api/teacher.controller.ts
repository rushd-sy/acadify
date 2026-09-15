import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import type { CreateTeacherDto, TeacherDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Post()
  createTeacher(@Body() newTeacher: CreateTeacherDto): Promise<TeacherDto> {
    return this.teacherService.createTeacher(newTeacher);
  }
}
