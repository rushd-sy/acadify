import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Put,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { CreateTeacherDto, UpdateTeacherDto } from 'dtos';
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

  @Put(':id')
  updateTeacherById(
    @Param('id', ParseIntPipe) userId: number,
    @Body() data: UpdateTeacherDto,
  ): Promise<TeacherDetailsDto> {
    return this.teacherService.updateTeacherById(userId, data);
  }

  @Delete(':id')
  deleteTeacher(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teacherService.deleteTeacher(id);
  }
}
