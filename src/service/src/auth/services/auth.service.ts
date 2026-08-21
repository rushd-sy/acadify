import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, LoginResultDto, UserDto } from 'dtos';
import { UserRepository } from '../data/user.repository';
import { UserNotFoundError } from '../domain/errors';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'dtos';
import { JwtPayload } from '../api/types/jwt-payload.type';

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

    const isStudent = !!user.student;

    if (!isStudent) {
      throw new UnauthorizedException(
        'Access denied: Only students are allowed to log in at this time.',
      );
    }

    const role = Role.STUDENT;
    const payload: JwtPayload = { sub: user.id, email: user.email, role };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      accessToken: accessToken,
      role,
    };
  }

  async getCurrentUser(user: { id: number; email: string }): Promise<UserDto> {
    const currentUser = await this.userRepository.getUserById(user.id);

    if (!currentUser) {
      throw new UnauthorizedException('User not found');
    }

    const role = Role.STUDENT;

    return {
      id: currentUser.id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phoneNumber: currentUser.phoneNumber,
      role: role,
    };
  }
}
