import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SectionService } from '../services/section.service';
import { CreateSectionDto, SectionDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  createSection(
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<SectionDto> {
    return this.sectionService.createSection(createSectionDto);
  }
}
