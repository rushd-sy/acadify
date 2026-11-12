import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GradeService } from '../services/grade.service';
import { CreateGradeDto, GradeDto } from 'dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../auth/api/types/authenticated-request.type';

@UseGuards(JwtAuthGuard)
@Controller('grades')
export class GradeController {
  constructor(private readonly service: GradeService) {}

  @Post()
  create(
    @Body() createGradeDto: CreateGradeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<GradeDto> {
    return this.service.create(createGradeDto, req.user.id);
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
    @Req() req: AuthenticatedRequest,
  ): Promise<GradeDto> {
    return this.service.updateById(id, data, req.user.id);
  }

  @Delete(':id')
  deleteById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.service.deleteById(id, req.user.id);
  }
}
