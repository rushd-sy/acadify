import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getUser(email: string) {
    if (!email) {
      return null;
    }
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        student: true,
      },
    });
    return user;
  }
  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        student: true,
      },
    });
  }
}
