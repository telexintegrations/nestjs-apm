import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  private readonly filePath = path.join(
    __dirname,
    '..',
    'src',
    'data/integration.json',
  );
  getHello(): string {
    return 'Hello World!';
  }

  getIntegrationJson() {
    try {
      if (!fs.existsSync(this.filePath)) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      const rawData = fs.readFileSync(this.filePath, 'utf-8');
      const jsonData = JSON.parse(rawData);

      return jsonData;
    } catch (error) {
      throw new HttpException(
        'Error reading JSON file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
