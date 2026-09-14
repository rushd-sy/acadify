import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CurriculumService } from '../services/curriculum.service';
import { CreateCurriculumDto, UpdateCurriculumDto, CurriculumDto } from 'dtos';

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get()
  findAll(): Promise<CurriculumDto[]> {
    return this.curriculumService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<CurriculumDto> {
    return this.curriculumService.findById(id);
  }

  @Post()
  create(
    @Body() createCurriculumDto: CreateCurriculumDto,
  ): Promise<CurriculumDto> {
    return this.curriculumService.create(createCurriculumDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurriculumDto: UpdateCurriculumDto,
  ): Promise<CurriculumDto> {
    return this.curriculumService.update(id, updateCurriculumDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.curriculumService.delete(id);
  }
}
