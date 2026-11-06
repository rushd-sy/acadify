import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentDomain } from '../domain/student.domain';
import { StudentWithUser } from '../types/student-user.type';
import * as bcrypt from 'bcrypt';
import { UpdateStudentDto } from 'dtos';

@Injectable()
export class StudentRepository {
  constructor(private prisma: PrismaService) {}

  async createStudentWithUser(
    studentDomain: StudentDomain,
    actionById?: number,
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
          createdBy: actionById,
        },
      });

      const createdStudent = await tx.student.create({
        data: {
          userId: createdUser.id,
          createdBy: actionById,
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

  async findById(userId: number): Promise<StudentWithUser | null> {
    return this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async deleteById(userId: number, actionById?: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const student = await this.findById(userId);
      if (student) {
        const now = new Date();
        await tx.student.update({
          where: { userId },
          data: { archivedAt: now, updatedBy: actionById },
        });
        await tx.user.update({
          where: { id: userId },
          data: { archivedAt: now, updatedBy: actionById },
        });
      }
    });
  }

  async updateStudentData(
    userId: number,
    updateData: UpdateStudentDto,
    actionById?: number,
  ): Promise<StudentWithUser | null> {
    const student = await this.findById(userId);

    if (!student) {
      return null;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateData.firstName ?? student.user.firstName,
        lastName: updateData.lastName ?? student.user.lastName,
        email: updateData.email ?? student.user.email,
        phoneNumber: updateData.phoneNumber ?? student.user.phoneNumber,
        updatedBy: actionById,
      },
    });

    await this.prisma.student.update({
      where: { userId },
      data: { updatedBy: actionById },
    });

    return this.findById(userId);
  }
}
