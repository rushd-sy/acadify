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

    const studentDomains = students.map((student) =>
      this.mapper.toDomain(student),
    );

    return this.mapper.toStudentDTOs(studentDomains);
  }

  async getStudentById(id: number): Promise<StudentDetailsDto> {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }

    const studentDomain = this.mapper.toDomain(student);

    return this.mapper.toStudentDetailsDTO(studentDomain);
  }

  async createStudent(data: CreateStudentDto): Promise<StudentDto> {
    const studentDomain = this.mapper.toDomainFromCreateDto(data);

    const persistenceData = this.mapper.toPersistence(studentDomain);

    const student = await this.prisma.student.create({
      data: persistenceData,
    });

    const savedStudentDomain = this.mapper.toDomain(student);

    return this.mapper.toStudentDTO(savedStudentDomain);
  }

  async deleteStudent(id: number): Promise<void> {
    await this.prisma.student.delete({
      where: { id },
    });
  }
}
