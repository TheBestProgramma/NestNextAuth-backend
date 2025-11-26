import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { LoggerService } from '@/core/logger';

describe('GatewayController', () => {
  let gatewayController: GatewayController;
  let gatewayService: GatewayService;

  const mockLoggerService = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        GatewayService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    gatewayController = app.get<GatewayController>(GatewayController);
    gatewayService = app.get<GatewayService>(GatewayService);
  });

  describe('getHello', () => {
    it('should return API information with endpoints', () => {
      const result = gatewayController.getHello();
      
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('endpoints');
      expect(result.message).toBe('Welcome to NestNextAuth API Gateway');
      expect(result.version).toBe('1.0');
      expect(result.endpoints).toHaveProperty('documentation');
      expect(result.endpoints).toHaveProperty('auth');
      expect(result.endpoints.auth).toHaveProperty('register');
      expect(result.endpoints.auth).toHaveProperty('login');
      expect(result.endpoints.auth).toHaveProperty('users');
    });
  });
});
