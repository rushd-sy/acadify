import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from '@prisma/client';
@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}
  async getStudents(): Promise<Student[]> {
    return await this.prisma.student.findMany();
  }
}
