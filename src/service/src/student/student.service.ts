import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from '@prisma/client';
import { CreateStudentDto } from './Student.dto/create-student.dto';
@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}
  async getStudents(): Promise<Student[]> {
    return await this.prisma.student.findMany();
  }

  async getStudentById(id: number): Promise<Student> {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }
    return student;
  }

  async createStudent(data: CreateStudentDto): Promise<Student> {
    return await this.prisma.student.create({
      data,
    });
  }
  async deleteStudent(id: number): Promise<void> {
    await this.prisma.student.delete({
      where: { id },
    });
  }
}
