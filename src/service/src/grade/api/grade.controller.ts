import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GradeService } from '../services/grade.service';
import { CreateGradeDto, GradeDto } from 'dtos';

@Controller('grades')
export class GradeController {
  constructor(private readonly service: GradeService) {}

  @Post()
  create(@Body() createGradeDto: CreateGradeDto): Promise<GradeDto> {
    return this.service.create(createGradeDto);
  }

  @Get()
  findAll(): Promise<GradeDto[]> {
    return this.service.findAll();
  }

  @Get('name/:name')
  findByName(@Param('name') name: string): Promise<GradeDto> {
    return this.service.findByName(name);
  }
}
