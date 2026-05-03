import { Module } from '@nestjs/common';
import { HealthCheckController } from './HealthCheck.controller';
@Module({
  imports: [],
  controllers: [HealthCheckController],
})
export class AppModule {}
