import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'dtos';
import { UserRepository } from '../data/user.repository';
import { UserNotFoundError } from '../domain/errors';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.getUser(loginDto.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (loginDto.password !== user.hashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
