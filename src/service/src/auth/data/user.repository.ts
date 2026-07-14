import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getUser(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }
}
