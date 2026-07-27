import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LoginDto, LoginResultDto } from 'dtos';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResultDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mock')
  mock() {
    return { status: 'ok' };
  }
}
