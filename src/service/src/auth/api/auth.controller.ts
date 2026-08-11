import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { LoginDto, UserDto } from 'dtos';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
  };
};

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ONE_DAY_MS,
    });

    return { message: 'Login successful' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  test() {
    return { status: 'ok' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req: AuthenticatedRequest): Promise<UserDto> {
    return this.authService.getCurrentUser(req.user);
  }
}
