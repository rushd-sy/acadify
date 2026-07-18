import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginResultDto {
  @IsNotEmpty()
  id!: number;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  accessToken!: string;
}
