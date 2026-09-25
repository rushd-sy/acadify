import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { SectionService } from '../services/section.service';
import { CreateSectionDto, SectionDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  getAllSections(): Promise<SectionDto[]> {
    return this.sectionService.getAllSections();
  }

  @Post()
  createSection(
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<SectionDto> {
    return this.sectionService.createSection(createSectionDto);
  }
}
