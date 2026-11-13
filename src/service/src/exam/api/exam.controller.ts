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
import { CreateExamDto, ExamDto, UpdateExamDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../auth/api/types/authenticated-request.type';

@UseGuards(JwtAuthGuard)
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
}
