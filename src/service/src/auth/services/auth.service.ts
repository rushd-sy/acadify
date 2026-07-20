import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, LoginResultDto } from 'dtos';
import { UserRepository } from '../data/user.repository';
import { UserNotFoundError } from '../domain/errors';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResultDto> {
    const user = await this.userRepository.getUser(loginDto.email);

    if (!user) {
      throw new UserNotFoundError();
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      accessToken: accessToken,
    };
  }
}
