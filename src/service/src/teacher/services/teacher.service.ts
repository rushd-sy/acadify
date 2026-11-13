import { Injectable, NotFoundException } from '@nestjs/common';
import { TeacherMapper } from '../mappers/teacher.mapper';
import type {
  CreateTeacherDto,
  TeacherDetailsDto,
  TeacherDto,
  UpdateTeacherDto,
} from 'dtos';
import { TeacherRepository } from '../data/teacher.repository';

@Injectable()
export class TeacherService {
  constructor(
    private repository: TeacherRepository,
    private mapper: TeacherMapper,
  ) {}

  async createTeacher(
    data: CreateTeacherDto,
    actionById: number,
  ): Promise<TeacherDto> {
    const teacherDomain = this.mapper.toDomainFromCreateDto(data, actionById);

    const createdTeacher = await this.repository.createTeacherWithUser(
      teacherDomain,
      actionById,
    );

    return this.mapper.toTeacherDto(createdTeacher);
  }

  async findAllTeachers(): Promise<TeacherDto[]> {
    const teachers = await this.repository.findAllTeachers();
    return this.mapper.toTeacherDtoList(teachers);
  }

  async findTeacherById(userId: number): Promise<TeacherDetailsDto | null> {
    const teacher = await this.repository.findTeacherById(userId);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${userId} not found`);
    }
    return this.mapper.toTeacherDetailsDto(teacher);
  }

  async updateTeacherById(
    userId: number,
    data: UpdateTeacherDto,
    actionById: number,
  ): Promise<TeacherDetailsDto> {
    const updatedTeacher = await this.repository.updateTeacherById(
      userId,
      data,
      actionById,
    );

    if (!updatedTeacher) {
      throw new NotFoundException(`Teacher with ID ${userId} not found`);
    }

    return this.mapper.toTeacherDetailsDto(updatedTeacher);
  }

  async deleteTeacher(id: number, actionById: number): Promise<void> {
    const isDeleted = await this.repository.deleteById(id, actionById);
    if (!isDeleted) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }
}
