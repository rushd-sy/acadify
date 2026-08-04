import { Controller, Get, Post, Body, UseGuards, Res } from '@nestjs/common';
import { LoginDto } from 'dtos';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { accessToken } = await this.authService.login(loginDto);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prodution',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Login successful' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  test() {
    return { status: 'ok' };
  }
}
