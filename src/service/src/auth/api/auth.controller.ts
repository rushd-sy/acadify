import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto, UserDto } from 'dtos';
import { AuthService } from '../services/auth.service';
import { UserMapper } from '../mappers/user.mapper';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usermapper: UserMapper,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<UserDto> {
    const user = await this.authService.login(loginDto);
    return this.usermapper.toUserDto(user);
  }
}
