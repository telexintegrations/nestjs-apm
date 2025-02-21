import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('integration-json')
  getIntegrationJson() {
    return this.appService.getIntegrationJson();
  }

  @Get('simulate-slow')
  async slowResponse(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 4500));
    return 'Response after 4.5 seconds';
  }

  @Get('simulate-error')
  throwError() {
    throw new Error('Simulated error');
  }
}
