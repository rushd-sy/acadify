import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import type { CreateTeacherDto, TeacherDetailsDto, TeacherDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Post()
  createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherDto> {
    return this.teacherService.createTeacher(createTeacherDto);
  }

  @Get()
  getAllTeachers(): Promise<TeacherDto[]> {
    return this.teacherService.findAllTeachers();
  }

  @Get(':id')
  getTeacherById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TeacherDetailsDto | null> {
    return this.teacherService.findTeacherById(id);
  }
}
