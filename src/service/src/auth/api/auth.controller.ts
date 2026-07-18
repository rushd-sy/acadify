import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from 'dtos';
import { AuthService } from '../services/auth.service';
import { User } from '@prisma/client';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<User> {
    return await this.authService.login(loginDto);
  }
}
