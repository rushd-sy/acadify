import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  testing(): string {
    return 'it works!';
  }
}