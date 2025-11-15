import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

describe('GatewayController', () => {
  let gatewayController: GatewayController;
  let gatewayService: GatewayService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [GatewayService],
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
