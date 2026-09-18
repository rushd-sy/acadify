import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TeacherDomain } from '../domain/teacher.domain';
import { TeacherWithUser } from '../types/teacher-user.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherRepository {
  constructor(private prisma: PrismaService) {}

  async createTeacherWithUser(
    teacherDomain: TeacherDomain,
  ): Promise<TeacherWithUser> {
    const hashedPassword = await bcrypt.hash(
      teacherDomain.user.hashedPassword,
      10,
    );

    return this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          firstName: teacherDomain.user.firstName,
          lastName: teacherDomain.user.lastName,
          email: teacherDomain.user.email,
          phoneNumber: teacherDomain.user.phoneNumber,
          hashedPassword,
        },
      });

      const createdTeacher = await tx.teacher.create({
        data: {
          userId: createdUser.id,
          degree: teacherDomain.degree,
        },
        include: {
          user: true,
        },
      });

      return createdTeacher;
    });
  }

  async findAllTeachers(): Promise<TeacherWithUser[]> {
    return this.prisma.teacher.findMany({
      include: {
        user: true,
      },
    });
  }

  async findTeacherById(userId: number): Promise<TeacherWithUser | null> {
    return this.prisma.teacher.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }
}
