import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentDomain } from '../domain/student.domain';
import { StudentWithUser } from '../types/student-user.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentRepository {
  constructor(private prisma: PrismaService) {}

  async createStudentWithUser(
    studentDomain: StudentDomain,
  ): Promise<StudentWithUser> {
    const hashedPassword = await bcrypt.hash(
      studentDomain.user.hashedPassword,
      10,
    );
    return this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          firstName: studentDomain.user.firstName,
          lastName: studentDomain.user.lastName,
          email: studentDomain.user.email,
          phoneNumber: studentDomain.user.phoneNumber,
          hashedPassword: hashedPassword,
        },
      });

      const createdStudent = await tx.student.create({
        data: {
          userId: createdUser.id,
        },
        include: {
          user: true,
        },
      });
      return createdStudent;
    });
  }

  async findAll(): Promise<StudentWithUser[]> {
    return this.prisma.student.findMany({
      include: {
        user: true,
      },
    });
  }

  async findById(id: number): Promise<StudentWithUser | null> {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const student = await this.findById(id);
      if (student) {
        await tx.student.delete({
          where: { id },
        });
        await tx.user.delete({
          where: { id: student.user.id },
        });
      }
    });
  }
}
