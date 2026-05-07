import { Module } from '@nestjs/common';
import { HealthCheckController } from './HealthCheck.controller';
import { PrismaService } from './prisma/prisma.service';
@Module({
  imports: [],
  controllers: [HealthCheckController, PrismaService],
  providers: [PrismaService],
@Module({
  imports: [],
  controllers: [HealthCheckController],
})
export class AppModule {}
