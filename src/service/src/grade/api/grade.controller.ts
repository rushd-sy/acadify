import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
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

  @Get(':id')
  findByName(@Param('id', ParseIntPipe) id: number): Promise<GradeDto> {
    return this.service.findById(id);
  }

  @Patch(':id')
  updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: GradeDto,
  ): Promise<GradeDto> {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.deleteById(id);
  }
}
