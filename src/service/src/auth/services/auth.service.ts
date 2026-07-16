import { Injectable } from '@nestjs/common';
import { LoginDto } from 'dtos';
import { UserRepository } from '../data/user.repository';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.getUser(loginDto.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    return user;
  }
}
