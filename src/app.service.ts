import { Injectable } from '@nestjs/common';

import * as data from './data/integration.json';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getIntegrationJson() {
    return data;
  }
}
