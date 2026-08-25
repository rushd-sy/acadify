import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from './role.enum';

export class LoginResultDto {
  @IsNotEmpty()
  id!: number;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;
}
