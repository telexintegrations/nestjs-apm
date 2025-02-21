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
    const integrationJson = {
      data: {
        date: {
          created_at: '2025-02-20',
          updated_at: '2025-02-20',
        },
        descriptions: {
          app_name: 'NestJS APM',
          app_description:
            'NestJS-APM is a powerful integration package designed to provide seamless Application Performance Monitoring (APM) for NestJS applications.',
          app_logo: 'https://cdn-icons-png.flaticon.com/512/10700/10700902.png',
          app_url: 'https://nestjs-apm.primatexcode.com',
          background_color: '#fff',
        },
        is_active: true,
        integration_type: 'modifier',
        integration_category: 'Performance Monitoring',
        key_features: [
          'Global Exception Handling.',
          'Real Time Error Monitoring.',
          'Request Response Time.',
          'Application Performance Monitoring.',
          'Error Rate.',
          'Throughput.',
        ],
        author: 'Edwin Edjokpa',
        settings: [
          {
            label: 'webhook_url',
            type: 'text',
            required: true,
            default:
              process.env.TELEX_WEBHOOK_URL ||
              'https://ping.telex.im/v1/webhooks/0195186d-b707-7f9e-bc7f-c75f841ef281',
          },
        ],
        target_url:
          process.env.TARGET_URL ||
          'https://ping.telex.im/v1/webhooks/0195186d-b707-7f9e-bc7f-c75f841ef281',
        tick_url: process.env.TICK_URL || 'https://nestjs-apm.primatexcode.com',
      },
    };

    return integrationJson;
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
