import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { Worker } from 'worker_threads';

import {
  ITelexErrorDetails,
  ITelexNotificationDetails,
} from './telex.interface';

@Injectable()
export class TelexService {
  private readonly webhookUrl: string;

  constructor(configService: ConfigService) {
    this.webhookUrl = configService.get<string>('TELEX_WEBHOOK_URL');
  }

  async sendErrorToTelex(details: ITelexErrorDetails): Promise<void> {
    const workerPath = path.resolve(
      __dirname,
      '..',
      'telex',
      'telex.worker.js',
    );

    return new Promise<void>((resolve, reject) => {
      const worker = new Worker(workerPath);

      worker.on('message', (msg) => {
        console.log('Worker message:', msg);
        resolve();
      });

      worker.on('error', (err) => {
        console.error('Worker error:', err);
        reject(err);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(`Worker stopped with exit code ${code}`);
        }
      });

      worker.postMessage({
        webhookUrl: this.webhookUrl,
        details: details,
      });
    });
  }

  async sendNotification(details: ITelexNotificationDetails): Promise<void> {
    const workerPath = path.resolve(
      __dirname,
      '..',
      'telex',
      'performance.worker.js',
    );

    return new Promise<void>((resolve, reject) => {
      const worker = new Worker(workerPath);

      worker.on('message', (msg) => {
        console.log('Worker message:', msg);
        resolve();
      });

      worker.on('error', (err) => {
        console.error('Worker error:', err);
        reject(err);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(`Worker stopped with exit code ${code}`);
        }
      });

      worker.postMessage({
        webhookUrl: this.webhookUrl,
        details: details,
      });
    });
  }
}
