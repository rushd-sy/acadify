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
  Req,
} from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { CreateTeacherDto, UpdateTeacherDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../auth/api/types/authenticated-request.type';

@UseGuards(JwtAuthGuard)
@Controller('/api/teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Post()
  createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TeacherDto> {
    return this.teacherService.createTeacher(createTeacherDto, req.user.id);
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
    @Req() req: AuthenticatedRequest,
  ): Promise<TeacherDetailsDto> {
    return this.teacherService.updateTeacherById(userId, data, req.user.id);
  }

  @Delete(':id')
  deleteTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.teacherService.deleteTeacher(id, req.user.id);
  }
}
