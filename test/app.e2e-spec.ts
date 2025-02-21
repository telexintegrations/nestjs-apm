import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TelexService } from '../src/telex/telex.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const mockTelexService = {
    sendNotification: jest.fn().mockResolvedValue(true),
    sendErrorToTelex: jest.fn().mockResolvedValue(true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TelexService)
      .useValue(mockTelexService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should simulate error and return 500', async () => {
    const response = await request(app.getHttpServer()).get('/simulate-error');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Simulated error');
  });

  it('should take at least 4 seconds to respond', async () => {
    const startTime = Date.now();

    const response = await request(app.getHttpServer()).get('/simulate-slow');

    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;

    expect(response.status).toBe(200);
    expect(response.text).toBe('Response after 4.5 seconds');
    expect(elapsedTime).toBeGreaterThanOrEqual(4);
  }, 10000);
});
