import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentMapper } from '../mappers/student.mapper';
import type {
  CreateStudentDto,
  StudentDetailsDto,
  StudentDto,
  UpdateStudentDto,
} from 'dtos';
import { StudentRepository } from '../data/student.repository';

@Injectable()
export class StudentService {
  constructor(
    private repository: StudentRepository,
    private mapper: StudentMapper,
  ) {}

  async getStudents(): Promise<StudentDto[]> {
    const students = await this.repository.findAll();
    return this.mapper.toStudentDtoList(students);
  }

  async getStudentById(id: number): Promise<StudentDetailsDto> {
    const student = await this.repository.findById(id);
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return this.mapper.toStudentDetailsDto(student);
  }

  async createStudent(
    data: CreateStudentDto,
    actionById: number,
  ): Promise<StudentDto> {
    const studentDomain = this.mapper.toDomainFromCreateDto(data, actionById);
    const createdStudent = await this.repository.createStudentWithUser(
      studentDomain,
      actionById,
    );
    return this.mapper.toStudentDto(createdStudent);
  }

  async deleteStudent(id: number, actionById: number): Promise<void> {
    const isDeleted = await this.repository.deleteById(id, actionById);
    if (!isDeleted) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
  }

  async updateStudent(
    id: number,
    updateData: UpdateStudentDto,
    actionById: number,
  ): Promise<StudentDetailsDto> {
    const updatedStudent = await this.repository.updateStudentData(
      id,
      updateData,
      actionById,
    );
    if (!updatedStudent) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return this.mapper.toStudentDetailsDto(updatedStudent);
  }
}
