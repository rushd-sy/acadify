import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './data/user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserMapper } from './mappers/user.mapper';
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, UserMapper],
})
export class AuthModule {}
