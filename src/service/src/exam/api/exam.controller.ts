import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { ExamService } from '../services/exam.service';
import { CreateExamDto, ExamDto } from 'dtos';

@Controller('api/exams')
export class ExamController {
  constructor(private readonly service: ExamService) {}

  @Get()
  findAll(): Promise<ExamDto[]> {
    return this.service.findAll();
  }

  @Delete(':id')
  deleteExam(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.deleteExam(id);
  }

  @Post()
  createExam(@Body() createExamDto: CreateExamDto): Promise<ExamDto> {
    return this.service.createExam(createExamDto);
  }
}
