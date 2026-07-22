import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto, LoginResultDto } from 'dtos';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResultDto> {
    return this.authService.login(loginDto);
  }
}
