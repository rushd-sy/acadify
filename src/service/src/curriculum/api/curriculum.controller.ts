import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CurriculumService } from '../services/curriculum.service';
import { CreateCurriculumDto, UpdateCurriculumDto, CurriculumDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../auth/api/types/authenticated-request.type';

@UseGuards(JwtAuthGuard)
@Controller('/api/curriculums')
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
    @Req() req: AuthenticatedRequest,
  ): Promise<CurriculumDto> {
    return this.curriculumService.create(createCurriculumDto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurriculumDto: UpdateCurriculumDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CurriculumDto> {
    return this.curriculumService.update(id, updateCurriculumDto, req.user.id);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.curriculumService.delete(id, req.user.id);
  }
}
