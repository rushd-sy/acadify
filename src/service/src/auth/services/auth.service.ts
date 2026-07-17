import { Injectable } from '@nestjs/common';
import { LoginDto } from 'dtos';
import { UserRepository } from '../data/user.repository';
import { User } from '@prisma/client';
import { UserNotFoundError } from '../domain/errors';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.getUser(loginDto.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
