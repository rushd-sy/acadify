import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheckController {
  @Get()
  Check() {
    return { status: 'ok' };
  }
}
