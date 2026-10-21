import { Injectable } from '@nestjs/common';
import { ExamRepository } from '../data/exam.repository';
import { ExamMapper } from '../mappers/exam.mapper';
import { ExamDto } from 'dtos';

@Injectable()
export class ExamService {
  constructor(
    private readonly repository: ExamRepository,
    private readonly mapper: ExamMapper,
  ) {}

  async findAll(): Promise<ExamDto[]> {
    const examsDomain = await this.repository.findAll();
    return this.mapper.toDtoList(examsDomain);
  }
}
