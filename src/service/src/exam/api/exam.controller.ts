import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExamService } from '../services/exam.service';
import {
  CreateExamDto,
  ExamDto,
  UpdateExamDto,
  AssignSectionsDto,
  ExamSectionDto,
} from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../auth/api/types/authenticated-request.type';
import { UseFilters } from '@nestjs/common';
import { ExamDomainExceptionFilter } from '../filters/exam-domain-exception.filter';

@UseGuards(JwtAuthGuard)
@UseFilters(ExamDomainExceptionFilter)
@Controller('api/exams')
export class ExamController {
  constructor(private readonly service: ExamService) {}

  @Get()
  findAll(): Promise<ExamDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<ExamDto> {
    return this.service.getById(id);
  }

  @Get(':id/sections')
  getAssignedSections(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExamSectionDto[]> {
    return this.service.getAssignedSections(id);
  }

  @Post()
  createExam(
    @Body() createExamDto: CreateExamDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ExamDto> {
    return this.service.createExam(createExamDto, req.user.id);
  }

  @Put(':id')
  updateExam(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamDto: UpdateExamDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ExamDto> {
    return this.service.update(id, updateExamDto, req.user.id);
  }

  @Delete(':id')
  deleteExam(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.service.deleteExam(id, req.user.id);
  }

  @Post(':id/sections')
  assignSections(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignSectionsDto: AssignSectionsDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ExamSectionDto[]> {
    return this.service.assignSections(id, assignSectionsDto, req.user.id);
  }
}
