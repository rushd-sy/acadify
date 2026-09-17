import { Injectable } from '@nestjs/common';
import { TeacherMapper } from '../mappers/teacher.mapper';
import type { CreateTeacherDto, TeacherDto } from 'dtos';
import { TeacherRepository } from '../data/teacher.repository';

@Injectable()
export class TeacherService {
  constructor(
    private repository: TeacherRepository,
    private mapper: TeacherMapper,
  ) {}

  async createTeacher(data: CreateTeacherDto): Promise<TeacherDto> {
    const teacherDomain = this.mapper.toDomainFromCreateDto(data);

    const createdTeacher =
      await this.repository.createTeacherWithUser(teacherDomain);

    return this.mapper.toTeacherDto(createdTeacher);
  }
}
