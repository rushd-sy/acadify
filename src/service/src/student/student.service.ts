import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from '@prisma/client';
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
}
