import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentMapper } from './student.mapper';
import type { CreateStudentDto, StudentDto } from 'dtos';
@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private mapper: StudentMapper,
  ) {}
  async getStudents(): Promise<StudentDto[]> {
    const students = await this.prisma.student.findMany();
    return this.mapper.toDTOs(students);
  }

  async getStudentById(id: number): Promise<StudentDto> {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }
    return this.mapper.toDTO(student);
  }

  async createStudent(data: CreateStudentDto): Promise<StudentDto> {
    const persistenceData = this.mapper.toPersistence(data);
    const student = await this.prisma.student.create({
      data: persistenceData,
    });
    return this.mapper.toDTO(student);
  }
  async deleteStudent(id: number): Promise<void> {
    await this.prisma.student.delete({
      where: { id },
    });
  }
}
