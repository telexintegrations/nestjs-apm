import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { performance } from 'perf_hooks';
import { TelexService } from '../../telex/telex.service';
import * as client from 'prom-client';

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  private readonly logger = new Logger('PerformanceMiddleware');
  private requestCount: client.Counter;
  private errorCount: client.Counter;
  private totalRequests = 0;
  private totalErrors = 0;
  private startTime = performance.now();

  constructor(private readonly telexService: TelexService) {
    this.requestCount = new client.Counter({
      name: 'http_request_total',
      help: 'Total number of requests',
      labelNames: ['method', 'status'],
    });

    this.errorCount = new client.Counter({
      name: 'http_requests_failed_total',
      help: 'Total number of errors',
      labelNames: ['method', 'status'],
    });
  }

  use(req: any, res: any, next: () => void) {
    const requestStartTime = performance.now();

    res.on('finish', () => {
      const requestEndTime = performance.now();
      const responseTime = requestEndTime - requestStartTime;

      this.logger.log(
        `${req.method} ${req.url} - ${responseTime.toFixed(3)} ms`,
      );

      this.requestCount.inc({
        method: req.method,
        status: String(res.statusCode),
      });
      this.totalRequests++;

      if (res.statusCode >= 400) {
        this.errorCount.inc({
          method: req.method,
          status: String(res.statusCode),
        });
        this.totalErrors++;
      }

      if (responseTime > 3000) {
        const details = {
          method: req.method,
          url: req.url,
          responseTime: responseTime.toFixed(3),
          statusCode: res.statusCode,
        };
        this.telexService.sendNotification(details).catch((err) => {
          this.logger.error('Failed to send notification:', err);
        });
      }

      // Calculate error rate
      const errorRate =
        this.totalRequests > 0
          ? (this.totalErrors / this.totalRequests) * 100
          : 0;
      this.logger.log(`Error Rate: ${errorRate.toFixed(2)}%`);

      // Calculate throughput (requests per second)
      const elapsedTime = (performance.now() - this.startTime) / 1000;
      const throughput = this.totalRequests / elapsedTime;
      this.logger.log(`Throughput: ${throughput.toFixed(2)} requests/second`);
    });

    res.on('error', (err: any) => {
      this.logger.error(`Error occurred in request to ${req.url}:`, err);
    });

    next();
  }
}
