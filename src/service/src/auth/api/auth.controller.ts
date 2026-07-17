import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from 'dtos';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginn(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
