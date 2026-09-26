import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';

import { SectionService } from '../services/section.service';
import { CreateSectionDto, SectionDto, UpdateSectionDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  getAllSections(): Promise<SectionDto[]> {
    return this.sectionService.getAllSections();
  }

  @Get(':id')
  getSectionById(@Param('id', ParseIntPipe) id: number): Promise<SectionDto> {
    return this.sectionService.findById(id);
  }

  @Post()
  createSection(
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<SectionDto> {
    return this.sectionService.createSection(createSectionDto);
  }

  @Put(':id')
  updateSectionById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSection: UpdateSectionDto,
  ): Promise<SectionDto> {
    return this.sectionService.updateSectionById(id, updateSection);
  }
}
