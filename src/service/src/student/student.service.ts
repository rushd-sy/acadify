import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentMapper } from './student.mapper';
import type { CreateStudentDto, StudentDetailsDto, StudentDto } from 'dtos';
@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private mapper: StudentMapper,
  ) {}
  async getStudents(): Promise<StudentDto[]> {
    const students = await this.prisma.student.findMany();
    return this.mapper.toStudentDTOs(students);
  }

  async getStudentById(id: number): Promise<StudentDetailsDto> {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }
    return this.mapper.toStudentDetailsDTO(student);
  }

  async createStudent(data: CreateStudentDto): Promise<StudentDto> {
    const persistenceData = this.mapper.toPersistence(data);
    const student = await this.prisma.student.create({
      data: persistenceData,
    });
    return this.mapper.toStudentDTO(student);
  }
  async deleteStudent(id: number): Promise<void> {
    await this.prisma.student.delete({
      where: { id },
    });
  }
}
