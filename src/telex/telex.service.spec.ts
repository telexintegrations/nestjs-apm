import { Test, TestingModule } from '@nestjs/testing';
import { TelexService } from './telex.service';
import { ConfigService } from '@nestjs/config';
import { Worker } from 'worker_threads';

jest.mock('worker_threads', () => {
  return {
    Worker: jest.fn().mockImplementation(() => ({
      postMessage: jest.fn(),
      on: jest.fn((event, callback) => {
        if (event === 'message') {
          callback('Worker success');
        }
        if (event === 'exit') {
          callback(0);
        }
      }),
    })),
  };
});

describe('TelexService', () => {
  let telexService: TelexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelexService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('https://mock-webhook-url.com'),
          },
        },
      ],
    }).compile();

    telexService = module.get<TelexService>(TelexService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(telexService).toBeDefined();
  });

  it('should send error to Telex', async () => {
    await expect(
      telexService.sendErrorToTelex({
        url: '/test',
        method: 'GET',
        message: 'Error',
        stack: 'stack trace',
      }),
    ).resolves.toBeUndefined();
    expect(Worker).toHaveBeenCalled();
  });

  it('should send notification to Telex', async () => {
    await expect(
      telexService.sendNotification({
        url: '/slow',
        method: 'GET',
        responseTime: '4500',
        statusCode: 200,
      }),
    ).resolves.toBeUndefined();
    expect(Worker).toHaveBeenCalled();
  });
});
