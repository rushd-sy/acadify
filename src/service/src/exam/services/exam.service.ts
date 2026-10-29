import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamRepository } from '../data/exam.repository';
import { ExamMapper } from '../mappers/exam.mapper';
import { CreateExamDto, ExamDto } from 'dtos';

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

  async deleteExam(id: number): Promise<void> {
    const isDeleted = await this.repository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`Exam with ID: ${id} not found`);
    }
  }

  async createExam(createExam: CreateExamDto): Promise<ExamDto> {
    const examDomain = this.mapper.toDomainCreateData(createExam);
    const createdExam = await this.repository.create(examDomain);
    return this.mapper.toDto(createdExam);
  }
}
