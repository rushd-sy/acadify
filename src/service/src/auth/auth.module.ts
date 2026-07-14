import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './data/user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
